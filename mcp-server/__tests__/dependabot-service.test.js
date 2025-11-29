/**
 * Tests for Dependabot Service
 */

import { DependabotService } from '../src/services/dependabot-service.js';

describe('DependabotService', () => {
    let service;

    beforeEach(() => {
        service = new DependabotService();
    });

    describe('analyzePR', () => {
        test('should approve minor version updates', () => {
            const result = service.analyzePR({
                prTitle: 'Bump lodash from 4.17.20 to 4.17.21',
                labels: ['dependencies'],
                files: ['package.json', 'package-lock.json']
            });

            expect(result.shouldApprove).toBe(true);
            expect(result.updateType).toBe('patch');
            expect(result.confidence).toBeGreaterThan(0);
        });

        test('should not approve major version updates', () => {
            const result = service.analyzePR({
                prTitle: 'Bump express from 4.18.2 to 5.0.0',
                labels: ['dependencies'],
                files: ['package.json', 'package-lock.json']
            });

            expect(result.shouldApprove).toBe(false);
            expect(result.updateType).toBe('major');
            expect(result.reason).toContain('Major update');
        });

        test('should always approve security updates', () => {
            const result = service.analyzePR({
                prTitle: 'Bump lodash from 4.17.20 to 4.17.21 [security]',
                labels: ['security'],
                files: ['package.json']
            });

            expect(result.shouldApprove).toBe(true);
            expect(result.reason).toContain('Security');
        });

        test('should block PRs with do-not-merge label', () => {
            const result = service.analyzePR({
                prTitle: 'Bump lodash from 4.17.20 to 4.17.21',
                labels: ['dependencies', 'do-not-merge'],
                files: ['package.json']
            });

            expect(result.shouldApprove).toBe(false);
            expect(result.reason).toContain('Blocked by label');
        });

        test('should handle PRs with too many files changed', () => {
            const result = service.analyzePR({
                prTitle: 'Bump lodash from 4.17.20 to 4.17.21',
                labels: ['dependencies'],
                files: ['file1.js', 'file2.js', 'file3.js', 'file4.js', 'file5.js', 'file6.js']
            });

            expect(result.shouldApprove).toBe(false);
            expect(result.reason).toContain('Too many files');
        });
    });

    describe('parseTitle', () => {
        test('should parse package info from title', () => {
            const result = service.parseTitle('Bump express from 4.18.0 to 4.18.2 in /h5p');

            expect(result.packageName).toBe('express');
            expect(result.oldVersion).toBe('4.18.0');
            expect(result.newVersion).toBe('4.18.2');
            expect(result.ecosystem).toBe('npm');
        });

        test('should detect npm ecosystem from directory', () => {
            const result = service.parseTitle('Bump lodash in /h5p');
            expect(result.ecosystem).toBe('npm');
        });

        test('should detect pip ecosystem', () => {
            const result = service.parseTitle('Bump requests in /anki');
            expect(result.ecosystem).toBe('pip');
        });

        test('should handle empty title', () => {
            const result = service.parseTitle('');
            expect(result.packageName).toBeNull();
        });
    });

    describe('determineUpdateType', () => {
        test('should detect major update', () => {
            expect(service.determineUpdateType('1.0.0', '2.0.0')).toBe('major');
        });

        test('should detect minor update', () => {
            expect(service.determineUpdateType('1.0.0', '1.1.0')).toBe('minor');
        });

        test('should detect patch update', () => {
            expect(service.determineUpdateType('1.0.0', '1.0.1')).toBe('patch');
        });

        test('should handle missing versions', () => {
            expect(service.determineUpdateType(null, null)).toBe('unknown');
        });
    });

    describe('getRules', () => {
        test('should return current rules', () => {
            const rules = service.getRules();

            expect(rules.allowedEcosystems).toContain('npm');
            expect(rules.allowedUpdateTypes).toContain('patch');
            expect(rules.blockingLabels).toContain('do-not-merge');
        });
    });
});
