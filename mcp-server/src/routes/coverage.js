/**
 * Coverage Report Router
 * 
 * Provides endpoints for coverage enforcement and reporting
 */

import express from 'express';
import { CoverageService } from '../services/coverage-service.js';

const router = express.Router();
const coverageService = new CoverageService();

/**
 * POST /coverage-report
 * Generate a coverage report and check enforcement
 */
router.post('/', async (req, res) => {
    try {
        const { component, coverage, threshold } = req.body;

        if (!component) {
            return res.status(400).json({
                error: 'Missing required field',
                message: 'component is required (h5p or anki)'
            });
        }

        const report = coverageService.generateReport({
            component,
            coverage: coverage || {},
            threshold: threshold || coverageService.getDefaultThreshold(component)
        });

        res.json(report);
    } catch (error) {
        console.error('Error generating coverage report:', error);
        res.status(500).json({
            error: 'Report generation failed',
            message: error.message
        });
    }
});

/**
 * POST /coverage-report/check
 * Check if coverage meets thresholds
 */
router.post('/check', async (req, res) => {
    try {
        const { component, coverage, threshold } = req.body;

        if (!component || !coverage) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'component and coverage are required'
            });
        }

        const result = coverageService.checkThreshold({
            component,
            coverage,
            threshold: threshold || coverageService.getDefaultThreshold(component)
        });

        res.json(result);
    } catch (error) {
        console.error('Error checking coverage:', error);
        res.status(500).json({
            error: 'Coverage check failed',
            message: error.message
        });
    }
});

/**
 * POST /coverage-report/suggest
 * Suggest files to improve coverage
 */
router.post('/suggest', async (req, res) => {
    try {
        const { component, coverageData } = req.body;

        if (!component) {
            return res.status(400).json({
                error: 'Missing required field',
                message: 'component is required'
            });
        }

        const suggestions = coverageService.suggestImprovements({
            component,
            coverageData: coverageData || {}
        });

        res.json(suggestions);
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({
            error: 'Suggestion generation failed',
            message: error.message
        });
    }
});

/**
 * GET /coverage-report/thresholds
 * Get current coverage thresholds
 */
router.get('/thresholds', (req, res) => {
    res.json(coverageService.getThresholds());
});

/**
 * POST /coverage-report/ratchet
 * Calculate new thresholds based on current coverage (ratchet up)
 */
router.post('/ratchet', async (req, res) => {
    try {
        const { component, currentCoverage } = req.body;

        if (!component || !currentCoverage) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'component and currentCoverage are required'
            });
        }

        const newThresholds = coverageService.calculateRatchetThresholds({
            component,
            currentCoverage
        });

        res.json(newThresholds);
    } catch (error) {
        console.error('Error calculating ratchet thresholds:', error);
        res.status(500).json({
            error: 'Ratchet calculation failed',
            message: error.message
        });
    }
});

export { router as coverageRouter };
