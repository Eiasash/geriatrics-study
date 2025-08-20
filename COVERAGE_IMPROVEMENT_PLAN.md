# 📈 Coverage Improvement Plan

## 🎯 Goal: Gradually Increase Coverage from 50% → 70%

### Current Status
- **H5P Coverage**: 50% threshold (initial)
- **Anki Coverage**: 70% threshold (target)
- **Strategy**: Incremental improvements without breaking CI

## 📊 Phased Approach

### Phase 1: Baseline (Current) ✅
```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50
  }
}
```
- **Goal**: Establish baseline, fix CI
- **Timeline**: Immediate
- **Status**: ✅ Complete

### Phase 2: Quick Wins (Week 1-2)
```javascript
coverageThreshold: {
  global: {
    branches: 55,
    functions: 55,
    lines: 60,
    statements: 60
  }
}
```
- **Actions**:
  - Add tests for utility functions
  - Test configuration loading
  - Cover error handling paths
- **Expected gain**: +10% coverage

### Phase 3: Core Logic (Week 3-4)
```javascript
coverageThreshold: {
  global: {
    branches: 60,
    functions: 65,
    lines: 65,
    statements: 65
  }
}
```
- **Actions**:
  - Test build scripts thoroughly
  - Add integration tests
  - Mock external dependencies
- **Expected gain**: +5-10% coverage

### Phase 4: Target Achievement (Week 5-6)
```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```
- **Actions**:
  - Edge case testing
  - Error scenario coverage
  - Performance test cases
- **Goal**: Reach 70% target

## 🛠️ Implementation Strategy

### 1. Automatic Threshold Updates
Create a GitHub Action to automatically bump thresholds when coverage exceeds them:

```yaml
name: Coverage Ratchet

on:
  push:
    branches: [main]

jobs:
  update-threshold:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check coverage
        run: |
          cd h5p
          npm test -- --coverage --json --outputFile=coverage.json
          
      - name: Update threshold if exceeded
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const coverage = JSON.parse(fs.readFileSync('h5p/coverage.json'));
            const current = coverage.coverageMap.total;
            
            // Only increase, never decrease
            const config = require('./h5p/jest.config.js');
            const threshold = config.coverageThreshold.global;
            
            let updated = false;
            for (const metric of ['branches', 'functions', 'lines', 'statements']) {
              if (current[metric].pct > threshold[metric] + 2) {
                threshold[metric] = Math.floor(current[metric].pct);
                updated = true;
              }
            }
            
            if (updated) {
              // Update jest.config.js
              // Create PR with new thresholds
            }
```

### 2. Test Priority Matrix

| Priority | Component | Current | Target | Effort |
|----------|-----------|---------|--------|--------|
| 🔴 High | build-h5p-questionset.js | 0% | 80% | Medium |
| 🔴 High | build-h5p-mega.js | 0% | 80% | Medium |
| 🟡 Medium | build-h5p.js | 0% | 70% | Low |
| 🟢 Low | Config files | N/A | 60% | Low |

### 3. Quick Test Templates

#### Template 1: Build Script Test
```javascript
// build-h5p-questionset.test.js
const { buildQuestionSet } = require('./build-h5p-questionset');
const fs = require('fs-extra');

jest.mock('fs-extra');

describe('buildQuestionSet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates output directory', async () => {
    await buildQuestionSet();
    expect(fs.ensureDir).toHaveBeenCalledWith('./dist');
  });

  test('handles missing content.json', async () => {
    fs.readJson.mockRejectedValue(new Error('File not found'));
    await expect(buildQuestionSet()).rejects.toThrow('File not found');
  });

  test('generates H5P package for each topic', async () => {
    const mockContent = {
      topics: [
        { id: 'topic1', title: 'Test Topic', questions: [] }
      ]
    };
    fs.readJson.mockResolvedValue(mockContent);
    
    await buildQuestionSet();
    expect(fs.writeFile).toHaveBeenCalled();
  });
});
```

#### Template 2: Utility Function Test
```javascript
// utils.test.js
describe('Utility Functions', () => {
  test('sanitizes Hebrew text correctly', () => {
    const input = 'דליריום';
    const output = sanitizeHebrew(input);
    expect(output).toBe('דליריום');
  });

  test('validates question structure', () => {
    const validQuestion = { q: 'Question?', a: 'Answer' };
    const invalidQuestion = { q: 'Question?' };
    
    expect(isValidQuestion(validQuestion)).toBe(true);
    expect(isValidQuestion(invalidQuestion)).toBe(false);
  });
});
```

## 📋 Coverage Checklist

### Week 1
- [ ] Add jest.mock for fs-extra
- [ ] Test file I/O operations
- [ ] Cover happy paths
- [ ] Update threshold to 55%

### Week 2
- [ ] Add error handling tests
- [ ] Test edge cases
- [ ] Mock external APIs
- [ ] Update threshold to 60%

### Week 3
- [ ] Integration tests
- [ ] End-to-end scenarios
- [ ] Performance tests
- [ ] Update threshold to 65%

### Week 4
- [ ] Remaining uncovered branches
- [ ] Complex logic paths
- [ ] Final push to 70%
- [ ] Celebrate! 🎉

## 🔄 Continuous Improvement

### Monthly Review
1. Run coverage report: `npm test -- --coverage`
2. Identify lowest coverage files
3. Add tests for uncovered code
4. Bump thresholds by 2-5%

### Automated Enforcement
```json
// package.json
{
  "scripts": {
    "test:coverage": "jest --coverage --coverageReporters=text-summary",
    "test:coverage:check": "jest --coverage --bail",
    "coverage:report": "jest --coverage --coverageReporters=html && open coverage/index.html"
  }
}
```

### Pre-commit Hook
```bash
# .husky/pre-commit
#!/bin/sh
npm run test:coverage:check || {
  echo "Coverage threshold not met!"
  echo "Run 'npm run coverage:report' to see uncovered code"
  exit 1
}
```

## 📈 Tracking Progress

### Coverage Badge Updates
The README badges will automatically update as coverage improves:
- 🔴 <50%: Red
- 🟡 50-70%: Yellow  
- 🟢 >70%: Green

### Weekly Metrics
| Week | H5P Coverage | Anki Coverage | Total |
|------|--------------|---------------|-------|
| 1 | 50% | 70% | 60% |
| 2 | 55% | 72% | 63% |
| 3 | 60% | 74% | 67% |
| 4 | 65% | 75% | 70% |
| 5 | 70% | 76% | 73% |

## 🎯 Success Criteria

✅ **Achieved when:**
- H5P coverage ≥ 70%
- Anki coverage ≥ 70%
- No coverage regressions
- All CI checks passing
- Team comfortable with testing

## 🚀 Benefits

1. **Quality**: Catch bugs before production
2. **Confidence**: Safe refactoring
3. **Documentation**: Tests show usage
4. **Speed**: Faster debugging
5. **Professional**: Industry standard

---

*Start small, improve consistently, celebrate progress!* 🎉