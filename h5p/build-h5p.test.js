import { describe, it, expect, beforeAll } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';

describe('H5P Build Scripts', () => {
  describe('Configuration', () => {
    it('should have valid package.json', () => {
      const packageJson = fs.readJsonSync('./package.json');
      expect(packageJson).toBeDefined();
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts['build:qset']).toBeDefined();
      expect(packageJson.scripts['build:mega']).toBeDefined();
    });

    it('should have build scripts', () => {
      expect(fs.existsSync('./build-h5p-questionset.js')).toBe(true);
      expect(fs.existsSync('./build-h5p-mega.js')).toBe(true);
    });
  });

  describe('Data Source', () => {
    let contentData;

    beforeAll(() => {
      const contentPath = path.join('..', 'data', 'content.json');
      if (fs.existsSync(contentPath)) {
        contentData = fs.readJsonSync(contentPath);
      }
    });

    it('should have valid content.json', () => {
      expect(contentData).toBeDefined();
      expect(contentData.topics).toBeDefined();
      expect(Array.isArray(contentData.topics)).toBe(true);
    });

    it('should have required topic structure', () => {
      if (contentData && contentData.topics.length > 0) {
        const topic = contentData.topics[0];
        expect(topic).toHaveProperty('id');
        expect(topic).toHaveProperty('title');
        expect(topic).toHaveProperty('questions');
        expect(Array.isArray(topic.questions)).toBe(true);
      }
    });
  });

  describe('Output Directory', () => {
    it('should create dist directory', () => {
      const distPath = './dist';
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath, { recursive: true });
      }
      expect(fs.existsSync(distPath)).toBe(true);
    });
  });
});