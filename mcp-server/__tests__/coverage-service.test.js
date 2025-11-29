/**
 * Tests for Coverage Service
 */

import { CoverageService } from '../src/services/coverage-service.js';

describe('CoverageService', () => {
    let service;

    beforeEach(() => {
        service = new CoverageService();
    });

    describe('generateReport', () => {
        test('should generate passing report when coverage meets thresholds', () => {
            const result = service.generateReport({
                component: 'h5p',
                coverage: {
                    branches: 60,
                    functions: 60,
                    lines: 60,
                    statements: 60
                },
                threshold: {
                    branches: 50,
                    functions: 50,
                    lines: 50,
                    statements: 50
                }
            });

            expect(result.passing).toBe(true);
            expect(result.status).toBe('success');
            expect(result.averageCoverage).toBe(60);
        });

        test('should generate failing report when coverage below thresholds', () => {
            const result = service.generateReport({
                component: 'h5p',
                coverage: {
                    branches: 40,
                    functions: 40,
                    lines: 40,
                    statements: 40
                },
                threshold: {
                    branches: 50,
                    functions: 50,
                    lines: 50,
                    statements: 50
                }
            });

            expect(result.passing).toBe(false);
            expect(result.status).toBe('failure');
        });

        test('should include recommendations', () => {
            const result = service.generateReport({
                component: 'h5p',
                coverage: { branches: 40, functions: 40, lines: 40, statements: 40 },
                threshold: { branches: 50, functions: 50, lines: 50, statements: 50 }
            });

            expect(result.recommendations.length).toBeGreaterThan(0);
        });
    });

    describe('checkThreshold', () => {
        test('should return passing result when thresholds met', () => {
            const result = service.checkThreshold({
                component: 'anki',
                coverage: { branches: 80, functions: 80, lines: 80, statements: 80 },
                threshold: { branches: 70, functions: 70, lines: 70, statements: 70 }
            });

            expect(result.passing).toBe(true);
            expect(result.message).toContain('✅');
        });

        test('should return failing metrics when below threshold', () => {
            const result = service.checkThreshold({
                component: 'h5p',
                coverage: { branches: 30, functions: 60, lines: 60, statements: 60 },
                threshold: { branches: 50, functions: 50, lines: 50, statements: 50 }
            });

            expect(result.passing).toBe(false);
            expect(result.failedMetrics.length).toBe(1);
            expect(result.failedMetrics[0].metric).toBe('branches');
        });
    });

    describe('suggestImprovements', () => {
        test('should provide suggestions for h5p component', () => {
            const result = service.suggestImprovements({
                component: 'h5p',
                coverageData: {}
            });

            expect(result.suggestions.length).toBeGreaterThan(0);
            expect(result.nextMilestone).toBeDefined();
        });

        test('should provide suggestions for anki component', () => {
            const result = service.suggestImprovements({
                component: 'anki',
                coverageData: {}
            });

            expect(result.suggestions.length).toBeGreaterThan(0);
        });
    });

    describe('getThresholds', () => {
        test('should return current and target thresholds', () => {
            const thresholds = service.getThresholds();

            expect(thresholds.current).toBeDefined();
            expect(thresholds.target).toBeDefined();
            expect(thresholds.current.h5p).toBeDefined();
            expect(thresholds.current.anki).toBeDefined();
        });
    });

    describe('calculateRatchetThresholds', () => {
        test('should increase thresholds when coverage exceeds by 2%', () => {
            const result = service.calculateRatchetThresholds({
                component: 'h5p',
                currentCoverage: { branches: 60, functions: 60, lines: 60, statements: 60 }
            });

            expect(result.updated).toBe(true);
            expect(result.newThreshold.branches).toBeGreaterThan(result.previousThreshold.branches);
        });

        test('should not change thresholds when coverage is below threshold + 2', () => {
            const result = service.calculateRatchetThresholds({
                component: 'h5p',
                currentCoverage: { branches: 51, functions: 51, lines: 51, statements: 51 }
            });

            expect(result.updated).toBe(false);
        });
    });

    describe('getDefaultThreshold', () => {
        test('should return default threshold for known component', () => {
            const threshold = service.getDefaultThreshold('h5p');

            expect(threshold.branches).toBe(50);
            expect(threshold.functions).toBe(50);
        });

        test('should return fallback threshold for unknown component', () => {
            const threshold = service.getDefaultThreshold('unknown');

            expect(threshold.branches).toBe(50);
        });
    });
});
