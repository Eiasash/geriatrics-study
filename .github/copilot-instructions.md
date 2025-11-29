# Copilot Instructions for Geriatrics Study Repository

This repository contains educational materials for geriatrics topics, including Anki flashcards and H5P interactive content with Hebrew language support.

## Repository Structure

- `h5p/` - H5P interactive content (Node.js/JavaScript)
- `anki/` - Anki flashcard system (Python)
- `data/` - Source content data (JSON)
- `scripts/` - Utility scripts
- `.github/workflows/` - CI/CD automation

## Development Environment

### Prerequisites
- Node.js 20+
- Python 3.11+
- Git

### Setup Commands
```bash
# H5P dependencies
cd h5p && npm install

# Anki dependencies
cd anki && pip install -r requirements.txt
```

## Code Style and Standards

### JavaScript/Node.js (H5P)
- Use ESLint for linting: `npm run lint` in `h5p/` directory
- Use Prettier for formatting: `npm run format` in `h5p/` directory
- Run tests with Jest: `npm test` in `h5p/` directory
- Follow existing code patterns in `build-h5p-*.js` files

### Python (Anki)
- Use Black for formatting (`black --line-length 100`)
- Use isort for import sorting (profile: black)
- Run tests with pytest: `pytest` in `anki/` directory
- Follow patterns in `build_apkg.py`

## Testing Requirements

### H5P Testing
```bash
cd h5p
npm test           # Run unit tests
npm run lint       # Check code style
```

### Anki Testing
```bash
cd anki
pytest             # Run unit tests
pytest --cov=.     # Run with coverage
```

## Building Packages

### H5P QuestionSet
```bash
cd h5p
npm run build:qset
# Output: h5p/dist/<Topic>_QuestionSet.h5p
```

### H5P Mega Package
```bash
cd h5p
# TOPICS: Comma-separated list of topic names (in Hebrew)
# PASS: Minimum passing score percentage
TOPICS="דליריום,שבריריות (Frailty)" PASS=75 npm run build:mega
# Output: h5p/dist/geriatrics_mega.h5p
```

### Anki Package
```bash
cd anki
python build_apkg.py
# Output: anki/dist/geriatrics.apkg
```

## Hebrew Language Support

This project has full Hebrew (RTL) language support:
- Content is primarily in Hebrew
- Ensure RTL text direction is maintained when modifying content
- Use UTF-8 encoding for all files containing Hebrew text
- Test Hebrew rendering after content changes

## CI/CD Pipeline

The repository uses GitHub Actions for:
- Security audits (npm audit, pip-audit)
- Code linting (ESLint, Prettier)
- Unit testing (Jest, pytest)
- Package building and validation
- Automated releases

### Required Status Checks
- CI Summary
- Build h5p (questionset)
- Build h5p (mega)
- Build anki (default)
- Security audit (Node.js)
- Security audit (Python)
- CodeQL analysis

## When Making Changes

1. **Before starting**: Understand the existing code patterns
2. **Run tests early**: Validate changes don't break existing functionality
3. **Follow conventions**: Match the style of surrounding code
4. **Test Hebrew content**: Ensure Hebrew text renders correctly
5. **Check CI locally**: Run lint and test commands before pushing

## Content Guidelines

### Medical Content
- Medical content should be reviewed by geriatrics specialists before merging
- Content is structured as questions and answers in `data/content.json`
- Each topic has a Hebrew name and English equivalent

### Topics Covered
1. דליריום (Delirium)
2. דמנציה ומחלת אלצהיימר (Dementia and Alzheimer's)
3. שבריריות (Frailty)
4. נפילות (Falls)
5. דיכאון בגיל המבוגר (Depression in the Elderly)
6. רישום ודה-פרסקייבינג תרופות (Prescribing and Deprescribing)
7. אי שליטה בסוגרים (Incontinence)
8. סרקופניה ותזונה (Sarcopenia and Nutrition)
9. טיפול סוף-חיים (End-of-life Care)
10. שבץ מוחי (Stroke/TIA)
11. אי ספיקת לב / יתר לחץ דם (Heart Failure/Hypertension)
12. פרקינסון ותסמונות אקסטרה-פירמידליות (Parkinson's and Extrapyramidal Syndromes)

## Security Considerations

- Run security audits before merging: `npm audit` and `pip-audit`
- Keep dependencies up to date via Dependabot
- Review CodeQL alerts for security vulnerabilities
- Don't commit sensitive data or credentials
