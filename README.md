# SZMC Geriatrics Hub

<p align="center">
  <img src="szmc-presentation-maker/icons/icon.svg" width="120" alt="SZMC Geriatrics Logo">
</p>

<p align="center">
  <strong>Shaare Zedek Medical Center - Geriatrics Department</strong><br>
  Clinical tools, educational resources & presentation maker
</p>

<p align="center">
  <a href="https://eiasash.github.io/geriatrics-study/">
    <img src="https://img.shields.io/badge/Live%20Site-Visit-blue?style=for-the-badge" alt="Live Site">
  </a>
  <a href="https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/">
    <img src="https://img.shields.io/badge/Presentation%20Maker-Open-green?style=for-the-badge" alt="Presentation Maker">
  </a>
</p>

---

## 🚀 Quick Links

| Tool | Description | Link |
|------|-------------|------|
| **Main Site** | Landing page and hub | [🌐 Open](https://eiasash.github.io/geriatrics-study/) |
| **Presentation Maker** | Create medical presentations for case reviews & journal clubs | [📊 Open](https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/) |
| **Clinical Dashboard** | Geriatric assessments, medications & decision tools | [🩺 Open](https://eiasash.github.io/geriatrics-study/clinical-tools/dashboard.html) |
| **H5P Study Mode** | Interactive quizzes and flashcards | [📚 Open](https://eiasash.github.io/geriatrics-study/h5p/) |
| **Hazzard's 8e - Part 1** | Principles of Geriatric Medicine | [📖 Open](https://eiasash.github.io/geriatrics-study/hazzards/Part1_Hazzards_Geriatric_Medicine_8e.html) |
| **Hazzard's 8e - Part 2** | Geriatric Syndromes | [📖 Open](https://eiasash.github.io/geriatrics-study/hazzards/Part2_Hazzards_Geriatric_Medicine_8e.html) |
| **Hazzard's 8e - Part 3** | Organ System Diseases | [📖 Open](https://eiasash.github.io/geriatrics-study/hazzards/Part3_Hazzards_Geriatric_Medicine_8e.html) |

---

## 🩺 Clinical Tools

| Tool | Description | Link |
|------|-------------|------|
| **Assessments** | MMSE, MoCA, GDS, ADL/IADL scales | [Open](https://eiasash.github.io/geriatrics-study/clinical-tools/assessments.html) |
| **Medications** | Medication reference & Beers criteria | [Open](https://eiasash.github.io/geriatrics-study/clinical-tools/medications.html) |
| **Anticoagulation** | CHADS-VASc, HAS-BLED, reversal protocols | [Open](https://eiasash.github.io/geriatrics-study/clinical-tools/anticoag.html) |
| **Decision Support** | Clinical decision support tools | [Open](https://eiasash.github.io/geriatrics-study/clinical-tools/decisions.html) |
| **Evidence** | Evidence-based guidelines | [Open](https://eiasash.github.io/geriatrics-study/clinical-tools/evidence.html) |
| **Physical Exam** | Examination reference | [Open](https://eiasash.github.io/geriatrics-study/clinical-tools/exam.html) |
| **On-Call** | Quick reference for on-call | [Open](https://eiasash.github.io/geriatrics-study/clinical-tools/oncall.html) |
| **AI Assistant** | AI-powered clinical assistant | [Open](https://eiasash.github.io/geriatrics-study/clinical-tools/ai-assistant.html) |

---

## 📁 Repository Structure

```
geriatrics-study/
├── index.html                    # Main landing page
├── szmc-presentation-maker/      # Presentation creation tool
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
└── scripts/                      # Utility scripts
    └── pubmed_fetcher.py         # PubMed citation fetcher
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
- **Mobile-responsive** design with touch gestures

### Clinical Tools
- **Geriatric Assessments**: MMSE, MoCA, GDS, ADL/IADL scales
- **Medication Reference**: Beers criteria, drug interactions
- **Anticoagulation**: CHADS-VASc, HAS-BLED, reversal protocols
- **Evidence Search**: Quick access to guidelines and literature

### Study Resources
- **Hazzard's 8e**: Complete textbook content searchable
- **H5P Quizzes**: Interactive board exam preparation
- **Flashcards**: Spaced repetition learning

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

### Building H5P Content
```bash
cd h5p
npm install
npm run build
```

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

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
