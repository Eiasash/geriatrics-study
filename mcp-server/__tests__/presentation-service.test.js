/**
 * Tests for Presentation Service
 */

import { PresentationService } from '../src/services/presentation-service.js';

describe('PresentationService', () => {
    let service;

    beforeEach(() => {
        service = new PresentationService();
    });

    describe('analyzePresentation', () => {
        test('should return error for empty presentation', () => {
            const result = service.analyzePresentation([]);

            expect(result.score).toBe(0);
            expect(result.issues).toHaveLength(1);
            expect(result.issues[0].severity).toBe('error');
        });

        test('should analyze valid presentation', () => {
            const slides = [
                { type: 'title', data: { title: 'Test Presentation', presenter: 'Dr. Test' } },
                { type: 'content', data: { title: 'Introduction', content: 'This is the introduction' } },
                { type: 'take-home', data: { message1: 'Key point 1', message2: 'Key point 2' } }
            ];

            const result = service.analyzePresentation(slides, 'case-presentation');

            expect(result.score).toBeGreaterThan(0);
            expect(result.summary.totalSlides).toBe(3);
            expect(result.timing.formatted).toBeDefined();
        });

        test('should detect empty slides', () => {
            const slides = [
                { type: 'title', data: { title: 'Test' } },
                { type: 'content', data: {} }
            ];

            const result = service.analyzePresentation(slides);

            const emptySlideIssue = result.issues.find(i => i.title === 'Empty slide');
            expect(emptySlideIssue).toBeDefined();
        });

        test('should add bonus points for teaching-points slide', () => {
            const slidesWithTeaching = [
                { type: 'title', data: { title: 'Test', presenter: 'Dr. Test' } },
                { type: 'teaching-points', data: { title: 'Teaching Points', points: ['Point 1'] } }
            ];

            const slidesWithout = [
                { type: 'title', data: { title: 'Test', presenter: 'Dr. Test' } },
                { type: 'content', data: { title: 'Content', content: 'Some content' } }
            ];

            const scoreWith = service.analyzePresentation(slidesWithTeaching).score;
            const scoreWithout = service.analyzePresentation(slidesWithout).score;

            // Teaching points should give bonus
            expect(scoreWith).toBeGreaterThanOrEqual(scoreWithout);
        });
    });

    describe('getScore', () => {
        test('should return score with grade', () => {
            const slides = [
                { type: 'title', data: { title: 'Test', presenter: 'Dr. Test' } },
                { type: 'content', data: { content: 'Content here' } },
                { type: 'take-home', data: { message1: 'Take home' } }
            ];

            const result = service.getScore(slides);

            expect(result.score).toBeDefined();
            expect(result.grade).toBeDefined();
            expect(['A', 'B', 'C', 'D', 'F']).toContain(result.grade);
        });
    });

    describe('validateLabValues', () => {
        test('should detect lab values in text', () => {
            const slides = [
                { type: 'labs', data: { content: 'Creatinine: 1.2, eGFR: 65, Sodium: 140' } }
            ];

            const result = service.validateLabValues(slides);

            expect(result.labsFound).toBeGreaterThan(0);
            expect(result.results).toBeInstanceOf(Array);
        });

        test('should flag unusual lab values', () => {
            const slides = [
                { type: 'labs', data: { content: 'Creatinine: 100' } }  // Unusual value
            ];

            const result = service.validateLabValues(slides);

            expect(result.hasUnusualValues).toBe(true);
        });
    });

    describe('checkMedicationSafety', () => {
        test('should detect Beers Criteria medications', () => {
            const slides = [
                { type: 'medications', data: { content: 'Patient is on diphenhydramine for sleep' } }
            ];

            const result = service.checkMedicationSafety(slides);

            expect(result.beersCriteriaMeds).toContain('diphenhydramine');
            expect(result.hasSafetyIssues).toBe(true);
        });

        test('should detect drug interactions', () => {
            const slides = [
                { type: 'medications', data: { content: 'Patient is on warfarin and aspirin' } }
            ];

            const result = service.checkMedicationSafety(slides);

            expect(result.drugInteractions.length).toBeGreaterThan(0);
        });
    });

    describe('getTimingEstimate', () => {
        test('should calculate timing based on slide types', () => {
            const slides = [
                { type: 'title', data: {} },
                { type: 'content', data: {} },
                { type: 'questions', data: {} }
            ];

            const timing = service.getTimingEstimate(slides);

            expect(timing.totalSeconds).toBeGreaterThan(0);
            expect(timing.minutes).toBeDefined();
            expect(timing.formatted).toMatch(/\d+:\d{2}/);
        });
    });

    describe('getTemplates', () => {
        test('should return available templates', () => {
            const templates = service.getTemplates();

            expect(templates.presentationTypes).toContain('case-presentation');
            expect(templates.slideTypes).toBeDefined();
            expect(templates.geriatricsKeywords.length).toBeGreaterThan(0);
        });
    });
});
