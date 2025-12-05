/**
 * Integration tests for build-h5p-questionset.js main function
 */

const path = require('path');

// Mock child_process before requiring the module
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

// Mock fs-extra with tracking
const mockFs = {
  ensureDir: jest.fn().mockResolvedValue(),
  readFile: jest.fn(),
  writeJson: jest.fn().mockResolvedValue(),
  remove: jest.fn().mockResolvedValue(),
  rename: jest.fn().mockResolvedValue(),
};
jest.mock('fs-extra', () => mockFs);

const { execSync } = require('child_process');

describe('build-h5p-questionset.js integration', () => {
  let buildQset;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    jest.mock('child_process', () => ({
      execSync: jest.fn(),
    }));
    jest.mock('fs-extra', () => mockFs);

    buildQset = require('../build-h5p-questionset.js');
  });

  describe('main function', () => {
    test('should skip topics without MCQs', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Empty Topic', mcqs: [] },
          { topic: 'Another Empty' }, // no mcqs property
        ])
      );

      await buildQset();

      expect(mockFs.ensureDir).toHaveBeenCalled();
      expect(mockFs.writeJson).not.toHaveBeenCalled();
    });

    test('should process topics with MCQs', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Delirium',
            mcqs: [
              {
                q: 'What is delirium?',
                options: ['Acute confusion', 'Chronic confusion', 'Depression', 'Anxiety'],
                correct: 'Acute confusion',
              },
            ],
          },
        ])
      );

      await buildQset();

      // Should create h5p.json and content.json
      expect(mockFs.writeJson).toHaveBeenCalledTimes(2);
    });

    test('should create temp directory with qset prefix', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            mcqs: [{ q: 'Q', options: ['A', 'B'], correct: 'A' }],
          },
        ])
      );

      await buildQset();

      const calls = mockFs.ensureDir.mock.calls;
      expect(calls.some((c) => c[0].includes('.tmp_qset_'))).toBe(true);
    });

    test('should clean up temp directory after build', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            mcqs: [{ q: 'Q', options: ['A', 'B'], correct: 'A' }],
          },
        ])
      );

      await buildQset();

      expect(mockFs.remove).toHaveBeenCalled();
    });

    test('should sanitize filename with special characters', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test: Topic/With<Special>Chars',
            mcqs: [{ q: 'Q', options: ['A', 'B'], correct: 'A' }],
          },
        ])
      );

      await buildQset();

      // Verify build completes
      expect(mockFs.writeJson).toHaveBeenCalled();
    });

    test('should write h5p.json with QuestionSet structure', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            mcqs: [{ q: 'Q', options: ['A', 'B'], correct: 'A' }],
          },
        ])
      );

      await buildQset();

      const h5pJsonCall = mockFs.writeJson.mock.calls.find((c) => c[0].endsWith('h5p.json'));
      expect(h5pJsonCall).toBeDefined();

      const h5pJson = h5pJsonCall[1];
      expect(h5pJson.title).toContain('Test Topic');
      expect(h5pJson.title).toContain('Question Set');
      expect(h5pJson.language).toBe('he');
      expect(h5pJson.mainLibrary).toBe('H5P.QuestionSet');
      expect(h5pJson.embedTypes).toContain('div');
    });

    test('should include both QuestionSet and MultiChoice dependencies', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            mcqs: [{ q: 'Q', options: ['A', 'B'], correct: 'A' }],
          },
        ])
      );

      await buildQset();

      const h5pJsonCall = mockFs.writeJson.mock.calls.find((c) => c[0].endsWith('h5p.json'));
      const h5pJson = h5pJsonCall[1];

      expect(h5pJson.preloadedDependencies).toContainEqual(
        expect.objectContaining({ machineName: 'H5P.QuestionSet' })
      );
      expect(h5pJson.preloadedDependencies).toContainEqual(
        expect.objectContaining({ machineName: 'H5P.MultiChoice' })
      );
    });

    test('should write content.json with question set data', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            mcqs: [
              { q: 'Question 1', options: ['A', 'B', 'C', 'D'], correct: 'A' },
              { q: 'Question 2', options: ['E', 'F', 'G', 'H'], correct: 'E' },
            ],
          },
        ])
      );

      await buildQset();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      expect(contentJsonCall).toBeDefined();

      const content = contentJsonCall[1];
      expect(content.questionSet).toHaveLength(2);
      expect(content.behaviour).toBeDefined();
      expect(content.behaviour.passPercentage).toBe(60);
    });

    test('should mark correct answers properly', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            mcqs: [{ q: 'Q', options: ['Wrong', 'Correct', 'Also Wrong'], correct: 'Correct' }],
          },
        ])
      );

      await buildQset();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      const answers = content.questionSet[0].params.answers;

      expect(answers[0].correct).toBe(false);
      expect(answers[1].correct).toBe(true);
      expect(answers[2].correct).toBe(false);
    });

    test('should process multiple topics with MCQs', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
          { topic: 'Topic 2', mcqs: [{ q: 'Q2', options: ['C', 'D'], correct: 'C' }] },
        ])
      );

      await buildQset();

      expect(mockFs.writeJson).toHaveBeenCalledTimes(4); // 2 topics * 2 files
    });

    test('should configure question behaviour correctly', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test',
            mcqs: [{ q: 'Q', options: ['A', 'B'], correct: 'A' }],
          },
        ])
      );

      await buildQset();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      const questionBehaviour = content.questionSet[0].params.behaviour;

      expect(questionBehaviour.randomAnswers).toBe(true);
      expect(questionBehaviour.singleAnswer).toBe(true);
      expect(questionBehaviour.showSolutionButton).toBe(true);
      expect(questionBehaviour.enableRetry).toBe(true);
    });

    test('should configure intro page as hidden', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test',
            mcqs: [{ q: 'Q', options: ['A', 'B'], correct: 'A' }],
          },
        ])
      );

      await buildQset();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];

      expect(content.introPage.showIntroPage).toBe(false);
    });

    test('should configure end page with solution and summary', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test',
            mcqs: [{ q: 'Q', options: ['A', 'B'], correct: 'A' }],
          },
        ])
      );

      await buildQset();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];

      expect(content.endPage.showSolutionButton).toBe(true);
      expect(content.endPage.showSummary).toBe(true);
    });
  });

  describe('renderQuestionSet export', () => {
    test('should export renderQuestionSet function', () => {
      expect(buildQset.renderQuestionSet).toBeDefined();
      expect(typeof buildQset.renderQuestionSet).toBe('function');
    });
  });
});
