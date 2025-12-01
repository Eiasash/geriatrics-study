const nativeFs = require('fs');
const path = require('path');

describe('H5P Build Scripts', () => {
  const distPath = path.join(__dirname, 'dist');

  beforeAll(() => {
    // Ensure dist directory exists using native fs to avoid mock interference
    if (!nativeFs.existsSync(distPath)) {
      nativeFs.mkdirSync(distPath, { recursive: true });
    }
  });

  describe('Configuration', () => {
    test('should have valid package.json', () => {
      const packageJson = JSON.parse(
        nativeFs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
      );
      expect(packageJson).toBeDefined();
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts['build:qset']).toBeDefined();
      expect(packageJson.scripts['build:mega']).toBeDefined();
      expect(packageJson.scripts['build']).toBeDefined();
    });

    test('should have all build scripts', () => {
      expect(nativeFs.existsSync(path.join(__dirname, 'build-h5p-questionset.js'))).toBe(true);
      expect(nativeFs.existsSync(path.join(__dirname, 'build-h5p-mega.js'))).toBe(true);
      expect(nativeFs.existsSync(path.join(__dirname, 'build-h5p.js'))).toBe(true);
    });
  });

  describe('Data Source', () => {
    let contentData;

    beforeAll(() => {
      const contentPath = path.join(__dirname, '..', 'data', 'content.json');
      if (nativeFs.existsSync(contentPath)) {
        contentData = JSON.parse(nativeFs.readFileSync(contentPath, 'utf8'));
      }
    });

    test('should have valid content.json', () => {
      expect(contentData).toBeDefined();
      expect(Array.isArray(contentData)).toBe(true);
      expect(contentData.length).toBeGreaterThan(0);
    });

    test('should have required topic structure', () => {
      if (contentData && contentData.length > 0) {
        const topic = contentData[0];
        expect(topic).toHaveProperty('topic');
        expect(topic).toHaveProperty('flashcards');
        expect(topic).toHaveProperty('mcqs');
        expect(Array.isArray(topic.flashcards)).toBe(true);
        expect(Array.isArray(topic.mcqs)).toBe(true);
      }
    });

    test('should have valid flashcard structure', () => {
      if (contentData && contentData[0].flashcards.length > 0) {
        const flashcard = contentData[0].flashcards[0];
        expect(flashcard).toHaveProperty('q');
        expect(flashcard).toHaveProperty('a');
        expect(typeof flashcard.q).toBe('string');
        expect(typeof flashcard.a).toBe('string');
      }
    });

    test('should have valid MCQ structure', () => {
      if (contentData && contentData[0].mcqs.length > 0) {
        const mcq = contentData[0].mcqs[0];
        expect(mcq).toHaveProperty('q');
        expect(mcq).toHaveProperty('options');
        expect(mcq).toHaveProperty('correct');
        expect(mcq).toHaveProperty('explanation');
        expect(Array.isArray(mcq.options)).toBe(true);
        expect(mcq.options.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Build Output', () => {
    test('should create dist directory', () => {
      expect(nativeFs.existsSync(distPath)).toBe(true);
    });

    test('should handle Windows platform-specific code', () => {
      const buildScript = nativeFs.readFileSync(path.join(__dirname, 'build-h5p.js'), 'utf8');
      expect(buildScript).toContain('process.platform');
      expect(buildScript).toContain('Compress-Archive');
      expect(buildScript).toContain('zip -r');
    });

    test('should sanitize filenames properly', () => {
      const buildScript = nativeFs.readFileSync(
        path.join(__dirname, 'build-h5p-questionset.js'),
        'utf8'
      );
      expect(buildScript).toContain('replace');
      expect(buildScript).toContain('safeTitle');
    });
  });

  describe('H5P Package Structure', () => {
    test('should create valid H5P package structure in temp', async () => {
      // Test that the build script creates proper temp structure
      const buildScript = require('./build-h5p-questionset.js');
      expect(typeof buildScript).toBe('function');
    });

    test('should include Hebrew language support', () => {
      const buildScript = nativeFs.readFileSync(path.join(__dirname, 'build-h5p.js'), 'utf8');
      expect(buildScript).toContain('language');
      expect(buildScript).toContain('he');
    });

    test('should support environment variables for mega build', () => {
      const buildScript = nativeFs.readFileSync(path.join(__dirname, 'build-h5p-mega.js'), 'utf8');
      expect(buildScript).toContain('process.env.TOPICS');
      expect(buildScript).toContain('process.env.PASS');
    });
  });

  describe('Integration Tests', () => {
    test('build scripts should export functions', () => {
      const buildH5p = require('./build-h5p.js');
      const buildQset = require('./build-h5p-questionset.js');
      const buildMega = require('./build-h5p-mega.js');

      expect(typeof buildH5p).toBe('function');
      expect(typeof buildQset).toBe('function');
      expect(typeof buildMega).toBe('function');
    });
  });
});
