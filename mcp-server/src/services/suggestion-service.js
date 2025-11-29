/**
 * Suggestion Service
 * 
 * Provides AI-powered code/test/utility suggestions
 */

export class SuggestionService {
    constructor() {
        // Test templates for different frameworks
        this.testTemplates = {
            jest: {
                javascript: this.getJestTemplate(),
                basic: this.getJestBasicTemplate()
            },
            pytest: {
                python: this.getPytestTemplate()
            }
        };

        // Utility templates by domain
        this.utilityTemplates = {
            file: this.getFileUtilityTemplates(),
            string: this.getStringUtilityTemplates(),
            array: this.getArrayUtilityTemplates(),
            validation: this.getValidationTemplates()
        };

        // Build script templates
        this.buildTemplates = {
            npm: this.getNpmBuildTemplates(),
            python: this.getPythonBuildTemplates()
        };
    }

    /**
     * Generate a suggestion based on type and context
     */
    generateSuggestion(options) {
        const { type, context, language, options: extraOptions } = options;

        switch (type) {
            case 'test':
                return this.generateTestSuggestion({ code: context, language, ...extraOptions });
            case 'utility':
                return this.generateUtilitySuggestion({ domain: extraOptions?.domain || 'file', pattern: context, language });
            case 'build':
                return this.generateBuildSuggestion({ buildSystem: language === 'python' ? 'python' : 'npm', tasks: [], language });
            case 'scaffold':
                return this.generateScaffoldSuggestion({ context, language, ...extraOptions });
            default:
                return {
                    type,
                    suggestion: null,
                    message: `Unknown suggestion type: ${type}. Use: test, utility, build, scaffold`
                };
        }
    }

    /**
     * Generate test suggestions for given code
     */
    generateTestSuggestion(options) {
        const { code, language, framework } = options;
        const detectedFramework = framework || (language === 'python' ? 'pytest' : 'jest');

        // Analyze code to extract testable elements
        const analysis = this.analyzeCode(code, language);

        // Generate test suggestions
        const suggestions = [];

        if (analysis.functions.length > 0) {
            analysis.functions.forEach(fn => {
                suggestions.push({
                    functionName: fn.name,
                    testCases: this.generateTestCases(fn, language),
                    template: this.getTestTemplate(fn, detectedFramework, language)
                });
            });
        }

        if (analysis.classes.length > 0) {
            analysis.classes.forEach(cls => {
                suggestions.push({
                    className: cls.name,
                    testCases: this.generateClassTestCases(cls, language),
                    template: this.getClassTestTemplate(cls, detectedFramework, language)
                });
            });
        }

        return {
            language,
            framework: detectedFramework,
            analysis,
            suggestions,
            template: this.testTemplates[detectedFramework]?.[language] || this.testTemplates.jest.basic,
            recommendations: this.getTestingRecommendations(analysis)
        };
    }

    /**
     * Generate utility function suggestions
     */
    generateUtilitySuggestion(options) {
        const { domain, pattern, language } = options;
        const templates = this.utilityTemplates[domain] || this.utilityTemplates.file;

        return {
            domain,
            language,
            utilities: templates[language] || templates.javascript,
            pattern,
            example: this.getUtilityExample(domain, language),
            recommendations: [
                'Add JSDoc/docstrings for documentation',
                'Include input validation',
                'Add error handling for edge cases'
            ]
        };
    }

    /**
     * Generate build script suggestions
     */
    generateBuildSuggestion(options) {
        const { buildSystem, tasks, language } = options;
        const templates = this.buildTemplates[buildSystem] || this.buildTemplates.npm;

        return {
            buildSystem,
            language,
            scripts: templates,
            suggestedTasks: this.getSuggestedBuildTasks(buildSystem, tasks),
            example: this.getBuildExample(buildSystem),
            ciIntegration: this.getCIIntegrationExample(buildSystem)
        };
    }

    /**
     * Generate scaffold suggestions for new components
     */
    generateScaffoldSuggestion(options) {
        const { language, componentType } = options;

        return {
            componentType: componentType || 'module',
            language,
            structure: this.getScaffoldStructure(componentType, language),
            files: this.getScaffoldFiles(componentType, language),
            commands: this.getScaffoldCommands(componentType, language),
            recommendations: [
                'Follow existing project conventions',
                'Add tests alongside new code',
                'Update documentation'
            ]
        };
    }

    /**
     * Get available templates
     */
    getTemplates() {
        return {
            suggestionTypes: ['test', 'utility', 'build', 'scaffold'],
            testFrameworks: ['jest', 'pytest'],
            utilityDomains: ['file', 'string', 'array', 'validation'],
            buildSystems: ['npm', 'python'],
            languages: ['javascript', 'python']
        };
    }

    // Helper methods for code analysis
    analyzeCode(code, language) {
        const analysis = {
            functions: [],
            classes: [],
            imports: [],
            exports: []
        };

        if (!code) return analysis;

        if (language === 'javascript' || language === 'js') {
            // Simple regex-based analysis for JS
            const functionMatches = code.matchAll(/(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(|(?:async\s+)?(\w+)\s*\([^)]*\)\s*{)/g);
            for (const match of functionMatches) {
                const name = match[1] || match[2] || match[3];
                if (name && !['if', 'for', 'while', 'switch'].includes(name)) {
                    analysis.functions.push({ name, async: code.includes(`async ${name}`) || code.includes(`async function ${name}`) });
                }
            }

            const classMatches = code.matchAll(/class\s+(\w+)/g);
            for (const match of classMatches) {
                analysis.classes.push({ name: match[1] });
            }
        } else if (language === 'python' || language === 'py') {
            // Simple regex-based analysis for Python
            const functionMatches = code.matchAll(/def\s+(\w+)\s*\(/g);
            for (const match of functionMatches) {
                analysis.functions.push({ name: match[1], async: code.includes(`async def ${match[1]}`) });
            }

            const classMatches = code.matchAll(/class\s+(\w+)/g);
            for (const match of classMatches) {
                analysis.classes.push({ name: match[1] });
            }
        }

        return analysis;
    }

    generateTestCases(fn, language) {
        return [
            { name: `should handle valid input`, type: 'happy-path' },
            { name: `should handle empty input`, type: 'edge-case' },
            { name: `should handle null/undefined`, type: 'error-handling' },
            { name: `should throw error for invalid input`, type: 'error-handling' }
        ];
    }

    generateClassTestCases(cls, language) {
        return [
            { name: `should instantiate correctly`, type: 'initialization' },
            { name: `should have expected methods`, type: 'structure' },
            { name: `should handle method calls`, type: 'functionality' }
        ];
    }

    getTestTemplate(fn, framework, language) {
        if (framework === 'jest') {
            return `describe('${fn.name}', () => {
  test('should work correctly', ${fn.async ? 'async ' : ''}() => {
    // Arrange
    const input = /* test input */;
    
    // Act
    const result = ${fn.async ? 'await ' : ''}${fn.name}(input);
    
    // Assert
    expect(result).toBeDefined();
  });

  test('should handle edge cases', () => {
    expect(() => ${fn.name}(null)).toThrow();
  });
});`;
        }
        
        return `def test_${fn.name}():
    # Arrange
    test_input = None  # test input
    
    # Act
    result = ${fn.name}(test_input)
    
    # Assert
    assert result is not None`;
    }

    getClassTestTemplate(cls, framework, language) {
        if (framework === 'jest') {
            return `describe('${cls.name}', () => {
  let instance;

  beforeEach(() => {
    instance = new ${cls.name}();
  });

  test('should instantiate', () => {
    expect(instance).toBeInstanceOf(${cls.name});
  });

  test('should have expected methods', () => {
    // Add method existence checks
  });
});`;
        }

        return `class Test${cls.name}:
    def setup_method(self):
        self.instance = ${cls.name}()

    def test_instantiation(self):
        assert self.instance is not None`;
    }

    getTestingRecommendations(analysis) {
        const recommendations = [];
        
        if (analysis.functions.length > 0) {
            recommendations.push('Test each function with valid and invalid inputs');
            recommendations.push('Add async tests for async functions');
        }
        
        if (analysis.classes.length > 0) {
            recommendations.push('Test class instantiation');
            recommendations.push('Test method interactions');
        }
        
        recommendations.push('Mock external dependencies');
        recommendations.push('Use meaningful test descriptions');

        return recommendations;
    }

    // Template getters
    getJestTemplate() {
        return `import { functionToTest } from './module';

describe('functionToTest', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  test('should handle valid input', () => {
    const result = functionToTest(validInput);
    expect(result).toBe(expectedOutput);
  });

  test('should handle errors', () => {
    expect(() => functionToTest(invalidInput)).toThrow();
  });
});`;
    }

    getJestBasicTemplate() {
        return `test('description', () => {
  expect(actual).toBe(expected);
});`;
    }

    getPytestTemplate() {
        return `import pytest
from module import function_to_test

class TestFunctionToTest:
    def test_valid_input(self):
        result = function_to_test(valid_input)
        assert result == expected_output

    def test_invalid_input(self):
        with pytest.raises(ValueError):
            function_to_test(invalid_input)`;
    }

    getFileUtilityTemplates() {
        return {
            javascript: [
                { name: 'readJsonFile', description: 'Read and parse JSON file', code: 'const readJsonFile = (path) => JSON.parse(fs.readFileSync(path, "utf8"));' },
                { name: 'writeJsonFile', description: 'Write object to JSON file', code: 'const writeJsonFile = (path, data) => fs.writeFileSync(path, JSON.stringify(data, null, 2));' },
                { name: 'ensureDir', description: 'Create directory if not exists', code: 'const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };' }
            ],
            python: [
                { name: 'read_json_file', description: 'Read and parse JSON file', code: 'def read_json_file(path): return json.load(open(path))' },
                { name: 'write_json_file', description: 'Write object to JSON file', code: 'def write_json_file(path, data): json.dump(data, open(path, "w"), indent=2)' }
            ]
        };
    }

    getStringUtilityTemplates() {
        return {
            javascript: [
                { name: 'capitalize', description: 'Capitalize first letter', code: 'const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);' },
                { name: 'slugify', description: 'Convert to URL-safe slug', code: 'const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");' }
            ],
            python: [
                { name: 'slugify', description: 'Convert to URL-safe slug', code: 'def slugify(s): return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")' }
            ]
        };
    }

    getArrayUtilityTemplates() {
        return {
            javascript: [
                { name: 'groupBy', description: 'Group array by key', code: 'const groupBy = (arr, key) => arr.reduce((acc, item) => ({ ...acc, [item[key]]: [...(acc[item[key]] || []), item] }), {});' },
                { name: 'unique', description: 'Get unique values', code: 'const unique = (arr) => [...new Set(arr)];' }
            ],
            python: [
                { name: 'group_by', description: 'Group list by key', code: 'def group_by(lst, key): return {k: list(g) for k, g in itertools.groupby(sorted(lst, key=key), key=key)}' }
            ]
        };
    }

    getValidationTemplates() {
        return {
            javascript: [
                { name: 'isEmail', description: 'Validate email format', code: 'const isEmail = (str) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(str);' },
                { name: 'isNotEmpty', description: 'Check non-empty string', code: 'const isNotEmpty = (str) => typeof str === "string" && str.trim().length > 0;' }
            ],
            python: [
                { name: 'is_email', description: 'Validate email format', code: 'def is_email(s): return bool(re.match(r"^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", s))' }
            ]
        };
    }

    getNpmBuildTemplates() {
        return {
            build: 'npm run build',
            test: 'npm test',
            lint: 'npm run lint',
            format: 'npm run format',
            coverage: 'npm run test:coverage'
        };
    }

    getPythonBuildTemplates() {
        return {
            install: 'pip install -r requirements.txt',
            test: 'pytest',
            lint: 'flake8 .',
            format: 'black .',
            coverage: 'pytest --cov=. --cov-report=term'
        };
    }

    getUtilityExample(domain, language) {
        const examples = this.utilityTemplates[domain] || this.utilityTemplates.file;
        const langExamples = examples[language] || examples.javascript;
        return langExamples[0];
    }

    getBuildExample(buildSystem) {
        return this.buildTemplates[buildSystem] || this.buildTemplates.npm;
    }

    getSuggestedBuildTasks(buildSystem, existingTasks) {
        const allTasks = Object.keys(this.buildTemplates[buildSystem] || this.buildTemplates.npm);
        return allTasks.filter(task => !existingTasks.includes(task));
    }

    getCIIntegrationExample(buildSystem) {
        if (buildSystem === 'npm') {
            return `- name: Install dependencies
  run: npm ci
- name: Run tests
  run: npm test
- name: Build
  run: npm run build`;
        }
        
        return `- name: Install dependencies
  run: pip install -r requirements.txt
- name: Run tests
  run: pytest`;
    }

    getScaffoldStructure(componentType, language) {
        if (componentType === 'module') {
            return language === 'python' ? {
                'src/': 'Source code',
                'tests/': 'Test files',
                'requirements.txt': 'Dependencies',
                'README.md': 'Documentation'
            } : {
                'src/': 'Source code',
                '__tests__/': 'Test files',
                'package.json': 'Dependencies',
                'README.md': 'Documentation'
            };
        }
        return {};
    }

    getScaffoldFiles(componentType, language) {
        return [];
    }

    getScaffoldCommands(componentType, language) {
        if (language === 'python') {
            return ['python -m venv .venv', 'source .venv/bin/activate', 'pip install -r requirements.txt'];
        }
        return ['npm init -y', 'npm install'];
    }
}
