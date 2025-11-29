/**
 * Code Suggestion Router
 * 
 * Provides AI-powered code/test/utility suggestions
 */

import express from 'express';
import { SuggestionService } from '../services/suggestion-service.js';

const router = express.Router();
const suggestionService = new SuggestionService();

/**
 * POST /suggest-code
 * Generate code suggestions based on context
 */
router.post('/', async (req, res) => {
    try {
        const { type, context, language, options } = req.body;

        if (!type) {
            return res.status(400).json({
                error: 'Missing required field',
                message: 'type is required (test, utility, build, scaffold)'
            });
        }

        const suggestion = suggestionService.generateSuggestion({
            type,
            context: context || '',
            language: language || 'javascript',
            options: options || {}
        });

        res.json(suggestion);
    } catch (error) {
        console.error('Error generating suggestion:', error);
        res.status(500).json({
            error: 'Suggestion generation failed',
            message: error.message
        });
    }
});

/**
 * POST /suggest-code/test
 * Generate test suggestions for given code
 */
router.post('/test', async (req, res) => {
    try {
        const { code, language, framework } = req.body;

        if (!code) {
            return res.status(400).json({
                error: 'Missing required field',
                message: 'code is required'
            });
        }

        const testSuggestion = suggestionService.generateTestSuggestion({
            code,
            language: language || 'javascript',
            framework: framework || 'jest'
        });

        res.json(testSuggestion);
    } catch (error) {
        console.error('Error generating test suggestion:', error);
        res.status(500).json({
            error: 'Test suggestion failed',
            message: error.message
        });
    }
});

/**
 * POST /suggest-code/utility
 * Suggest utility functions based on common patterns
 */
router.post('/utility', async (req, res) => {
    try {
        const { domain, pattern, language } = req.body;

        if (!domain) {
            return res.status(400).json({
                error: 'Missing required field',
                message: 'domain is required (file, string, array, date, validation)'
            });
        }

        const utilitySuggestion = suggestionService.generateUtilitySuggestion({
            domain,
            pattern: pattern || '',
            language: language || 'javascript'
        });

        res.json(utilitySuggestion);
    } catch (error) {
        console.error('Error generating utility suggestion:', error);
        res.status(500).json({
            error: 'Utility suggestion failed',
            message: error.message
        });
    }
});

/**
 * POST /suggest-code/build
 * Generate build script suggestions
 */
router.post('/build', async (req, res) => {
    try {
        const { buildSystem, tasks, language } = req.body;

        if (!buildSystem) {
            return res.status(400).json({
                error: 'Missing required field',
                message: 'buildSystem is required (npm, python, make)'
            });
        }

        const buildSuggestion = suggestionService.generateBuildSuggestion({
            buildSystem,
            tasks: tasks || [],
            language: language || 'javascript'
        });

        res.json(buildSuggestion);
    } catch (error) {
        console.error('Error generating build suggestion:', error);
        res.status(500).json({
            error: 'Build suggestion failed',
            message: error.message
        });
    }
});

/**
 * GET /suggest-code/templates
 * Get available suggestion templates
 */
router.get('/templates', (req, res) => {
    res.json(suggestionService.getTemplates());
});

export { router as suggestRouter };
