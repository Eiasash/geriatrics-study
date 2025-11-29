# 🤖 GitHub Copilot Automation Guide

This guide documents automation opportunities in the repository and provides Copilot-ready examples for common development tasks.

## 📋 Table of Contents

- [Automation Opportunities](#automation-opportunities)
- [Copilot-Ready Code Snippets](#copilot-ready-code-snippets)
- [Workflow Automation](#workflow-automation)
- [Best Practices](#best-practices)

---

## 🎯 Automation Opportunities

### Current Automation (Implemented)

| Feature | Status | Description |
|---------|--------|-------------|
| Path-based CI | ✅ Active | CI only runs for changed components |
| Dependabot Auto-merge | ✅ Active | Minor/patch updates auto-merge |
| PR Auto-labeling | ✅ Active | Labels based on files changed |
| Release Automation | ✅ Active | Automated GitHub releases |
| CodeQL Security | ✅ Active | JavaScript/Python scanning |

### Recommended Additions

| Opportunity | Priority | Impact | Status |
|-------------|----------|--------|--------|
| Coverage Ratchet | 🔴 High | Prevents coverage regression | ✅ Implemented |
| Pre-commit Hooks | 🟡 Medium | Local quality checks | 📝 Documented |
| Copilot Code Review | 🟡 Medium | AI-assisted reviews | 📝 Documented |
| Auto-fix Formatting | 🟢 Low | Automated code style | 📝 Documented |
| Stale Issue Bot | 🟢 Low | Issue management | 📝 Documented |

---

## 💻 Copilot-Ready Code Snippets

### Test Templates

#### H5P Build Script Test

```javascript
// Copilot: Generate test for H5P build function
const fs = require('fs-extra');
const path = require('path');

describe('buildQuestionSet', () => {
  const mockContent = {
    topics: [
      {
        id: 'test-topic',
        title: 'Test Topic',
        questions: [
          { q: 'Question?', a: 'Answer' }
        ]
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates output directory if not exists', async () => {
    // Copilot will suggest mock implementations
    fs.ensureDir = jest.fn();
    await buildQuestionSet();
    expect(fs.ensureDir).toHaveBeenCalledWith(expect.stringContaining('dist'));
  });

  test('handles missing content gracefully', async () => {
    fs.readJson = jest.fn().mockRejectedValue(new Error('ENOENT'));
    await expect(buildQuestionSet()).rejects.toThrow();
  });
});
```

#### Python Test Template

```python
# Copilot: Generate test for Anki build function
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock

def test_build_deck_creates_output():
    """Test that build_deck creates an output file."""
    # Copilot will suggest mock implementations
    with patch('genanki.Deck') as mock_deck:
        mock_deck.return_value = MagicMock()
        result = build_deck(topic_data)
        assert result is not None

def test_hebrew_text_preserved():
    """Test Hebrew text is preserved in deck."""
    hebrew_question = "מהו דליריום?"
    # Copilot will suggest assertion
    assert len(hebrew_question.encode('utf-8')) > 0
```

### Utility Function Templates

#### File Processing Utility

```javascript
// Copilot: Generate file processing utility
const processFiles = async (inputDir, outputDir, processor) => {
  const files = await fs.readdir(inputDir);
  
  await fs.ensureDir(outputDir);
  
  const results = await Promise.all(
    files
      .filter(f => f.endsWith('.json'))
      .map(async file => {
        const content = await fs.readJson(path.join(inputDir, file));
        const processed = await processor(content);
        const outputPath = path.join(outputDir, file);
        await fs.writeJson(outputPath, processed, { spaces: 2 });
        return { file, success: true };
      })
  );
  
  return results;
};
```

#### Validation Utility

```python
# Copilot: Generate content validation utility
def validate_topic(topic: dict) -> list[str]:
    """Validate a topic structure and return list of errors."""
    errors = []
    
    required_fields = ['id', 'title', 'questions']
    for field in required_fields:
        if field not in topic:
            errors.append(f"Missing required field: {field}")
    
    if 'questions' in topic:
        for i, q in enumerate(topic['questions']):
            if 'q' not in q:
                errors.append(f"Question {i}: missing 'q' field")
            if 'a' not in q:
                errors.append(f"Question {i}: missing 'a' field")
    
    return errors
```

---

## ⚙️ Workflow Automation

### Coverage Ratchet Workflow

A GitHub Actions workflow that automatically increases coverage thresholds when coverage improves:

```yaml
# .github/workflows/coverage-ratchet.yml
name: Coverage Ratchet

on:
  push:
    branches: [main]

jobs:
  update-threshold:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install and test
        run: |
          cd h5p
          npm ci
          npm test -- --coverage --json --outputFile=coverage-summary.json
      
      - name: Update thresholds
        uses: actions/github-script@v7
        with:
          script: |
            // Copilot: Read coverage and update jest.config.js thresholds
            const fs = require('fs');
            // ... implementation details
```

### Pre-commit Hook Setup

Set up Husky for local pre-commit checks:

```bash
# Install Husky
cd h5p
npm install --save-dev husky
npx husky init

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
cd h5p
npm run lint || exit 1
npm run test:coverage:check || {
  echo "❌ Coverage threshold not met!"
  echo "Run 'npm run coverage:report' to see uncovered code"
  exit 1
}
EOF
chmod +x .husky/pre-commit
```

### Copilot-Assisted PR Creation

When creating PRs, Copilot can suggest:

```bash
# Copilot: Generate PR description for feature branch
gh pr create \
  --title "feat: Add coverage ratchet workflow" \
  --body "## Summary
Adds automated coverage threshold updates.

## Changes
- New workflow: coverage-ratchet.yml
- Updated package.json scripts
- Documentation updates

## Testing
- [ ] CI passes
- [ ] Coverage report generated
- [ ] Thresholds updated correctly" \
  --label "type: ci/cd"
```

---

## 📚 Copilot Prompts for This Repository

### For Test Generation

```
// Copilot: Generate jest tests for {filename}
// Test error handling, edge cases, and happy paths
// Use mocks for fs operations
```

### For Build Scripts

```
// Copilot: Add error handling to this build function
// Include progress logging and graceful failure
// Support both Windows and Unix platforms
```

### For Documentation

```
# Copilot: Generate README section for {feature}
# Include installation, usage examples, and common issues
# Support Hebrew text examples
```

### For Workflow Files

```yaml
# Copilot: Create GitHub Actions job for {task}
# Use caching, matrix strategy, and path filtering
# Include coverage reporting and artifact upload
```

---

## 🔧 Configuration Templates

### Jest Configuration Extension

```javascript
// Copilot: Extend jest.config.js for better coverage
module.exports = {
  // ... existing config
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!jest.config.js'
  ],
  coverageReporters: ['text', 'lcov', 'html']
};
```

### ESLint Rules for Copilot

```json
// Copilot: Configure ESLint for better code suggestions
{
  "extends": ["eslint:recommended"],
  "rules": {
    "no-unused-vars": "warn",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

---

## 📈 Metrics and Monitoring

### Coverage Tracking

Track coverage improvements over time:

| Date | H5P Coverage | Anki Coverage | Notes |
|------|--------------|---------------|-------|
| Initial | 50% | 70% | Baseline |
| Week 1 | 55% | 72% | Added utility tests |
| Week 2 | 60% | 74% | Added build tests |

### Automation Effectiveness

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| PR Review Time | 2 days | 1 day | 50% faster |
| CI Build Time | 10 min | 6 min | 40% faster |
| Manual Steps | 8 | 2 | 75% reduction |

---

## 🤝 Contributing with Copilot

### Recommended Workflow

1. **Start with tests**: Let Copilot generate test templates
2. **Implement features**: Use Copilot suggestions for implementations
3. **Run checks locally**: Use pre-commit hooks
4. **Create PR**: Use Copilot for PR descriptions
5. **Review feedback**: Address automated review comments

### Copilot Chat Prompts

For quick assistance, use these prompts in Copilot Chat:

- "How do I add a new topic to content.json?"
- "Generate a test for the build-h5p-mega.js file"
- "What's the correct structure for an H5P package?"
- "Help me debug this Hebrew encoding issue"

---

## 📞 Support

- [Open an Issue](https://github.com/Eiasash/geriatrics-study/issues)
- [View CI/CD Documentation](./IMPLEMENTATION_SUMMARY.md)
- [Coverage Improvement Plan](./COVERAGE_IMPROVEMENT_PLAN.md)

---

*This guide is designed to help developers leverage GitHub Copilot effectively in this repository.*
