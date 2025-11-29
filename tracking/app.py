from flask import Flask, jsonify, request, g
from flask_cors import CORS
from datetime import datetime, timedelta
import sqlite3
import json
from pathlib import Path

app = Flask(__name__)
CORS(app)

DB_PATH = Path(__file__).parent / 'progress.db'


def get_db():
    """Get database connection with connection reuse within request context."""
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(e=None):
    """Close database connection at the end of request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    """Initialize database with tracking tables and performance indexes"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Progress tracking table
    c.execute('''
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            score REAL NOT NULL,
            total_questions INTEGER NOT NULL,
            correct_answers INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            review_needed BOOLEAN DEFAULT 0
        )
    ''')
    
    # Weak areas tracking
    c.execute('''
        CREATE TABLE IF NOT EXISTS weak_areas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            subtopic TEXT,
            error_count INTEGER DEFAULT 1,
            last_error DATETIME DEFAULT CURRENT_TIMESTAMP,
            mastery_level REAL DEFAULT 0.0
        )
    ''')
    
    # Study sessions
    c.execute('''
        CREATE TABLE IF NOT EXISTS study_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            end_time DATETIME,
            topics_covered TEXT,
            cards_reviewed INTEGER DEFAULT 0,
            retention_rate REAL
        )
    ''')
    
    # Add indexes for frequently queried columns (improves query performance)
    c.execute('CREATE INDEX IF NOT EXISTS idx_progress_topic ON progress(topic)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_progress_timestamp ON progress(timestamp)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_progress_score ON progress(score)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_weak_areas_topic ON weak_areas(topic)')
    
    conn.commit()
    conn.close()

@app.route('/api/progress/<topic>/complete', methods=['POST'])
def track_progress(topic):
    """Track completion of a topic quiz/study session"""
    data = request.json
    score = data.get('score', 0)
    total = data.get('total', 0)
    correct = data.get('correct', 0)
    
    conn = get_db()
    c = conn.cursor()
    
    # Insert progress record
    c.execute('''
        INSERT INTO progress (topic, score, total_questions, correct_answers, review_needed)
        VALUES (?, ?, ?, ?, ?)
    ''', (topic, score, total, correct, 1 if score < 75 else 0))
    
    # Update weak areas if score is low
    if score < 75:
        c.execute('''
            INSERT INTO weak_areas (topic, error_count)
            VALUES (?, 1)
            ON CONFLICT(topic) DO UPDATE SET
                error_count = error_count + 1,
                last_error = CURRENT_TIMESTAMP,
                mastery_level = mastery_level * 0.8
        ''')
    else:
        # Improve mastery level for good performance
        c.execute('''
            UPDATE weak_areas 
            SET mastery_level = MIN(mastery_level * 1.2 + 0.1, 1.0)
            WHERE topic = ?
        ''', (topic,))
    
    conn.commit()
    
    return jsonify({
        'status': 'success',
        'topic': topic,
        'score': score,
        'review_needed': score < 75,
        'next_review': (datetime.now() + timedelta(days=1 if score < 75 else 3)).isoformat()
    })

@app.route('/api/weakest-areas', methods=['GET'])
def get_weakest_areas():
    """Get topics that need the most review"""
    conn = get_db()
    c = conn.cursor()
    
    results = c.execute('''
        SELECT topic, 
               AVG(score) as avg_score,
               COUNT(*) as attempts,
               SUM(CASE WHEN score < 75 THEN 1 ELSE 0 END) as failed_attempts,
               MAX(timestamp) as last_attempt
        FROM progress
        GROUP BY topic
        HAVING avg_score < 80
        ORDER BY avg_score ASC, failed_attempts DESC
        LIMIT 5
    ''').fetchall()
    
    weak_areas = [dict(row) for row in results]
    
    return jsonify({
        'weak_areas': weak_areas,
        'recommendations': generate_recommendations(weak_areas)
    })

@app.route('/api/study-plan', methods=['GET'])
def get_study_plan():
    """Generate personalized study plan based on performance"""
    days = request.args.get('days', 7, type=int)
    
    conn = get_db()
    c = conn.cursor()
    
    # Combined query for both overdue topics and weak topics (more efficient)
    study_data = c.execute('''
        SELECT topic, 
               AVG(score) as avg_score,
               MAX(timestamp) as last_study,
               CASE 
                   WHEN MAX(timestamp) < datetime('now', '-3 days') 
                        AND topic NOT IN (SELECT topic FROM progress WHERE timestamp > datetime('now', '-1 day'))
                   THEN 'overdue'
                   WHEN AVG(score) < 75 THEN 'weak'
                   ELSE 'normal'
               END as status
        FROM progress
        GROUP BY topic
        ORDER BY 
            CASE 
                WHEN MAX(timestamp) < datetime('now', '-3 days') THEN 0 
                WHEN AVG(score) < 75 THEN 1
                ELSE 2 
            END,
            avg_score ASC
    ''').fetchall()
    
    overdue = [row for row in study_data if row['status'] == 'overdue']
    weak = [row for row in study_data if row['status'] == 'weak']
    
    plan = []
    topics = [
        'דליריום', 'דמנציה ומחלת אלצהיימר', 'שבריריות',
        'נפילות', 'דיכאון בגיל המבוגר', 'רישום ודה-פרסקייבינג תרופות'
    ]
    
    # Prioritize weak topics
    for day in range(days):
        day_plan = {
            'day': day + 1,
            'date': (datetime.now() + timedelta(days=day)).strftime('%Y-%m-%d'),
            'topics': [],
            'focus': 'review' if day % 3 == 0 else 'new',
            'estimated_time': 45  # minutes
        }
        
        if weak and day % 2 == 0:
            day_plan['topics'].append({
                'name': weak[0]['topic'],
                'type': 'weak_area_focus',
                'cards': 30
            })
        elif overdue:
            day_plan['topics'].append({
                'name': overdue[0]['topic'],
                'type': 'spaced_repetition',
                'cards': 25
            })
        else:
            # Rotate through all topics
            topic_index = day % len(topics)
            day_plan['topics'].append({
                'name': topics[topic_index],
                'type': 'regular_study',
                'cards': 20
            })
        
        plan.append(day_plan)
    
    return jsonify({
        'study_plan': plan,
        'total_cards': sum(t['cards'] for d in plan for t in d['topics']),
        'estimated_hours': days * 0.75
    })

@app.route('/api/stats/overview', methods=['GET'])
def get_stats_overview():
    """Get comprehensive statistics"""
    conn = get_db()
    c = conn.cursor()
    
    # Combined query for overall stats (more efficient than separate queries)
    stats = c.execute('''
        SELECT 
            COUNT(*) as total_sessions,
            AVG(score) as avg_score,
            (SELECT AVG(score) FROM progress WHERE timestamp > datetime('now', '-7 days')) as recent_avg,
            (SELECT COUNT(*) FROM progress WHERE timestamp > datetime('now', '-7 days')) as recent_count
        FROM progress
    ''').fetchone()
    
    # Get topic performance in single query
    topic_performance = c.execute('''
        SELECT topic, AVG(score) as avg_score, COUNT(*) as attempts
        FROM progress
        GROUP BY topic
        ORDER BY avg_score DESC
    ''').fetchall()
    
    return jsonify({
        'total_sessions': stats['total_sessions'] or 0,
        'overall_average': round(stats['avg_score'] or 0, 1),
        'recent_average': round(stats['recent_avg'] or 0, 1),
        'recent_sessions': stats['recent_count'] or 0,
        'best_topic': dict(topic_performance[0]) if topic_performance else None,
        'worst_topic': dict(topic_performance[-1]) if topic_performance else None,
        'streak_days': calculate_streak()
    })

def generate_recommendations(weak_areas):
    """Generate study recommendations based on weak areas"""
    recs = []
    for area in weak_areas:
        if area['avg_score'] < 60:
            recs.append(f"🔴 Critical: Review {area['topic']} fundamentals - consider re-reading source material")
        elif area['avg_score'] < 75:
            recs.append(f"🟡 Focus: Practice more {area['topic']} questions - aim for 20 cards daily")
        else:
            recs.append(f"🟢 Maintain: Keep reviewing {area['topic']} every 3 days")
    return recs

def calculate_streak():
    """Calculate study streak in days using optimized SQL"""
    conn = get_db()
    c = conn.cursor()
    
    # Get distinct study dates in descending order
    dates = c.execute('''
        SELECT DISTINCT DATE(timestamp) as study_date
        FROM progress
        ORDER BY study_date DESC
        LIMIT 365
    ''').fetchall()
    
    if not dates:
        return 0
    
    streak = 0
    expected_date = datetime.now().date()
    
    for date_row in dates:
        study_date = datetime.strptime(date_row[0], '%Y-%m-%d').date()
        if study_date == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)
        elif study_date < expected_date:
            # Allow for starting streak from yesterday if today hasn't been studied yet
            if streak == 0 and study_date == expected_date - timedelta(days=1):
                streak = 1
                expected_date = study_date - timedelta(days=1)
            else:
                break
    
    return streak

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
