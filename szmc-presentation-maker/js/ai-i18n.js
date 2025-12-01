/**
 * AI Assistant i18n Translations
 * 
 * This file extends the existing i18n system with translations
 * for all AI Assistant UI elements.
 */

// Add AI translations to the existing i18n system
(function() {
    const aiTranslations = {
        en: {
            // Panel Header
            aiAssistant: "AI Assistant",
            aiSubtitle: "Medical Presentation Expert",
            aiOnline: "Online",
            aiOffline: "Offline",

            // Tabs
            aiTabChat: "Chat",
            aiTabAnalyze: "Analyze",
            aiTabGenerate: "Generate",

            // Welcome
            aiWelcomeTitle: "Hi! I'm your AI Assistant",
            aiWelcomeDesc: "I can help you create better medical presentations, generate content, and review your slides.",

            // Suggestions
            aiSuggestDdx: "Generate Differential",
            aiSuggestDdxDesc: "Create a DDx list based on case",
            aiSuggestReview: "Review Presentation",
            aiSuggestReviewDesc: "Get feedback on structure",
            aiSuggestTeaching: "Teaching Points",
            aiSuggestTeachingDesc: "Key learning objectives",

            // Quick Actions
            aiQuickActions: "Quick Actions:",
            aiImproveText: "Improve Text",
            aiAddPearl: "Add Pearl",
            aiFindCitation: "Find Citation",
            aiTranslate: "Translate",
            aiCondense: "Condense",

            // Input
            aiInputPlaceholder: "Ask me anything about your presentation...",
            aiInputHint: "Press Enter to send, Shift+Enter for new line",

            // Analysis
            aiScoreLabel: "Presentation Score",
            aiScoreRun: "Run analysis to get score",
            aiScoreExcellent: "Excellent",
            aiScoreGood: "Good - Minor improvements suggested",
            aiScoreNeedsWork: "Needs attention",
            aiScorePoor: "Significant issues found",
            aiErrors: "Errors",
            aiWarnings: "Warnings",
            aiSuggestions: "Suggestions",
            aiAnalyzePlaceholder: "Click below to analyze your presentation",
            aiRunAnalysis: "Run Full Analysis",

            // Generate Section Titles
            aiGenCaseContent: "Case Content",
            aiGenTeaching: "Teaching Elements",
            aiGenGeriatric: "Geriatric Focus",
            aiGenSlides: "Slide Generation",

            // Generate Cards
            aiGenDdx: "Differential Diagnosis",
            aiGenDdxDesc: "Based on case details",
            aiGenWorkup: "Diagnostic Workup",
            aiGenWorkupDesc: "Tests and imaging",
            aiGenTreatment: "Treatment Plan",
            aiGenTreatmentDesc: "Evidence-based options",
            aiGenPoints: "Teaching Points",
            aiGenPointsDesc: "Key learning objectives",
            aiGenPearls: "Clinical Pearls",
            aiGenPearlsDesc: "Memorable insights",
            aiGenQuiz: "Quiz Questions",
            aiGenQuizDesc: "Test understanding",
            aiGenCGA: "CGA Summary",
            aiGenCGADesc: "Comprehensive assessment",
            aiGenMedReview: "Medication Review",
            aiGenMedReviewDesc: "Beers/STOPP-START",
            aiGenGoals: "Goals of Care",
            aiGenGoalsDesc: "Discussion framework",
            aiGenFullCase: "Generate Full Presentation",
            aiGenFullCaseDesc: "From notes or text"
        },
        he: {
            // Panel Header
            aiAssistant: "עוזר AI",
            aiSubtitle: "מומחה למצגות רפואיות",
            aiOnline: "מקוון",
            aiOffline: "לא מקוון",

            // Tabs
            aiTabChat: "צ'אט",
            aiTabAnalyze: "ניתוח",
            aiTabGenerate: "יצירה",

            // Welcome
            aiWelcomeTitle: "!שלום! אני העוזר החכם שלך",
            aiWelcomeDesc: "אני יכול לעזור לך ליצור מצגות רפואיות טובות יותר, לייצר תוכן ולסקור את השקופיות שלך.",

            // Suggestions
            aiSuggestDdx: "יצירת אבחנה מבדלת",
            aiSuggestDdxDesc: "רשימת DDx מבוססת מקרה",
            aiSuggestReview: "סקירת מצגת",
            aiSuggestReviewDesc: "קבלת משוב על המבנה",
            aiSuggestTeaching: "נקודות לימוד",
            aiSuggestTeachingDesc: "מטרות למידה מרכזיות",

            // Quick Actions
            aiQuickActions: "פעולות מהירות:",
            aiImproveText: "שפר טקסט",
            aiAddPearl: "הוסף פנינה קלינית",
            aiFindCitation: "מצא מקור",
            aiTranslate: "תרגם",
            aiCondense: "קצר",

            // Input
            aiInputPlaceholder: "שאל אותי כל שאלה על המצגת שלך...",
            aiInputHint: "Enter לשליחה, Shift+Enter לשורה חדשה",

            // Analysis
            aiScoreLabel: "ציון מצגת",
            aiScoreRun: "הפעל ניתוח לקבלת ציון",
            aiScoreExcellent: "מצוין",
            aiScoreGood: "טוב - מומלצים שיפורים קלים",
            aiScoreNeedsWork: "דורש תשומת לב",
            aiScorePoor: "נמצאו בעיות משמעותיות",
            aiErrors: "שגיאות",
            aiWarnings: "אזהרות",
            aiSuggestions: "הצעות",
            aiAnalyzePlaceholder: "לחץ למטה לניתוח המצגת",
            aiRunAnalysis: "הפעל ניתוח מלא",

            // Generate Section Titles
            aiGenCaseContent: "תוכן מקרה",
            aiGenTeaching: "אלמנטים לימודיים",
            aiGenGeriatric: "מיקוד גריאטרי",
            aiGenSlides: "יצירת שקופיות",

            // Generate Cards
            aiGenDdx: "אבחנה מבדלת",
            aiGenDdxDesc: "מבוסס פרטי המקרה",
            aiGenWorkup: "בירור אבחנתי",
            aiGenWorkupDesc: "בדיקות והדמיה",
            aiGenTreatment: "תוכנית טיפול",
            aiGenTreatmentDesc: "אפשרויות מבוססות ראיות",
            aiGenPoints: "נקודות לימוד",
            aiGenPointsDesc: "מטרות למידה מרכזיות",
            aiGenPearls: "פנינים קליניות",
            aiGenPearlsDesc: "תובנות בלתי נשכחות",
            aiGenQuiz: "שאלות חידון",
            aiGenQuizDesc: "בדיקת הבנה",
            aiGenCGA: "סיכום CGA",
            aiGenCGADesc: "הערכה מקיפה",
            aiGenMedReview: "סקירת תרופות",
            aiGenMedReviewDesc: "Beers/STOPP-START",
            aiGenGoals: "יעדי טיפול",
            aiGenGoalsDesc: "מסגרת לדיון",
            aiGenFullCase: "יצירת מצגת מלאה",
            aiGenFullCaseDesc: "מהערות או טקסט"
        }
    };

    // Merge with existing i18n if available
    if (window.i18n && typeof window.i18n.addTranslations === 'function') {
        window.i18n.addTranslations(aiTranslations);
    } else {
        // Store for later use
        window.aiTranslations = aiTranslations;
        
        // Create simple translation function if i18n not available
        window.translateAI = function(key, lang = 'en') {
            return aiTranslations[lang]?.[key] || aiTranslations.en[key] || key;
        };
    }
})();
