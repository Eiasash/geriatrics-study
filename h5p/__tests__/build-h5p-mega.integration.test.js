/**
 * Integration tests for build-h5p-mega.js main function
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
  pathExists: jest.fn().mockResolvedValue(false),
  copy: jest.fn().mockResolvedValue(),
};
jest.mock('fs-extra', () => mockFs);

const { execSync } = require('child_process');

describe('build-h5p-mega.js integration', () => {
  let buildMega;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Reset environment
    process.env = { ...originalEnv };
    delete process.env.TOPICS;
    delete process.env.PASS;

    jest.mock('child_process', () => ({
      execSync: jest.fn(),
    }));
    jest.mock('fs-extra', () => mockFs);

    buildMega = require('../build-h5p-mega.js');
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('main function', () => {
    test('should aggregate MCQs from all topics by default', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Topic 1',
            mcqs: [{ q: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 'A' }],
          },
          {
            topic: 'Topic 2',
            mcqs: [{ q: 'Q2', options: ['E', 'F', 'G', 'H'], correct: 'E' }],
          },
        ])
      );

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      expect(contentJsonCall).toBeDefined();

      const content = contentJsonCall[1];
      expect(content.questionSet).toHaveLength(2);
    });

    test('should filter topics when TOPICS env var is set', async () => {
      process.env.TOPICS = 'Topic 1';

      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Topic 1',
            mcqs: [{ q: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 'A' }],
          },
          {
            topic: 'Topic 2',
            mcqs: [{ q: 'Q2', options: ['E', 'F', 'G', 'H'], correct: 'E' }],
          },
        ])
      );

      // Need to re-require after setting env
      jest.resetModules();
      jest.mock('child_process', () => ({ execSync: jest.fn() }));
      jest.mock('fs-extra', () => mockFs);
      buildMega = require('../build-h5p-mega.js');

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      expect(content.questionSet).toHaveLength(1);
    });

    test('should support multiple topics in TOPICS env var', async () => {
      process.env.TOPICS = 'Topic 1,Topic 3';

      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
          { topic: 'Topic 2', mcqs: [{ q: 'Q2', options: ['C', 'D'], correct: 'C' }] },
          { topic: 'Topic 3', mcqs: [{ q: 'Q3', options: ['E', 'F'], correct: 'E' }] },
        ])
      );

      jest.resetModules();
      jest.mock('child_process', () => ({ execSync: jest.fn() }));
      jest.mock('fs-extra', () => mockFs);
      buildMega = require('../build-h5p-mega.js');

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      expect(content.questionSet).toHaveLength(2);
    });

    test('should use custom pass percentage from PASS env var', async () => {
      process.env.PASS = '85';

      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      jest.resetModules();
      jest.mock('child_process', () => ({ execSync: jest.fn() }));
      jest.mock('fs-extra', () => mockFs);
      buildMega = require('../build-h5p-mega.js');

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      expect(content.behaviour.passPercentage).toBe(85);
    });

    test('should use default pass percentage of 70', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      expect(content.behaviour.passPercentage).toBe(70);
    });

    test('should create temp directory with mega prefix', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      const calls = mockFs.ensureDir.mock.calls;
      expect(calls.some((c) => c[0].includes('.tmp_mega_'))).toBe(true);
    });

    test('should output to Mega_QuestionSet.h5p', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      const execCall = execSync.mock.calls[0];
      if (execCall) {
        expect(execCall[0]).toContain('Mega_QuestionSet.h5p');
      }
    });

    test('should wrap questions in RTL div', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Hebrew question?', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      const question = content.questionSet[0].params.question;

      expect(question).toContain('dir="rtl"');
      expect(question).toContain('text-align:right');
    });

    test('should clean up temp directory after build', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      expect(mockFs.remove).toHaveBeenCalled();
    });

    test('should show intro page', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];

      expect(content.introPage.showIntroPage).toBe(true);
      expect(content.introPage.title).toBeDefined();
    });

    test('should have Hebrew button text on end page', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];

      expect(content.endPage.retryButtonText).toBe('נסה שוב');
      expect(content.endPage.finishButtonText).toBe('סיום');
    });
  });

  describe('logo handling', () => {
    test('should include logo when it exists', async () => {
      mockFs.pathExists.mockResolvedValue(true);
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      expect(mockFs.copy).toHaveBeenCalled();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];

      expect(content.introPage.introduction).toContain('img');
      expect(content.introPage.introduction).toContain('logo.png');
    });

    test('should work without logo', async () => {
      mockFs.pathExists.mockResolvedValue(false);
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
        ])
      );

      await buildMega();

      expect(mockFs.copy).not.toHaveBeenCalled();
    });
  });

  describe('MCQ aggregation', () => {
    test('should skip topics without MCQs', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Has MCQs', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
          { topic: 'No MCQs', flashcards: [{ q: 'Q', a: 'A' }] },
          { topic: 'Empty MCQs', mcqs: [] },
        ])
      );

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      expect(content.questionSet).toHaveLength(1);
    });

    test('should handle topics with undefined mcqs property', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Has MCQs', mcqs: [{ q: 'Q1', options: ['A', 'B'], correct: 'A' }] },
          { topic: 'No MCQs property' },
        ])
      );

      await buildMega();

      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      const content = contentJsonCall[1];
      expect(content.questionSet).toHaveLength(1);
    });
  });

  describe('exports', () => {
    test('should export buildQuestionSetPayload function', () => {
      expect(buildMega.buildQuestionSetPayload).toBeDefined();
      expect(typeof buildMega.buildQuestionSetPayload).toBe('function');
    });
  });

  describe('readJson helper', () => {
    test('should be exported for testing', () => {
      expect(buildMega.readJson).toBeDefined();
      expect(typeof buildMega.readJson).toBe('function');
    });
  });
});
