/**
 * Presentation Analysis Router
 * 
 * Provides endpoints for analyzing SZMC presentations
 */

import express from 'express';
import { PresentationService } from '../services/presentation-service.js';

const router = express.Router();
const presentationService = new PresentationService();

/**
 * POST /analyze-presentation
 * Analyze a presentation for quality, issues, and suggestions
 */
router.post('/', async (req, res) => {
    try {
        const { slides, presentationType } = req.body;

        if (!slides || !Array.isArray(slides)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'slides array is required'
            });
        }

        const analysis = presentationService.analyzePresentation(slides, presentationType);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing presentation:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message
        });
    }
});

/**
 * POST /analyze-presentation/score
 * Get just the score for a presentation
 */
router.post('/score', async (req, res) => {
    try {
        const { slides, presentationType } = req.body;

        if (!slides || !Array.isArray(slides)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'slides array is required'
            });
        }

        const score = presentationService.getScore(slides, presentationType);
        res.json(score);
    } catch (error) {
        console.error('Error scoring presentation:', error);
        res.status(500).json({
            error: 'Scoring failed',
            message: error.message
        });
    }
});

/**
 * POST /analyze-presentation/suggestions
 * Get improvement suggestions for a presentation
 */
router.post('/suggestions', async (req, res) => {
    try {
        const { slides, presentationType } = req.body;

        if (!slides || !Array.isArray(slides)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'slides array is required'
            });
        }

        const suggestions = presentationService.getSuggestions(slides, presentationType);
        res.json(suggestions);
    } catch (error) {
        console.error('Error getting suggestions:', error);
        res.status(500).json({
            error: 'Suggestions failed',
            message: error.message
        });
    }
});

/**
 * POST /analyze-presentation/batch
 * Analyze multiple presentations at once
 */
router.post('/batch', async (req, res) => {
    try {
        const { presentations } = req.body;

        if (!presentations || !Array.isArray(presentations)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'presentations array is required'
            });
        }

        const results = presentations.map((pres, index) => ({
            index,
            name: pres.name || `Presentation ${index + 1}`,
            ...presentationService.analyzePresentation(pres.slides || [], pres.presentationType)
        }));

        const summary = {
            total: results.length,
            averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
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
 * POST /analyze-presentation/labs
 * Validate lab values in a presentation
 */
router.post('/labs', async (req, res) => {
    try {
        const { slides } = req.body;

        if (!slides || !Array.isArray(slides)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'slides array is required'
            });
        }

        const labValidation = presentationService.validateLabValues(slides);
        res.json(labValidation);
    } catch (error) {
        console.error('Error validating labs:', error);
        res.status(500).json({
            error: 'Lab validation failed',
            message: error.message
        });
    }
});

/**
 * POST /analyze-presentation/medications
 * Check medication safety in a presentation
 */
router.post('/medications', async (req, res) => {
    try {
        const { slides } = req.body;

        if (!slides || !Array.isArray(slides)) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'slides array is required'
            });
        }

        const medSafety = presentationService.checkMedicationSafety(slides);
        res.json(medSafety);
    } catch (error) {
        console.error('Error checking medications:', error);
        res.status(500).json({
            error: 'Medication check failed',
            message: error.message
        });
    }
});

/**
 * GET /analyze-presentation/templates
 * Get available presentation templates
 */
router.get('/templates', (req, res) => {
    res.json(presentationService.getTemplates());
});

export { router as presentationRouter };
