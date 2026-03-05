# SZMC Geriatrics Hub

<p align="center">
  <img src="szmc-presentation-maker/icons/icon.svg" width="120" alt="SZMC Geriatrics Logo">
</p>

<p align="center">
  <strong>Shaare Zedek Medical Center - Geriatrics Department</strong><br>
  Clinical tools, educational resources & presentation maker
</p>

<p align="center">
  <a href="https://eiasash.github.io/geriatrics-study/">🌐 Live Site</a> •
  <a href="https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/">📊 Presentation Maker</a> •
  <a href="https://eiasash.github.io/geriatrics-study/clinical-tools/dashboard.html">🩺 Clinical Tools</a>
</p>

<p align="center">
  <a href="https://github.com/Eiasash/geriatrics-study/actions/workflows/ci.yml">
    <img src="https://github.com/Eiasash/geriatrics-study/actions/workflows/ci.yml/badge.svg" alt="CI Status">
  </a>
  <a href="https://github.com/Eiasash/geriatrics-study/actions/workflows/codeql.yml">
    <img src="https://github.com/Eiasash/geriatrics-study/actions/workflows/codeql.yml/badge.svg" alt="CodeQL">
  </a>
  <a href="https://github.com/Eiasash/geriatrics-study/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://github.com/Eiasash/geriatrics-study/issues">
    <img src="https://img.shields.io/github/issues/Eiasash/geriatrics-study" alt="Issues">
  </a>
  <a href="https://github.com/Eiasash/geriatrics-study/stargazers">
    <img src="https://img.shields.io/github/stars/Eiasash/geriatrics-study" alt="Stars">
  </a>
</p>

---

## 🚀 Quick Links

| Tool | Description | Link |
|------|-------------|------|
| **Presentation Maker** | Create medical presentations for case reviews & journal clubs | [Open →](https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/) |
| **Clinical Dashboard** | Geriatric assessments, medications & decision tools | [Open →](https://eiasash.github.io/geriatrics-study/clinical-tools/dashboard.html) |
| **H5P Study Mode** | Interactive quizzes and flashcards | [Open →](https://eiasash.github.io/geriatrics-study/h5p/) |
| **Hazzard's 8e** | Comprehensive geriatric medicine study materials | [Open →](https://eiasash.github.io/geriatrics-study/hazzards/) |
| **Toranot Shift Manager** | Night shift patient tracking, drug safety alerts, AI clinical notes | [Open →](https://toranot.netlify.app) |

---

## 📁 Repository Structure

```
geriatrics-study/
├── index.html                    # Main landing page
├── szmc-presentation-maker/      # Presentation creation tool (online)
│   ├── css/                      # Stylesheets (mobile, RTL, dark mode)
│   ├── js/                       # Application logic & templates
│   ├── templates/                # Case & journal club templates
│   └── presentations/            # Saved presentation examples
├── clinical-tools/               # Clinical reference applications
│   ├── dashboard.html            # Main clinical tools hub
│   ├── assessments.html          # Geriatric assessments (MMSE, MoCA, etc.)
│   ├── medications.html          # Medication reference & Beers criteria
│   ├── anticoag.html             # Anticoagulation management
│   ├── decisions.html            # Clinical decision support
│   ├── evidence.html             # Evidence-based guidelines
│   ├── exam.html                 # Physical examination reference
│   ├── oncall.html               # On-call quick reference
│   └── ai-assistant.html         # AI-powered clinical assistant
├── hazzards/                     # Hazzard's Geriatric Medicine 8e
│   ├── Part1_*.html              # Principles of Geriatric Medicine
│   ├── Part2_*.html              # Geriatric Syndromes
│   └── Part3_*.html              # Organ System Diseases
├── h5p/                          # Interactive learning content
│   ├── build-h5p.js              # H5P content generator
│   └── index.html                # Study mode interface
├── data/                         # Shared data files
│   └── content.json              # Question banks & content
├── scripts/                      # Utility scripts
│   ├── pubmed_fetcher.py         # PubMed citation fetcher
│   ├── setup-local-presentation-maker.sh   # Local setup (Linux/macOS)
│   └── setup-local-presentation-maker.ps1  # Local setup (Windows)
└── local-presentation-maker/     # Local instance (git-ignored)
```

---

## 🛠️ Features

### Presentation Maker
- **25+ slide templates** for case presentations and journal clubs
- **AI-assisted content generation** from clinical notes
- **Export options**: PPTX, PDF, PNG, HTML
- **Hebrew RTL support** for bilingual presentations
- **Dark mode** for comfortable editing
- **PWA support** - install as app on mobile/desktop
- **Offline capable** with service worker caching

### Clinical Tools
- **Geriatric Assessments**: MMSE, MoCA, GDS, ADL/IADL scales
- **Medication Reference**: Beers criteria, drug interactions
- **Anticoagulation**: CHADS-VASc, HAS-BLED, reversal protocols
- **Evidence Search**: Quick access to guidelines and literature

### Study Resources
- **Hazzard's 8e**: Complete textbook content searchable
- **H5P Quizzes**: Interactive board exam preparation
- **Flashcards**: Spaced repetition learning

### Shift Management ([Toranot](https://toranot.netlify.app))
- **Patient Tracking**: Night shift patient list with acuity scoring
- **Drug Safety**: Beers 2023 criteria, drug interaction screening
- **Lab Monitoring**: KDIGO AKI and hemoglobin delta alerts
- **Antibiotic Dosing**: 19 antibiotics with renal adjustment
- **AI Clinical Notes**: Claude and Gemini-powered documentation
- **OCR Import**: Scan patient lists with camera

---

## 💻 Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/Eiasash/geriatrics-study.git
cd geriatrics-study

# Serve locally (any static server works)
npx serve .
# or
python -m http.server 8000
```

### Local Presentation Maker

Create your own offline, customizable copy of the Presentation Maker:

```bash
# Linux/macOS
./scripts/setup-local-presentation-maker.sh

# Windows PowerShell
.\scripts\setup-local-presentation-maker.ps1
```

This creates a `local-presentation-maker/` folder (git-ignored) with:
- **Dashboard** - Quick access to templates, recent presentations, statistics
- **Local HTTP Server** - Python/Node.js server for full functionality
- **Personal Config** - Customize your name, theme, language, shortcuts
- **Local Storage** - Save presentations to `my-presentations/`, `exports/`, `backups/`
- **Update Mode** - Refresh core files while preserving your data

### Building H5P Content
```bash
cd h5p
npm install
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

Quick start:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 🔒 Security

For security concerns or to report vulnerabilities, please see our [Security Policy](SECURITY.md).

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.

---

## 🏥 About

This project is developed for the **Geriatrics Department at Shaare Zedek Medical Center, Jerusalem**. 

It provides educational and clinical tools for:
- Medical residents and fellows
- Attending physicians
- Medical students
- Allied health professionals

---

<p align="center">
  <sub>Made with ❤️ for better geriatric care</sub>
</p>
