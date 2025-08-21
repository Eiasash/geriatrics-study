#!/usr/bin/env python3
"""
Enhanced Anki Package Builder
Integrates original content + PubMed papers + progress tracking
"""

import genanki
import json
import random
import hashlib
from pathlib import Path
from datetime import datetime

class GeriatricsAnkiBuilder:
    def __init__(self):
        # Generate consistent IDs
        self.model_id = 1607392319
        self.deck_id = 2059400110
        
        # Create model with enhanced fields
        self.model = genanki.Model(
            self.model_id,
            'Geriatrics Enhanced Model',
            fields=[
                {'name': 'Question'},
                {'name': 'Answer'},
                {'name': 'Source'},
                {'name': 'Clinical_Pearl'},
                {'name': 'Hebrew_Terms'},
                {'name': 'Difficulty'},
                {'name': 'Last_Review'},
                {'name': 'Tags'}
            ],
            templates=[
                {
                    'name': 'Card 1',
                    'qfmt': '''
                        <div style="font-size: 20px; text-align: center; padding: 20px;">
                            {{Question}}
                            <br><br>
                            <div style="font-size: 14px; color: #666;">
                                {{#Source}}<i>📖 {{Source}}</i>{{/Source}}
                            </div>
                        </div>
                    ''',
                    'afmt': '''
                        {{FrontSide}}
                        <hr id="answer">
                        <div style="font-size: 18px; padding: 20px;">
                            <strong>תשובה:</strong><br>
                            {{Answer}}
                            
                            {{#Clinical_Pearl}}
                            <div style="background: #f0f8ff; padding: 10px; margin-top: 15px; border-radius: 5px;">
                                <strong>💡 Clinical Pearl:</strong><br>
                                {{Clinical_Pearl}}
                            </div>
                            {{/Clinical_Pearl}}
                            
                            {{#Hebrew_Terms}}
                            <div style="margin-top: 10px; color: #555;">
                                <strong>מונחים בעברית:</strong> {{Hebrew_Terms}}
                            </div>
                            {{/Hebrew_Terms}}
                        </div>
                    '''
                }
            ],
            css='''
                .card {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
                    text-align: right;
                    direction: rtl;
                    color: #333;
                    background: white;
                }
                .card.night_mode {
                    background: #1e1e1e;
                    color: #d4d4d4;
                }
                hr#answer {
                    border: 1px solid #ccc;
                }
            '''
        )
        
        # Topic mapping
        self.topics = {
            'delirium': 'דליריום',
            'dementia': 'דמנציה ומחלת אלצהיימר',
            'frailty': 'שבריריות',
            'falls': 'נפילות',
            'depression': 'דיכאון בגיל המבוגר',
            'deprescribing': 'רישום ודה-פרסקייבינג תרופות',
            'incontinence': 'אי שליטה בסוגרים',
            'sarcopenia': 'סרקופניה ותזונה',
            'end_of_life': 'טיפול סוף-חיים',
            'stroke': 'שבץ מוחי',
            'heart_failure': 'אי ספיקת לב',
            'parkinson': 'פרקינסון'
        }
    
    def load_original_content(self, content_file='data/content.json'):
        """Load original study content"""
        try:
            with open(content_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: {content_file} not found")
            return []
    
    def load_pubmed_cards(self, pubmed_file='data/pubmed_anki_cards.json'):
        """Load PubMed-generated cards"""
        try:
            with open(pubmed_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"No PubMed cards found at {pubmed_file}")
            return []
    
    def load_weak_areas(self, db_path='tracking/progress.db'):
        """Load weak areas from progress tracking"""
        weak_topics = []
        try:
            import sqlite3
            conn = sqlite3.connect(db_path)
            c = conn.cursor()
            
            weak = c.execute('''
                SELECT topic, AVG(score) as avg_score
                FROM progress
                GROUP BY topic
                HAVING avg_score < 75
                ORDER BY avg_score ASC
            ''').fetchall()
            
            weak_topics = [row[0] for row in weak]
            conn.close()
        except:
            print("No progress tracking data available")
        
        return weak_topics
    
    def calculate_difficulty(self, question, weak_topics):
        """Calculate card difficulty based on content and weak areas"""
        difficulty = "normal"
        
        # Check if it's from weak topics
        for topic in weak_topics:
            if topic.lower() in question.lower():
                difficulty = "hard"
                break
        
        # Check for complex medical terms
        complex_terms = ['pathophysiology', 'differential', 'contraindicated', 
                        'mechanism', 'pharmacokinetics', 'syndrome']
        if any(term in question.lower() for term in complex_terms):
            difficulty = "hard"
        
        # Check for basic definitions
        if any(word in question.lower() for word in ['what is', 'define', 'מהו', 'הגדר']):
            difficulty = "easy"
        
        return difficulty
    
    def create_note(self, card_data, weak_topics):
        """Create an Anki note from card data"""
        question = card_data.get('front', card_data.get('question', ''))
        answer = card_data.get('back', card_data.get('answer', ''))
        
        # Extract source and clinical pearl
        source = ''
        clinical_pearl = ''
        
        if '📖' in answer:
            parts = answer.split('📖')
            if len(parts) > 1:
                source = parts[1].split('\n')[0].strip()
        
        if '💡' in answer or 'Clinical' in answer:
            pearl_start = answer.find('💡')
            if pearl_start == -1:
                pearl_start = answer.find('Clinical')
            if pearl_start != -1:
                clinical_pearl = answer[pearl_start:pearl_start+200].strip()
        
        # Extract Hebrew terms
        hebrew_terms = []
        for eng, heb in self.topics.items():
            if eng in question.lower() or heb in question:
                hebrew_terms.append(heb)
        
        # Calculate difficulty
        difficulty = self.calculate_difficulty(question, weak_topics)
        
        # Get tags
        tags = card_data.get('tags', [])
        if isinstance(tags, list):
            tags_str = ' '.join(tags)
        else:
            tags_str = str(tags)
        
        # Add difficulty tag
        tags_str += f' difficulty::{difficulty}'
        
        # Add weak area tag if applicable
        for topic in weak_topics:
            if topic.lower() in question.lower():
                tags_str += ' needs_review'
        
        note = genanki.Note(
            model=self.model,
            fields=[
                question,
                answer,
                source,
                clinical_pearl,
                ', '.join(hebrew_terms),
                difficulty,
                datetime.now().strftime('%Y-%m-%d'),
                tags_str
            ]
        )
        
        # Set custom tags for organization
        note.tags = tags if isinstance(tags, list) else [tags]
        note.tags.append(f'geriatrics_{datetime.now().strftime("%Y")}')
        
        return note
    
    def build_decks(self):
        """Build main and sub-decks"""
        # Main deck
        main_deck = genanki.Deck(
            self.deck_id,
            'Geriatrics Fellowship - Shaare Tzedek'
        )
        
        # Sub-decks for each topic
        subdecks = {}
        for topic_en, topic_he in self.topics.items():
            deck_id = abs(hash(topic_en)) % (10**10)
            subdecks[topic_en] = genanki.Deck(
                deck_id,
                f'Geriatrics Fellowship - Shaare Tzedek::{topic_he}'
            )
        
        # Load all content
        original = self.load_original_content()
        pubmed = self.load_pubmed_cards()
        weak_topics = self.load_weak_areas()
        
        print(f"📊 Loading content:")
        print(f"  - Original cards: {len(original)}")
        print(f"  - PubMed cards: {len(pubmed)}")
        print(f"  - Weak topics identified: {weak_topics}")
        
        # Process original content
        for item in original:
            note = self.create_note(item, weak_topics)
            
            # Add to appropriate subdeck
            added = False
            for topic_en, deck in subdecks.items():
                if topic_en in str(item).lower() or self.topics[topic_en] in str(item):
                    deck.add_note(note)
                    added = True
                    break
            
            if not added:
                main_deck.add_note(note)
        
        # Process PubMed cards
        pubmed_deck = genanki.Deck(
            abs(hash('pubmed')) % (10**10),
            'Geriatrics Fellowship - Shaare Tzedek::Recent Research'
        )
        
        for card in pubmed:
            note = self.create_note(card, weak_topics)
            pubmed_deck.add_note(note)
        
        # Create weak areas focus deck if needed
        if weak_topics:
            weak_deck = genanki.Deck(
                abs(hash('weak')) % (10**10),
                'Geriatrics Fellowship - Shaare Tzedek::🔥 Focus Areas'
            )
            
            # Add cards from weak topics
            for item in original + pubmed:
                for topic in weak_topics:
                    if topic.lower() in str(item).lower():
                        note = self.create_note(item, weak_topics)
                        weak_deck.add_note(note)
                        break
        
        return main_deck, subdecks, pubmed_deck
    
    def save_packages(self, output_dir='dist'):
        """Save Anki packages"""
        Path(output_dir).mkdir(exist_ok=True)
        
        # Build decks
        main_deck, subdecks, pubmed_deck = self.build_decks()
        
        # Create main package with all decks
        package = genanki.Package([main_deck] + list(subdecks.values()) + [pubmed_deck])
        package.write_to_file(f'{output_dir}/geriatrics_complete.apkg')
        print(f"✅ Saved complete package: {output_dir}/geriatrics_complete.apkg")
        
        # Create PubMed-only package
        pubmed_package = genanki.Package([pubmed_deck])
        pubmed_package.write_to_file(f'{output_dir}/pubmed_recent.apkg')
        print(f"✅ Saved PubMed package: {output_dir}/pubmed_recent.apkg")
        
        # Create individual topic packages
        for topic_en, deck in subdecks.items():
            if deck.notes:  # Only save if has notes
                topic_package = genanki.Package([deck])
                topic_package.write_to_file(f'{output_dir}/{topic_en}.apkg')
                print(f"✅ Saved {topic_en} package")
        
        # Generate stats
        total_cards = len(main_deck.notes)
        for deck in subdecks.values():
            total_cards += len(deck.notes)
        total_cards += len(pubmed_deck.notes)
        
        stats = {
            'total_cards': total_cards,
            'main_deck': len(main_deck.notes),
            'pubmed_cards': len(pubmed_deck.notes),
            'topics': {k: len(v.notes) for k, v in subdecks.items()},
            'generated_at': datetime.now().isoformat()
        }
        
        with open(f'{output_dir}/build_stats.json', 'w') as f:
            json.dump(stats, f, indent=2)
        
        print(f"\n📊 Build Statistics:")
        print(f"  Total cards: {total_cards}")
        print(f"  Topics covered: {len(subdecks)}")
        print(f"  Recent research: {len(pubmed_deck.notes)} cards")


def main():
    builder = GeriatricsAnkiBuilder()
    builder.save_packages()
    print("\n🎉 Build complete! Packages saved to dist/")


if __name__ == "__main__":
    main()