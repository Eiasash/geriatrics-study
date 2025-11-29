# MCP Server - Geriatrics Study

An automation server for CI management, presentation analysis, coverage enforcement, and AI-driven code suggestions.

## 🚀 Quick Start

### Installation

```bash
cd mcp-server
npm install
```

### Running the Server

```bash
# Start server
npm start

# Development mode with auto-reload
npm run dev
```

The server will start on port 3000 (or `MCP_PORT` environment variable).

## 📚 API Endpoints

### Health Check

```
GET /health
```

Returns server health status and available endpoints.

### 1. Review Dependabot (`/review-dependabot`)

Analyze Dependabot PRs and determine auto-merge eligibility.

#### Analyze Single PR

```
POST /review-dependabot
```

**Request Body:**
```json
{
  "prTitle": "Bump lodash from 4.17.20 to 4.17.21",
  "prNumber": 123,
  "labels": ["dependencies"],
  "files": ["package.json", "package-lock.json"],
  "oldVersion": "4.17.20",
  "newVersion": "4.17.21"
}
```

**Response:**
```json
{
  "shouldApprove": true,
  "confidence": 85,
  "reason": "patch update - safe to auto-merge",
  "updateType": "patch",
  "ecosystem": "npm",
  "packageName": "lodash",
  "risks": [],
  "recommendations": ["CI checks will verify compatibility"]
}
```

#### Batch Analysis

```
POST /review-dependabot/batch
```

Analyze multiple Dependabot PRs at once.

#### Get Rules

```
GET /review-dependabot/rules
```

Get current auto-merge rules configuration.

### 2. Analyze Presentation (`/analyze-presentation`)

Analyze SZMC presentations for quality, issues, and suggestions.

#### Full Analysis

```
POST /analyze-presentation
```

**Request Body:**
```json
{
  "slides": [
    { "type": "title", "data": { "title": "Case Presentation", "presenter": "Dr. Smith" } },
    { "type": "hpi", "data": { "chiefComplaint": "...", "history": "..." } }
  ],
  "presentationType": "case-presentation"
}
```

**Response:**
```json
{
  "score": 85,
  "issues": [
    { "severity": "warning", "title": "Missing field", "message": "..." }
  ],
  "suggestions": [
    { "severity": "tip", "title": "Add teaching points", "message": "..." }
  ],
  "timing": { "minutes": 12, "seconds": 30, "formatted": "12:30" },
  "summary": {
    "totalSlides": 10,
    "slideTypes": { "title": 1, "content": 5 },
    "errorCount": 0,
    "warningCount": 2
  }
}
```

#### Get Score Only

```
POST /analyze-presentation/score
```

#### Get Suggestions Only

```
POST /analyze-presentation/suggestions
```

#### Validate Lab Values

```
POST /analyze-presentation/labs
```

#### Check Medication Safety

```
POST /analyze-presentation/medications
```

Checks for:
- Beers Criteria medications (potentially inappropriate for elderly)
- Drug-drug interactions
- High-risk medications without monitoring

#### Batch Analysis

```
POST /analyze-presentation/batch
```

#### Get Templates

```
GET /analyze-presentation/templates
```

### 3. Coverage Report (`/coverage-report`)

Manage coverage thresholds and generate reports.

#### Generate Report

```
POST /coverage-report
```

**Request Body:**
```json
{
  "component": "h5p",
  "coverage": {
    "branches": 60,
    "functions": 65,
    "lines": 70,
    "statements": 68
  },
  "threshold": {
    "branches": 50,
    "functions": 50,
    "lines": 50,
    "statements": 50
  }
}
```

**Response:**
```json
{
  "component": "h5p",
  "passing": true,
  "status": "success",
  "averageCoverage": 65.75,
  "targetAverage": 70,
  "progressToTarget": 94,
  "metrics": {
    "branches": { "current": 60, "required": 50, "passing": true }
  },
  "recommendations": []
}
```

#### Check Threshold

```
POST /coverage-report/check
```

#### Suggest Improvements

```
POST /coverage-report/suggest
```

#### Get Thresholds

```
GET /coverage-report/thresholds
```

#### Ratchet Thresholds

```
POST /coverage-report/ratchet
```

Automatically increase thresholds based on improved coverage.

### 4. Suggest Code (`/suggest-code`)

AI-powered code, test, and utility suggestions.

#### Generate Suggestion

```
POST /suggest-code
```

**Request Body:**
```json
{
  "type": "test",
  "context": "function validateEmail(email) { ... }",
  "language": "javascript",
  "options": { "framework": "jest" }
}
```

#### Test Suggestions

```
POST /suggest-code/test
```

Generate test suggestions for given code.

#### Utility Suggestions

```
POST /suggest-code/utility
```

**Request Body:**
```json
{
  "domain": "file",
  "pattern": "read JSON",
  "language": "javascript"
}
```

Available domains: `file`, `string`, `array`, `validation`

#### Build Script Suggestions

```
POST /suggest-code/build
```

**Request Body:**
```json
{
  "buildSystem": "npm",
  "tasks": ["build", "test"],
  "language": "javascript"
}
```

#### Get Templates

```
GET /suggest-code/templates
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production/test) | development |

### Coverage Thresholds

Default thresholds are configured per component:

- **H5P**: 50% (baseline), target: 70%
- **Anki**: 70% (baseline), target: 80%

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 CI/CD Integration

### GitHub Actions Integration

Add to your workflow:

```yaml
- name: Check coverage thresholds
  run: |
    curl -X POST http://localhost:3000/coverage-report/check \
      -H "Content-Type: application/json" \
      -d '{"component": "h5p", "coverage": ${{ steps.coverage.outputs.data }}}'
```

### Dependabot Auto-Merge Integration

The `/review-dependabot` endpoint integrates with the existing `dependabot-auto-merge.yml` workflow to provide intelligent PR analysis.

## 🏗️ Architecture

```
mcp-server/
├── src/
│   ├── index.js           # Main server entry point
│   ├── routes/
│   │   ├── dependabot.js  # Dependabot analysis endpoints
│   │   ├── presentation.js # Presentation analysis endpoints
│   │   ├── coverage.js    # Coverage reporting endpoints
│   │   └── suggest.js     # Code suggestion endpoints
│   └── services/
│       ├── dependabot-service.js
│       ├── presentation-service.js
│       ├── coverage-service.js
│       └── suggestion-service.js
├── __tests__/             # Test files
├── package.json
└── README.md
```

## 🔐 Security

- Input validation on all endpoints
- Rate limiting recommended for production
- No sensitive data logging
- CORS should be configured for production deployment

## 📈 Roadmap

- [ ] External AI API integration (OpenAI, Claude)
- [ ] WebSocket support for real-time analysis
- [ ] Database persistence for analytics
- [ ] Enhanced medical content validation
- [ ] Multi-language support

## 📄 License

MIT License - see the main repository LICENSE file.
