/**
 * Presentation Service
 * 
 * Provides analysis for SZMC presentations with AI-driven suggestions
 */

export class PresentationService {
    constructor() {
        // Severity levels
        this.SEVERITY = {
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'info',
            TIP: 'tip'
        };

        // Geriatrics-specific keywords
        this.geriatricsKeywords = [
            'frailty', 'polypharmacy', 'delirium', 'dementia', 'falls',
            'incontinence', 'malnutrition', 'sarcopenia', 'osteoporosis',
            'cognitive', 'functional', 'ADL', 'IADL', 'goals of care',
            'advance directive', 'palliative', 'hospice', 'caregiver',
            'geriatric syndrome', 'beers criteria', 'deprescribing'
        ];

        // Beers Criteria medications
        this.beersCriteria = [
            'benzodiazepine', 'zolpidem', 'eszopiclone', 'diphenhydramine',
            'hydroxyzine', 'amitriptyline', 'doxepin', 'meperidine',
            'indomethacin', 'ketorolac', 'muscle relaxant', 'glyburide',
            'chlorpropamide', 'megestrol', 'metoclopramide', 'proton pump inhibitor'
        ];

        // Drug interactions
        this.drugInteractions = {
            'warfarin': ['aspirin', 'ibuprofen', 'naproxen', 'amiodarone'],
            'digoxin': ['amiodarone', 'verapamil', 'quinidine'],
            'metformin': ['contrast', 'alcohol'],
            'ace inhibitor': ['potassium', 'spironolactone', 'nsaid'],
            'ssri': ['tramadol', 'triptans', 'maoi']
        };

        // Lab value patterns
        this.labPatterns = [
            { name: 'Creatinine', pattern: /creatinine[:\s]+(\d+\.?\d*)/gi, unit: 'mg/dL', typical: [0.5, 1.5] },
            { name: 'eGFR', pattern: /egfr[:\s]+(\d+)/gi, unit: 'mL/min', typical: [60, 120] },
            { name: 'Hemoglobin', pattern: /(?:hemoglobin|hgb|hb)[:\s]+(\d+\.?\d*)/gi, unit: 'g/dL', typical: [10, 17] },
            { name: 'Sodium', pattern: /(?:sodium|na)[:\s]+(\d+)/gi, unit: 'mEq/L', typical: [135, 145] },
            { name: 'Potassium', pattern: /(?:potassium|k)[:\s]+(\d+\.?\d*)/gi, unit: 'mEq/L', typical: [3.5, 5.0] }
        ];

        // Slide type recommendations
        this.slideTypeRecommendations = {
            'case-presentation': ['title', 'toc', 'hpi', 'pmh', 'medications', 'physical-exam', 'labs', 'assessment', 'plan', 'teaching-points', 'take-home', 'references'],
            'journal-club': ['title', 'toc', 'content', 'statistics-visual', 'algorithm', 'key-points-visual', 'teaching-points', 'take-home', 'references'],
            'lecture': ['title', 'toc', 'content', 'two-column', 'pathophysiology', 'algorithm', 'key-points-visual', 'teaching-points', 'take-home', 'questions']
        };

        // Timing estimates per slide type (seconds)
        this.slideTiming = {
            'title': 30,
            'toc': 20,
            'content': 90,
            'two-column': 90,
            'algorithm': 120,
            'teaching-points': 90,
            'take-home': 60,
            'references': 30,
            'questions': 60,
            'default': 60
        };
    }

    /**
     * Analyze a presentation and return comprehensive results
     */
    analyzePresentation(slides, presentationType = 'case-presentation') {
        const issues = [];
        const suggestions = [];

        if (!slides || slides.length === 0) {
            return {
                score: 0,
                issues: [{ severity: this.SEVERITY.ERROR, title: 'Empty presentation', message: 'No slides found' }],
                suggestions: [],
                timing: { minutes: 0, seconds: 0, formatted: '0:00' },
                summary: { totalSlides: 0, slideTypes: {}, errorCount: 1, warningCount: 0 }
            };
        }

        // Run all checks
        this.checkSlideCount(slides, issues, suggestions);
        this.checkEmptySlides(slides, issues);
        this.checkSlideOrder(slides, issues, suggestions);
        this.checkContentLength(slides, issues, suggestions);
        this.checkGeriatricsContent(slides, suggestions);
        this.checkSlideVariety(slides, suggestions);
        this.checkMedicationSafety(slides, issues, suggestions);
        this.checkAccessibility(slides, issues, suggestions);

        // Calculate score
        const score = this.calculateScore(slides, issues, suggestions);

        // Get timing estimate
        const timing = this.getTimingEstimate(slides);

        // Generate summary
        const slideTypes = {};
        slides.forEach(s => {
            slideTypes[s.type] = (slideTypes[s.type] || 0) + 1;
        });

        return {
            score,
            issues,
            suggestions,
            timing,
            summary: {
                totalSlides: slides.length,
                slideTypes,
                errorCount: issues.filter(i => i.severity === this.SEVERITY.ERROR).length,
                warningCount: issues.filter(i => i.severity === this.SEVERITY.WARNING).length,
                infoCount: suggestions.filter(s => s.severity === this.SEVERITY.INFO).length,
                tipCount: suggestions.filter(s => s.severity === this.SEVERITY.TIP).length
            },
            recommendedTypes: this.slideTypeRecommendations[presentationType] || []
        };
    }

    /**
     * Get just the score for a presentation
     */
    getScore(slides, presentationType) {
        const analysis = this.analyzePresentation(slides, presentationType);
        return {
            score: analysis.score,
            grade: this.getGrade(analysis.score),
            summary: `${analysis.summary.errorCount} errors, ${analysis.summary.warningCount} warnings`
        };
    }

    /**
     * Get improvement suggestions
     */
    getSuggestions(slides, presentationType) {
        const analysis = this.analyzePresentation(slides, presentationType);
        return {
            suggestions: analysis.suggestions,
            issues: analysis.issues,
            prioritizedActions: this.prioritizeActions(analysis.issues, analysis.suggestions)
        };
    }

    /**
     * Validate lab values in slides
     */
    validateLabValues(slides) {
        const allText = slides.map(s => this.getSlideText(s)).join(' ');
        const results = [];

        this.labPatterns.forEach(lab => {
            const matches = allText.matchAll(lab.pattern);
            for (const match of matches) {
                const value = parseFloat(match[1]);
                const status = (value >= lab.typical[0] && value <= lab.typical[1]) ? 'normal' :
                              (value < lab.typical[0]) ? 'low' : 'high';
                const unusual = value < lab.typical[0] * 0.1 || value > lab.typical[1] * 10;
                
                results.push({
                    name: lab.name,
                    value,
                    unit: lab.unit,
                    normalRange: `${lab.typical[0]}-${lab.typical[1]}`,
                    status,
                    unusual,
                    message: unusual ? `Value appears unusual - please verify` : null
                });
            }
        });

        return {
            labsFound: results.length,
            results,
            hasUnusualValues: results.some(r => r.unusual)
        };
    }

    /**
     * Check medication safety
     */
    checkMedicationSafety(slides, issues = [], suggestions = []) {
        const allText = slides.map(s => this.getSlideText(s)).join(' ').toLowerCase();
        const foundBeersMeds = [];
        const foundInteractions = [];

        // Check for Beers Criteria medications
        this.beersCriteria.forEach(med => {
            if (allText.includes(med.toLowerCase())) {
                foundBeersMeds.push(med);
            }
        });

        if (foundBeersMeds.length > 0) {
            suggestions.push({
                severity: this.SEVERITY.INFO,
                title: 'Beers Criteria medications detected',
                message: `Found potentially inappropriate medications: ${foundBeersMeds.slice(0, 3).join(', ')}`,
                recommendation: 'Consider discussing risks in older adults'
            });
        }

        // Check for drug interactions
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
            issues.push({
                severity: this.SEVERITY.WARNING,
                title: 'Potential drug interactions',
                message: `Detected interactions: ${foundInteractions.slice(0, 2).join('; ')}`
            });
        }

        return {
            beersCriteriaMeds: foundBeersMeds,
            drugInteractions: foundInteractions,
            hasSafetyIssues: foundBeersMeds.length > 0 || foundInteractions.length > 0
        };
    }

    /**
     * Get available templates
     */
    getTemplates() {
        return {
            presentationTypes: Object.keys(this.slideTypeRecommendations),
            slideTypes: {
                'case-presentation': this.slideTypeRecommendations['case-presentation'],
                'journal-club': this.slideTypeRecommendations['journal-club'],
                'lecture': this.slideTypeRecommendations['lecture']
            },
            geriatricsKeywords: this.geriatricsKeywords
        };
    }

    // Helper methods
    checkSlideCount(slides, issues, suggestions) {
        if (slides.length < 5) {
            suggestions.push({
                severity: this.SEVERITY.INFO,
                title: 'Short presentation',
                message: 'Consider adding more content for a comprehensive presentation'
            });
        }
        if (slides.length > 30) {
            suggestions.push({
                severity: this.SEVERITY.INFO,
                title: 'Long presentation',
                message: `${slides.length} slides may be too long to maintain audience attention`
            });
        }
    }

    checkEmptySlides(slides, issues) {
        slides.forEach((slide, index) => {
            if (this.isSlideEmpty(slide)) {
                issues.push({
                    severity: this.SEVERITY.WARNING,
                    title: 'Empty slide',
                    message: `Slide ${index + 1} appears to be empty`,
                    slideIndex: index
                });
            }
        });
    }

    checkSlideOrder(slides, issues, suggestions) {
        const slideTypes = slides.map(s => s.type);
        const titleIndex = slideTypes.indexOf('title');
        
        if (titleIndex > 0) {
            issues.push({
                severity: this.SEVERITY.WARNING,
                title: 'Title slide not first',
                message: 'Consider moving your title slide to the beginning'
            });
        }

        const lastSlideType = slideTypes[slideTypes.length - 1];
        if (slides.length > 3 && !['take-home', 'conclusion', 'references', 'questions'].includes(lastSlideType)) {
            suggestions.push({
                severity: this.SEVERITY.TIP,
                title: 'Add conclusion',
                message: 'Consider ending with a take-home or conclusion slide'
            });
        }
    }

    checkContentLength(slides, issues, suggestions) {
        slides.forEach((slide, index) => {
            const textLength = this.getSlideTextLength(slide);
            if (textLength > 800) {
                issues.push({
                    severity: this.SEVERITY.WARNING,
                    title: 'Too much text',
                    message: `Slide ${index + 1} has excessive text (${textLength} chars)`,
                    slideIndex: index
                });
            } else if (textLength > 500) {
                suggestions.push({
                    severity: this.SEVERITY.INFO,
                    title: 'Dense slide',
                    message: `Slide ${index + 1} is content-heavy`,
                    slideIndex: index
                });
            }
        });
    }

    checkGeriatricsContent(slides, suggestions) {
        const allText = slides.map(s => this.getSlideText(s)).join(' ').toLowerCase();
        let foundConcepts = 0;
        
        this.geriatricsKeywords.forEach(keyword => {
            if (allText.includes(keyword.toLowerCase())) {
                foundConcepts++;
            }
        });

        if (slides.length > 5 && foundConcepts < 3) {
            suggestions.push({
                severity: this.SEVERITY.TIP,
                title: 'Add geriatrics focus',
                message: 'Consider incorporating more geriatrics-specific concepts'
            });
        }
    }

    checkSlideVariety(slides, suggestions) {
        const typeCounts = {};
        slides.forEach(slide => {
            typeCounts[slide.type] = (typeCounts[slide.type] || 0) + 1;
        });

        Object.entries(typeCounts).forEach(([type, count]) => {
            if (count > 5 && !['content', 'bullet-points'].includes(type)) {
                suggestions.push({
                    severity: this.SEVERITY.INFO,
                    title: 'Slide variety',
                    message: `You have ${count} "${type}" slides. Consider varying slide types`
                });
            }
        });
    }

    checkAccessibility(slides, issues, suggestions) {
        slides.forEach((slide, index) => {
            const html = this.getSlideHTMLContent(slide);
            
            if (html.includes('<img') && !html.includes('alt=')) {
                suggestions.push({
                    severity: this.SEVERITY.TIP,
                    title: 'Missing alt text',
                    message: `Slide ${index + 1} has images without alt text`,
                    slideIndex: index
                });
            }

            if (/<font-size:\s*(8|9|10)px/i.test(html)) {
                issues.push({
                    severity: this.SEVERITY.WARNING,
                    title: 'Small font size',
                    message: `Slide ${index + 1} contains very small text`,
                    slideIndex: index
                });
            }
        });
    }

    calculateScore(slides, issues, suggestions) {
        let score = 100;
        
        // Deduct for errors
        const errorCount = issues.filter(i => i.severity === this.SEVERITY.ERROR).length;
        score -= Math.min(errorCount * 10, 40);
        
        // Deduct for warnings
        const warningCount = issues.filter(i => i.severity === this.SEVERITY.WARNING).length;
        score -= Math.min(warningCount * 5, 30);
        
        // Deduct for info issues
        const infoCount = suggestions.filter(s => s.severity === this.SEVERITY.INFO).length;
        score -= Math.min(infoCount * 2, 20);
        
        // Bonus for good practices
        const slideTypes = slides.map(s => s.type);
        if (slideTypes.includes('take-home') || slideTypes.includes('teaching-points')) score += 5;
        if (slideTypes.includes('references')) score += 3;
        if (slideTypes.includes('toc')) score += 2;

        return Math.max(0, Math.min(100, score));
    }

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
            formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`
        };
    }

    getGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    prioritizeActions(issues, suggestions) {
        const allItems = [
            ...issues.map(i => ({ ...i, type: 'issue' })),
            ...suggestions.map(s => ({ ...s, type: 'suggestion' }))
        ];

        const severityOrder = { error: 0, warning: 1, info: 2, tip: 3 };
        
        return allItems
            .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
            .slice(0, 5)
            .map(item => ({
                priority: severityOrder[item.severity] + 1,
                title: item.title,
                message: item.message,
                type: item.type
            }));
    }

    isSlideEmpty(slide) {
        return this.getSlideText(slide).trim().length < 10;
    }

    getSlideText(slide) {
        if (!slide) return '';
        const data = slide.data || slide;
        
        const textFields = ['title', 'subtitle', 'content', 'text', 'description',
            'chiefComplaint', 'history', 'assessment', 'plan', 'question',
            'findings', 'interpretation', 'notes', 'summary'];

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

        return text;
    }

    getSlideTextLength(slide) {
        return this.getSlideText(slide).length;
    }

    getSlideHTMLContent(slide) {
        if (!slide) return '';
        const data = slide.data || slide;
        let html = '';
        
        const htmlFields = ['content', 'leftContent', 'rightContent', 'description', 'body'];
        htmlFields.forEach(field => {
            if (data[field] && typeof data[field] === 'string') {
                html += ' ' + data[field];
            }
        });

        return html;
    }
}
