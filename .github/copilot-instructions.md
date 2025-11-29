# Copilot Instructions for Geriatrics Study Repository

## Project Overview

This is an educational materials system for geriatrics topics featuring Anki flashcards and H5P interactive content with full Hebrew language support.

## Technology Stack

- **Node.js 20+**: H5P interactive content (located in `h5p/` directory)
- **Python 3.11+**: Anki flashcard building (located in `anki/` directory)
- **Content**: Questions and answers stored in `data/content.json`

## Development Environment Setup

### H5P (Node.js)

```bash
cd h5p
npm install
```

### Anki (Python)

```bash
cd anki
pip install -r requirements.txt
```

## Building

### H5P QuestionSet

```bash
cd h5p
npm run build:qset
```

### H5P Mega Package

```bash
cd h5p
TOPICS="דליריום,שבריריות (Frailty)" PASS=75 npm run build:mega
```

### Anki Package

```bash
cd anki
PYTHONIOENCODING=utf-8 python build_apkg.py
```

## Testing

### H5P (JavaScript)

```bash
cd h5p
npm run lint        # ESLint
npm test            # Jest tests
npx prettier --check "**/*.{js,jsx,json,css,md}"
```

### Anki (Python)

```bash
cd anki
pytest              # Run tests
pytest --cov=.      # Run tests with coverage
```

## Code Style

### JavaScript (H5P)

- Follow ESLint configuration in `h5p/.eslintrc.json`
- Follow Prettier configuration in `h5p/.prettierrc.json`
- Use modern JavaScript syntax (see `.eslintrc.json` for specific rules)

### Python (Anki)

- Follow flake8 configuration in `anki/.flake8`
- Follow pyproject.toml for project settings
- Use Python 3.11+ features as appropriate

## Content Guidelines

### Hebrew Language Support

- This project uses Hebrew content with RTL (right-to-left) support
- Maintain proper Hebrew formatting in content files
- Test Hebrew rendering in output packages

### Topics Covered

The repository covers 12 geriatrics topics:

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

## Project Structure

```
geriatrics-study/
├── h5p/                    # H5P interactive content
│   ├── build-h5p-questionset.js
│   ├── build-h5p-mega.js
│   ├── __tests__/          # Jest tests
│   └── dist/               # Built H5P packages
├── anki/                   # Anki flashcard system
│   ├── build_apkg.py
│   ├── test_build.py       # Pytest tests
│   └── dist/               # Built Anki packages
├── data/                   # Source content
│   └── content.json        # Questions and answers
└── .github/workflows/      # CI/CD automation
```

## CI/CD Notes

- The CI pipeline runs on pushes to `main` and pull requests
- Changes to `h5p/`, `anki/`, `data/`, or `.github/workflows/` trigger builds
- Security audits run via `npm audit` and `pip-audit`
- Build artifacts are retained for 30 days; audit/coverage reports for 7 days

## Common Tasks

### Adding New Questions

1. Edit `data/content.json` with new questions
2. Run both H5P and Anki builds to generate updated packages
3. Verify Hebrew text renders correctly

### Updating Dependencies

- For H5P: Update `h5p/package.json` and run `npm ci` (or `npm install` to update lock file)
- For Anki: Update `anki/requirements.txt` and run `pip install -r requirements.txt`
- Run security audits after updating dependencies

### Creating Releases

Releases are automated via `.github/workflows/release.yml` and include:
- H5P QuestionSet packages
- H5P Mega packages
- Anki packages
