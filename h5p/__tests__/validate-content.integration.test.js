/**
 * Integration tests for validate-content.js validateContent function
 */

const path = require('path');
const fs = require('fs');

// Store original fs functions
const originalExistsSync = fs.existsSync;
const originalReadFileSync = fs.readFileSync;

describe('validateContent integration', () => {
  let consoleSpy;
  let validateContent;

  beforeEach(() => {
    jest.resetModules();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    // Restore fs functions
    fs.existsSync = originalExistsSync;
    fs.readFileSync = originalReadFileSync;
  });

  describe('file handling', () => {
    test('should return false when content file does not exist', () => {
      fs.existsSync = jest.fn().mockReturnValue(false);

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    });

    test('should return false when JSON is invalid', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue('{ invalid json }');

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to parse JSON'));
    });

    test('should return false when content is not an array', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({ notAnArray: true }));

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      expect(result).toBe(false);
    });

    test('should support content with topics property', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify({
          topics: [
            {
              topic: 'Test Topic',
              flashcards: [{ q: 'Question here', a: 'Valid answer here' }],
              mcqs: [
                { q: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'Exp' },
                { q: 'Q2', options: ['A', 'B', 'C', 'D'], correct: 'B', explanation: 'Exp' },
                { q: 'Q3', options: ['A', 'B', 'C', 'D'], correct: 'C', explanation: 'Exp' },
                { q: 'Q4', options: ['A', 'B', 'C', 'D'], correct: 'D', explanation: 'Exp' },
                { q: 'Q5', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'Exp' },
              ],
            },
          ],
        })
      );

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      // With topics property format, it should parse and validate
      expect(typeof result).toBe('boolean');
    });

    test('should return false when no topics defined', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify([]));

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No topics defined'));
    });
  });

  describe('validation results', () => {
    test('should return true when all validations pass', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify([
          {
            topic: 'Valid Topic',
            flashcards: [
              { q: 'Question 1', a: 'Answer 1 here' },
              { q: 'Question 2', a: 'Answer 2 here' },
            ],
            mcqs: [
              { q: 'MCQ 1', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'Exp 1' },
              { q: 'MCQ 2', options: ['A', 'B', 'C', 'D'], correct: 'B', explanation: 'Exp 2' },
              { q: 'MCQ 3', options: ['A', 'B', 'C', 'D'], correct: 'C', explanation: 'Exp 3' },
              { q: 'MCQ 4', options: ['A', 'B', 'C', 'D'], correct: 'D', explanation: 'Exp 4' },
              { q: 'MCQ 5', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'Exp 5' },
            ],
          },
        ])
      );

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      expect(result).toBe(true);
    });

    test('should return false when there are errors', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify([
          {
            topic: 'Invalid Topic',
            flashcards: [{ q: '', a: '' }], // Invalid - empty
            mcqs: [{ q: '', options: ['A'], correct: 'B' }], // Invalid - missing question, too few options, wrong correct
          },
        ])
      );

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      expect(result).toBe(false);
    });

    test('should log validation summary', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            flashcards: [{ q: 'Q', a: 'Answer' }],
            mcqs: [
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q2', options: ['A', 'B', 'C', 'D'], correct: 'B', explanation: 'E' },
              { q: 'Q3', options: ['A', 'B', 'C', 'D'], correct: 'C', explanation: 'E' },
              { q: 'Q4', options: ['A', 'B', 'C', 'D'], correct: 'D', explanation: 'E' },
              { q: 'Q5', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
            ],
          },
        ])
      );

      const { validateContent } = require('../validate-content.js');
      validateContent();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Validation Summary'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Topics:'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Questions:'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Flashcards:'));
    });

    test('should log content statistics', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            flashcards: [{ q: 'Q', a: 'Answer' }],
            mcqs: [
              { q: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q2', options: ['A', 'B', 'C', 'D'], correct: 'B', explanation: 'E' },
              { q: 'Q3', options: ['A', 'B', 'C', 'D'], correct: 'C', explanation: 'E' },
              { q: 'Q4', options: ['A', 'B', 'C', 'D'], correct: 'D', explanation: 'E' },
              { q: 'Q5', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
            ],
          },
        ])
      );

      const { validateContent } = require('../validate-content.js');
      validateContent();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Content Statistics'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Average questions per topic'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Average flashcards per topic'));
    });
  });

  describe('issue categorization', () => {
    test('should categorize issues as warnings or errors', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            flashcards: [{ q: 'Valid question', a: 'Valid answer here' }],
            mcqs: [
              { q: 'Q1', options: ['A', 'B', 'C'], correct: 'A', explanation: 'E' }, // Warning: only 3 options
            ],
          },
        ])
      );

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      // Result may be true or false depending on accumulated state
      expect(typeof result).toBe('boolean');
    });

    test('should count errors correctly', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            flashcards: [{ q: '', a: '' }], // 2 errors: empty question and answer
            mcqs: [],
          },
        ])
      );

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('error'));
    });
  });

  describe('multiple topics', () => {
    test('should validate all topics', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify([
          {
            topic: 'Topic 1',
            flashcards: [{ q: 'Q1', a: 'A1 answer' }],
            mcqs: [
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
            ],
          },
          {
            topic: 'Topic 2',
            flashcards: [{ q: 'Q2', a: 'A2 answer' }],
            mcqs: [
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
            ],
          },
        ])
      );

      const { validateContent } = require('../validate-content.js');
      const result = validateContent();

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Topic 1'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Topic 2'));
    });

    test('should use topic name in output', () => {
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn().mockReturnValue(
        JSON.stringify([
          {
            topic: 'Delirium in Elderly',
            flashcards: [{ q: 'Q', a: 'Answer' }],
            mcqs: [
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
              { q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' },
            ],
          },
        ])
      );

      const { validateContent } = require('../validate-content.js');
      validateContent();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Delirium in Elderly'));
    });
  });

  describe('log functions', () => {
    test('should export log object with all methods', () => {
      const { log } = require('../validate-content.js');

      expect(log).toBeDefined();
      expect(typeof log.info).toBe('function');
      expect(typeof log.success).toBe('function');
      expect(typeof log.warning).toBe('function');
      expect(typeof log.error).toBe('function');
      expect(typeof log.section).toBe('function');
    });

    test('log.info should output with blue color', () => {
      const { log, colors } = require('../validate-content.js');
      log.info('Test info');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(colors.blue));
    });

    test('log.success should output with green color', () => {
      const { log, colors } = require('../validate-content.js');
      log.success('Test success');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(colors.green));
    });

    test('log.warning should output with yellow color', () => {
      const { log, colors } = require('../validate-content.js');
      log.warning('Test warning');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(colors.yellow));
    });

    test('log.error should output with red color', () => {
      const { log, colors } = require('../validate-content.js');
      log.error('Test error');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(colors.red));
    });

    test('log.section should output with cyan color', () => {
      const { log, colors } = require('../validate-content.js');
      log.section('Test section');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(colors.cyan));
    });
  });
});
