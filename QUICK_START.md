# Quick Start Guide

Get up and running with the SZMC Geriatrics Hub in minutes!

## 🚀 For Users

### Access the Live Site
Simply visit: **[https://eiasash.github.io/geriatrics-study/](https://eiasash.github.io/geriatrics-study/)**

### Main Tools

| Tool | URL | Use Case |
|------|-----|----------|
| **Presentation Maker** | [/szmc-presentation-maker/](https://eiasash.github.io/geriatrics-study/szmc-presentation-maker/) | Create case presentations and journal clubs |
| **Clinical Tools** | [/clinical-tools/dashboard.html](https://eiasash.github.io/geriatrics-study/clinical-tools/dashboard.html) | Quick reference for assessments and medications |
| **H5P Study Mode** | [/h5p/](https://eiasash.github.io/geriatrics-study/h5p/) | Interactive quizzes and flashcards |
| **Hazzard's 8e** | [/hazzards/](https://eiasash.github.io/geriatrics-study/hazzards/) | Textbook content and reference |

### Tips
- 💡 Use the **search bar** on the main page to quickly find tools
- 🌙 Toggle **dark mode** with the button in the bottom-right
- 📱 Add to **home screen** on mobile for app-like experience
- ⚡ All tools work **offline** after first visit (PWA enabled)

---

## 💻 For Developers

### Prerequisites
- Node.js 20+
- Git
- Code editor (VS Code recommended)

### 1. Clone & Setup (2 minutes)

```bash
# Clone repository
git clone https://github.com/Eiasash/geriatrics-study.git
cd geriatrics-study

# Install H5P dependencies
cd h5p
npm install --ignore-scripts

# Verify setup
npm test
```

### 2. Local Development (1 minute)

```bash
# From repository root
npx serve .
# OR
python -m http.server 8000

# Open http://localhost:8000
```

### 3. Key Commands

```bash
# H5P Content
cd h5p
npm run validate      # Check content.json
npm test              # Run all tests
npm run lint          # Check code style
npm run build:all     # Build all packages

# Specific builds
npm run build         # Dialog cards
npm run build:qset    # Question sets
npm run build:mega    # Mega quiz
```

### 4. Project Structure

```
geriatrics-study/
├── index.html                 # Main landing page ⭐
├── h5p/                       # Interactive content system
│   ├── build-*.js            # Build scripts
│   ├── validate-content.js   # Content validator
│   └── __tests__/            # Test suites
├── szmc-presentation-maker/   # Presentation tool
│   ├── js/                   # 24 JavaScript modules
│   ├── css/                  # Stylesheets
│   └── templates/            # Slide templates
├── clinical-tools/            # Medical calculators
├── data/                      # Content database
│   └── content.json          # Questions & flashcards
└── docs/                      # Documentation
    ├── CONTRIBUTING.md
    ├── SECURITY.md
    └── CHANGELOG.md
```

### 5. Common Tasks

#### Add New Questions
1. Edit `data/content.json`
2. Run `npm run validate` to check
3. Test with `npm test`
4. Build with `npm run build:all`

#### Modify Presentation Templates
1. Edit `szmc-presentation-maker/js/templates.js`
2. Test in browser at `/szmc-presentation-maker/`
3. No build step needed (vanilla JS)

#### Update Styles
1. Edit CSS in respective folders
2. Test in browser
3. Check mobile responsiveness

### 6. Code Quality Checks

```bash
# Before committing
cd h5p
npm run lint          # Check linting
npm run format:check  # Check formatting
npm test              # Run tests
npm run validate      # Validate content
```

### 7. Making Changes

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes...

# Test thoroughly
npm test

# Commit with conventional format
git commit -m "feat(h5p): add new question type"

# Push and create PR
git push origin feature/my-feature
```

---

## 📚 For Content Contributors

### Add Medical Content

1. **Edit data/content.json**
   - Find your topic in the array
   - Add MCQs or flashcards

2. **MCQ Format**
```json
{
  "q": "What is the CAM criterion for delirium?",
  "options": [
    "Acute onset",
    "Chronic decline",
    "Normal cognition",
    "Stable attention"
  ],
  "correct": "Acute onset",
  "explanation": "CAM requires acute onset and fluctuating course."
}
```

3. **Flashcard Format**
```json
{
  "q": "What does CAM stand for?",
  "a": "Confusion Assessment Method - a tool for diagnosing delirium"
}
```

4. **Validate**
```bash
cd h5p
npm run validate
```

### Content Guidelines

✅ **Do:**
- Use evidence-based information
- Include explanations for MCQs
- Cite sources when possible
- Keep questions clear and concise
- Use Hebrew for local content

❌ **Don't:**
- Copy content verbatim without citation
- Include patient-identifying information
- Use overly complex medical jargon
- Create questions without explanations

---

## 🔧 For Maintainers

### Release Process

```bash
# 1. Update version in package.json
npm version patch  # or minor, major

# 2. Update CHANGELOG.md
# Add new version section with changes

# 3. Create release
git tag -a v1.2.1 -m "Release v1.2.1"
git push origin v1.2.1

# 4. GitHub Actions will:
#    - Run all tests
#    - Build packages
#    - Deploy to GitHub Pages
#    - Create release artifacts
```

### Monitoring

- **CI Status**: Check [Actions tab](https://github.com/Eiasash/geriatrics-study/actions)
- **Security**: Review [Dependabot alerts](https://github.com/Eiasash/geriatrics-study/security)
- **Issues**: Monitor [Issues page](https://github.com/Eiasash/geriatrics-study/issues)

### Emergency Fixes

```bash
# Hotfix branch from main
git checkout -b hotfix/critical-fix main

# Make minimal fix
# Test thoroughly
npm test

# Fast-track merge
git checkout main
git merge hotfix/critical-fix
git push origin main

# Tag immediately
git tag -a v1.2.2 -m "Hotfix: critical security update"
git push origin v1.2.2
```

---

## ❓ Common Issues

### npm install fails
```bash
# Use --ignore-scripts to skip postinstall hooks
npm install --ignore-scripts
```

### Tests fail
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --ignore-scripts
npm test
```

### Build fails
```bash
# Validate content first
npm run validate

# Check for syntax errors
npm run lint

# Try specific build
npm run build:qset
```

### Port already in use
```bash
# Use different port
npx serve . -p 3000
# or
python -m http.server 3000
```

---

## 📖 Further Reading

- [CONTRIBUTING.md](CONTRIBUTING.md) - Detailed contribution guide
- [SECURITY.md](SECURITY.md) - Security policies
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md) - Recent improvements

---

## 🆘 Getting Help

- 💬 [GitHub Discussions](https://github.com/Eiasash/geriatrics-study/discussions)
- 🐛 [Report Bug](https://github.com/Eiasash/geriatrics-study/issues/new)
- 💡 [Request Feature](https://github.com/Eiasash/geriatrics-study/issues/new)

---

**Happy coding! 🎉**
