/**
 * Integration tests for build-h5p.js main function
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

describe('build-h5p.js integration', () => {
  let buildH5p;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset module cache to get fresh require
    jest.resetModules();

    // Re-setup mocks after reset
    jest.mock('child_process', () => ({
      execSync: jest.fn(),
    }));
    jest.mock('fs-extra', () => mockFs);

    buildH5p = require('../build-h5p.js');
  });

  describe('main function', () => {
    test('should skip topics without flashcards', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Empty Topic', flashcards: [] },
          { topic: 'Another Empty', flashcards: [] },
        ])
      );

      await buildH5p();

      expect(mockFs.ensureDir).toHaveBeenCalled();
      // Should not write any files since all topics have empty flashcards
      expect(mockFs.writeJson).not.toHaveBeenCalled();
    });

    test('should process topics with flashcards', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Delirium',
            flashcards: [
              { q: 'What is delirium?', a: 'Acute confusion' },
              { q: 'Common causes?', a: 'Infection, meds' },
            ],
          },
        ])
      );

      await buildH5p();

      // Should create h5p.json and content.json
      expect(mockFs.writeJson).toHaveBeenCalledTimes(2);
    });

    test('should create temp directory for each topic', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            flashcards: [{ q: 'Q', a: 'A' }],
          },
        ])
      );

      await buildH5p();

      // Should create multiple directories (dist + temp + temp/content)
      expect(mockFs.ensureDir).toHaveBeenCalled();
      const calls = mockFs.ensureDir.mock.calls;
      expect(calls.some((c) => c[0].includes('.tmp_'))).toBe(true);
    });

    test('should clean up temp directory after build', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            flashcards: [{ q: 'Q', a: 'A' }],
          },
        ])
      );

      await buildH5p();

      expect(mockFs.remove).toHaveBeenCalled();
    });

    test('should sanitize filename with special characters', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test: Topic/With<Special>Chars',
            flashcards: [{ q: 'Q', a: 'A' }],
          },
        ])
      );

      await buildH5p();

      // Verify build completes successfully by checking writeJson was called
      expect(mockFs.writeJson).toHaveBeenCalled();
    });

    test('should write h5p.json with correct structure', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            flashcards: [{ q: 'Q', a: 'A' }],
          },
        ])
      );

      await buildH5p();

      // Find the h5p.json write call
      const h5pJsonCall = mockFs.writeJson.mock.calls.find((c) => c[0].endsWith('h5p.json'));
      expect(h5pJsonCall).toBeDefined();

      const h5pJson = h5pJsonCall[1];
      expect(h5pJson.title).toContain('Test Topic');
      expect(h5pJson.language).toBe('he');
      expect(h5pJson.mainLibrary).toBe('H5P.Dialogcards');
      expect(h5pJson.embedTypes).toContain('div');
      expect(h5pJson.preloadedDependencies).toBeDefined();
    });

    test('should write content.json with cards data', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            topic: 'Test Topic',
            flashcards: [
              { q: 'Question 1', a: 'Answer 1' },
              { q: 'Question 2', a: 'Answer 2' },
            ],
          },
        ])
      );

      await buildH5p();

      // Find the content.json write call
      const contentJsonCall = mockFs.writeJson.mock.calls.find((c) =>
        c[0].endsWith('content.json')
      );
      expect(contentJsonCall).toBeDefined();

      const contentData = contentJsonCall[1];
      // The content.json contains the full renderDialogCards result
      expect(contentData.content.cards).toHaveLength(2);
      expect(contentData.content.cards[0].text).toBe('Question 1');
      expect(contentData.content.cards[0].answer).toBe('Answer 1');
    });

    test('should process multiple topics', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Topic 1', flashcards: [{ q: 'Q1', a: 'A1' }] },
          { topic: 'Topic 2', flashcards: [{ q: 'Q2', a: 'A2' }] },
          { topic: 'Topic 3', flashcards: [{ q: 'Q3', a: 'A3' }] },
        ])
      );

      await buildH5p();

      // Should create 2 files (h5p.json + content.json) per topic = 6 total
      expect(mockFs.writeJson).toHaveBeenCalledTimes(6);
    });

    test('should handle mixed topics (some with, some without flashcards)', async () => {
      mockFs.readFile.mockResolvedValue(
        JSON.stringify([
          { topic: 'Has Cards', flashcards: [{ q: 'Q', a: 'A' }] },
          { topic: 'No Cards', flashcards: [] },
          { topic: 'Also Has Cards', flashcards: [{ q: 'Q2', a: 'A2' }] },
        ])
      );

      await buildH5p();

      // Should only process 2 topics
      expect(mockFs.writeJson).toHaveBeenCalledTimes(4); // 2 topics * 2 files
    });
  });

  describe('renderDialogCards export', () => {
    test('should export renderDialogCards function', () => {
      expect(buildH5p.renderDialogCards).toBeDefined();
      expect(typeof buildH5p.renderDialogCards).toBe('function');
    });
  });
});
