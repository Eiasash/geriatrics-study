// SZMC Geriatrics Presentation Maker - AI Assistant Module
// Provides intelligent analysis, bug detection, and improvement suggestions

class AIAssistant {
    constructor() {
        this.issues = [];
        this.suggestions = [];
        this.analysisCache = new Map();
        this.presentationScore = 0;
        this.lastAnalysisTime = null;

        // Issue severity levels
        this.SEVERITY = {
            ERROR: 'error',      // Critical issues that must be fixed
            WARNING: 'warning',  // Issues that should be addressed
            INFO: 'info',        // Suggestions for improvement
            TIP: 'tip'           // Best practices and tips
        };

        // Geriatrics-specific keywords for content analysis
        this.geriatricsKeywords = [
            'frailty', 'polypharmacy', 'delirium', 'dementia', 'falls',
            'incontinence', 'malnutrition', 'sarcopenia', 'osteoporosis',
            'cognitive', 'functional', 'ADL', 'IADL', 'goals of care',
            'advance directive', 'palliative', 'hospice', 'caregiver',
            'geriatric syndrome', 'beers criteria', 'deprescribing',
            'multimorbidity', 'comorbidity', 'mobility', 'gait'
        ];

        // Common medical abbreviations that should be defined
        this.abbreviations = [
            'ADL', 'IADL', 'MMSE', 'MoCA', 'GDS', 'PHQ-9', 'CAM',
            'TUG', 'FRAIL', 'CGA', 'PIM', 'ADE', 'DNR', 'DNI',
            'POLST', 'CODE', 'HbA1c', 'eGFR', 'BUN', 'CBC', 'BMP'
        ];

        // Slide type recommendations based on presentation context
        this.slideTypeRecommendations = {
            'case-presentation': ['title', 'toc', 'content', 'two-column', 'statistics-visual', 'algorithm', 'key-points-visual', 'teaching-points', 'take-home', 'references-formatted', 'questions'],
            'journal-club': ['title', 'toc', 'content', 'statistics-visual', 'algorithm', 'key-points-visual', 'teaching-points', 'take-home', 'references-formatted', 'questions'],
            'lecture': ['title', 'toc', 'content', 'two-column', 'statistics-visual', 'pathophysiology', 'algorithm', 'key-points-visual', 'teaching-points', 'take-home', 'questions']
        };

        // Timing estimates per slide type (in seconds)
        this.slideTiming = {
            'title': 30,
            'toc': 20,
            'section-header': 10,
            'content': 90,
            'two-column': 90,
            'statistics-visual': 60,
            'algorithm': 120,
            'pathophysiology': 90,
            'key-points-visual': 60,
            'teaching-points': 90,
            'take-home': 60,
            'references-formatted': 30,
            'questions': 60,
            'quiz': 120,
            'default': 60
        };

        // Drug interaction database (common geriatric concerns)
        this.drugInteractions = {
            'warfarin': ['aspirin', 'ibuprofen', 'naproxen', 'amiodarone', 'fluconazole', 'metronidazole'],
            'digoxin': ['amiodarone', 'verapamil', 'quinidine', 'clarithromycin'],
            'metformin': ['contrast', 'alcohol'],
            'ace inhibitor': ['potassium', 'spironolactone', 'nsaid'],
            'lithium': ['nsaid', 'ace inhibitor', 'diuretic'],
            'ssri': ['tramadol', 'triptans', 'maoi', 'linezolid']
        };

        // Beers Criteria categories
        this.beersCriteria = [
            'benzodiazepine', 'zolpidem', 'eszopiclone', 'diphenhydramine', 'hydroxyzine',
            'amitriptyline', 'doxepin', 'chlorpheniramine', 'promethazine', 'meperidine',
            'indomethacin', 'ketorolac', 'muscle relaxant', 'carisoprodol', 'cyclobenzaprine',
            'metaxalone', 'methocarbamol', 'sliding scale insulin', 'glyburide', 'chlorpropamide',
            'megestrol', 'metoclopramide', 'proton pump inhibitor'
        ];
    }

    // Main analysis function - analyzes entire presentation
    analyzePresentation(slides) {
        this.issues = [];
        this.suggestions = [];
        this.lastAnalysisTime = new Date();

        if (!slides || slides.length === 0) {
            this.addIssue(this.SEVERITY.ERROR, 'No slides found',
                'Your presentation has no slides. Add at least one slide to get started.',
                null, 'addSlide');
            return this.getResults();
        }

        // Run all analysis checks
        this.checkSlideCount(slides);
        this.checkEmptySlides(slides);
        this.checkSlideOrder(slides);
        this.checkContentLength(slides);
        this.checkContentDensity(slides);  // Check for sizing/overflow issues
        this.checkTableComplexity(slides); // Check table sizing issues
        this.checkHTMLContent(slides);     // Check HTML content issues
        this.checkMissingFields(slides);
        this.checkCitationFormat(slides);
        this.checkImagePlaceholders(slides);
        this.checkGeriatricsContent(slides);
        this.checkAbbreviations(slides);
        this.checkDuplicateContent(slides);
        this.checkSlideVariety(slides);
        this.checkMedicationSafety(slides);    // NEW: Check medication safety
        this.checkReadability(slides);          // NEW: Check readability
        this.checkAccessibility(slides);        // NEW: Check accessibility
        this.checkConsistency(slides);          // NEW: Check consistency
        this.checkLabValues(slides);            // NEW: Check lab value formatting
        this.suggestImprovements(slides);

        // Calculate presentation score
        this.calculatePresentationScore(slides);

        return this.getResults();
    }

    // Analyze a single slide
    analyzeSlide(slide, index) {
        const slideIssues = [];

        if (!slide) return slideIssues;

        // Check for empty content
        if (this.isSlideEmpty(slide)) {
            slideIssues.push({
                severity: this.SEVERITY.WARNING,
                title: 'Empty slide detected',
                message: `Slide ${index + 1} appears to be empty or has minimal content.`,
                slideIndex: index,
                action: 'editSlide'
            });
        }

        // Check for placeholder text
        const placeholders = this.findPlaceholders(slide);
        if (placeholders.length > 0) {
            slideIssues.push({
                severity: this.SEVERITY.WARNING,
                title: 'Placeholder text found',
                message: `Slide ${index + 1} contains placeholder text: "${placeholders[0]}"`,
                slideIndex: index,
                action: 'editSlide'
            });
        }

        // Check content length
        const textLength = this.getSlideTextLength(slide);
        if (textLength > 500) {
            slideIssues.push({
                severity: this.SEVERITY.INFO,
                title: 'Dense content',
                message: `Slide ${index + 1} has a lot of text (${textLength} characters). Consider splitting into multiple slides.`,
                slideIndex: index,
                action: 'splitSlide'
            });
        }

        return slideIssues;
    }

    // Check total slide count
    checkSlideCount(slides) {
        if (slides.length < 5) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Short presentation',
                'Your presentation has fewer than 5 slides. Consider adding more content for a comprehensive presentation.',
                null, 'addSlide');
        }

        if (slides.length > 30) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Long presentation',
                `Your presentation has ${slides.length} slides. Consider condensing content to maintain audience attention.`,
                null, null);
        }
    }

    // Check for empty slides
    checkEmptySlides(slides) {
        slides.forEach((slide, index) => {
            if (this.isSlideEmpty(slide)) {
                this.addIssue(this.SEVERITY.WARNING,
                    'Empty slide',
                    `Slide ${index + 1} (${slide.type}) appears to be empty or incomplete.`,
                    index, 'editSlide');
            }
        });
    }

    // Check slide order for logical flow
    checkSlideOrder(slides) {
        const slideTypes = slides.map(s => s.type);

        // Check if title slide is first
        const titleIndex = slideTypes.indexOf('title');
        if (titleIndex > 0) {
            this.addIssue(this.SEVERITY.WARNING,
                'Title slide not first',
                'Consider moving your title slide to the beginning of the presentation.',
                titleIndex, 'moveSlide');
        }

        // Check for HPI before Assessment
        const hpiIndex = slideTypes.indexOf('hpi');
        const assessmentIndex = slideTypes.indexOf('assessment');
        if (hpiIndex > -1 && assessmentIndex > -1 && hpiIndex > assessmentIndex) {
            this.addIssue(this.SEVERITY.WARNING,
                'HPI after Assessment',
                'The History of Present Illness should come before the Assessment section.',
                hpiIndex, 'moveSlide');
        }

        // Check for Conclusion/Take-home at end
        const conclusionTypes = ['take-home', 'conclusion', 'references'];
        const lastSlideType = slideTypes[slideTypes.length - 1];
        if (slides.length > 3 && !conclusionTypes.includes(lastSlideType)) {
            this.addSuggestion(this.SEVERITY.TIP,
                'Add conclusion',
                'Consider ending with a take-home points or conclusion slide.',
                null, 'addSlide');
        }
    }

    // Check content length per slide
    checkContentLength(slides) {
        slides.forEach((slide, index) => {
            const textLength = this.getSlideTextLength(slide);

            if (textLength > 800) {
                this.addIssue(this.SEVERITY.WARNING,
                    'Too much text',
                    `Slide ${index + 1} has excessive text (${textLength} chars). Consider splitting into multiple slides.`,
                    index, 'splitSlide');
            } else if (textLength > 500) {
                this.addSuggestion(this.SEVERITY.INFO,
                    'Dense slide',
                    `Slide ${index + 1} is content-heavy. Consider using bullet points or visuals.`,
                    index, 'editSlide');
            }
        });
    }

    // NEW: Check content density for sizing/overflow issues
    checkContentDensity(slides) {
        // Slide types that commonly have overflow issues
        const denseTypes = ['content', 'two-column', 'medications-detailed', 'pathophysiology',
                           'algorithm', 'key-points-visual', 'statistics-visual', 'teaching-points'];

        slides.forEach((slide, index) => {
            const data = slide.data || slide;
            const textLength = this.getSlideTextLength(slide);
            const htmlContent = this.getSlideHTMLContent(slide);

            // Check for oversized content based on slide type
            if (denseTypes.includes(slide.type)) {
                // Check HTML length (indicates complex formatting)
                if (htmlContent.length > 2000) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Content overflow likely',
                        `Slide ${index + 1} (${slide.type}) has very dense HTML content that may overflow. Consider simplifying or splitting.`,
                        index, 'simplifySlide');
                }

                // Check for too many list items
                const listItemCount = (htmlContent.match(/<li/gi) || []).length;
                if (listItemCount > 12) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Too many list items',
                        `Slide ${index + 1} has ${listItemCount} list items which may cause overflow. Limit to 6-8 items per slide.`,
                        index, 'splitSlide');
                }
            }

            // Check for two-column slides with unbalanced content
            if (slide.type === 'two-column') {
                const leftContent = data.leftContent || data.left || '';
                const rightContent = data.rightContent || data.right || '';
                const leftLen = leftContent.length;
                const rightLen = rightContent.length;

                if (leftLen > 800 || rightLen > 800) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Two-column overflow',
                        `Slide ${index + 1} has too much content in columns. Each column should have less than 400 characters.`,
                        index, 'editSlide');
                }
            }

            // Check teaching-points slides
            if (slide.type === 'teaching-points') {
                const points = data.points || [];
                if (points.length > 5) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Too many teaching points',
                        `Slide ${index + 1} has ${points.length} teaching points. Limit to 4-5 for readability.`,
                        index, 'splitSlide');
                }
            }

            // Check key-points-visual slides
            if (slide.type === 'key-points-visual') {
                const keyPoints = data.keyPoints || data.points || [];
                if (keyPoints.length > 6) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Too many key points',
                        `Slide ${index + 1} has ${keyPoints.length} key points. The grid layout works best with 3-6 points.`,
                        index, 'splitSlide');
                }
            }

            // Check take-home slides
            if (slide.type === 'take-home') {
                const messages = [data.message1, data.message2, data.message3, data.message4].filter(Boolean);
                let longMessages = 0;
                messages.forEach(msg => {
                    if (msg && msg.length > 150) longMessages++;
                });
                if (longMessages > 0) {
                    this.addSuggestion(this.SEVERITY.INFO,
                        'Long take-home messages',
                        `Slide ${index + 1} has ${longMessages} take-home message(s) that are too long. Keep each under 100 characters for impact.`,
                        index, 'editSlide');
                }
            }

            // Check statistics-visual slides
            if (slide.type === 'statistics-visual') {
                const stats = data.stats || [];
                if (stats.length > 4) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Too many statistics',
                        `Slide ${index + 1} has ${stats.length} statistics. The 4-column grid layout works best with exactly 4 stats.`,
                        index, 'editSlide');
                }
            }
        });
    }

    // NEW: Check table complexity and sizing
    checkTableComplexity(slides) {
        slides.forEach((slide, index) => {
            const htmlContent = this.getSlideHTMLContent(slide);

            // Check for tables in content
            const tableMatches = htmlContent.match(/<table/gi) || [];
            if (tableMatches.length > 0) {
                // Count table rows
                const rowCount = (htmlContent.match(/<tr/gi) || []).length;
                const colCount = (htmlContent.match(/<th/gi) || []).length ||
                                 (htmlContent.match(/<td/gi) || []).length / Math.max(rowCount, 1);

                if (rowCount > 8) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Table too long',
                        `Slide ${index + 1} has a table with ${rowCount} rows. Tables with more than 6-8 rows may overflow. Consider splitting.`,
                        index, 'splitSlide');
                }

                if (colCount > 5) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Table too wide',
                        `Slide ${index + 1} has a table with approximately ${Math.round(colCount)} columns. Wide tables may not fit. Consider using fewer columns.`,
                        index, 'editSlide');
                }

                // Check for long cell content
                const cellContents = htmlContent.match(/<td[^>]*>([^<]*)</gi) || [];
                const longCells = cellContents.filter(cell => cell.length > 100).length;
                if (longCells > 0) {
                    this.addSuggestion(this.SEVERITY.INFO,
                        'Long table cells',
                        `Slide ${index + 1} has ${longCells} table cell(s) with long content. Abbreviate or use bullet points.`,
                        index, 'editSlide');
                }
            }
        });
    }

    // NEW: Check HTML content for potential issues
    checkHTMLContent(slides) {
        slides.forEach((slide, index) => {
            const htmlContent = this.getSlideHTMLContent(slide);

            // Check for deeply nested elements
            const nestedDivs = (htmlContent.match(/<div[^>]*><div[^>]*><div/gi) || []).length;
            if (nestedDivs > 2) {
                this.addSuggestion(this.SEVERITY.INFO,
                    'Complex HTML structure',
                    `Slide ${index + 1} has deeply nested HTML which may cause layout issues. Simplify the structure.`,
                    index, 'editSlide');
            }

            // Check for inline styles that might override layout
            const inlineWidths = (htmlContent.match(/style="[^"]*width\s*:/gi) || []).length;
            const inlineHeights = (htmlContent.match(/style="[^"]*height\s*:/gi) || []).length;
            if (inlineWidths > 3 || inlineHeights > 3) {
                this.addSuggestion(this.SEVERITY.INFO,
                    'Inline dimension styles',
                    `Slide ${index + 1} has multiple inline width/height styles which may cause sizing issues. Use CSS classes instead.`,
                    index, 'editSlide');
            }

            // Check for very long unbroken text (no spaces)
            const longWords = htmlContent.match(/\S{40,}/g) || [];
            if (longWords.length > 0) {
                this.addIssue(this.SEVERITY.WARNING,
                    'Long unbroken text',
                    `Slide ${index + 1} contains very long text without spaces (${longWords[0].substring(0, 20)}...) which will overflow. Add word breaks.`,
                    index, 'editSlide');
            }

            // Check for missing alt text on images
            const imagesWithoutAlt = (htmlContent.match(/<img(?![^>]*alt=)[^>]*>/gi) || []).length;
            if (imagesWithoutAlt > 0) {
                this.addSuggestion(this.SEVERITY.TIP,
                    'Missing image alt text',
                    `Slide ${index + 1} has ${imagesWithoutAlt} image(s) without alt text. Add alt attributes for accessibility.`,
                    index, 'editSlide');
            }
        });
    }

    // Helper: Get all HTML content from a slide
    getSlideHTMLContent(slide) {
        if (!slide) return '';
        const data = slide.data || slide;
        let html = '';

        // Collect all string fields that might contain HTML
        const htmlFields = ['content', 'leftContent', 'rightContent', 'left', 'right',
                          'description', 'body', 'html', 'text', 'chiefComplaint', 'history',
                          'urgent', 'routine', 'imaging', 'special', 'rationale',
                          'pros', 'cons', 'verdict', 'explanation', 'findings'];

        htmlFields.forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                html += ' ' + data[field];
            }
        });

        // Also check array fields
        ['points', 'items', 'messages', 'keyPoints', 'stats'].forEach(field => {
            if (data[field] && Array.isArray(data[field])) {
                data[field].forEach(item => {
                    if (typeof item === 'string') {
                        html += ' ' + item;
                    } else if (typeof item === 'object') {
                        Object.values(item).forEach(val => {
                            if (typeof val === 'string') html += ' ' + val;
                        });
                    }
                });
            }
        });

        return html;
    }

    // Check for missing required fields
    checkMissingFields(slides) {
        const requiredFields = {
            'title': ['title', 'presenter'],
            'hpi': ['chiefComplaint', 'history'],
            'medications': ['medications'],
            'assessment': ['assessment'],
            'plan': ['plan'],
            'jc-pico': ['population', 'intervention', 'comparison', 'outcome'],
            'jc-results': ['results'],
            'quiz': ['question', 'options']
        };

        slides.forEach((slide, index) => {
            const required = requiredFields[slide.type];
            const data = slide.data || slide; // Support both data structures
            if (required) {
                required.forEach(field => {
                    if (!data[field] ||
                        (typeof data[field] === 'string' && data[field].trim() === '') ||
                        (Array.isArray(data[field]) && data[field].length === 0)) {
                        this.addIssue(this.SEVERITY.WARNING,
                            'Missing field',
                            `Slide ${index + 1} (${slide.type}) is missing the "${field}" field.`,
                            index, 'editSlide');
                    }
                });
            }
        });
    }

    // Check citation format consistency
    checkCitationFormat(slides) {
        const citationPatterns = [];

        slides.forEach((slide, index) => {
            const text = this.getSlideText(slide);

            // Check for various citation formats
            const apaMatch = text.match(/\([A-Z][a-z]+,?\s*\d{4}\)/g);
            const vancouverMatch = text.match(/\[\d+\]/g);
            const numberMatch = text.match(/\(\d+\)/g);

            if (apaMatch) citationPatterns.push({ type: 'APA', index });
            if (vancouverMatch) citationPatterns.push({ type: 'Vancouver', index });
            if (numberMatch && !vancouverMatch) citationPatterns.push({ type: 'Numbered', index });
        });

        // Check for mixed citation styles
        const styles = [...new Set(citationPatterns.map(p => p.type))];
        if (styles.length > 1) {
            this.addIssue(this.SEVERITY.WARNING,
                'Inconsistent citations',
                `Mixed citation styles detected (${styles.join(', ')}). Use a consistent format throughout.`,
                null, null);
        }
    }

    // Check for image placeholders
    checkImagePlaceholders(slides) {
        slides.forEach((slide, index) => {
            const data = slide.data || slide; // Support both data structures
            const imageFields = ['image', 'imageUrl', 'figure', 'diagram'];

            imageFields.forEach(field => {
                if (data[field]) {
                    const value = data[field].toLowerCase();
                    if (value.includes('placeholder') ||
                        value.includes('example') ||
                        value.includes('sample') ||
                        value === '' ||
                        value.includes('todo')) {
                        this.addIssue(this.SEVERITY.WARNING,
                            'Image placeholder',
                            `Slide ${index + 1} has a placeholder image. Add an actual image before presenting.`,
                            index, 'editSlide');
                    }
                }
            });
        });
    }

    // Check for geriatrics-specific content quality
    checkGeriatricsContent(slides) {
        const allText = slides.map(s => this.getSlideText(s)).join(' ').toLowerCase();

        // Check for key geriatrics concepts
        let foundConcepts = 0;
        this.geriatricsKeywords.forEach(keyword => {
            if (allText.includes(keyword.toLowerCase())) {
                foundConcepts++;
            }
        });

        if (slides.length > 5 && foundConcepts < 3) {
            this.addSuggestion(this.SEVERITY.TIP,
                'Add geriatrics focus',
                'Consider incorporating more geriatrics-specific concepts (frailty, functional status, goals of care, etc.)',
                null, null);
        }

        // Check for Beers Criteria mention in medication slides
        const hasMedSlide = slides.some(s => s.type === 'medications');
        const mentionsBeers = allText.includes('beers') || allText.includes('potentially inappropriate');

        if (hasMedSlide && !mentionsBeers) {
            this.addSuggestion(this.SEVERITY.TIP,
                'Consider Beers Criteria',
                'For medication slides, consider reviewing Beers Criteria for potentially inappropriate medications in older adults.',
                null, null);
        }
    }

    // Check for undefined abbreviations
    checkAbbreviations(slides) {
        const allText = slides.map(s => this.getSlideText(s)).join(' ');
        const usedAbbreviations = [];

        this.abbreviations.forEach(abbr => {
            const regex = new RegExp(`\\b${abbr}\\b`, 'g');
            if (regex.test(allText)) {
                // Check if it's defined (word in parentheses after or before)
                const definedRegex = new RegExp(`${abbr}\\s*\\([^)]+\\)|\\([^)]+\\)\\s*${abbr}`, 'i');
                if (!definedRegex.test(allText)) {
                    usedAbbreviations.push(abbr);
                }
            }
        });

        if (usedAbbreviations.length > 0) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Define abbreviations',
                `Consider defining these abbreviations on first use: ${usedAbbreviations.slice(0, 5).join(', ')}${usedAbbreviations.length > 5 ? '...' : ''}`,
                null, null);
        }
    }

    // Check for duplicate content
    checkDuplicateContent(slides) {
        const contentHashes = new Map();

        slides.forEach((slide, index) => {
            const content = this.getSlideText(slide).toLowerCase().trim();
            if (content.length > 50) {
                // Simple similarity check
                contentHashes.forEach((existingIndex, existingContent) => {
                    const similarity = this.calculateSimilarity(content, existingContent);
                    if (similarity > 0.8) {
                        this.addIssue(this.SEVERITY.WARNING,
                            'Duplicate content',
                            `Slides ${existingIndex + 1} and ${index + 1} have very similar content. Consider consolidating.`,
                            index, 'deleteSlide');
                    }
                });
                contentHashes.set(content, index);
            }
        });
    }

    // Check for slide variety
    checkSlideVariety(slides) {
        const typeCounts = {};
        slides.forEach(slide => {
            typeCounts[slide.type] = (typeCounts[slide.type] || 0) + 1;
        });

        // Check for too many of the same type
        Object.entries(typeCounts).forEach(([type, count]) => {
            if (count > 5 && !['bullet-points', 'content'].includes(type)) {
                this.addSuggestion(this.SEVERITY.INFO,
                    'Slide variety',
                    `You have ${count} "${type}" slides. Consider using different slide types for visual variety.`,
                    null, null);
            }
        });

        // Suggest visual slides if none present
        const visualTypes = ['image-focus', 'comparison', 'timeline', 'chart', 'diagram', 'infographic'];
        const hasVisuals = slides.some(s => visualTypes.includes(s.type));

        if (slides.length > 8 && !hasVisuals) {
            this.addSuggestion(this.SEVERITY.TIP,
                'Add visual slides',
                'Consider adding visual elements like charts, diagrams, or comparison tables to enhance engagement.',
                null, 'addSlide');
        }
    }

    // Generate improvement suggestions
    suggestImprovements(slides) {
        // Suggest case presentation structure
        const caseTypes = ['title', 'hpi', 'pmh', 'medications', 'physical-exam', 'labs', 'assessment', 'plan'];
        const slideTypes = slides.map(s => s.type);

        const hasCaseElements = caseTypes.filter(t => slideTypes.includes(t)).length;
        if (hasCaseElements > 2 && hasCaseElements < caseTypes.length - 2) {
            const missingTypes = caseTypes.filter(t => !slideTypes.includes(t));
            this.addSuggestion(this.SEVERITY.TIP,
                'Complete case structure',
                `Consider adding: ${missingTypes.slice(0, 3).join(', ')} for a complete case presentation.`,
                null, 'addSlide');
        }

        // Suggest teaching points
        if (slides.length > 5 && !slideTypes.includes('teaching-points') && !slideTypes.includes('take-home')) {
            this.addSuggestion(this.SEVERITY.TIP,
                'Add teaching points',
                'Consider adding a teaching points or take-home slide to summarize key learnings.',
                null, 'addSlide');
        }

        // Suggest references if citations exist
        const hasReferences = slideTypes.includes('references');
        const hasCitations = slides.some(s => {
            const text = this.getSlideText(s);
            return /\[\d+\]|\(\d{4}\)/.test(text);
        });

        if (hasCitations && !hasReferences) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Add references slide',
                'You have citations but no references slide. Add one to properly credit your sources.',
                null, 'addSlide');
        }
    }

    // Quick fix functions
    getQuickFix(issue) {
        switch (issue.action) {
            case 'editSlide':
                return {
                    label: 'Edit Slide',
                    action: () => {
                        if (window.editor && issue.slideIndex !== null) {
                            window.editor.selectSlide(issue.slideIndex);
                            // Focus on the slide canvas for editing
                            const canvas = document.getElementById('current-slide');
                            if (canvas) {
                                const editable = canvas.querySelector('[contenteditable="true"]');
                                if (editable) editable.focus();
                            }
                        }
                    }
                };
            case 'deleteSlide':
                return {
                    label: 'Delete Slide',
                    action: () => {
                        if (window.editor && issue.slideIndex !== null) {
                            if (confirm('Are you sure you want to delete this slide?')) {
                                window.editor.deleteSlide(issue.slideIndex);
                            }
                        }
                    }
                };
            case 'addSlide':
                return {
                    label: 'Add Slide',
                    action: () => {
                        // Scroll to add slide section
                        const typeSelect = document.getElementById('slide-type');
                        if (typeSelect) {
                            typeSelect.scrollIntoView({ behavior: 'smooth' });
                            typeSelect.focus();
                        }
                    }
                };
            case 'moveSlide':
                return {
                    label: 'Move Slide',
                    action: () => {
                        if (window.editor && issue.slideIndex !== null) {
                            window.editor.selectSlide(issue.slideIndex);
                            window.showToast('Use drag and drop to reorder slides', 'info');
                        }
                    }
                };
            case 'splitSlide':
                return {
                    label: 'Split Slide',
                    action: () => {
                        if (window.editor && issue.slideIndex !== null) {
                            this.suggestSplitSlide(issue.slideIndex);
                        }
                    }
                };
            case 'simplifySlide':
                return {
                    label: 'Simplify Content',
                    action: () => {
                        if (window.editor && issue.slideIndex !== null) {
                            window.editor.selectSlide(issue.slideIndex);
                            window.showToast('Tip: Remove complex HTML, reduce list items, or split into multiple slides', 'info');
                        }
                    }
                };
            default:
                return null;
        }
    }

    // Suggest how to split a dense slide
    suggestSplitSlide(slideIndex) {
        const slide = window.editor?.slides[slideIndex];
        if (!slide) return;

        const suggestions = [];

        if (slide.type === 'bullet-points' && slide.points && slide.points.length > 5) {
            suggestions.push(`Split ${slide.points.length} bullet points across 2 slides`);
        }

        if (slide.content && slide.content.length > 500) {
            suggestions.push('Create a new slide for additional details');
        }

        if (suggestions.length > 0) {
            window.showToast(`Suggestion: ${suggestions[0]}`, 'info');
        }
    }

    // Helper functions
    isSlideEmpty(slide) {
        if (!slide) return true;

        const textContent = this.getSlideText(slide);
        return textContent.trim().length < 10;
    }

    getSlideText(slide) {
        if (!slide) return '';

        // Support both slide structures: {type, data: {...}} or flat {type, field1, field2}
        const data = slide.data || slide;

        const textFields = ['title', 'subtitle', 'content', 'text', 'description',
            'chiefComplaint', 'history', 'assessment', 'plan', 'question',
            'findings', 'interpretation', 'notes', 'summary', 'presenter',
            'message1', 'message2', 'message3', 'message4', 'bottomLine',
            'urgent', 'routine', 'imaging', 'special', 'rationale',
            'pros', 'cons', 'verdict', 'patient', 'presentation', 'diagnosis',
            'management', 'outcome', 'learning', 'question', 'explanation',
            'highEvidence', 'modEvidence', 'lowEvidence', 'veryLowEvidence',
            'values', 'codeStatus', 'intubation', 'feeding', 'proxy'];

        let text = '';

        textFields.forEach(field => {
            if (data[field]) {
                if (typeof data[field] === 'string') {
                    text += ' ' + data[field];
                } else if (Array.isArray(data[field])) {
                    text += ' ' + data[field].join(' ');
                }
            }
        });

        // Handle nested arrays (like points, items, etc.)
        ['points', 'items', 'medications', 'options', 'optionA', 'optionB', 'optionC', 'optionD'].forEach(field => {
            if (data[field]) {
                if (Array.isArray(data[field])) {
                    data[field].forEach(item => {
                        if (typeof item === 'string') {
                            text += ' ' + item;
                        } else if (typeof item === 'object') {
                            text += ' ' + Object.values(item).join(' ');
                        }
                    });
                } else if (typeof data[field] === 'string') {
                    text += ' ' + data[field];
                }
            }
        });

        return text;
    }

    getSlideTextLength(slide) {
        return this.getSlideText(slide).length;
    }

    findPlaceholders(slide) {
        const placeholders = [];
        const text = this.getSlideText(slide).toLowerCase();

        const placeholderPatterns = [
            'lorem ipsum', 'placeholder', '[insert', 'xxx', 'todo:',
            'add content here', 'your text here', 'enter text',
            '[your ', 'example text', 'sample text', 'tbd'
        ];

        placeholderPatterns.forEach(pattern => {
            if (text.includes(pattern)) {
                placeholders.push(pattern);
            }
        });

        return placeholders;
    }

    calculateSimilarity(str1, str2) {
        const words1 = new Set(str1.split(/\s+/));
        const words2 = new Set(str2.split(/\s+/));

        const intersection = [...words1].filter(w => words2.has(w)).length;
        const union = new Set([...words1, ...words2]).size;

        return union > 0 ? intersection / union : 0;
    }

    // NEW: Check medication safety (Beers criteria, interactions)
    checkMedicationSafety(slides) {
        const allText = slides.map(s => this.getSlideText(s)).join(' ').toLowerCase();

        // Check for Beers Criteria medications
        const foundBeersMeds = [];
        this.beersCriteria.forEach(med => {
            if (allText.includes(med.toLowerCase())) {
                foundBeersMeds.push(med);
            }
        });

        if (foundBeersMeds.length > 0) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Beers Criteria medications detected',
                `Found potentially inappropriate medications for older adults: ${foundBeersMeds.slice(0, 3).join(', ')}${foundBeersMeds.length > 3 ? '...' : ''}. Consider discussing risks.`,
                null, null);
        }

        // Check for potential drug interactions
        const foundInteractions = [];
        Object.entries(this.drugInteractions).forEach(([drug, interactions]) => {
            if (allText.includes(drug.toLowerCase())) {
                interactions.forEach(interactor => {
                    if (allText.includes(interactor.toLowerCase())) {
                        foundInteractions.push(`${drug} + ${interactor}`);
                    }
                });
            }
        });

        if (foundInteractions.length > 0) {
            this.addIssue(this.SEVERITY.WARNING,
                'Potential drug interactions',
                `Detected potential interactions: ${foundInteractions.slice(0, 2).join('; ')}. Consider addressing in your presentation.`,
                null, null);
        }

        // Check for high-risk medications without monitoring mentioned
        const highRiskMeds = ['warfarin', 'digoxin', 'lithium', 'methotrexate', 'insulin'];
        const monitoringTerms = ['inr', 'level', 'monitor', 'check', 'follow'];

        highRiskMeds.forEach(med => {
            if (allText.includes(med)) {
                const hasMonitoring = monitoringTerms.some(term => allText.includes(term));
                if (!hasMonitoring) {
                    this.addSuggestion(this.SEVERITY.TIP,
                        `${med.charAt(0).toUpperCase() + med.slice(1)} monitoring`,
                        `High-risk medication "${med}" mentioned. Consider discussing monitoring requirements.`,
                        null, null);
                }
            }
        });
    }

    // NEW: Check readability of content
    checkReadability(slides) {
        slides.forEach((slide, index) => {
            const text = this.getSlideText(slide);

            // Skip very short slides
            if (text.length < 50) return;

            // Check for very long sentences (rough estimate)
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);

            if (longSentences.length > 2) {
                this.addSuggestion(this.SEVERITY.INFO,
                    'Long sentences detected',
                    `Slide ${index + 1} has ${longSentences.length} long sentences. Break them up for better readability.`,
                    index, 'editSlide');
            }

            // Check for passive voice indicators
            const passiveIndicators = ['was ', 'were ', 'been ', 'being ', 'is being', 'are being', 'was given', 'was started', 'was found'];
            let passiveCount = 0;
            passiveIndicators.forEach(indicator => {
                const matches = text.toLowerCase().match(new RegExp(indicator, 'g'));
                if (matches) passiveCount += matches.length;
            });

            if (passiveCount > 5) {
                this.addSuggestion(this.SEVERITY.TIP,
                    'Consider active voice',
                    `Slide ${index + 1} uses passive voice frequently. Active voice is more engaging.`,
                    index, 'editSlide');
            }

            // Check for jargon density
            const jargonTerms = ['aforementioned', 'utilize', 'facilitate', 'implement', 'subsequently', 'aforementioned', 'heretofore'];
            let jargonCount = 0;
            jargonTerms.forEach(term => {
                if (text.toLowerCase().includes(term)) jargonCount++;
            });

            if (jargonCount > 2) {
                this.addSuggestion(this.SEVERITY.TIP,
                    'Simplify language',
                    `Slide ${index + 1} contains complex jargon. Use simpler alternatives for clarity.`,
                    index, 'editSlide');
            }
        });
    }

    // NEW: Check accessibility
    checkAccessibility(slides) {
        slides.forEach((slide, index) => {
            const data = slide.data || slide;
            const htmlContent = this.getSlideHTMLContent(slide);

            // Check color contrast issues (mentioned colors)
            const lowContrastCombos = ['yellow on white', 'light gray on white', 'white on yellow'];
            lowContrastCombos.forEach(combo => {
                if (htmlContent.toLowerCase().includes(combo.split(' on ')[0]) &&
                    htmlContent.toLowerCase().includes(combo.split(' on ')[1])) {
                    this.addSuggestion(this.SEVERITY.INFO,
                        'Potential contrast issue',
                        `Slide ${index + 1} may have low contrast colors. Ensure text is readable.`,
                        index, 'editSlide');
                }
            });

            // Check for small font indicators
            const smallFontPatterns = ['font-size:\\s*(8|9|10)px', 'font-size:\\s*0\\.[0-6]'];
            smallFontPatterns.forEach(pattern => {
                if (new RegExp(pattern, 'i').test(htmlContent)) {
                    this.addIssue(this.SEVERITY.WARNING,
                        'Small font size',
                        `Slide ${index + 1} contains very small text. Use at least 14px for readability.`,
                        index, 'editSlide');
                }
            });

            // Check for color-only information
            const colorOnlyPatterns = ['shown in red', 'shown in green', 'highlighted in', 'marked in blue', 'the red items', 'the green ones'];
            colorOnlyPatterns.forEach(pattern => {
                if (htmlContent.toLowerCase().includes(pattern)) {
                    this.addSuggestion(this.SEVERITY.TIP,
                        'Color-only information',
                        `Slide ${index + 1} may rely on color alone to convey information. Add text labels for accessibility.`,
                        index, 'editSlide');
                }
            });

            // Check for missing table headers
            if (htmlContent.includes('<table') && !htmlContent.includes('<th')) {
                this.addSuggestion(this.SEVERITY.INFO,
                    'Missing table headers',
                    `Slide ${index + 1} has a table without header cells (<th>). Add headers for accessibility.`,
                    index, 'editSlide');
            }
        });
    }

    // NEW: Check consistency across slides
    checkConsistency(slides) {
        if (slides.length < 3) return;

        // Check title case consistency
        const titles = slides.map(s => (s.data || s).title).filter(Boolean);
        const titleCaseCount = titles.filter(t => this.isTitleCase(t)).length;
        const sentenceCaseCount = titles.filter(t => this.isSentenceCase(t)).length;

        if (titleCaseCount > 0 && sentenceCaseCount > 0 && Math.abs(titleCaseCount - sentenceCaseCount) < titles.length * 0.3) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Inconsistent title capitalization',
                'Mix of title case and sentence case in slide titles. Choose one style consistently.',
                null, null);
        }

        // Check bullet point style consistency
        const bulletStyles = new Set();
        slides.forEach(slide => {
            const html = this.getSlideHTMLContent(slide);
            if (html.includes('•')) bulletStyles.add('bullet');
            if (html.includes('→')) bulletStyles.add('arrow');
            if (html.includes('✓')) bulletStyles.add('check');
            if (html.includes('-')) bulletStyles.add('dash');
            if (/<li/i.test(html)) bulletStyles.add('list');
        });

        if (bulletStyles.size > 2) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Inconsistent bullet styles',
                `Found ${bulletStyles.size} different bullet/list styles. Use a consistent style throughout.`,
                null, null);
        }

        // Check date format consistency
        const allText = slides.map(s => this.getSlideText(s)).join(' ');
        const dateFormats = {
            'MM/DD/YYYY': /\d{1,2}\/\d{1,2}\/\d{4}/g,
            'DD/MM/YYYY': /\d{1,2}-\d{1,2}-\d{4}/g,
            'Month DD, YYYY': /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi,
            'DD Month YYYY': /\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/gi
        };

        const foundFormats = Object.entries(dateFormats).filter(([name, regex]) => regex.test(allText));
        if (foundFormats.length > 1) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Inconsistent date formats',
                `Found multiple date formats (${foundFormats.map(f => f[0]).join(', ')}). Use a consistent format.`,
                null, null);
        }

        // Check number formatting consistency
        const hasCommas = /\d{1,3}(,\d{3})+/.test(allText);
        const hasSpaces = /\d{1,3}(\s\d{3})+/.test(allText);
        if (hasCommas && hasSpaces) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Inconsistent number formatting',
                'Mix of comma and space separators in large numbers. Use one format consistently.',
                null, null);
        }
    }

    // NEW: Check lab value formatting
    checkLabValues(slides) {
        const allText = slides.map(s => this.getSlideText(s)).join(' ');

        // Common lab values with typical units
        const labPatterns = [
            { name: 'Creatinine', pattern: /creatinine[:\s]+(\d+\.?\d*)/gi, unit: 'mg/dL', typical: [0.5, 1.5] },
            { name: 'eGFR', pattern: /egfr[:\s]+(\d+)/gi, unit: 'mL/min/1.73m²', typical: [60, 120] },
            { name: 'Hemoglobin', pattern: /(?:hemoglobin|hgb|hb)[:\s]+(\d+\.?\d*)/gi, unit: 'g/dL', typical: [10, 17] },
            { name: 'WBC', pattern: /wbc[:\s]+(\d+\.?\d*)/gi, unit: 'x10⁹/L', typical: [4, 11] },
            { name: 'Platelets', pattern: /(?:platelets?|plt)[:\s]+(\d+)/gi, unit: 'x10⁹/L', typical: [150, 400] },
            { name: 'Sodium', pattern: /(?:sodium|na)[:\s]+(\d+)/gi, unit: 'mEq/L', typical: [135, 145] },
            { name: 'Potassium', pattern: /(?:potassium|k)[:\s]+(\d+\.?\d*)/gi, unit: 'mEq/L', typical: [3.5, 5.0] },
            { name: 'Glucose', pattern: /(?:glucose|bs|bg)[:\s]+(\d+)/gi, unit: 'mg/dL', typical: [70, 200] }
        ];

        const labIssues = [];
        labPatterns.forEach(lab => {
            const matches = allText.matchAll(lab.pattern);
            for (const match of matches) {
                const value = parseFloat(match[1]);
                if (value < lab.typical[0] * 0.1 || value > lab.typical[1] * 10) {
                    labIssues.push(`${lab.name}: ${value} (expected ${lab.typical[0]}-${lab.typical[1]} ${lab.unit})`);
                }
            }
        });

        if (labIssues.length > 0) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Unusual lab values',
                `Some lab values appear unusual or may be missing units: ${labIssues.slice(0, 2).join('; ')}. Please verify.`,
                null, null);
        }

        // Check for lab values without units
        const valuesWithoutUnits = allText.match(/(?:creatinine|egfr|hemoglobin|wbc|platelets|sodium|potassium)[:\s]+\d+\.?\d*(?!\s*(?:mg|g|meq|mmol|x10|ml|\/|%|units?))/gi);
        if (valuesWithoutUnits && valuesWithoutUnits.length > 2) {
            this.addSuggestion(this.SEVERITY.INFO,
                'Missing lab value units',
                'Some lab values appear to be missing units. Add units for clarity (e.g., "Cr 1.2 mg/dL").',
                null, null);
        }
    }

    // NEW: Calculate presentation score
    calculatePresentationScore(slides) {
        let score = 100;

        // Deduct for errors (10 points each, max 40)
        const errorCount = this.issues.filter(i => i.severity === this.SEVERITY.ERROR).length;
        score -= Math.min(errorCount * 10, 40);

        // Deduct for warnings (5 points each, max 30)
        const warningCount = this.issues.filter(i => i.severity === this.SEVERITY.WARNING).length;
        score -= Math.min(warningCount * 5, 30);

        // Deduct for info issues (2 points each, max 20)
        const infoCount = this.suggestions.filter(s => s.severity === this.SEVERITY.INFO).length;
        score -= Math.min(infoCount * 2, 20);

        // Bonus for good practices
        const slideTypes = slides.map(s => s.type);
        if (slideTypes.includes('take-home') || slideTypes.includes('teaching-points')) score += 5;
        if (slideTypes.includes('references-formatted') || slideTypes.includes('references')) score += 3;
        if (slideTypes.includes('toc')) score += 2;

        this.presentationScore = Math.max(0, Math.min(100, score));
    }

    // NEW: Get presentation timing estimate
    getTimingEstimate(slides) {
        let totalSeconds = 0;
        slides.forEach(slide => {
            totalSeconds += this.slideTiming[slide.type] || this.slideTiming['default'];
        });

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return {
            totalSeconds,
            minutes,
            seconds,
            formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            perSlide: Math.round(totalSeconds / slides.length)
        };
    }

    // NEW: Get slide type suggestions
    getSuggestedSlideTypes(slides, presentationType = 'case-presentation') {
        const currentTypes = slides.map(s => s.type);
        const recommended = this.slideTypeRecommendations[presentationType] || [];

        const missing = recommended.filter(t => !currentTypes.includes(t));
        const extras = currentTypes.filter(t => !recommended.includes(t) && t !== 'content' && t !== 'section-header');

        return { missing, extras, recommended };
    }

    // NEW: Generate summary report
    generateSummaryReport(slides) {
        const timing = this.getTimingEstimate(slides);
        const typeCount = {};
        slides.forEach(s => {
            typeCount[s.type] = (typeCount[s.type] || 0) + 1;
        });

        return {
            totalSlides: slides.length,
            estimatedTime: timing.formatted,
            score: this.presentationScore,
            slideTypes: typeCount,
            errorCount: this.issues.filter(i => i.severity === this.SEVERITY.ERROR).length,
            warningCount: this.issues.filter(i => i.severity === this.SEVERITY.WARNING).length,
            suggestionCount: this.suggestions.length,
            analysisTime: this.lastAnalysisTime
        };
    }

    // Helper: Check if text is title case
    isTitleCase(text) {
        if (!text) return false;
        const words = text.split(/\s+/);
        const capitalizedWords = words.filter(w => w.length > 3 && /^[A-Z]/.test(w));
        return capitalizedWords.length > words.length * 0.6;
    }

    // Helper: Check if text is sentence case
    isSentenceCase(text) {
        if (!text) return false;
        const words = text.split(/\s+/);
        if (words.length < 2) return true;
        const lowercaseWords = words.slice(1).filter(w => w.length > 3 && /^[a-z]/.test(w));
        return lowercaseWords.length > (words.length - 1) * 0.5;
    }

    addIssue(severity, title, message, slideIndex, action) {
        this.issues.push({ severity, title, message, slideIndex, action });
    }

    addSuggestion(severity, title, message, slideIndex, action) {
        this.suggestions.push({ severity, title, message, slideIndex, action });
    }

    getResults() {
        return {
            issues: this.issues,
            suggestions: this.suggestions,
            score: this.presentationScore,
            stats: {
                errorCount: this.issues.filter(i => i.severity === this.SEVERITY.ERROR).length,
                warningCount: this.issues.filter(i => i.severity === this.SEVERITY.WARNING).length,
                infoCount: this.suggestions.filter(s => s.severity === this.SEVERITY.INFO).length,
                tipCount: this.suggestions.filter(s => s.severity === this.SEVERITY.TIP).length
            }
        };
    }

    // Get severity icon
    getSeverityIcon(severity) {
        switch (severity) {
            case this.SEVERITY.ERROR: return 'fa-times-circle';
            case this.SEVERITY.WARNING: return 'fa-exclamation-triangle';
            case this.SEVERITY.INFO: return 'fa-info-circle';
            case this.SEVERITY.TIP: return 'fa-lightbulb';
            default: return 'fa-circle';
        }
    }

    // Get severity color
    getSeverityColor(severity) {
        switch (severity) {
            case this.SEVERITY.ERROR: return '#ef4444';
            case this.SEVERITY.WARNING: return '#f59e0b';
            case this.SEVERITY.INFO: return '#3b82f6';
            case this.SEVERITY.TIP: return '#10b981';
            default: return '#6b7280';
        }
    }
}

// Create global instance
window.aiAssistant = new AIAssistant();
