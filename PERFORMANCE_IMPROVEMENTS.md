# Performance Improvements Guide

This document identifies slow or inefficient code patterns in the geriatrics-study repository and provides recommendations for optimization.

---

## Table of Contents

1. [Python Code Improvements](#python-code-improvements)
2. [JavaScript Code Improvements](#javascript-code-improvements)
3. [Database Optimizations](#database-optimizations)
4. [Network & API Optimizations](#network--api-optimizations)
5. [DOM Manipulation Optimizations](#dom-manipulation-optimizations)
6. [Memory Management](#memory-management)

---

## Python Code Improvements

### 1. PubMed Fetcher (`scripts/pubmed_fetcher.py`)

#### Issue: Sequential API Calls
**Location:** Lines 173-188

```python
# Current (inefficient) - makes sequential requests
for topic, query in self.search_queries.items():
    pmids = self.search_pubmed(query, max_results=3)
    for pmid in pmids:
        article = self.fetch_article_details(pmid)
        time.sleep(0.5)  # Blocking sleep
```

**Improvement:** Use `concurrent.futures` for parallel API requests while respecting rate limits:

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def fetch_all_topics(self, days_back: int = 30) -> Dict:
    all_articles = {}
    all_cards = []
    
    # Use thread pool for parallel topic fetching
    with ThreadPoolExecutor(max_workers=3) as executor:
        future_to_topic = {
            executor.submit(self._fetch_topic, topic, query): topic
            for topic, query in self.search_queries.items()
        }
        
        for future in as_completed(future_to_topic):
            topic = future_to_topic[future]
            try:
                articles = future.result()
                all_articles[topic] = articles
                cards = self.generate_anki_cards(articles, topic)
                all_cards.extend(cards)
            except Exception as e:
                print(f"Error fetching {topic}: {e}")
```

#### Issue: Inefficient String Pattern Matching
**Location:** Lines 115-135 (`extract_key_findings`)

```python
# Current - iterates patterns for each sentence
for sentence in sentences:
    lower_sent = sentence.lower()
    if any(pattern in lower_sent for pattern in patterns):
        # ...
```

**Improvement:** Pre-compile patterns into a single regex:

```python
import re

def extract_key_findings(self, abstract: str) -> List[str]:
    findings = []
    # Compile patterns once
    pattern_regex = re.compile(
        r'(concluded that|found that|demonstrated that|showed that|'
        r'revealed that|suggest that|indicates that|associated with|significantly)',
        re.IGNORECASE
    )
    
    sentences = abstract.split('. ')
    for sentence in sentences:
        if pattern_regex.search(sentence):
            clean_sent = sentence.strip()
            if 20 < len(clean_sent) < 200:
                findings.append(clean_sent)
    
    return findings[:3]
```

#### Issue: Duplicate hashlib Import
**Location:** Lines 13 and 13 in `mk_id` function

```python
import hashlib  # Line 13 at top

def mk_id(seed):
    import hashlib  # Unnecessary re-import
```

**Improvement:** Remove the redundant import inside the function.

---

### 2. Tracking App (`tracking/app.py`)

#### Issue: Repeated Database Connections
**Location:** Lines 66-94, 107-125, etc.

```python
# Current - creates new connection for each request
conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
# ... operations ...
conn.commit()
conn.close()
```

**Improvement:** Use Flask's `g` object for connection pooling:

```python
from flask import g

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
```

#### Issue: N+1 Query Pattern in `calculate_streak`
**Location:** Lines 259-285

```python
# Current - fetches all dates, processes in Python
dates = c.execute('''
    SELECT DISTINCT DATE(timestamp) as study_date
    FROM progress
    ORDER BY study_date DESC
''').fetchall()

# Then loops through dates in Python
for date_row in dates:
    study_date = datetime.strptime(date_row[0], '%Y-%m-%d').date()
    # ...
```

**Improvement:** Use SQL window functions:

```python
def calculate_streak():
    conn = get_db()
    c = conn.cursor()
    
    # Calculate streak directly in SQL
    result = c.execute('''
        WITH consecutive_dates AS (
            SELECT DATE(timestamp) as study_date,
                   DATE(timestamp, '-' || ROW_NUMBER() OVER (ORDER BY DATE(timestamp) DESC) || ' days') as grp
            FROM progress
            WHERE DATE(timestamp) >= DATE('now', '-365 days')
            GROUP BY DATE(timestamp)
        )
        SELECT COUNT(*) as streak
        FROM consecutive_dates
        WHERE grp = (SELECT MAX(grp) FROM consecutive_dates)
    ''').fetchone()
    
    return result[0] if result else 0
```

#### Issue: Inefficient SQL Query in `get_study_plan`
**Location:** Lines 142-150

```python
# Current - two separate queries
overdue = c.execute('''SELECT DISTINCT topic FROM progress WHERE ...''')
weak = c.execute('''SELECT topic, AVG(score) FROM progress WHERE ...''')
```

**Improvement:** Combine into single query:

```python
c.execute('''
    SELECT topic, 
           AVG(score) as avg_score,
           MAX(timestamp) as last_study,
           CASE 
               WHEN MAX(timestamp) < datetime('now', '-3 days') THEN 'overdue'
               WHEN AVG(score) < 75 THEN 'weak'
               ELSE 'normal'
           END as status
    FROM progress
    GROUP BY topic
    ORDER BY 
        CASE WHEN MAX(timestamp) < datetime('now', '-3 days') THEN 0 ELSE 1 END,
        avg_score ASC
''')
```

---

## JavaScript Code Improvements

### 1. Presentation Generator (`szmc-presentation-maker/js/generator.js`)

#### Issue: Repeated DOM Queries
**Location:** Lines 956-996 (`generateFromText`)

```javascript
// Current - multiple getElementById calls
const textInput = document.getElementById('paste-text-input');
const titleInput = document.getElementById('gen-title-input');
const presenterInput = document.getElementById('gen-presenter-input');
const themeSelect = document.getElementById('gen-theme-select');
```

**Improvement:** Cache DOM references:

```javascript
// Cache elements once at module load
const DOM = {
    textInput: null,
    titleInput: null,
    presenterInput: null,
    themeSelect: null
};

function initDOMCache() {
    DOM.textInput = document.getElementById('paste-text-input');
    DOM.titleInput = document.getElementById('gen-title-input');
    DOM.presenterInput = document.getElementById('gen-presenter-input');
    DOM.themeSelect = document.getElementById('gen-theme-select');
}

// Call on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initDOMCache);
```

#### Issue: Inefficient Indicator Detection
**Location:** Lines 29-62 (`detectPresentationType`)

```javascript
// Current - iterates through arrays using includes()
journalIndicators.forEach(ind => {
    if (textLower.includes(ind)) journalScore++;
});
```

**Improvement:** Use Set for O(1) lookups or a single regex:

```javascript
detectPresentationType(text) {
    const textLower = text.toLowerCase();
    
    // Use single regex for faster matching
    const journalRegex = /abstract|methods|results|conclusion|study design|randomized|cohort|meta-analysis|systematic review|p-value|confidence interval/gi;
    const caseRegex = /chief complaint|history of present illness|hpi|past medical history|pmh|physical exam|vitals|blood pressure|presents with/gi;
    
    const journalScore = (textLower.match(journalRegex) || []).length;
    const caseScore = (textLower.match(caseRegex) || []).length;
    
    return caseScore >= journalScore ? 'case' : 'journal';
}
```

---

### 2. Editor Module (`szmc-presentation-maker/js/editor.js`)

#### Issue: Repeated `forEach` with Index Updates
**Location:** Lines 68-70, 94-96, 126-128, etc.

```javascript
// Current - repeated pattern
this.slides.forEach((slide, index) => {
    slide.order = index;
});
```

**Improvement:** Create a utility function:

```javascript
// Utility function
updateSlideOrders() {
    for (let i = 0; i < this.slides.length; i++) {
        this.slides[i].order = i;
    }
}

// Use wherever needed
this.updateSlideOrders();
```

#### Issue: Expensive JSON Serialization in History
**Location:** Lines 389-406 (`saveState`)

```javascript
// Current - full JSON stringify on every save
const state = {
    slides: JSON.parse(JSON.stringify(this.slides)),
    currentSlideIndex: this.currentSlideIndex
};
```

**Improvement:** Use structured cloning (faster) or debounce saves:

```javascript
saveState() {
    // Debounce state saves
    if (this.saveStateTimeout) {
        clearTimeout(this.saveStateTimeout);
    }
    
    this.saveStateTimeout = setTimeout(() => {
        // Use structuredClone (modern browsers) or fallback
        const state = {
            slides: typeof structuredClone !== 'undefined' 
                ? structuredClone(this.slides)
                : JSON.parse(JSON.stringify(this.slides)),
            currentSlideIndex: this.currentSlideIndex
        };
        
        // Remove states after current index
        this.history.length = this.historyIndex + 1;
        this.history.push(state);
        this.historyIndex++;
        
        // Limit history
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.historyIndex--;
        }
        
        this.updateUndoRedoButtons();
    }, 100);
}
```

---

### 3. AI Assistant (`szmc-presentation-maker/js/ai-assistant.js`)

#### Issue: Multiple Full Slide Iterations
**Location:** Lines 84-122 (`analyzePresentation`)

```javascript
// Current - runs 15+ separate slide iterations
this.checkSlideCount(slides);
this.checkEmptySlides(slides);      // forEach
this.checkSlideOrder(slides);       // map + indexOf
this.checkContentLength(slides);    // forEach
this.checkContentDensity(slides);   // forEach
// ... and 10+ more methods that iterate slides
```

**Improvement:** Single-pass analysis:

```javascript
analyzePresentation(slides) {
    this.issues = [];
    this.suggestions = [];
    this.lastAnalysisTime = new Date();

    if (!slides || slides.length === 0) {
        this.addIssue(this.SEVERITY.ERROR, 'No slides found', ...);
        return this.getResults();
    }

    // Collect data in single pass
    const analysisData = {
        slideTypes: [],
        contentLengths: [],
        allText: '',
        titleIndex: -1,
        hpiIndex: -1,
        assessmentIndex: -1
    };

    slides.forEach((slide, index) => {
        const text = this.getSlideText(slide);
        const textLength = text.length;
        
        analysisData.slideTypes.push(slide.type);
        analysisData.contentLengths.push(textLength);
        analysisData.allText += ' ' + text;
        
        // Track important slide positions
        if (slide.type === 'title') analysisData.titleIndex = index;
        if (slide.type === 'hpi') analysisData.hpiIndex = index;
        if (slide.type === 'assessment') analysisData.assessmentIndex = index;
        
        // Per-slide checks (in same iteration)
        if (this.isSlideEmpty(slide)) {
            this.addIssue(this.SEVERITY.WARNING, 'Empty slide', ...);
        }
        if (textLength > 800) {
            this.addIssue(this.SEVERITY.WARNING, 'Too much text', ...);
        }
    });

    // Aggregate checks using collected data
    this.runAggregateChecks(analysisData, slides);
    this.calculatePresentationScore(slides);
    
    return this.getResults();
}
```

#### Issue: Repeated `getSlideText` Calls
**Location:** Multiple methods call `getSlideText` on the same slides

```javascript
// Current - same slide's text retrieved multiple times
checkContentLength(slides) {
    slides.forEach((slide, index) => {
        const textLength = this.getSlideTextLength(slide); // calls getSlideText
    });
}

checkReadability(slides) {
    slides.forEach((slide, index) => {
        const text = this.getSlideText(slide); // same slide, duplicate work
    });
}
```

**Improvement:** Cache slide text during analysis:

```javascript
analyzePresentation(slides) {
    // Cache slide text
    this.slideTextCache = new Map();
    slides.forEach((slide, index) => {
        this.slideTextCache.set(index, this.getSlideText(slide));
    });
    
    // Methods use cache
    // ...
    
    // Clear cache after analysis
    this.slideTextCache = null;
}

getCachedSlideText(slide, index) {
    if (this.slideTextCache && this.slideTextCache.has(index)) {
        return this.slideTextCache.get(index);
    }
    return this.getSlideText(slide);
}
```

---

### 4. Main Application (`szmc-presentation-maker/js/main.js`)

#### Issue: Multiple Event Listeners for Same Action
**Location:** Lines 229-243 (auto-save)

```javascript
// Current - adds new listener on every input event
document.addEventListener('input', () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        // duplicate auto-save logic
    }, 5000);
});
```

**Improvement:** Use single debounced handler:

```javascript
// Debounce utility
function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Single auto-save function
const performAutoSave = debounce(() => {
    if (editor.isDirty) {
        updateAutoSaveIndicator('saving');
        try {
            const presentation = editor.getPresentation();
            localStorage.setItem('szmc_autosave', JSON.stringify(presentation));
            setTimeout(() => updateAutoSaveIndicator('saved'), 500);
        } catch (e) {
            updateAutoSaveIndicator('error');
        }
    }
}, 5000);

// Single listener
document.addEventListener('input', performAutoSave);
```

#### Issue: Duplicate Theme Object Definitions
**Location:** Lines 267-276 and 404-413

```javascript
// Same themes object defined twice
const themes = {
    'szmc-blue': { primary: '#1e40af', light: '#3b82f6', accent: '#60a5fa' },
    // ...
};
```

**Improvement:** Define once and export:

```javascript
// Define once at module level
const THEMES = Object.freeze({
    'szmc-blue': { primary: '#1e40af', light: '#3b82f6', accent: '#60a5fa' },
    'clinical-green': { primary: '#047857', light: '#059669', accent: '#34d399' },
    // ...
});

// Use everywhere
function applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (theme) {
        // ...
    }
}
```

---

## Database Optimizations

### SQLite Indexing (`tracking/app.py`)

#### Issue: Missing Indexes

```python
# Current schema lacks indexes for common queries
c.execute('''
    CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic TEXT NOT NULL,
        score REAL NOT NULL,
        ...
    )
''')
```

**Improvement:** Add indexes for frequently queried columns:

```python
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Existing table creation...
    
    # Add indexes for performance
    c.execute('CREATE INDEX IF NOT EXISTS idx_progress_topic ON progress(topic)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_progress_timestamp ON progress(timestamp)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_progress_score ON progress(score)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_weak_areas_topic ON weak_areas(topic)')
    
    conn.commit()
    conn.close()
```

---

## Network & API Optimizations

### PubMed API Batching

#### Issue: Individual Requests Per Article

```python
# Current - one request per article
for pmid in pmids:
    article = self.fetch_article_details(pmid)
```

**Improvement:** Batch requests (PubMed supports up to 200 IDs per request):

```python
def fetch_article_details_batch(self, pmids: List[str]) -> List[Dict]:
    """Fetch multiple articles in a single API call"""
    if not pmids:
        return []
    
    fetch_url = f"{self.base_url}/efetch.fcgi"
    params = {
        'db': 'pubmed',
        'id': ','.join(pmids),  # Comma-separated IDs
        'rettype': 'abstract',
        'retmode': 'xml',
        'email': self.email
    }
    
    try:
        response = requests.get(fetch_url, params=params)
        root = ET.fromstring(response.content)
        
        articles = []
        for article in root.findall('.//PubmedArticle'):
            # Parse each article
            articles.append(self._parse_article(article))
        
        return articles
    except Exception as e:
        print(f"Batch fetch error: {e}")
        return []
```

---

## DOM Manipulation Optimizations

### Template Rendering (`szmc-presentation-maker/js/templates.js`)

#### Issue: Template String Concatenation with HTML

**Improvement:** Use DocumentFragment for complex DOM operations:

```javascript
// Instead of innerHTML = template string
// Use DocumentFragment for batch DOM updates

function renderSlideList(slides) {
    const fragment = document.createDocumentFragment();
    
    slides.forEach((slide, index) => {
        const div = document.createElement('div');
        div.className = 'slide-thumbnail';
        div.dataset.index = index;
        // ... build element
        fragment.appendChild(div);
    });
    
    // Single DOM update
    container.innerHTML = '';
    container.appendChild(fragment);
}
```

---

## Memory Management

### Event Listener Cleanup

#### Issue: Event listeners not cleaned up

**Location:** `szmc-presentation-maker/js/editor.js` line 687-724

```javascript
// Event listeners added but never removed
slideCanvas.addEventListener('dragover', ...);
slideCanvas.addEventListener('dragleave', ...);
slideCanvas.addEventListener('drop', ...);
```

**Improvement:** Track and clean up listeners:

```javascript
class PresentationEditor {
    constructor() {
        this.eventListeners = [];
    }
    
    addTrackedListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }
    
    cleanup() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }
}
```

### LocalStorage Size Management

#### Issue: Unbounded localStorage usage

**Location:** `szmc-presentation-maker/js/main.js` lines 62-65

```javascript
saves[saveId] = presentation;
localStorage.setItem('szmc_presentations', JSON.stringify(saves));
```

**Improvement:** Implement size limits and cleanup:

```javascript
function savePresentation() {
    const MAX_SAVES = 10;
    const MAX_SIZE_MB = 5;
    
    const saves = JSON.parse(localStorage.getItem('szmc_presentations') || '{}');
    
    // Remove oldest saves if exceeding limit
    const saveKeys = Object.keys(saves).sort();
    while (saveKeys.length >= MAX_SAVES) {
        const oldest = saveKeys.shift();
        delete saves[oldest];
    }
    
    // Check total size
    const newSaves = JSON.stringify(saves);
    if (new Blob([newSaves]).size > MAX_SIZE_MB * 1024 * 1024) {
        // Remove oldest until under limit
        while (new Blob([JSON.stringify(saves)]).size > MAX_SIZE_MB * 1024 * 1024 && Object.keys(saves).length > 0) {
            const oldest = Object.keys(saves).sort()[0];
            delete saves[oldest];
        }
    }
    
    // Add new save
    const saveId = presentation.title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    saves[saveId] = presentation;
    
    try {
        localStorage.setItem('szmc_presentations', JSON.stringify(saves));
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            // Clear old saves and retry
            localStorage.removeItem('szmc_presentations');
            localStorage.setItem('szmc_presentations', JSON.stringify({ [saveId]: presentation }));
        }
    }
}
```

---

## Summary of Key Improvements

| Area | Issue | Impact | Difficulty |
|------|-------|--------|------------|
| PubMed Fetcher | Sequential API calls | High | Medium |
| Tracking App | Repeated DB connections | Medium | Low |
| Generator | Repeated DOM queries | Medium | Low |
| AI Assistant | Multiple slide iterations | High | High |
| Main App | Duplicate theme definitions | Low | Low |
| Database | Missing indexes | Medium | Low |
| Event Listeners | No cleanup | Medium | Medium |

---

## Implementation Priority

1. **High Priority (Quick Wins)**
   - Add database indexes
   - Remove duplicate code (themes, imports)
   - Cache DOM references
   - Implement debouncing for auto-save

2. **Medium Priority**
   - Batch API requests
   - Single-pass slide analysis
   - Connection pooling for SQLite

3. **Lower Priority (Larger Refactors)**
   - Event listener cleanup system
   - localStorage size management
   - Convert to async/await patterns

---

*Generated on: $(date)*
*For: geriatrics-study repository*
