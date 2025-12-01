# 🎓 Geriatrics Study H5P Content System

A legendary interactive learning platform for geriatrics medical education, featuring H5P content packages, exam simulations, and comprehensive study tools.

## 🚀 Features

### Core Components

- **H5P Content Generation**: Automated creation of interactive learning packages
- **Exam Simulator**: Full-featured timer system with pause/resume capabilities
- **Multi-Format Output**: Dialog Cards, Question Sets, and Mega Quizzes
- **Hebrew Support**: Complete RTL layout and Hebrew content
- **Progressive Web App**: Offline-capable with responsive design

### Content Types

1. **Dialog Cards** - Flashcard-style learning with spaced repetition
2. **Question Sets** - Topic-specific multiple-choice quizzes
3. **Mega Quiz** - Comprehensive exam combining all topics
4. **Timer Embed** - Exam simulation with customizable duration

## 📦 Quick Start

### Installation

```bash
cd h5p
npm install
```

### Build All Content

```bash
# Build dialog cards
npm run build

# Build question sets
npm run build:qset

# Build mega quiz (all topics)
npm run build:mega

# Build mega quiz (specific topics)
TOPICS="דליריום,נפילות" PASS=75 npm run build:mega
```

### View Content

Open `h5p/index.html` in your browser to access the content hub.

## 🏗️ Architecture

### Directory Structure

```
h5p/
├── dist/                 # Generated H5P packages
├── __tests__/           # Test files
├── assets/              # Static resources
├── build-h5p.js         # Dialog cards builder
├── build-h5p-questionset.js  # Question set builder
├── build-h5p-mega.js    # Mega quiz builder
├── index.html           # Content hub interface
├── timer-embed.html     # Exam simulator
└── package.json         # Dependencies
```

### Data Flow

```
content.json → Build Scripts → H5P Packages → Distribution
     ↓              ↓                ↓              ↓
  Source Data   Processing      .h5p Files    Web/LMS
```

## 🎯 Usage Examples

### Exam Simulator

1. Open `timer-embed.html`
2. Select exam duration (5 min - 4 hours)
3. Use controls:
   - **Pause/Resume**: Escape key or button
   - **End Exam**: Confirm to finish early
   - **Progress Bar**: Visual time remaining

### H5P Package Deployment

#### Moodle

1. Navigate to Site Administration → Plugins → H5P
2. Upload `.h5p` files from `dist/` folder
3. Embed in courses using H5P activity

#### WordPress

1. Install H5P plugin
2. Upload packages via H5P Content menu
3. Embed using shortcodes

## 🛠️ Development

### Running Tests

```bash
npm test                 # Run all tests
npm run test:coverage   # With coverage report
```

### Linting & Formatting

```bash
npm run lint            # Check code style
npm run lint:fix        # Auto-fix issues
npm run format          # Format with Prettier
```

### Custom Topics

Edit `data/content.json` to add/modify content:

```json
{
  "topic": "Your Topic",
  "flashcards": [...],
  "mcqs": [...]
}
```

## 📊 Content Statistics

| Topic                 | Questions | Flashcards |
| --------------------- | --------- | ---------- |
| דליריום               | 10        | 2          |
| דמנציה ומחלת אלצהיימר | 15        | 3          |
| שבריריות (Frailty)    | 12        | 4          |
| נפילות                | 14        | 3          |
| דיכאון בגיל המבוגר    | 11        | 2          |
| רישום ודה-פרסקייבינג  | 16        | 5          |
| אי שליטה בסוגרים      | 10        | 3          |
| סרקופניה ותזונה       | 13        | 4          |
| טיפול סוף-חיים        | 9         | 2          |
| שבץ מוחי              | 15        | 3          |
| אי ספיקת לב           | 14        | 4          |
| פרקינסון              | 12        | 3          |

**Total**: 151 Questions, 38 Flashcards

## 🔧 Troubleshooting

### Build Errors

- **"pack is not a valid command"**: Fixed - uses native compression
- **Special characters in filenames**: Automatically sanitized
- **Windows path issues**: PowerShell Compress-Archive used

### Common Issues

1. **Missing dist folder**: Run any build command to create
2. **Test failures**: Run `npm install expect --save-dev`
3. **H5P not loading**: Check CORS settings if serving locally

## 🚢 Deployment

### GitHub Pages

1. Build all packages: `npm run build && npm run build:qset && npm run build:mega`
2. Commit dist folder
3. Enable GitHub Pages for the repository
4. Access at: `https://[username].github.io/[repo]/h5p/`

### CI/CD Pipeline

GitHub Actions workflow automatically:

- Builds H5P packages on push
- Runs tests and linting
- Deploys to GitHub Pages
- Creates release artifacts

## 📄 License

This project is designed for educational purposes within the Shaare Tzedek medical system.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 💡 Advanced Features

### Keyboard Shortcuts

- **F2**: Open settings (timer-embed)
- **Escape**: Pause/Resume exam
- **Ctrl+S**: Save progress (main app)

### Environment Variables

- `TOPICS`: Comma-separated topic list for mega quiz
- `PASS`: Pass percentage (default: 70)
- `NODE_ENV`: Development/production mode

## 🏆 Legendary System Features

✅ Fully automated H5P generation
✅ Professional exam simulator
✅ Responsive content hub
✅ Cross-platform compatibility  
✅ Offline support
✅ Hebrew RTL support
✅ Progress tracking
✅ Multiple time presets
✅ Visual feedback system
✅ Keyboard navigation

---

Built with ❤️ for medical education | Powered by H5P & Claude Code
