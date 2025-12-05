/**
 * Tests for validate-content.js validation functions
 */

const { validateMCQ, validateFlashcard, validateTopic, colors, log } = require('../validate-content.js');

describe('validateMCQ', () => {
  describe('question text validation', () => {
    test('should pass with valid question', () => {
      const mcq = {
        q: 'What is delirium?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('question text'))).toHaveLength(0);
    });

    test('should fail with missing question', () => {
      const mcq = {
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing or empty question text'))).toBe(true);
    });

    test('should fail with empty question', () => {
      const mcq = {
        q: '',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing or empty question text'))).toBe(true);
    });

    test('should fail with whitespace-only question', () => {
      const mcq = {
        q: '   ',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing or empty question text'))).toBe(true);
    });

    test('should support "question" field as alternative to "q"', () => {
      const mcq = {
        question: 'What is delirium?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('question text'))).toHaveLength(0);
    });

    test('should warn about very long questions', () => {
      const mcq = {
        q: 'A'.repeat(600),
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('very long'))).toBe(true);
    });
  });

  describe('options validation', () => {
    test('should pass with 4 options', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('options'))).toHaveLength(0);
    });

    test('should fail with missing options', () => {
      const mcq = {
        q: 'Question?',
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('at least 2 options'))).toBe(true);
    });

    test('should fail with only 1 option', () => {
      const mcq = {
        q: 'Question?',
        options: ['A'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('at least 2 options'))).toBe(true);
    });

    test('should warn with 2-3 options', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Should have 4 options'))).toBe(true);
    });

    test('should pass with 2 options (minimum)', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('at least 2 options'))).toBe(false);
    });
  });

  describe('correct answer validation', () => {
    test('should pass with correct string answer in options', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'B',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('correct answer'))).toHaveLength(0);
    });

    test('should fail with missing correct answer', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing correct answer'))).toBe(true);
    });

    test('should fail with string answer not in options', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'E',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('not found in options'))).toBe(true);
    });

    test('should support numeric correctAnswer index', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 2,
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('correct answer'))).toHaveLength(0);
    });

    test('should fail with numeric index out of range (too high)', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 5,
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('out of range'))).toBe(true);
    });

    test('should fail with negative numeric index', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: -1,
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('out of range'))).toBe(true);
    });

    test('should accept correctAnswer index 0', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('correct answer'))).toHaveLength(0);
    });
  });

  describe('duplicate options validation', () => {
    test('should pass with unique options', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('duplicate'))).toBe(false);
    });

    test('should fail with duplicate options', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'A', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('duplicate'))).toBe(true);
    });
  });

  describe('explanation validation', () => {
    test('should pass with explanation', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
        explanation: 'This is why A is correct.',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing explanation'))).toBe(false);
    });

    test('should warn about missing explanation', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing explanation'))).toBe(true);
    });

    test('should warn about empty explanation', () => {
      const mcq = {
        q: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correct: 'A',
        explanation: '',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing explanation'))).toBe(true);
    });
  });

  describe('issue index numbering', () => {
    test('should include correct question index in issues (1-based)', () => {
      const mcq = {
        options: ['A'],
        correct: 'A',
      };
      const issues = validateMCQ(mcq, 'Test Topic', 4);
      expect(issues.some((i) => i.includes('Question 5'))).toBe(true);
    });
  });
});

describe('validateFlashcard', () => {
  describe('term/question validation', () => {
    test('should pass with valid q/a format', () => {
      const flashcard = {
        q: 'What is delirium?',
        a: 'Acute confusional state',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('question/term'))).toHaveLength(0);
    });

    test('should pass with valid term/definition format', () => {
      const flashcard = {
        term: 'Delirium',
        definition: 'Acute confusional state',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('question/term'))).toHaveLength(0);
    });

    test('should fail with missing question/term', () => {
      const flashcard = {
        a: 'Some answer',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing or empty question/term'))).toBe(true);
    });

    test('should fail with empty question/term', () => {
      const flashcard = {
        q: '',
        a: 'Some answer',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing or empty question/term'))).toBe(true);
    });

    test('should fail with whitespace-only question/term', () => {
      const flashcard = {
        q: '   ',
        a: 'Some answer',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing or empty question/term'))).toBe(true);
    });
  });

  describe('answer/definition validation', () => {
    test('should pass with valid answer', () => {
      const flashcard = {
        q: 'Question?',
        a: 'Valid answer here',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('answer/definition'))).toHaveLength(0);
    });

    test('should fail with missing answer/definition', () => {
      const flashcard = {
        q: 'Question?',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing or empty answer/definition'))).toBe(true);
    });

    test('should fail with empty answer/definition', () => {
      const flashcard = {
        q: 'Question?',
        a: '',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('Missing or empty answer/definition'))).toBe(true);
    });
  });

  describe('length validation', () => {
    test('should warn about very short term (less than 2 chars)', () => {
      const flashcard = {
        q: 'X',
        a: 'Valid answer',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('too short'))).toBe(true);
    });

    test('should warn about very short answer (less than 5 chars)', () => {
      const flashcard = {
        q: 'Valid question',
        a: 'Yes',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('too short'))).toBe(true);
    });

    test('should warn about very long term (more than 300 chars)', () => {
      const flashcard = {
        q: 'A'.repeat(350),
        a: 'Valid answer',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('very long') && i.includes('Question/term'))).toBe(true);
    });

    test('should warn about very long answer (more than 1000 chars)', () => {
      const flashcard = {
        q: 'Valid question',
        a: 'A'.repeat(1100),
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.some((i) => i.includes('very long') && i.includes('Answer/definition'))).toBe(
        true
      );
    });

    test('should pass with appropriate length content', () => {
      const flashcard = {
        q: 'What is delirium?',
        a: 'Delirium is an acute confusional state characterized by disturbed attention and awareness.',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 0);
      expect(issues.filter((i) => i.includes('long') || i.includes('short'))).toHaveLength(0);
    });
  });

  describe('issue index numbering', () => {
    test('should include correct flashcard index in issues (1-based)', () => {
      const flashcard = {
        q: 'X',
        a: 'Answer',
      };
      const issues = validateFlashcard(flashcard, 'Test Topic', 7);
      expect(issues.some((i) => i.includes('Flashcard 8'))).toBe(true);
    });
  });
});

describe('validateTopic', () => {
  describe('topic name validation', () => {
    test('should pass with valid topic name', () => {
      const topic = {
        topic: 'Delirium',
        flashcards: [{ q: 'Q', a: 'Answer here' }],
        mcqs: [],
      };
      const issues = validateTopic(topic);
      expect(issues.some((i) => i.includes('topic name'))).toBe(false);
    });

    test('should fail with missing topic name', () => {
      const topic = {
        flashcards: [],
        mcqs: [],
      };
      const issues = validateTopic(topic);
      expect(issues.some((i) => i.includes('Missing or empty topic name'))).toBe(true);
    });

    test('should fail with empty topic name', () => {
      const topic = {
        topic: '',
        flashcards: [],
        mcqs: [],
      };
      const issues = validateTopic(topic);
      expect(issues.some((i) => i.includes('Missing or empty topic name'))).toBe(true);
    });

    test('should return early if topic name is missing', () => {
      const topic = {
        flashcards: 'not an array',
        mcqs: 'not an array',
      };
      const issues = validateTopic(topic);
      // Should only have the topic name issue
      expect(issues.length).toBe(1);
      expect(issues[0]).toContain('topic name');
    });
  });

  describe('flashcards validation', () => {
    test('should fail if flashcards is not an array', () => {
      const topic = {
        topic: 'Test',
        flashcards: 'not an array',
        mcqs: [],
      };
      const issues = validateTopic(topic);
      expect(issues.some((i) => i.includes('flashcards must be an array'))).toBe(true);
    });

    test('should warn about empty flashcards', () => {
      const topic = {
        topic: 'Test',
        flashcards: [],
        mcqs: [{ q: 'Q', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' }],
      };
      const issues = validateTopic(topic);
      expect(issues.some((i) => i.includes('No flashcards defined'))).toBe(true);
    });

    test('should validate each flashcard', () => {
      const topic = {
        topic: 'Test',
        flashcards: [
          { q: '', a: 'Answer' },
          { q: 'Question', a: '' },
        ],
        mcqs: [],
      };
      const issues = validateTopic(topic);
      expect(issues.filter((i) => i.includes('Flashcard')).length).toBeGreaterThan(0);
    });
  });

  describe('mcqs validation', () => {
    test('should fail if mcqs is not an array', () => {
      const topic = {
        topic: 'Test',
        flashcards: [],
        mcqs: 'not an array',
      };
      const issues = validateTopic(topic);
      expect(issues.some((i) => i.includes('mcqs must be an array'))).toBe(true);
    });

    test('should warn about empty mcqs', () => {
      const topic = {
        topic: 'Test',
        flashcards: [{ q: 'Q', a: 'Answer here' }],
        mcqs: [],
      };
      const issues = validateTopic(topic);
      expect(issues.some((i) => i.includes('No MCQs defined'))).toBe(true);
    });

    test('should warn about few mcqs (less than 5)', () => {
      const topic = {
        topic: 'Test',
        flashcards: [{ q: 'Q', a: 'Answer here' }],
        mcqs: [{ q: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'E' }],
      };
      const issues = validateTopic(topic);
      expect(issues.some((i) => i.includes('5+ recommended'))).toBe(true);
    });

    test('should validate each MCQ', () => {
      const topic = {
        topic: 'Test',
        flashcards: [],
        mcqs: [
          { q: '', options: ['A', 'B', 'C', 'D'], correct: 'A' },
          { q: 'Question', options: ['A'], correct: 'A' },
        ],
      };
      const issues = validateTopic(topic);
      expect(issues.filter((i) => i.includes('Question')).length).toBeGreaterThan(0);
    });
  });

  describe('valid topic', () => {
    test('should return empty issues for valid topic', () => {
      const topic = {
        topic: 'Delirium',
        flashcards: [
          { q: 'What is delirium?', a: 'Acute confusional state' },
          { q: 'Common cause?', a: 'Infection, medication, dehydration' },
        ],
        mcqs: [
          { q: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'Explanation 1' },
          { q: 'Q2', options: ['A', 'B', 'C', 'D'], correct: 'B', explanation: 'Explanation 2' },
          { q: 'Q3', options: ['A', 'B', 'C', 'D'], correct: 'C', explanation: 'Explanation 3' },
          { q: 'Q4', options: ['A', 'B', 'C', 'D'], correct: 'D', explanation: 'Explanation 4' },
          { q: 'Q5', options: ['A', 'B', 'C', 'D'], correct: 'A', explanation: 'Explanation 5' },
        ],
      };
      const issues = validateTopic(topic);
      expect(issues).toHaveLength(0);
    });
  });
});

describe('colors export', () => {
  test('should export color codes', () => {
    expect(colors).toBeDefined();
    expect(colors.reset).toBeDefined();
    expect(colors.red).toBeDefined();
    expect(colors.green).toBeDefined();
    expect(colors.yellow).toBeDefined();
    expect(colors.blue).toBeDefined();
    expect(colors.cyan).toBeDefined();
  });
});

describe('log export', () => {
  test('should export log functions', () => {
    expect(log).toBeDefined();
    expect(typeof log.info).toBe('function');
    expect(typeof log.success).toBe('function');
    expect(typeof log.warning).toBe('function');
    expect(typeof log.error).toBe('function');
    expect(typeof log.section).toBe('function');
  });
});
