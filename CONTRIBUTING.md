# Contributing to SZMC Geriatrics Hub

Thank you for your interest in contributing to the SZMC Geriatrics Hub! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive, and professional environment. Please be considerate of others and focus on constructive collaboration.

## Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **Python** 3.11 or higher (for scripts)
- **Git** for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Eiasash/geriatrics-study.git
cd geriatrics-study

# Install H5P dependencies
cd h5p
npm install --ignore-scripts

# Run tests to verify setup
npm test

# Return to root
cd ..
```

### Running Locally

```bash
# Serve the site locally (choose one)
npx serve .
# or
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

## Development Workflow

1. **Create a Branch**: Always create a new branch for your work
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make Changes**: Implement your changes following our coding standards

3. **Test Thoroughly**: Run tests and verify your changes work correctly

4. **Commit**: Write clear, descriptive commit messages

5. **Push and PR**: Push your branch and create a pull request

## Coding Standards

### JavaScript/TypeScript

- **Style**: Follow existing code style (we use Prettier)
- **Linting**: Code must pass ESLint checks
- **Naming**: Use camelCase for variables/functions, PascalCase for classes
- **Comments**: Add JSDoc comments for public functions
- **ES6+**: Use modern JavaScript features (arrow functions, destructuring, etc.)

```javascript
/**
 * Calculate geriatric assessment score
 * @param {Object} assessment - The assessment data
 * @param {string} assessment.type - Type of assessment (MMSE, MoCA, etc.)
 * @param {number} assessment.score - Raw score
 * @returns {Object} Interpreted result with severity level
 */
function interpretAssessment(assessment) {
  // Implementation
}
```

### HTML/CSS

- **Semantic HTML**: Use appropriate HTML5 semantic elements
- **Accessibility**: Include ARIA labels, alt text, proper heading hierarchy
- **Responsive**: Mobile-first design approach
- **RTL Support**: Ensure Hebrew content displays correctly (right-to-left)
- **CSS Variables**: Use CSS custom properties for theming

### Python

- **Style**: Follow PEP 8 guidelines
- **Type Hints**: Use type hints for function signatures
- **Docstrings**: Use Google-style docstrings

```python
def process_medical_data(patient_data: dict) -> dict:
    """
    Process patient medical data.
    
    Args:
        patient_data: Dictionary containing patient information
        
    Returns:
        Processed data with calculated fields
        
    Raises:
        ValueError: If required fields are missing
    """
    # Implementation
```

## Testing Guidelines

### H5P Tests

```bash
cd h5p
npm test                    # Run all tests
npm run test:coverage       # Generate coverage report
npm run lint                # Check code style
npm run format              # Format code
```

### Writing Tests

- **Unit Tests**: Test individual functions in isolation
- **Integration Tests**: Test component interactions
- **Coverage**: Aim for >70% code coverage for new code
- **Edge Cases**: Include tests for error conditions and edge cases

```javascript
describe('Assessment Calculator', () => {
  test('should calculate MMSE score correctly', () => {
    const result = calculateMMSE({ score: 25 });
    expect(result.severity).toBe('mild');
  });

  test('should handle invalid input', () => {
    expect(() => calculateMMSE({ score: 35 })).toThrow();
  });
});
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature change or bug fix)
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process, dependency updates, etc.
- **ci**: CI/CD changes

### Examples

```bash
feat(h5p): add new flashcard type for drug interactions

fix(presentation-maker): resolve slide ordering issue in export

docs(readme): update installation instructions for Windows

test(clinical-tools): add tests for anticoagulation calculator

chore(deps): upgrade eslint to v9
```

### Best Practices

- Use imperative mood ("add feature" not "added feature")
- Keep the first line under 72 characters
- Provide context in the body if needed
- Reference issues/PRs in the footer (e.g., "Fixes #123")

## Pull Request Process

### Before Submitting

1. **Update from main**: Rebase or merge latest changes
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main  # or git merge main
   ```

2. **Run all checks**:
   ```bash
   cd h5p
   npm test
   npm run lint
   npm run format:check
   ```

3. **Test manually**: Verify your changes work in a browser

4. **Update documentation**: Update README or add docs if needed

### PR Template

When creating a PR, please include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for new features
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated

## Screenshots (if UI changes)
Add screenshots or GIFs showing the changes
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer must approve
3. **Testing**: Reviewers will test the changes
4. **Merge**: Once approved, changes will be merged to main

## Project Structure

### Directory Overview

```
geriatrics-study/
├── index.html                    # Main landing page
├── h5p/                          # H5P interactive content
│   ├── build-h5p*.js            # Build scripts
│   ├── __tests__/               # Test files
│   └── index.html               # H5P content hub
├── szmc-presentation-maker/      # Presentation tool
│   ├── js/                      # Application logic
│   ├── css/                     # Styles
│   ├── templates/               # Slide templates
│   └── index.html               # Main app
├── clinical-tools/               # Medical calculators
│   └── *.html                   # Individual tools
├── hazzards/                     # Textbook content
├── data/                         # Content data (JSON)
├── scripts/                      # Utility scripts
└── .github/                      # CI/CD workflows
```

### Key Files to Know

- **h5p/package.json**: Node.js dependencies and scripts
- **data/content.json**: Medical content for H5P packages
- **.github/workflows/**: CI/CD pipeline definitions
- **README.md**: Project overview and quick start

## Areas for Contribution

### High Priority

- **Content**: Add more geriatrics questions and flashcards
- **Tests**: Improve test coverage (currently ~20%)
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimize load times and bundle sizes
- **Mobile**: Improve responsive design

### Feature Requests

- New clinical calculators
- Additional presentation templates
- More AI assistant capabilities
- Export formats (e.g., Markdown, DOCX)
- Collaboration features

### Bug Fixes

Check the [Issues](https://github.com/Eiasash/geriatrics-study/issues) page for known bugs.

## Medical Content Guidelines

When contributing medical content:

1. **Evidence-Based**: Use current, evidence-based guidelines
2. **Citations**: Include references with PMID/DOI
3. **Accuracy**: Verify all clinical information
4. **Review**: Medical content should be reviewed by specialists
5. **Updates**: Check for guideline updates annually

### Content Sources

- UpToDate
- NICE Guidelines
- AGS Beers Criteria
- Cochrane Reviews
- NEJM, JAMA, Geriatrics journals

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/Eiasash/geriatrics-study/discussions)
- **Bugs**: Open an [Issue](https://github.com/Eiasash/geriatrics-study/issues)
- **Security**: See SECURITY.md for reporting vulnerabilities

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be acknowledged in:
- GitHub Contributors page
- CHANGELOG.md for significant contributions
- README.md for major features

---

Thank you for contributing to better geriatric education and care! 🏥❤️
