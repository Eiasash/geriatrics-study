/**
 * MCP Server for Geriatrics Study Repository
 * 
 * Provides endpoints for:
 * - CI management and Dependabot review
 * - SZMC presentation analysis and scoring
 * - Coverage enforcement
 * - AI-powered code/test suggestions
 */

import express from 'express';
import { dependabotRouter } from './routes/dependabot.js';
import { presentationRouter } from './routes/presentation.js';
import { coverageRouter } from './routes/coverage.js';
import { suggestRouter } from './routes/suggest.js';

const app = express();
const PORT = process.env.MCP_PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const safePath = req.path.replace(/\r?\n|\r/g, "");
    console.log(`[${timestamp}] ${req.method} ${safePath}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: [
            '/review-dependabot',
            '/analyze-presentation',
            '/coverage-report',
            '/suggest-code'
        ]
    });
});

// API Routes
app.use('/review-dependabot', dependabotRouter);
app.use('/analyze-presentation', presentationRouter);
app.use('/coverage-report', coverageRouter);
app.use('/suggest-code', suggestRouter);

// Root endpoint with API documentation
app.get('/', (req, res) => {
    res.json({
        name: 'MCP Server - Geriatrics Study',
        version: '1.0.0',
        description: 'Automation server for CI, presentation analysis, and AI-driven improvements',
        endpoints: {
            health: {
                method: 'GET',
                path: '/health',
                description: 'Health check endpoint'
            },
            reviewDependabot: {
                method: 'POST',
                path: '/review-dependabot',
                description: 'Analyze and auto-approve Dependabot PRs',
                body: {
                    prNumber: 'number - Pull request number',
                    prTitle: 'string - Pull request title',
                    labels: 'array - PR labels',
                    files: 'array - Changed files'
                }
            },
            analyzePresentation: {
                method: 'POST',
                path: '/analyze-presentation',
                description: 'Analyze SZMC presentation for quality and suggestions',
                body: {
                    slides: 'array - Presentation slides',
                    presentationType: 'string - Type of presentation (case-presentation, journal-club, lecture)'
                }
            },
            coverageReport: {
                method: 'POST',
                path: '/coverage-report',
                description: 'Generate coverage report and enforcement status',
                body: {
                    component: 'string - Component name (h5p, anki)',
                    coverage: 'object - Coverage data',
                    threshold: 'number - Minimum coverage threshold'
                }
            },
            suggestCode: {
                method: 'POST',
                path: '/suggest-code',
                description: 'Generate AI-powered code/test suggestions',
                body: {
                    type: 'string - Suggestion type (test, utility, build)',
                    context: 'string - Code context',
                    language: 'string - Programming language'
                }
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Endpoint ${req.method} ${req.path} not found`,
        availableEndpoints: ['/health', '/review-dependabot', '/analyze-presentation', '/coverage-report', '/suggest-code']
    });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 MCP Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`📖 API docs: http://localhost:${PORT}/`);
    });
}

export { app };
