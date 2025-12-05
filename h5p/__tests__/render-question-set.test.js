/**
 * Tests for build-h5p-questionset.js renderQuestionSet function
 */

const { renderQuestionSet } = require('../build-h5p-questionset.js');

describe('renderQuestionSet', () => {
  const sampleMcqs = [
    {
      q: 'What is the most common cause of delirium in elderly?',
      options: ['Infection', 'Medication', 'Dehydration', 'All of the above'],
      correct: 'All of the above',
    },
  ];

  describe('basic structure', () => {
    test('should return valid H5P QuestionSet structure', () => {
      const result = renderQuestionSet('Test Topic', sampleMcqs);

      expect(result).toBeDefined();
      expect(result.title).toBe('Test Topic – Question Set');
      expect(result.language).toBe('he');
      expect(result.mainLibrary).toBe('H5P.QuestionSet');
      expect(result.embedTypes).toEqual(['div']);
    });

    test('should include correct preloaded dependencies', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.preloadedDependencies).toBeDefined();
      expect(Array.isArray(result.preloadedDependencies)).toBe(true);
      expect(result.preloadedDependencies).toHaveLength(2);
      expect(result.preloadedDependencies).toContainEqual({
        machineName: 'H5P.QuestionSet',
        majorVersion: 1,
        minorVersion: 0,
      });
      expect(result.preloadedDependencies).toContainEqual({
        machineName: 'H5P.MultiChoice',
        majorVersion: 1,
        minorVersion: 0,
      });
    });

    test('should have content with questionSet, behaviour, and pages', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content).toBeDefined();
      expect(result.content.questionSet).toBeDefined();
      expect(result.content.behaviour).toBeDefined();
      expect(result.content.introPage).toBeDefined();
      expect(result.content.endPage).toBeDefined();
    });
  });

  describe('question mapping', () => {
    test('should map single MCQ correctly', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.questionSet).toHaveLength(1);
      const question = result.content.questionSet[0];
      expect(question.library.machineName).toBe('H5P.MultiChoice');
      expect(question.params.question).toBe(sampleMcqs[0].q);
    });

    test('should map multiple MCQs correctly', () => {
      const mcqs = [
        { q: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 'A' },
        { q: 'Q2', options: ['E', 'F', 'G', 'H'], correct: 'E' },
        { q: 'Q3', options: ['I', 'J', 'K', 'L'], correct: 'I' },
      ];
      const result = renderQuestionSet('Multi Test', mcqs);

      expect(result.content.questionSet).toHaveLength(3);
      expect(result.content.questionSet[0].params.question).toBe('Q1');
      expect(result.content.questionSet[1].params.question).toBe('Q2');
      expect(result.content.questionSet[2].params.question).toBe('Q3');
    });

    test('should mark correct answer properly', () => {
      const mcqs = [
        { q: 'Test', options: ['Wrong', 'Correct', 'Wrong2'], correct: 'Correct' },
      ];
      const result = renderQuestionSet('Test', mcqs);

      const answers = result.content.questionSet[0].params.answers;
      expect(answers).toHaveLength(3);
      expect(answers[0].correct).toBe(false);
      expect(answers[1].correct).toBe(true);
      expect(answers[2].correct).toBe(false);
    });

    test('should preserve option order', () => {
      const mcqs = [
        { q: 'Test', options: ['First', 'Second', 'Third', 'Fourth'], correct: 'Second' },
      ];
      const result = renderQuestionSet('Test', mcqs);

      const answers = result.content.questionSet[0].params.answers;
      expect(answers[0].text).toBe('First');
      expect(answers[1].text).toBe('Second');
      expect(answers[2].text).toBe('Third');
      expect(answers[3].text).toBe('Fourth');
    });
  });

  describe('question behaviour settings', () => {
    test('should enable random answers', () => {
      const result = renderQuestionSet('Test', sampleMcqs);
      const behaviour = result.content.questionSet[0].params.behaviour;

      expect(behaviour.randomAnswers).toBe(true);
    });

    test('should set single answer mode', () => {
      const result = renderQuestionSet('Test', sampleMcqs);
      const behaviour = result.content.questionSet[0].params.behaviour;

      expect(behaviour.singleAnswer).toBe(true);
    });

    test('should enable solution button', () => {
      const result = renderQuestionSet('Test', sampleMcqs);
      const behaviour = result.content.questionSet[0].params.behaviour;

      expect(behaviour.showSolutionButton).toBe(true);
    });

    test('should enable retry', () => {
      const result = renderQuestionSet('Test', sampleMcqs);
      const behaviour = result.content.questionSet[0].params.behaviour;

      expect(behaviour.enableRetry).toBe(true);
    });
  });

  describe('quiz-level behaviour settings', () => {
    test('should set autoContinue to false', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.behaviour.autoContinue).toBe(false);
    });

    test('should enable retry at quiz level', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.behaviour.enableRetry).toBe(true);
    });

    test('should enable solutions button at quiz level', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.behaviour.enableSolutionsButton).toBe(true);
    });

    test('should set pass percentage to 60', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.behaviour.passPercentage).toBe(60);
    });

    test('should set progress type to textual', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.progressType).toBe('textual');
    });
  });

  describe('intro and end page settings', () => {
    test('should not show intro page', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.introPage.showIntroPage).toBe(false);
    });

    test('should enable solution button on end page', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.endPage.showSolutionButton).toBe(true);
    });

    test('should enable summary on end page', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.endPage.showSummary).toBe(true);
    });
  });

  describe('override settings', () => {
    test('should enable solution button in override', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.override.showSolutionButton).toBe('enabled');
    });

    test('should enable retry button in override', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.content.override.retryButton).toBe('enabled');
    });
  });

  describe('Hebrew content support', () => {
    test('should preserve Hebrew in questions', () => {
      const hebrewMcqs = [
        {
          q: 'מהו הגורם השכיח ביותר לדליריום?',
          options: ['זיהום', 'תרופות', 'התייבשות', 'כל התשובות נכונות'],
          correct: 'כל התשובות נכונות',
        },
      ];
      const result = renderQuestionSet('דליריום', hebrewMcqs);

      expect(result.content.questionSet[0].params.question).toBe('מהו הגורם השכיח ביותר לדליריום?');
    });

    test('should set language to Hebrew', () => {
      const result = renderQuestionSet('Test', sampleMcqs);

      expect(result.language).toBe('he');
    });
  });

  describe('edge cases', () => {
    test('should handle empty MCQ array', () => {
      const result = renderQuestionSet('Empty', []);

      expect(result.content.questionSet).toHaveLength(0);
    });

    test('should handle MCQ with minimum options (2)', () => {
      const mcqs = [{ q: 'Binary?', options: ['Yes', 'No'], correct: 'Yes' }];
      const result = renderQuestionSet('Binary', mcqs);

      expect(result.content.questionSet[0].params.answers).toHaveLength(2);
    });

    test('should handle MCQ with many options', () => {
      const mcqs = [
        {
          q: 'Many options?',
          options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
          correct: 'D',
        },
      ];
      const result = renderQuestionSet('Many', mcqs);

      expect(result.content.questionSet[0].params.answers).toHaveLength(7);
    });
  });
});
