# SZMC Geriatrics Presentation Maker

<p align="center">
  <img src="icons/icon.svg" width="100" alt="Presentation Maker Logo">
</p>

<p align="center">
  <strong>Professional presentation builder for medical case reviews & journal clubs</strong>
</p>

<p align="center">
  <a href="https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/">
    <img src="https://img.shields.io/badge/Launch%20App-Open-green?style=for-the-badge" alt="Launch App">
  </a>
</p>

---

## 🚀 Live Demo

**[Open Presentation Maker →](https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/)**

---

## ✨ Features

### Templates
- **Case Presentation** - 25+ slide template with structured format
- **Journal Club** - PICO framework, methods, results analysis
- **Generate from Text** - AI-assisted content extraction from notes

### Editor
- **Real-time editing** - Click any text to edit directly
- **Drag & drop** - Reorder slides with drag and drop
- **Auto-save** - Changes saved automatically to browser
- **Undo/Redo** - Full history support

### AI Assistant
- **Presentation analysis** - Score and suggestions
- **Content generation** - Auto-generate speaker notes
- **Clinical pearls** - Add teaching points
- **Beers criteria checker** - Medication safety

### Mobile Support
- **Responsive design** - Works on phones and tablets
- **Touch gestures** - Swipe between slides
- **Mobile toolbar** - Easy access to all features
- **PWA install** - Add to home screen

### Export Options
- **PowerPoint (.pptx)** - Full export with formatting
- **PDF** - Print-ready output
- **HTML** - Standalone web presentation
- **JSON** - Editable save format

### Languages
- **English** - Full support
- **Hebrew (עברית)** - RTL layout support

---

## 📱 Screenshots

### Desktop Editor
- Slide navigator sidebar
- Live preview
- Properties panel
- AI Assistant panel

### Mobile View
- Bottom toolbar
- Slide drawer
- Touch-friendly controls

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `←` / `→` | Previous / Next slide |
| `Ctrl + S` | Save presentation |
| `Ctrl + N` | Add new slide |
| `Ctrl + D` | Duplicate slide |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Space` | Next slide (presentation mode) |
| `Escape` | Exit presentation mode |
| `Home` / `End` | First / Last slide |
| `?` | Show shortcuts help |

---

## 📋 Slide Types

### Case Presentation
| Slide Type | Description |
|------------|-------------|
| Title | Presentation title and presenter |
| Patient Information | Demographics, chief complaint |
| History of Present Illness | Timeline and symptoms |
| Past Medical History | Comorbidities list |
| Medications | Current medications with details |
| Social History | Living situation, habits |
| Physical Examination | Vitals and findings |
| Laboratory Results | Lab values with highlighting |
| Geriatric Assessment | MMSE, MoCA, GDS, ADL scores |
| Differential Diagnosis | Ranked possibilities |
| Final Diagnosis | Working diagnosis |
| Disease Overview | Background and pathophysiology |
| Treatment Plan | Pharmacologic and non-pharmacologic |
| Prognosis & Follow-up | Outcomes and monitoring |
| Teaching Points | Key takeaways |
| References | Citations |
| Questions | Discussion slide |

### Journal Club
| Slide Type | Description |
|------------|-------------|
| Article Title | Citation and DOI |
| Background | Study rationale |
| PICO Framework | Research question structure |
| Study Methods | Design and population |
| Results | Primary and secondary outcomes |
| Statistical Analysis | Data interpretation |
| Discussion | Key findings |
| Limitations | Study weaknesses |
| Clinical Applicability | Practice implications |
| Conclusions | Summary |

---

## 🛠️ Development

### Local Setup
```bash
# Navigate to folder
cd szmc-presentation-maker

# Serve with any static server
npx serve .
# or
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

### File Structure
```
szmc-presentation-maker/
├── index.html              # Main application
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── css/
│   ├── main.css           # Editor styles
│   ├── presentation.css   # Slide styles
│   ├── mobile.css         # Mobile responsive
│   ├── rtl.css            # Hebrew RTL support
│   ├── ai-assistant.css   # AI panel styles
│   └── visuals.css        # Visual elements
├── js/
│   ├── main.js            # Application entry
│   ├── editor.js          # Editor functionality
│   ├── presentation.js    # Presentation mode
│   ├── templates.js       # Slide templates
│   ├── export.js          # Export functions
│   ├── ai-assistant.js    # AI features
│   ├── mobile.js          # Mobile support
│   └── i18n.js            # Internationalization
├── icons/                  # App icons
└── templates/              # JSON templates
```

### Customization

**Add custom slide type:**
Edit `js/templates.js` and add to `SlideTemplates` object.

**Change colors:**
Edit CSS variables in `css/main.css`:
```css
:root {
  --primary: #1e3a5f;
  --primary-light: #3b82f6;
  /* ... */
}
```

**Add language:**
Edit `js/i18n.js` and add translations object.

---

## 📊 Geriatric Assessment Reference

| Tool | Range | Normal | Interpretation |
|------|-------|--------|----------------|
| MMSE | 0-30 | ≥27 | 21-26 Mild, 11-20 Moderate, ≤10 Severe |
| MoCA | 0-30 | ≥26 | 18-25 MCI, 10-17 Moderate, <10 Severe |
| GDS-15 | 0-15 | 0-4 | 5-9 Mild depression, 10-15 Moderate-severe |
| TUG | sec | <10s | 10-20s Risk, >20s High risk |
| MNA-SF | 0-14 | 12-14 | 8-11 At risk, 0-7 Malnourished |
| Barthel | 0-100 | 80-100 | 60-79 Mild, 40-59 Moderate, <40 Severe |
| Lawton | 0-8 | 8 | Lower = more dependent |

---

## 🔗 Related Links

- [Main Site](https://eiasash.github.io/geriatrics-study/)
- [Clinical Tools Dashboard](https://eiasash.github.io/geriatrics-study/clinical-tools/dashboard.html)
- [H5P Study Mode](https://eiasash.github.io/geriatrics-study/h5p/)
- [Hazzard's Part 1](https://eiasash.github.io/geriatrics-study/hazzards/Part1_Hazzards_Geriatric_Medicine_8e.html)
- [Hazzard's Part 2](https://eiasash.github.io/geriatrics-study/hazzards/Part2_Hazzards_Geriatric_Medicine_8e.html)
- [Hazzard's Part 3](https://eiasash.github.io/geriatrics-study/hazzards/Part3_Hazzards_Geriatric_Medicine_8e.html)
- [GitHub Repository](https://github.com/Eiasash/geriatrics-study)

---

## 📝 License

For internal use at Shaare Zedek Medical Center - Geriatrics Department.

---

## 🏥 Contact

**Geriatrics Department**
Shaare Zedek Medical Center
Jerusalem, Israel
