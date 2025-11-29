// SZMC Geriatrics Presentation Maker - Presentation Analytics Dashboard

class PresentationAnalytics {
    constructor() {
        this.wordWeights = {
            title: 2.5,
            heading: 1.5,
            body: 1.0,
            caption: 0.5
        };
        this.readingSpeed = 150; // words per minute
        this.slideTimeEstimates = {
            title: 30,          // 30 seconds
            'jc-title': 30,
            'section-header': 15,
            content: 90,        // 1.5 minutes
            'patient-info': 120,
            hpi: 120,
            differential: 90,
            diagnosis: 90,
            treatment: 120,
            'geriatric-assessment': 120,
            'teaching-points': 90,
            references: 45,
            questions: 60
        };
    }

    /**
     * Analyze a presentation and return comprehensive statistics
     * @param {Object} presentation - Presentation object
     * @returns {Object} Analytics data
     */
    analyze(presentation) {
        if (!presentation || !presentation.slides) {
            return this.getEmptyAnalytics();
        }

        const slides = presentation.slides;
        
        return {
            overview: this.getOverview(presentation),
            slideBreakdown: this.getSlideBreakdown(slides),
            contentAnalysis: this.getContentAnalysis(slides),
            timing: this.getTimingAnalysis(slides),
            balance: this.getBalanceAnalysis(slides),
            completeness: this.getCompletenessScore(slides, presentation.type)
        };
    }

    /**
     * Get presentation overview statistics
     * @param {Object} presentation - Presentation object
     * @returns {Object} Overview stats
     */
    getOverview(presentation) {
        const slides = presentation.slides;
        
        return {
            title: presentation.title || 'Untitled',
            type: presentation.type,
            slideCount: slides.length,
            createdAt: presentation.createdAt,
            lastModified: new Date().toISOString()
        };
    }

    /**
     * Get slide type breakdown
     * @param {Array} slides - Array of slides
     * @returns {Object} Slide type statistics
     */
    getSlideBreakdown(slides) {
        const typeCount = {};
        const typeCategories = {
            title: ['title', 'jc-title'],
            content: ['content', 'hpi', 'pmh', 'medications', 'physical-exam', 'labs'],
            assessment: ['geriatric-assessment', 'differential', 'diagnosis', 'treatment'],
            visual: ['statistics-visual', 'timeline-visual', 'algorithm', 'pathophysiology'],
            summary: ['teaching-points', 'take-home', 'questions', 'references']
        };

        slides.forEach(slide => {
            typeCount[slide.type] = (typeCount[slide.type] || 0) + 1;
        });

        const categoryCount = {};
        Object.entries(typeCategories).forEach(([category, types]) => {
            categoryCount[category] = types.reduce((sum, type) => sum + (typeCount[type] || 0), 0);
        });

        return {
            byType: typeCount,
            byCategory: categoryCount,
            uniqueTypes: Object.keys(typeCount).length
        };
    }

    /**
     * Get content analysis
     * @param {Array} slides - Array of slides
     * @returns {Object} Content statistics
     */
    getContentAnalysis(slides) {
        let totalWords = 0;
        let totalCharacters = 0;
        const wordsBySlide = [];
        let imagesCount = 0;
        let tablesCount = 0;
        let listsCount = 0;

        slides.forEach((slide, index) => {
            const slideText = this.extractSlideText(slide);
            const words = this.countWords(slideText);
            const chars = slideText.length;
            
            totalWords += words;
            totalCharacters += chars;
            wordsBySlide.push({ index: index + 1, words, type: slide.type });

            // Count elements
            const html = JSON.stringify(slide.data);
            imagesCount += (html.match(/<img/gi) || []).length;
            tablesCount += (html.match(/<table/gi) || []).length;
            listsCount += (html.match(/<ul|<ol/gi) || []).length;
        });

        const avgWordsPerSlide = slides.length > 0 ? Math.round(totalWords / slides.length) : 0;
        const maxWordsSlide = wordsBySlide.reduce((max, s) => s.words > max.words ? s : max, { words: 0 });
        const minWordsSlide = wordsBySlide.reduce((min, s) => s.words < min.words ? s : min, { words: Infinity });

        return {
            totalWords,
            totalCharacters,
            avgWordsPerSlide,
            maxWords: maxWordsSlide,
            minWords: minWordsSlide.words === Infinity ? { words: 0 } : minWordsSlide,
            wordsBySlide,
            elements: {
                images: imagesCount,
                tables: tablesCount,
                lists: listsCount
            }
        };
    }

    /**
     * Get timing analysis
     * @param {Array} slides - Array of slides
     * @returns {Object} Timing statistics
     */
    getTimingAnalysis(slides) {
        let totalSeconds = 0;
        const timingBySlide = [];

        slides.forEach((slide, index) => {
            // Base time for slide type
            const baseTime = this.slideTimeEstimates[slide.type] || 60;
            
            // Adjust for content length
            const text = this.extractSlideText(slide);
            const words = this.countWords(text);
            const readingTime = Math.ceil((words / this.readingSpeed) * 60);
            
            // Combine estimates
            const slideTime = Math.max(baseTime, readingTime);
            totalSeconds += slideTime;

            timingBySlide.push({
                index: index + 1,
                type: slide.type,
                seconds: slideTime,
                formatted: this.formatTime(slideTime)
            });
        });

        const avgSecondsPerSlide = slides.length > 0 ? Math.round(totalSeconds / slides.length) : 0;

        return {
            totalSeconds,
            totalFormatted: this.formatTime(totalSeconds),
            avgSecondsPerSlide,
            avgFormatted: this.formatTime(avgSecondsPerSlide),
            timingBySlide,
            recommendedTime: this.getRecommendedTime(slides.length)
        };
    }

    /**
     * Get balance analysis (text vs visuals)
     * @param {Array} slides - Array of slides
     * @returns {Object} Balance statistics
     */
    getBalanceAnalysis(slides) {
        const visualSlideTypes = ['statistics-visual', 'timeline-visual', 'algorithm', 'pathophysiology', 'key-points-visual'];
        const titleSlideTypes = ['title', 'jc-title', 'section-header', 'questions'];
        
        let visualSlides = 0;
        let textHeavySlides = 0;
        let titleSlides = 0;
        let contentSlides = 0;

        slides.forEach(slide => {
            if (titleSlideTypes.includes(slide.type)) {
                titleSlides++;
            } else if (visualSlideTypes.includes(slide.type)) {
                visualSlides++;
                contentSlides++;
            } else {
                const text = this.extractSlideText(slide);
                const words = this.countWords(text);
                if (words > 100) {
                    textHeavySlides++;
                }
                contentSlides++;
            }
        });

        const visualRatio = contentSlides > 0 ? (visualSlides / contentSlides * 100).toFixed(1) : 0;
        const textHeavyRatio = contentSlides > 0 ? (textHeavySlides / contentSlides * 100).toFixed(1) : 0;

        let balanceScore = 100;
        let recommendations = [];

        // Penalize for too much text
        if (textHeavyRatio > 50) {
            balanceScore -= 20;
            recommendations.push('Consider adding more visual slides');
        }

        // Penalize for too few visuals
        if (visualRatio < 15 && contentSlides > 5) {
            balanceScore -= 15;
            recommendations.push('Add visual elements to break up text');
        }

        // Penalize for missing title slides
        if (titleSlides === 0) {
            balanceScore -= 10;
            recommendations.push('Add a title slide');
        }

        return {
            visualSlides,
            textHeavySlides,
            titleSlides,
            contentSlides,
            visualRatio: parseFloat(visualRatio),
            textHeavyRatio: parseFloat(textHeavyRatio),
            score: Math.max(0, balanceScore),
            recommendations
        };
    }

    /**
     * Get completeness score based on presentation type
     * @param {Array} slides - Array of slides
     * @param {string} type - Presentation type
     * @returns {Object} Completeness analysis
     */
    getCompletenessScore(slides, type) {
        const slideTypes = slides.map(s => s.type);
        let requiredSlides = [];
        let optionalSlides = [];

        if (type === 'case') {
            requiredSlides = [
                { type: 'title', label: 'Title Slide' },
                { type: 'patient-info', label: 'Patient Information' },
                { type: 'hpi', label: 'History of Present Illness' },
                { type: 'diagnosis', label: 'Diagnosis' },
                { type: 'treatment', label: 'Treatment Plan' }
            ];
            optionalSlides = [
                { type: 'geriatric-assessment', label: 'Geriatric Assessment' },
                { type: 'differential', label: 'Differential Diagnosis' },
                { type: 'teaching-points', label: 'Teaching Points' },
                { type: 'questions', label: 'Questions Slide' }
            ];
        } else if (type === 'journal') {
            requiredSlides = [
                { type: 'jc-title', label: 'Title Slide' },
                { type: 'jc-background', label: 'Background/Rationale' },
                { type: 'jc-methods', label: 'Study Methods' },
                { type: 'jc-results', label: 'Results' },
                { type: 'jc-conclusion', label: 'Conclusions' }
            ];
            optionalSlides = [
                { type: 'jc-pico', label: 'PICO Framework' },
                { type: 'jc-limitations', label: 'Limitations' },
                { type: 'jc-applicability', label: 'Clinical Applicability' },
                { type: 'questions', label: 'Questions Slide' }
            ];
        }

        const present = [];
        const missing = [];

        requiredSlides.forEach(req => {
            if (slideTypes.includes(req.type)) {
                present.push(req);
            } else {
                missing.push(req);
            }
        });

        const optionalPresent = optionalSlides.filter(opt => slideTypes.includes(opt.type));
        const optionalMissing = optionalSlides.filter(opt => !slideTypes.includes(opt.type));

        const requiredScore = requiredSlides.length > 0 ? 
            Math.round((present.length / requiredSlides.length) * 100) : 100;
        const optionalScore = optionalSlides.length > 0 ?
            Math.round((optionalPresent.length / optionalSlides.length) * 100) : 100;

        const overallScore = Math.round(requiredScore * 0.7 + optionalScore * 0.3);

        return {
            requiredPresent: present,
            requiredMissing: missing,
            optionalPresent,
            optionalMissing,
            requiredScore,
            optionalScore,
            overallScore
        };
    }

    /**
     * Extract plain text from a slide
     * @param {Object} slide - Slide object
     * @returns {string} Plain text content
     */
    extractSlideText(slide) {
        if (!slide.data) return '';
        
        let text = '';
        Object.values(slide.data).forEach(value => {
            if (typeof value === 'string') {
                // Strip HTML tags
                const plainText = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                text += plainText + ' ';
            }
        });
        
        return text.trim();
    }

    /**
     * Count words in text
     * @param {string} text - Text to count
     * @returns {number} Word count
     */
    countWords(text) {
        if (!text) return 0;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Format seconds to MM:SS
     * @param {number} seconds - Total seconds
     * @returns {string} Formatted time
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Get recommended presentation time
     * @param {number} slideCount - Number of slides
     * @returns {Object} Time recommendation
     */
    getRecommendedTime(slideCount) {
        const minTime = slideCount * 45;  // 45 sec/slide minimum
        const maxTime = slideCount * 120; // 2 min/slide maximum
        const idealTime = slideCount * 90; // 1.5 min/slide ideal

        return {
            min: this.formatTime(minTime),
            max: this.formatTime(maxTime),
            ideal: this.formatTime(idealTime),
            seconds: { min: minTime, max: maxTime, ideal: idealTime }
        };
    }

    /**
     * Get empty analytics object
     * @returns {Object} Empty analytics
     */
    getEmptyAnalytics() {
        return {
            overview: { slideCount: 0, title: '', type: '' },
            slideBreakdown: { byType: {}, byCategory: {}, uniqueTypes: 0 },
            contentAnalysis: { totalWords: 0, avgWordsPerSlide: 0, wordsBySlide: [] },
            timing: { totalSeconds: 0, totalFormatted: '0:00' },
            balance: { score: 0, recommendations: [] },
            completeness: { overallScore: 0, requiredMissing: [], requiredPresent: [] }
        };
    }

    /**
     * Open analytics modal
     */
    openModal() {
        if (!window.editor || !window.editor.slides) {
            alert('No presentation loaded');
            return;
        }

        const presentation = window.editor.getPresentation();
        const analytics = this.analyze(presentation);
        this.renderModal(analytics);
    }

    /**
     * Render the analytics modal
     * @param {Object} analytics - Analytics data
     */
    renderModal(analytics) {
        const existingModal = document.getElementById('analytics-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'analytics-modal';
        modal.className = 'modal active';
        
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="presentationAnalytics.closeModal()"></div>
            <div class="modal-content analytics-modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-chart-bar"></i> Presentation Analytics</h2>
                    <button class="modal-close" onclick="presentationAnalytics.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.renderAnalyticsContent(analytics)}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Render analytics content
     * @param {Object} analytics - Analytics data
     * @returns {string} HTML content
     */
    renderAnalyticsContent(analytics) {
        return `
            <!-- Overview Cards -->
            <div class="analytics-overview">
                <div class="analytics-card">
                    <div class="analytics-card-icon">
                        <i class="fas fa-copy"></i>
                    </div>
                    <div class="analytics-card-content">
                        <span class="analytics-value">${analytics.overview.slideCount}</span>
                        <span class="analytics-label">Slides</span>
                    </div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-card-icon">
                        <i class="fas fa-file-word"></i>
                    </div>
                    <div class="analytics-card-content">
                        <span class="analytics-value">${analytics.contentAnalysis.totalWords}</span>
                        <span class="analytics-label">Words</span>
                    </div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-card-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="analytics-card-content">
                        <span class="analytics-value">${analytics.timing.totalFormatted}</span>
                        <span class="analytics-label">Est. Duration</span>
                    </div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-card-icon">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <div class="analytics-card-content">
                        <span class="analytics-value">${analytics.completeness.overallScore}%</span>
                        <span class="analytics-label">Completeness</span>
                    </div>
                </div>
            </div>

            <!-- Balance Score -->
            <div class="analytics-section">
                <h3><i class="fas fa-balance-scale"></i> Content Balance</h3>
                <div class="balance-meter">
                    <div class="balance-bar" style="width: ${analytics.balance.score}%"></div>
                    <span class="balance-score">${analytics.balance.score}%</span>
                </div>
                <div class="balance-details">
                    <span><i class="fas fa-image"></i> ${analytics.balance.visualSlides} visual slides (${analytics.balance.visualRatio}%)</span>
                    <span><i class="fas fa-align-left"></i> ${analytics.balance.textHeavySlides} text-heavy slides</span>
                </div>
                ${analytics.balance.recommendations.length > 0 ? `
                    <div class="analytics-recommendations">
                        <strong>Recommendations:</strong>
                        <ul>
                            ${analytics.balance.recommendations.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>

            <!-- Completeness -->
            <div class="analytics-section">
                <h3><i class="fas fa-tasks"></i> Completeness Check</h3>
                <div class="completeness-grid">
                    <div class="completeness-column present">
                        <h4><i class="fas fa-check-circle"></i> Present</h4>
                        ${analytics.completeness.requiredPresent.map(s => `<span class="slide-tag">${s.label}</span>`).join('')}
                        ${analytics.completeness.optionalPresent.map(s => `<span class="slide-tag optional">${s.label}</span>`).join('')}
                    </div>
                    <div class="completeness-column missing">
                        <h4><i class="fas fa-exclamation-circle"></i> Consider Adding</h4>
                        ${analytics.completeness.requiredMissing.map(s => `<span class="slide-tag required">${s.label}</span>`).join('')}
                        ${analytics.completeness.optionalMissing.map(s => `<span class="slide-tag optional">${s.label}</span>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Timing Breakdown -->
            <div class="analytics-section">
                <h3><i class="fas fa-stopwatch"></i> Timing Estimate</h3>
                <div class="timing-info">
                    <p>
                        <strong>Total:</strong> ${analytics.timing.totalFormatted} 
                        <span class="timing-hint">(avg ${analytics.timing.avgFormatted}/slide)</span>
                    </p>
                    <p>
                        <strong>Recommended:</strong> ${analytics.timing.recommendedTime.min} - ${analytics.timing.recommendedTime.max}
                    </p>
                </div>
            </div>

            <!-- Word Count by Slide -->
            <div class="analytics-section">
                <h3><i class="fas fa-chart-line"></i> Words per Slide</h3>
                <div class="word-chart">
                    ${analytics.contentAnalysis.wordsBySlide.map(s => {
                        const height = Math.min(100, Math.max(10, s.words / 2));
                        const color = s.words > 150 ? '#ef4444' : s.words > 100 ? '#f59e0b' : '#10b981';
                        return `<div class="word-bar" style="height: ${height}px; background: ${color};" title="Slide ${s.index}: ${s.words} words"></div>`;
                    }).join('')}
                </div>
                <div class="word-chart-legend">
                    <span>Avg: ${analytics.contentAnalysis.avgWordsPerSlide} words/slide</span>
                    <span class="legend-colors">
                        <span class="legend-item"><span class="legend-dot" style="background: #10b981;"></span> Good (&lt;100)</span>
                        <span class="legend-item"><span class="legend-dot" style="background: #f59e0b;"></span> Dense (100-150)</span>
                        <span class="legend-item"><span class="legend-dot" style="background: #ef4444;"></span> Heavy (&gt;150)</span>
                    </span>
                </div>
            </div>
        `;
    }

    /**
     * Close the modal
     */
    closeModal() {
        const modal = document.getElementById('analytics-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// Create global instance
const presentationAnalytics = new PresentationAnalytics();

// Make globally available
if (typeof window !== 'undefined') {
    window.presentationAnalytics = presentationAnalytics;
}
