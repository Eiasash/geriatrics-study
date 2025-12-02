# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive CONTRIBUTING.md with development guidelines
- CODE_OF_CONDUCT.md for community standards
- SECURITY.md with vulnerability reporting procedures
- CHANGELOG.md for tracking project changes
- Enhanced documentation structure

### Changed
- Removed problematic patch-package dependency from h5p
- Updated development workflow documentation

### Fixed
- H5P npm install issues with patch-package

## [1.2.0] - 2024-12-01

### Added
- AI Assistant improvements with 8 working auto-fix functions
- Enhanced detection accuracy for medications and syndromes
- Auto-split slide functionality for dense content
- Auto-simplify slide to reduce complexity
- Content overflow fixing for two-column slides
- Abbreviation definitions generator
- Take-home messages auto-generation
- Teaching points slide creation
- Configuration constants for maintainability
- Comprehensive documentation in AI_ASSISTANT_IMPROVEMENTS.md

### Changed
- Medication safety detection now uses word-boundary regex
- Geriatric syndrome detection with confidence scoring
- Drug interaction detection improved with bidirectional matching
- Editor integration with new insertSlide() and render() methods

### Fixed
- AI assistant quick-fix buttons now perform actual operations
- False positives in medication detection eliminated
- Toast messages standardized and improved

### Security
- CodeQL analysis passed with 0 vulnerabilities
- No external API calls - all operations local

## [1.1.0] - 2024-11-15

### Added
- Local Presentation Maker setup scripts (Linux/macOS/Windows)
- Dashboard for local presentation management
- Personal configuration system
- Backup and update modes
- Enhanced H5P build system with mega quiz support
- Timer embed for exam simulation
- Progressive Web App support

### Changed
- Improved H5P content structure
- Better Hebrew RTL support across all components
- Enhanced mobile responsiveness

### Fixed
- Build script compatibility issues on Windows
- Special character handling in H5P packages

## [1.0.0] - 2024-10-01

### Added
- SZMC Presentation Maker with 25+ slide templates
- H5P interactive learning content system
- Clinical tools dashboard with geriatric assessments
- Hazzard's 8e textbook content integration
- Main landing page with quick access links
- Export functionality (PPTX, PDF, HTML, JSON)
- AI-assisted content generation
- Dark mode support
- Hebrew and English bilingual support
- Service worker for offline capability
- Comprehensive CI/CD pipeline with GitHub Actions

### Features

#### Presentation Maker
- Case presentation templates
- Journal club templates
- Auto-detection of content type
- Multiple themes (8 color schemes)
- Keyboard shortcuts
- Drag-and-drop slide reordering
- Fullscreen presentation mode

#### H5P Content
- Dialog cards (flashcards)
- Question sets by topic
- Mega quiz combining all topics
- 12 geriatrics topics covered
- 151 questions, 38 flashcards

#### Clinical Tools
- MMSE, MoCA, GDS assessment tools
- Medication reference with Beers criteria
- Anticoagulation management (CHADS-VASc, HAS-BLED)
- Clinical decision support
- Evidence-based guidelines access
- AI clinical assistant

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
12. פרקינסון ותסמונות אקסטרה-פירמידליות (Parkinson's)

## [0.9.0] - 2024-09-01 (Beta)

### Added
- Initial project structure
- Basic presentation templates
- H5P content framework
- Clinical calculators prototype

### Changed
- Project renamed to SZMC Geriatrics Hub
- Restructured repository for better organization

## [0.5.0] - 2024-08-01 (Alpha)

### Added
- Proof of concept for presentation maker
- Basic H5P question sets
- Initial clinical tools

---

## Version History Summary

- **1.2.x**: AI improvements and auto-fix features
- **1.1.x**: Local tools and enhanced build system
- **1.0.x**: Full production release with all major features
- **0.9.x**: Beta testing phase
- **0.5.x**: Alpha/prototype phase

## Future Roadmap

### Planned for 2.0.0
- [ ] Machine learning for syndrome detection
- [ ] PubMed API integration for automatic references
- [ ] Natural language processing for quality assessment
- [ ] WCAG 2.1 AAA accessibility compliance
- [ ] Collaboration features (real-time editing)
- [ ] User authentication and profiles
- [ ] Cloud storage integration
- [ ] Mobile native apps (iOS/Android)
- [ ] Advanced analytics and reporting
- [ ] Integration with EMR systems

### Under Consideration
- Multi-language support beyond English/Hebrew
- Voice narration for presentations
- Video embedding and recording
- Advanced AI features (GPT integration)
- Peer review system
- Case repository and sharing platform
- CME credit tracking
- Integration with medical education platforms

---

For detailed commit history, see: https://github.com/Eiasash/geriatrics-study/commits/main

For bug reports and feature requests, see: https://github.com/Eiasash/geriatrics-study/issues
