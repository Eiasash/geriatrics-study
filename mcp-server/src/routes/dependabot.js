/**
 * Dependabot Review Router
 * 
 * Provides endpoints for analyzing and auto-approving Dependabot PRs
 */

import express from 'express';
import { DependabotService } from '../services/dependabot-service.js';

const router = express.Router();
const dependabotService = new DependabotService();

/**
 * POST /review-dependabot
 * Analyze a Dependabot PR and determine if it should be auto-approved
 */
router.post('/', async (req, res) => {
    try {
        const { prNumber, prTitle, labels, files, oldVersion, newVersion } = req.body;

        // Validate required fields
        if (!prTitle) {
            return res.status(400).json({
                error: 'Missing required field',
                message: 'prTitle is required'
            });
        }

        const analysis = dependabotService.analyzePR({
            prNumber,
            prTitle,
            labels: labels || [],
            files: files || [],
            oldVersion,
            newVersion
        });

        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing Dependabot PR:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message
        });
    }
});

/**
 * POST /review-dependabot/batch
 * Analyze multiple Dependabot PRs at once
 */
router.post('/batch', async (req, res) => {
    try {
        const { pullRequests } = req.body;

        if (!pullRequests || !Array.isArray(pullRequests)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'pullRequests array is required'
            });
        }

        const results = pullRequests.map(pr => ({
            prNumber: pr.prNumber,
            ...dependabotService.analyzePR(pr)
        }));

        const summary = {
            total: results.length,
            approved: results.filter(r => r.shouldApprove).length,
            needsReview: results.filter(r => !r.shouldApprove).length,
            results
        };

        res.json(summary);
    } catch (error) {
        console.error('Error in batch analysis:', error);
        res.status(500).json({
            error: 'Batch analysis failed',
            message: error.message
        });
    }
});

/**
 * GET /review-dependabot/rules
 * Get the current auto-merge rules
 */
router.get('/rules', (req, res) => {
    res.json(dependabotService.getRules());
});

export { router as dependabotRouter };
