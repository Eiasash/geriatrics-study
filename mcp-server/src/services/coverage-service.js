/**
 * Coverage Service
 * 
 * Provides coverage enforcement and reporting functionality
 */

export class CoverageService {
    constructor() {
        // Configuration constants
        this.DEFAULT_THRESHOLD = 50;
        this.RATCHET_THRESHOLD_BUFFER = 2; // Coverage must exceed threshold by this amount to trigger ratchet

        // Default thresholds per component
        this.thresholds = {
            h5p: {
                branches: 50,
                functions: 50,
                lines: 50,
                statements: 50
            },
            anki: {
                branches: 70,
                functions: 70,
                lines: 70,
                statements: 70
            }
        };

        // Target thresholds (for improvement plan)
        this.targetThresholds = {
            h5p: {
                branches: 70,
                functions: 70,
                lines: 70,
                statements: 70
            },
            anki: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80
            }
        };

        // Files that commonly need better coverage
        this.priorityFiles = {
            h5p: [
                'build-h5p-questionset.js',
                'build-h5p-mega.js',
                'build-h5p.js'
            ],
            anki: [
                'build_apkg.py',
                'build_apkg_enhanced.py'
            ]
        };
    }

    /**
     * Generate a coverage report
     */
    generateReport(options) {
        const { component, coverage, threshold } = options;
        const metrics = ['branches', 'functions', 'lines', 'statements'];
        
        const results = {};
        let allPassing = true;
        let totalCoverage = 0;

        metrics.forEach(metric => {
            const current = coverage[metric] || 0;
            const required = threshold[metric] || this.thresholds[component]?.[metric] || this.DEFAULT_THRESHOLD;
            const passing = current >= required;
            
            if (!passing) allPassing = false;
            totalCoverage += current;

            results[metric] = {
                current,
                required,
                passing,
                gap: passing ? 0 : required - current,
                percentage: Math.round((current / required) * 100)
            };
        });

        const averageCoverage = totalCoverage / metrics.length;
        const targetThreshold = this.targetThresholds[component] || this.thresholds[component];
        const targetAverage = Object.values(targetThreshold).reduce((a, b) => a + b, 0) / metrics.length;

        return {
            component,
            passing: allPassing,
            status: allPassing ? 'success' : 'failure',
            averageCoverage: Math.round(averageCoverage * 10) / 10,
            targetAverage,
            progressToTarget: Math.round((averageCoverage / targetAverage) * 100),
            metrics: results,
            recommendations: this.generateRecommendations(component, results, coverage)
        };
    }

    /**
     * Check if coverage meets thresholds
     */
    checkThreshold(options) {
        const { component, coverage, threshold } = options;
        const report = this.generateReport({ component, coverage, threshold });

        return {
            passing: report.passing,
            failedMetrics: Object.entries(report.metrics)
                .filter(([, data]) => !data.passing)
                .map(([metric, data]) => ({
                    metric,
                    current: data.current,
                    required: data.required,
                    gap: data.gap
                })),
            message: report.passing 
                ? `✅ Coverage meets all thresholds (${report.averageCoverage}% average)`
                : `❌ Coverage below threshold - ${Object.values(report.metrics).filter(m => !m.passing).length} metrics failing`
        };
    }

    /**
     * Suggest files to improve coverage
     */
    suggestImprovements(options) {
        const { component, coverageData } = options;
        const suggestions = [];

        // Get priority files for component
        const priorityFiles = this.priorityFiles[component] || [];
        
        priorityFiles.forEach(file => {
            const fileCoverage = coverageData[file];
            if (!fileCoverage || fileCoverage.statements < this.DEFAULT_THRESHOLD) {
                suggestions.push({
                    file,
                    priority: 'high',
                    currentCoverage: fileCoverage?.statements || 0,
                    targetCoverage: 80,
                    suggestion: `Add unit tests for ${file}`,
                    estimatedEffort: 'medium',
                    potentialGain: '10-20% overall coverage improvement'
                });
            }
        });

        // Add general suggestions
        suggestions.push({
            type: 'general',
            priority: 'medium',
            suggestion: 'Add tests for error handling paths',
            estimatedEffort: 'low',
            potentialGain: '5-10% branch coverage improvement'
        });

        suggestions.push({
            type: 'general',
            priority: 'medium',
            suggestion: 'Mock external dependencies (fs, network)',
            estimatedEffort: 'medium',
            potentialGain: '10-15% function coverage improvement'
        });

        return {
            component,
            suggestions,
            nextMilestone: this.getNextMilestone(component, coverageData)
        };
    }

    /**
     * Get current thresholds
     */
    getThresholds() {
        return {
            current: this.thresholds,
            target: this.targetThresholds,
            description: 'Current thresholds are baseline. Target thresholds are the improvement goal.'
        };
    }

    /**
     * Get default threshold for a component
     */
    getDefaultThreshold(component) {
        return this.thresholds[component] || {
            branches: this.DEFAULT_THRESHOLD,
            functions: this.DEFAULT_THRESHOLD,
            lines: this.DEFAULT_THRESHOLD,
            statements: this.DEFAULT_THRESHOLD
        };
    }

    /**
     * Calculate ratchet thresholds (only increase, never decrease)
     */
    calculateRatchetThresholds(options) {
        const { component, currentCoverage } = options;
        const currentThreshold = this.thresholds[component] || this.getDefaultThreshold(component);
        const newThreshold = { ...currentThreshold };
        let updated = false;

        ['branches', 'functions', 'lines', 'statements'].forEach(metric => {
            const current = currentCoverage[metric] || 0;
            // Only increase if coverage exceeds threshold by the buffer amount
            if (current > currentThreshold[metric] + this.RATCHET_THRESHOLD_BUFFER) {
                newThreshold[metric] = Math.floor(current);
                updated = true;
            }
        });

        return {
            component,
            previousThreshold: currentThreshold,
            newThreshold,
            updated,
            message: updated 
                ? '📈 Thresholds updated based on improved coverage!'
                : 'No threshold changes needed - keep improving coverage'
        };
    }

    /**
     * Generate recommendations based on coverage results
     */
    generateRecommendations(component, metrics, coverage) {
        const recommendations = [];

        // Check which metrics are failing
        if (!metrics.branches.passing) {
            recommendations.push({
                metric: 'branches',
                action: 'Add tests for conditional logic and error handling',
                priority: 'high'
            });
        }

        if (!metrics.functions.passing) {
            recommendations.push({
                metric: 'functions',
                action: 'Create tests for untested functions',
                priority: 'high'
            });
        }

        if (!metrics.lines.passing) {
            recommendations.push({
                metric: 'lines',
                action: 'Increase test coverage for main code paths',
                priority: 'medium'
            });
        }

        // Add component-specific recommendations
        if (component === 'h5p') {
            recommendations.push({
                type: 'component-specific',
                action: 'Test H5P package generation with mock fs-extra',
                priority: 'high'
            });
        }

        if (component === 'anki') {
            recommendations.push({
                type: 'component-specific',
                action: 'Test Anki deck building with sample data',
                priority: 'high'
            });
        }

        return recommendations;
    }

    /**
     * Get next milestone for coverage improvement
     */
    getNextMilestone(component, coverageData) {
        const target = this.targetThresholds[component] || this.thresholds[component];
        const current = this.thresholds[component] || this.getDefaultThreshold(component);
        
        // Calculate next 5% milestone
        const avgCurrent = Object.values(current).reduce((a, b) => a + b, 0) / 4;
        const avgTarget = Object.values(target).reduce((a, b) => a + b, 0) / 4;
        
        const nextMilestone = Math.min(avgCurrent + 5, avgTarget);

        return {
            currentAverage: avgCurrent,
            nextMilestone,
            targetAverage: avgTarget,
            remainingToTarget: avgTarget - avgCurrent,
            message: `Next milestone: ${nextMilestone}% average coverage`
        };
    }
}
