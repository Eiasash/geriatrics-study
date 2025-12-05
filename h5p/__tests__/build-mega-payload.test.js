/**
 * Tests for build-h5p-mega.js buildQuestionSetPayload function
 */

const { buildQuestionSetPayload } = require('../build-h5p-mega.js');

describe('buildQuestionSetPayload', () => {
  const sampleMcqs = [
    {
      q: 'What is delirium?',
      options: ['Acute confusion', 'Chronic confusion', 'Depression', 'Anxiety'],
      correct: 'Acute confusion',
    },
    {
      q: 'What is frailty?',
      options: ['Weakness', 'Strength', 'Agility', 'Speed'],
      correct: 'Weakness',
    },
  ];

  describe('basic structure', () => {
    test('should return valid mega quiz payload', () => {
      const result = buildQuestionSetPayload({
        title: 'Mega Quiz',
        mcqs: sampleMcqs,
      });

      expect(result).toBeDefined();
      expect(result.title).toBe('Mega Quiz');
      expect(result.language).toBe('he');
      expect(result.mainLibrary).toBe('H5P.QuestionSet');
      expect(result.embedTypes).toEqual(['div']);
    });

    test('should include correct preloaded dependencies', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

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

    test('should have content with all required sections', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content).toBeDefined();
      expect(result.content.questionSet).toBeDefined();
      expect(result.content.behaviour).toBeDefined();
      expect(result.content.introPage).toBeDefined();
      expect(result.content.endPage).toBeDefined();
      expect(result.content.override).toBeDefined();
    });
  });

  describe('RTL HTML wrapping', () => {
    test('should wrap questions in RTL div', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: [{ q: 'Question?', options: ['A', 'B'], correct: 'A' }],
      });

      const question = result.content.questionSet[0].params.question;
      expect(question).toContain('dir="rtl"');
      expect(question).toContain('text-align:right');
      expect(question).toContain('Question?');
    });

    test('should wrap answers in RTL div', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: [{ q: 'Q?', options: ['Answer A', 'Answer B'], correct: 'Answer A' }],
      });

      const answers = result.content.questionSet[0].params.answers;
      expect(answers[0].text).toContain('dir="rtl"');
      expect(answers[0].text).toContain('Answer A');
    });

    test('should preserve Hebrew content in RTL wrapper', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: [
          {
            q: 'מהו דליריום?',
            options: ['בלבול חריף', 'בלבול כרוני'],
            correct: 'בלבול חריף',
          },
        ],
      });

      const question = result.content.questionSet[0].params.question;
      expect(question).toContain('מהו דליריום?');
    });
  });

  describe('intro page configuration', () => {
    test('should show intro page', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.introPage.showIntroPage).toBe(true);
    });

    test('should set intro page title', () => {
      const result = buildQuestionSetPayload({
        title: 'My Custom Title',
        mcqs: sampleMcqs,
      });

      expect(result.content.introPage.title).toBe('My Custom Title');
    });

    test('should include custom intro HTML', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
        introHtml: 'Welcome to the quiz!',
      });

      expect(result.content.introPage.introduction).toContain('Welcome to the quiz!');
      expect(result.content.introPage.introduction).toContain('dir="rtl"');
    });

    test('should handle empty intro HTML', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
        introHtml: '',
      });

      expect(result.content.introPage.introduction).toBeDefined();
    });

    test('should handle undefined intro HTML', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.introPage.introduction).toBeDefined();
    });
  });

  describe('end page configuration', () => {
    test('should enable solution button on end page', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.endPage.showSolutionButton).toBe(true);
    });

    test('should enable summary on end page', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.endPage.showSummary).toBe(true);
    });

    test('should have Hebrew retry button text', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.endPage.retryButtonText).toBe('נסה שוב');
    });

    test('should have Hebrew finish button text', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.endPage.finishButtonText).toBe('סיום');
    });

    test('should include custom end HTML', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
        endHtml: 'Thanks for completing!',
      });

      expect(result.content.endPage.message).toContain('Thanks for completing!');
    });

    test('should have override settings in end page', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.endPage.override.showSolutionButton).toBe('enabled');
      expect(result.content.endPage.override.retryButton).toBe('enabled');
    });
  });

  describe('pass percentage configuration', () => {
    test('should use default pass percentage of 70', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.behaviour.passPercentage).toBe(70);
    });

    test('should use custom pass percentage', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
        passPercentage: 80,
      });

      expect(result.content.behaviour.passPercentage).toBe(80);
    });

    test('should handle pass percentage of 0', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
        passPercentage: 0,
      });

      expect(result.content.behaviour.passPercentage).toBe(0);
    });

    test('should handle pass percentage of 100', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
        passPercentage: 100,
      });

      expect(result.content.behaviour.passPercentage).toBe(100);
    });

    test('should handle null pass percentage with default', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
        passPercentage: null,
      });

      expect(result.content.behaviour.passPercentage).toBe(70);
    });
  });

  describe('behaviour settings', () => {
    test('should disable auto continue', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.behaviour.autoContinue).toBe(false);
    });

    test('should enable retry', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.behaviour.enableRetry).toBe(true);
    });

    test('should enable solutions button', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.behaviour.enableSolutionsButton).toBe(true);
    });

    test('should set progress type to textual', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.progressType).toBe('textual');
    });
  });

  describe('question behaviour settings', () => {
    test('should enable random answers for each question', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      result.content.questionSet.forEach((q) => {
        expect(q.params.behaviour.randomAnswers).toBe(true);
      });
    });

    test('should set single answer mode for each question', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      result.content.questionSet.forEach((q) => {
        expect(q.params.behaviour.singleAnswer).toBe(true);
      });
    });

    test('should enable solution button for each question', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      result.content.questionSet.forEach((q) => {
        expect(q.params.behaviour.showSolutionButton).toBe(true);
      });
    });
  });

  describe('override settings', () => {
    test('should enable solution button in override', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.override.showSolutionButton).toBe('enabled');
    });

    test('should enable retry button in override', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: sampleMcqs,
      });

      expect(result.content.override.retryButton).toBe('enabled');
    });
  });

  describe('edge cases', () => {
    test('should handle empty MCQ array', () => {
      const result = buildQuestionSetPayload({
        title: 'Empty',
        mcqs: [],
      });

      expect(result.content.questionSet).toHaveLength(0);
    });

    test('should handle large number of MCQs', () => {
      const largeMcqs = Array(100)
        .fill(null)
        .map((_, i) => ({
          q: `Question ${i}`,
          options: ['A', 'B', 'C', 'D'],
          correct: 'A',
        }));

      const result = buildQuestionSetPayload({
        title: 'Large',
        mcqs: largeMcqs,
      });

      expect(result.content.questionSet).toHaveLength(100);
    });

    test('should mark correct answer properly when it is the first option', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: [{ q: 'Q', options: ['Correct', 'Wrong1', 'Wrong2'], correct: 'Correct' }],
      });

      const answers = result.content.questionSet[0].params.answers;
      expect(answers[0].correct).toBe(true);
      expect(answers[1].correct).toBe(false);
      expect(answers[2].correct).toBe(false);
    });

    test('should mark correct answer properly when it is the last option', () => {
      const result = buildQuestionSetPayload({
        title: 'Test',
        mcqs: [{ q: 'Q', options: ['Wrong1', 'Wrong2', 'Correct'], correct: 'Correct' }],
      });

      const answers = result.content.questionSet[0].params.answers;
      expect(answers[0].correct).toBe(false);
      expect(answers[1].correct).toBe(false);
      expect(answers[2].correct).toBe(true);
    });
  });
});
