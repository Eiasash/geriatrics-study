# Geriatrics Study Materials 🏥

[![CI Pipeline](https://github.com/Eiasash/geriatrics-study/actions/workflows/ci.yml/badge.svg)](https://github.com/Eiasash/geriatrics-study/actions/workflows/ci.yml)
[![H5P Build](https://github.com/Eiasash/geriatrics-study/actions/workflows/h5p-deploy.yml/badge.svg)](https://github.com/Eiasash/geriatrics-study/actions/workflows/h5p-deploy.yml)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/Eiasash/geriatrics-study)](https://github.com/Eiasash/geriatrics-study/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Educational materials system for geriatrics topics - featuring H5P interactive content and the SZMC Presentation Maker with full Hebrew language support.

## 📚 Features

- **🎮 H5P Interactive Content**: Question sets and timed mega-quizzes
- **📊 SZMC Presentation Maker**: Create medical case presentations and journal club slides (PWA - installable)
- **🏥 Clinical Tools**: Medical calculators and assessment tools
- **🌐 Hebrew Support**: Full RTL support with proper formatting
- **🤖 Automated CI/CD**: Build, test, and release automation

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Eiasash/geriatrics-study.git
cd geriatrics-study

# Install H5P dependencies
cd h5p
npm install
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

## 📱 SZMC Presentation Maker

A Progressive Web App for creating professional medical presentations:

- **Case Presentations**: Structure patient cases for conferences
- **Journal Club**: Create slides for research paper reviews
- **Medical Snippets**: Quick-insert common geriatric assessments
- **Offline Support**: Works without internet connection
- **Export**: PowerPoint, PDF, and HTML formats

**Try it**: [https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/](https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/)

## 📦 Pre-built Releases

Download ready-to-use packages from the [Releases page](https://github.com/Eiasash/geriatrics-study/releases).

## 🏗️ Project Structure

```
geriatrics-study/
├── h5p/                        # H5P interactive content
│   ├── build-h5p-questionset.js
│   ├── build-h5p-mega.js
│   └── dist/                   # Built H5P packages
├── szmc-presentation-maker/    # PWA Presentation tool
│   ├── index.html
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
├── clinical-tools/             # Medical calculators
├── data/                       # Source content
│   └── content.json            # Questions and answers
└── .github/workflows/          # CI/CD automation
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
cd h5p
npm test
npm run lint
```

### Security Audits
```bash
cd h5p
npm audit
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For issues and questions:
- [Open an issue](https://github.com/Eiasash/geriatrics-study/issues)

---

Made with ❤️ for medical education
