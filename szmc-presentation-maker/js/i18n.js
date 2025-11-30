// SZMC Geriatrics Presentation Maker - Internationalization (i18n) Module

class I18n {
    constructor() {
        this.currentLang = 'en';
        this.supportedLangs = ['en', 'he'];
        this.translations = {
            en: {
                // App Title & Header
                appTitle: 'SZMC Geriatrics Presentation Maker',
                appSubtitle: 'Create professional medical presentations for case reviews and journal clubs',
                logo: 'SZMC Geriatrics',

                // Landing Page
                presentationMaker: 'Presentation Maker',
                casePresentation: 'Case Presentation',
                casePresentationDesc: 'Patient history, physical exam, differentials, workup, diagnosis, and treatment plan',
                journalClub: 'Journal Club',
                journalClubDesc: 'Critical appraisal of medical literature with structured analysis',
                generateFromText: 'Generate from Text',
                generateFromTextDesc: 'Paste your case notes or article and auto-generate a structured presentation',
                loadSavedPresentation: 'Load Saved Presentation',

                // Template Features
                slideTemplate: 'slide template',
                tableOfContents: 'Table of contents & take-home',
                chartsImagesAlgorithms: 'Charts, images & algorithms',
                numberedCitations: 'Numbered citations',
                picoStatisticalAnalysis: 'PICO & statistical analysis',
                dataVisualizations: 'Data visualizations',
                formattedReferences: 'Formatted references',
                autoDetectType: 'Auto-detect case vs journal',
                extractKeyInfo: 'Extract key information',
                multipleThemes: 'Multiple style themes',
                customizableOutput: 'Customizable output',

                // Editor Header
                save: 'Save',
                exportPPTX: 'Export PPTX',
                exportHTML: 'Export HTML',
                exportJSON: 'Export JSON',
                importJSON: 'Import JSON',
                present: 'Present',
                saved: 'Saved',
                saving: 'Saving...',
                error: 'Error',

                // Slide Navigator
                slides: 'Slides',
                addSlide: 'Add Slide',

                // Properties Panel
                slideType: 'Slide Type',
                quickInsert: 'Quick Insert',
                table: 'Table',
                bulletList: 'Bullet List',
                uploadImage: 'Upload Image',
                chart: 'Chart',
                calloutBox: 'Callout Box',
                reference: 'Reference',
                slideActions: 'Slide Actions',
                duplicate: 'Duplicate',
                delete: 'Delete',
                help: 'Help',
                keyboardShortcuts: 'Keyboard Shortcuts',

                // Presentation Modes
                startPresentation: 'Start Presentation',
                choosePresentationMode: 'Choose Presentation Mode',
                standard: 'Standard',
                standardDesc: 'Full screen presentation mode',
                speakerView: 'Speaker View',
                speakerViewDesc: 'See notes and next slide',
                overview: 'Overview',
                overviewDesc: 'See all slides at once',
                rehearsal: 'Rehearsal',
                rehearsalDesc: 'Practice with timer',
                slideTransition: 'Slide Transition',
                fade: 'Fade',
                slide: 'Slide',
                zoom: 'Zoom',
                none: 'None (Instant)',

                // Keyboard Shortcuts Modal
                navigation: 'Navigation',
                previousNextSlide: 'Previous / Next slide',
                firstLastSlide: 'First / Last slide',
                editing: 'Editing',
                undo: 'Undo',
                redo: 'Redo',
                copySlide: 'Copy slide',
                pasteSlide: 'Paste slide',
                duplicateSlide: 'Duplicate slide',
                deleteSlide: 'Delete slide',
                file: 'File',
                savePresentation: 'Save presentation',
                addNewSlide: 'Add new slide',
                presentation: 'Presentation',
                nextSlide: 'Next slide',
                overviewMode: 'Overview mode',
                blackScreen: 'Black screen',
                whiteScreen: 'White screen',
                exit: 'Exit',
                other: 'Other',
                showHelp: 'Show this help',
                tip: 'Tip',
                dragDropTip: 'Drag and drop images directly onto slides to insert them!',
                gotIt: 'Got it!',

                // Generator Modal
                generatePresentationFromText: 'Generate Presentation from Text',
                pasteYourText: 'Paste Your Text',
                pasteTextPlaceholder: 'Paste your case notes, discharge summary, or journal article abstract here...',
                detectedType: 'Start typing to auto-detect presentation type...',
                detectedCase: 'Detected: Case Presentation - Patient case notes identified',
                detectedJournal: 'Detected: Journal Club - Research article identified',
                options: 'Options',
                presentationTitle: 'Presentation Title',
                presenterName: 'Presenter Name',
                themeStyle: 'Theme Style',
                additionalOptions: 'Additional Options',
                includeTOC: 'Include Table of Contents',
                includeTakeHome: 'Include Take-Home Messages',
                includeRefs: 'Include References Slide',
                includeQuestions: 'Include Questions Slide',
                slideDensity: 'Slide Density',
                compact: 'Compact (15-18 slides)',
                standardDensity: 'Standard (20-25 slides)',
                detailed: 'Detailed (25-30 slides)',
                cancel: 'Cancel',
                generatePresentation: 'Generate Presentation',

                // Theme Names
                szmcBlue: 'SZMC Blue (Default)',
                clinicalGreen: 'Clinical Green',
                modernPurple: 'Modern Purple',
                warmOrange: 'Warm Orange',
                darkProfessional: 'Dark Professional',
                medicalRed: 'Medical Red',
                minimalGray: 'Minimal Gray',
                navyGold: 'Navy & Gold',

                // AI Assistant
                aiAssistant: 'AI Assistant',
                analyzePresentation: 'Analyze Presentation',
                score: 'Score',
                estimatedTime: 'Est.',
                errors: 'Errors',
                warnings: 'Warnings',
                info: 'Info',
                tips: 'Tips',
                all: 'All',
                issues: 'Issues',
                suggestions: 'Suggestions',
                analyzeNow: 'Analyze Now',
                analyzingPresentation: 'Analyzing your presentation...',
                lookingGood: 'Looking Good!',
                noIssuesFound: 'No issues found in your presentation.',
                autoAnalyzeOnChanges: 'Auto-analyze on changes',

                // Slide Types
                titleSlide: 'Title Slide',
                tableOfContentsSlide: 'Table of Contents',
                sectionHeader: 'Section Header',
                patientInformation: 'Patient Information',
                historyOfPresentIllness: 'History of Present Illness',
                clinicalTimeline: 'Clinical Timeline',
                pastMedicalHistory: 'Past Medical History',
                medications: 'Medications',
                medicationsDetailed: 'Medications (Detailed)',
                socialHistory: 'Social History',
                physicalExamination: 'Physical Examination',
                laboratoryResults: 'Laboratory Results',
                imagingStudies: 'Imaging Studies',
                diagnosticWorkup: 'Diagnostic Workup',
                geriatricAssessment: 'Geriatric Assessment',
                geriatricSyndromes: 'Geriatric Syndromes',
                differentialDiagnosis: 'Differential Diagnosis',
                finalDiagnosis: 'Final Diagnosis',
                diseaseOverview: 'Disease Overview',
                pathophysiology: 'Pathophysiology',
                riskFactors: 'Risk Factors',
                treatmentPlan: 'Treatment Plan',
                treatmentAlgorithm: 'Treatment Algorithm',
                drugComparison: 'Drug Comparison',
                prognosisFollowup: 'Prognosis & Follow-up',
                goalsOfCare: 'Goals of Care',
                caseSummary: 'Case Summary',
                articleTitle: 'Article Title',
                backgroundRationale: 'Background & Rationale',
                picoQuestion: 'PICO Question',
                studyMethods: 'Study Methods',
                results: 'Results',
                statisticalAnalysis: 'Statistical Analysis',
                discussion: 'Discussion',
                limitations: 'Limitations',
                clinicalApplicability: 'Clinical Applicability',
                conclusions: 'Conclusions',
                evidenceSummary: 'Evidence Summary',
                forestPlot: 'Forest Plot',
                statisticsDisplay: 'Statistics Display',
                barChart: 'Bar Chart',
                pieChart: 'Pie Chart',
                fullImage: 'Full Image',
                imageComparison: 'Image Comparison',
                keyPointsVisual: 'Key Points (Visual)',
                quizQuestion: 'Quiz Question',
                teachingPoints: 'Teaching Points',
                takeHomeMessages: 'Take-Home Messages',
                references: 'References',
                referencesFormatted: 'References (Formatted)',
                qrCodeResources: 'QR Code Resources',
                questions: 'Questions',
                contentSlide: 'Content Slide',
                twoColumn: 'Two Column',
                comparison: 'Comparison',
                prosCons: 'Pros & Cons',

                // View Toggle
                desktopView: 'Desktop View',
                mobileView: 'Mobile View',
                toggleView: 'Toggle View',

                // Theme
                darkMode: 'Dark Mode',
                lightMode: 'Light Mode',
                darkModeEnabled: 'Dark mode enabled',
                lightModeEnabled: 'Light mode enabled',
                toggleDarkMode: 'Toggle dark mode',

                // Language
                language: 'Language',
                english: 'English',
                hebrew: 'Hebrew',

                // Confirm Messages
                unsavedChanges: 'You have unsaved changes. Are you sure you want to go back?',
                deleteSlideConfirm: 'Delete this slide?',
                cannotDeleteLastSlide: 'Cannot delete the last slide',
                presentationSaved: 'Presentation saved successfully!',
                slideCopied: 'Slide copied',
                slidePasted: 'Slide pasted',
                slideDuplicated: 'Slide duplicated',
                nothingToPaste: 'Nothing to paste',
                imageInserted: 'Image inserted',
                imageAdded: 'Image added',
                restoreAutosave: 'Found an auto-saved presentation. Would you like to restore it?',
                newVersionAvailable: 'New version available! Reload to update?',
                failedToLoadPPTX: 'Failed to load PowerPoint export library. Please check your internet connection.',
                errorLoadingPresentation: 'Error loading presentation: ',
                themeChangedTo: 'Theme changed to ',

                // Footer
                szmcGeriatrics: 'SZMC Geriatrics',
                shaareZedekMedicalCenter: 'Shaare Zedek Medical Center - Geriatrics Department'
            },
            he: {
                // App Title & Header
                appTitle: 'יוצר מצגות - גריאטריה מרכז רפואי שערי צדק',
                appSubtitle: 'יצירת מצגות רפואיות מקצועיות לסקירת מקרים ומועדוני כתבי עת',
                logo: 'גריאטריה שע"צ',

                // Landing Page
                presentationMaker: 'יוצר מצגות',
                casePresentation: 'מצגת מקרה',
                casePresentationDesc: 'היסטוריה רפואית, בדיקה גופנית, אבחנות מבדלות, בירור, אבחנה וטיפול',
                journalClub: 'מועדון כתבי עת',
                journalClubDesc: 'ניתוח ביקורתי של ספרות רפואית עם ניתוח מובנה',
                generateFromText: 'צור מטקסט',
                generateFromTextDesc: 'הדבק את הערות המקרה או המאמר וצור מצגת מובנית אוטומטית',
                loadSavedPresentation: 'טען מצגת שמורה',

                // Template Features
                slideTemplate: 'תבנית שקופיות',
                tableOfContents: 'תוכן עניינים ומסרים מרכזיים',
                chartsImagesAlgorithms: 'תרשימים, תמונות ואלגוריתמים',
                numberedCitations: 'הפניות ממוספרות',
                picoStatisticalAnalysis: 'PICO וניתוח סטטיסטי',
                dataVisualizations: 'הצגת נתונים חזותית',
                formattedReferences: 'הפניות מעוצבות',
                autoDetectType: 'זיהוי אוטומטי של סוג המצגת',
                extractKeyInfo: 'חילוץ מידע מרכזי',
                multipleThemes: 'מגוון ערכות עיצוב',
                customizableOutput: 'פלט מותאם אישית',

                // Editor Header
                save: 'שמור',
                exportPPTX: 'ייצא PPTX',
                exportHTML: 'ייצא HTML',
                exportJSON: 'ייצא JSON',
                importJSON: 'ייבא JSON',
                present: 'הצג',
                saved: 'נשמר',
                saving: 'שומר...',
                error: 'שגיאה',

                // Slide Navigator
                slides: 'שקופיות',
                addSlide: 'הוסף שקופית',

                // Properties Panel
                slideType: 'סוג שקופית',
                quickInsert: 'הוספה מהירה',
                table: 'טבלה',
                bulletList: 'רשימה',
                uploadImage: 'העלה תמונה',
                chart: 'תרשים',
                calloutBox: 'תיבת הערה',
                reference: 'הפניה',
                slideActions: 'פעולות שקופית',
                duplicate: 'שכפל',
                delete: 'מחק',
                help: 'עזרה',
                keyboardShortcuts: 'קיצורי מקשים',

                // Presentation Modes
                startPresentation: 'התחל מצגת',
                choosePresentationMode: 'בחר מצב מצגת',
                standard: 'רגיל',
                standardDesc: 'מצב מצגת במסך מלא',
                speakerView: 'תצוגת מציג',
                speakerViewDesc: 'ראה הערות ושקופית הבאה',
                overview: 'סקירה',
                overviewDesc: 'ראה את כל השקופיות',
                rehearsal: 'תרגול',
                rehearsalDesc: 'תרגול עם טיימר',
                slideTransition: 'מעבר שקופיות',
                fade: 'דהייה',
                slide: 'החלקה',
                zoom: 'זום',
                none: 'ללא (מיידי)',

                // Keyboard Shortcuts Modal
                navigation: 'ניווט',
                previousNextSlide: 'שקופית קודמת / הבאה',
                firstLastSlide: 'שקופית ראשונה / אחרונה',
                editing: 'עריכה',
                undo: 'בטל',
                redo: 'בצע שוב',
                copySlide: 'העתק שקופית',
                pasteSlide: 'הדבק שקופית',
                duplicateSlide: 'שכפל שקופית',
                deleteSlide: 'מחק שקופית',
                file: 'קובץ',
                savePresentation: 'שמור מצגת',
                addNewSlide: 'הוסף שקופית חדשה',
                presentation: 'מצגת',
                nextSlide: 'שקופית הבאה',
                overviewMode: 'מצב סקירה',
                blackScreen: 'מסך שחור',
                whiteScreen: 'מסך לבן',
                exit: 'יציאה',
                other: 'אחר',
                showHelp: 'הצג עזרה זו',
                tip: 'טיפ',
                dragDropTip: 'גרור ושחרר תמונות ישירות על שקופיות להוספתן!',
                gotIt: 'הבנתי!',

                // Generator Modal
                generatePresentationFromText: 'צור מצגת מטקסט',
                pasteYourText: 'הדבק את הטקסט שלך',
                pasteTextPlaceholder: 'הדבק את הערות המקרה, סיכום שחרור או תקציר מאמר כאן...',
                detectedType: 'התחל להקליד לזיהוי אוטומטי של סוג המצגת...',
                detectedCase: 'זוהה: מצגת מקרה - זוהו הערות מקרה חולה',
                detectedJournal: 'זוהה: מועדון כתבי עת - זוהה מאמר מחקר',
                options: 'אפשרויות',
                presentationTitle: 'כותרת המצגת',
                presenterName: 'שם המציג',
                themeStyle: 'סגנון עיצוב',
                additionalOptions: 'אפשרויות נוספות',
                includeTOC: 'כלול תוכן עניינים',
                includeTakeHome: 'כלול מסרים מרכזיים',
                includeRefs: 'כלול שקופית הפניות',
                includeQuestions: 'כלול שקופית שאלות',
                slideDensity: 'צפיפות שקופיות',
                compact: 'מרוכז (15-18 שקופיות)',
                standardDensity: 'רגיל (20-25 שקופיות)',
                detailed: 'מפורט (25-30 שקופיות)',
                cancel: 'ביטול',
                generatePresentation: 'צור מצגת',

                // Theme Names
                szmcBlue: 'כחול שע"צ (ברירת מחדל)',
                clinicalGreen: 'ירוק קליני',
                modernPurple: 'סגול מודרני',
                warmOrange: 'כתום חם',
                darkProfessional: 'כהה מקצועי',
                medicalRed: 'אדום רפואי',
                minimalGray: 'אפור מינימלי',
                navyGold: 'כחול כהה וזהב',

                // AI Assistant
                aiAssistant: 'עוזר AI',
                analyzePresentation: 'נתח מצגת',
                score: 'ציון',
                estimatedTime: 'משוער',
                errors: 'שגיאות',
                warnings: 'אזהרות',
                info: 'מידע',
                tips: 'טיפים',
                all: 'הכל',
                issues: 'בעיות',
                suggestions: 'הצעות',
                analyzeNow: 'נתח עכשיו',
                analyzingPresentation: 'מנתח את המצגת שלך...',
                lookingGood: 'נראה מצוין!',
                noIssuesFound: 'לא נמצאו בעיות במצגת שלך.',
                autoAnalyzeOnChanges: 'נתח אוטומטית בשינויים',

                // Slide Types
                titleSlide: 'שקופית כותרת',
                tableOfContentsSlide: 'תוכן עניינים',
                sectionHeader: 'כותרת פרק',
                patientInformation: 'פרטי מטופל',
                historyOfPresentIllness: 'היסטוריה של מחלה נוכחית',
                clinicalTimeline: 'ציר זמן קליני',
                pastMedicalHistory: 'היסטוריה רפואית עברית',
                medications: 'תרופות',
                medicationsDetailed: 'תרופות (מפורט)',
                socialHistory: 'היסטוריה חברתית',
                physicalExamination: 'בדיקה גופנית',
                laboratoryResults: 'תוצאות מעבדה',
                imagingStudies: 'בדיקות הדמיה',
                diagnosticWorkup: 'בירור אבחנתי',
                geriatricAssessment: 'הערכה גריאטרית',
                geriatricSyndromes: 'תסמונות גריאטריות',
                differentialDiagnosis: 'אבחנה מבדלת',
                finalDiagnosis: 'אבחנה סופית',
                diseaseOverview: 'סקירת מחלה',
                pathophysiology: 'פתופיזיולוגיה',
                riskFactors: 'גורמי סיכון',
                treatmentPlan: 'תוכנית טיפול',
                treatmentAlgorithm: 'אלגוריתם טיפול',
                drugComparison: 'השוואת תרופות',
                prognosisFollowup: 'פרוגנוזה ומעקב',
                goalsOfCare: 'מטרות טיפול',
                caseSummary: 'סיכום מקרה',
                articleTitle: 'כותרת מאמר',
                backgroundRationale: 'רקע וסיבות',
                picoQuestion: 'שאלת PICO',
                studyMethods: 'שיטות מחקר',
                results: 'תוצאות',
                statisticalAnalysis: 'ניתוח סטטיסטי',
                discussion: 'דיון',
                limitations: 'מגבלות',
                clinicalApplicability: 'יישום קליני',
                conclusions: 'מסקנות',
                evidenceSummary: 'סיכום ראיות',
                forestPlot: 'Forest Plot',
                statisticsDisplay: 'הצגת סטטיסטיקה',
                barChart: 'תרשים עמודות',
                pieChart: 'תרשים עוגה',
                fullImage: 'תמונה מלאה',
                imageComparison: 'השוואת תמונות',
                keyPointsVisual: 'נקודות מפתח (חזותי)',
                quizQuestion: 'שאלת חידון',
                teachingPoints: 'נקודות הוראה',
                takeHomeMessages: 'מסרים מרכזיים',
                references: 'הפניות',
                referencesFormatted: 'הפניות (מעוצבות)',
                qrCodeResources: 'משאבים QR',
                questions: 'שאלות',
                contentSlide: 'שקופית תוכן',
                twoColumn: 'שתי עמודות',
                comparison: 'השוואה',
                prosCons: 'יתרונות וחסרונות',

                // View Toggle
                desktopView: 'תצוגת מחשב',
                mobileView: 'תצוגת נייד',
                toggleView: 'החלף תצוגה',

                // Theme
                darkMode: 'מצב כהה',
                lightMode: 'מצב בהיר',
                darkModeEnabled: 'מצב כהה הופעל',
                lightModeEnabled: 'מצב בהיר הופעל',
                toggleDarkMode: 'החלף מצב כהה/בהיר',

                // Language
                language: 'שפה',
                english: 'אנגלית',
                hebrew: 'עברית',

                // Confirm Messages
                unsavedChanges: 'יש לך שינויים שלא נשמרו. האם אתה בטוח שברצונך לחזור?',
                deleteSlideConfirm: 'למחוק שקופית זו?',
                cannotDeleteLastSlide: 'לא ניתן למחוק את השקופית האחרונה',
                presentationSaved: 'המצגת נשמרה בהצלחה!',
                slideCopied: 'השקופית הועתקה',
                slidePasted: 'השקופית הודבקה',
                slideDuplicated: 'השקופית שוכפלה',
                nothingToPaste: 'אין מה להדביק',
                imageInserted: 'התמונה הוכנסה',
                imageAdded: 'התמונה נוספה',
                restoreAutosave: 'נמצאה מצגת שנשמרה אוטומטית. האם לשחזר אותה?',
                newVersionAvailable: 'גרסה חדשה זמינה! לטעון מחדש לעדכון?',
                failedToLoadPPTX: 'נכשל בטעינת ספריית ייצוא PowerPoint. בדוק את חיבור האינטרנט שלך.',
                errorLoadingPresentation: 'שגיאה בטעינת מצגת: ',
                themeChangedTo: 'העיצוב שונה ל-',

                // Footer
                szmcGeriatrics: 'גריאטריה שע"צ',
                shaareZedekMedicalCenter: 'המרכז הרפואי שערי צדק - מחלקת גריאטריה'
            }
        };

        // Load saved language preference
        this.loadLanguagePreference();
    }

    loadLanguagePreference() {
        const savedLang = localStorage.getItem('szmc_language');
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            this.currentLang = savedLang;
        } else {
            // Detect browser language
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'he') {
                this.currentLang = 'he';
            }
        }
    }

    saveLanguagePreference() {
        localStorage.setItem('szmc_language', this.currentLang);
    }

    setLanguage(lang) {
        if (this.supportedLangs.includes(lang)) {
            this.currentLang = lang;
            this.saveLanguagePreference();
            this.updateDocumentDirection();
            this.updateAllTranslations();

            // Dispatch event for components that need to react
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

            return true;
        }
        return false;
    }

    getLanguage() {
        return this.currentLang;
    }

    isRTL() {
        return this.currentLang === 'he';
    }

    t(key) {
        const translation = this.translations[this.currentLang];
        if (translation && translation[key]) {
            return translation[key];
        }
        // Fallback to English
        if (this.translations.en && this.translations.en[key]) {
            return this.translations.en[key];
        }
        return key;
    }

    updateDocumentDirection() {
        const html = document.documentElement;
        const body = document.body;

        if (this.isRTL()) {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'he');
            body.classList.add('rtl');
            body.classList.remove('ltr');
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
            body.classList.add('ltr');
            body.classList.remove('rtl');
        }
    }

    updateAllTranslations() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Update all elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'he' : 'en';
        this.setLanguage(newLang);
        return newLang;
    }
}

// Create global i18n instance
const i18n = new I18n();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    i18n.updateDocumentDirection();
    i18n.updateAllTranslations();
});

// Make globally available
window.i18n = i18n;
