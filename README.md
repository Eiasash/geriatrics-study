# Geriatrics Study Materials 🏥

[![CI Pipeline](https://github.com/Eiasash/geriatrics-study/actions/workflows/ci.yml/badge.svg)](https://github.com/Eiasash/geriatrics-study/actions/workflows/ci.yml)
[![CI Enhanced](https://github.com/Eiasash/geriatrics-study/actions/workflows/ci-enhanced.yml/badge.svg)](https://github.com/Eiasash/geriatrics-study/actions/workflows/ci-enhanced.yml)
[![Release](https://github.com/Eiasash/geriatrics-study/actions/workflows/release.yml/badge.svg)](https://github.com/Eiasash/geriatrics-study/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/Eiasash/geriatrics-study/branch/main/graph/badge.svg)](https://codecov.io/gh/Eiasash/geriatrics-study)
[![H5P Coverage](https://img.shields.io/badge/H5P%20Coverage-70%25-yellow)](https://codecov.io/gh/Eiasash/geriatrics-study/tree/main/h5p)
[![Anki Coverage](https://img.shields.io/badge/Anki%20Coverage-70%25-yellow)](https://codecov.io/gh/Eiasash/geriatrics-study/tree/main/anki)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/Eiasash/geriatrics-study)](https://github.com/Eiasash/geriatrics-study/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Dependabot Status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg)](https://github.com/Eiasash/geriatrics-study/network/updates)
[![Auto-Merge](https://img.shields.io/badge/Auto--Merge-enabled-blue)](https://github.com/Eiasash/geriatrics-study/blob/main/.github/workflows/dependabot-auto-merge.yml)

Educational materials system for geriatrics topics - featuring Anki flashcards and H5P interactive content with full Hebrew language support.

## 📚 Features

- **🎴 Anki Flashcards**: Comprehensive spaced repetition decks for 12 geriatrics topics
- **🎮 H5P Interactive Content**: Question sets and timed mega-quizzes
- **🌐 Hebrew Support**: Full RTL support with proper formatting
- **🤖 Automated CI/CD**: Build, test, and release automation
- **🔒 Security First**: Automated dependency audits and updates

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Eiasash/geriatrics-study.git
cd geriatrics-study

# Install H5P dependencies
cd h5p
npm install

# Install Anki dependencies
cd ../anki
pip install -r requirements.txt
```

### Building Packages

#### H5P QuestionSet
```bash
cd h5p
npm run build:qset
# Output: h5p/dist/<Topic>_QuestionSet.h5p
```

#### H5P Mega Package
```bash
cd h5p
TOPICS="דליריום,שבריריות (Frailty)" PASS=75 npm run build:mega
# Output: h5p/dist/geriatrics_mega.h5p
```

#### Anki Package
```bash
cd anki
python build_apkg.py
# Output: anki/dist/geriatrics.apkg
```

## 📦 Pre-built Releases

Download ready-to-use packages from the [Releases page](https://github.com/Eiasash/geriatrics-study/releases).

## 🏗️ Project Structure

```
geriatrics-study/
├── h5p/                    # H5P interactive content
│   ├── build-h5p-questionset.js
│   ├── build-h5p-mega.js
│   └── dist/              # Built H5P packages
├── anki/                  # Anki flashcard system
│   ├── build_apkg.py
│   └── dist/              # Built Anki packages
├── data/                  # Source content
│   └── content.json       # Questions and answers
└── .github/workflows/     # CI/CD automation
    ├── ci.yml            # Main CI pipeline
    ├── release.yml       # Release automation
    └── dependabot.yml    # Dependency updates
```

## 📋 Topics Covered

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

## 🔧 Development

### Running Tests
```bash
# H5P linting
cd h5p
npm run lint

# Anki tests
cd anki
pytest
```

### Security Audits
```bash
# Node.js audit
cd h5p
npm audit

# Python audit
pip-audit -r anki/requirements.txt
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Medical content reviewed by geriatrics specialists
- Built with H5P framework for interactive learning
- Anki spaced repetition system for effective memorization

## 📞 Support

For issues and questions:
- [Open an issue](https://github.com/Eiasash/geriatrics-study/issues)
- [View documentation](https://github.com/Eiasash/geriatrics-study/wiki)

---

Made with ❤️ for medical education
---
*Last updated: 2025-08-20 22:21:01*
