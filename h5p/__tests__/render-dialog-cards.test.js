/**
 * Tests for build-h5p.js renderDialogCards function
 */

const { renderDialogCards } = require('../build-h5p.js');

describe('renderDialogCards', () => {
  describe('basic structure', () => {
    test('should return valid H5P DialogCards structure', () => {
      const pairs = [{ q: 'Question 1', a: 'Answer 1' }];
      const result = renderDialogCards('Test Topic', pairs);

      expect(result).toBeDefined();
      expect(result.title).toBe('Test Topic');
      expect(result.language).toBe('he');
      expect(result.mainLibrary).toBe('H5P.Dialogcards');
    });

    test('should include correct preloaded dependencies', () => {
      const pairs = [{ q: 'Q', a: 'A' }];
      const result = renderDialogCards('Test', pairs);

      expect(result.preloadedDependencies).toBeDefined();
      expect(Array.isArray(result.preloadedDependencies)).toBe(true);
      expect(result.preloadedDependencies).toHaveLength(1);
      expect(result.preloadedDependencies[0]).toEqual({
        machineName: 'H5P.Dialogcards',
        majorVersion: 1,
        minorVersion: 8,
      });
    });

    test('should have content property with cards and behaviour', () => {
      const pairs = [{ q: 'Q', a: 'A' }];
      const result = renderDialogCards('Test', pairs);

      expect(result.content).toBeDefined();
      expect(result.content.cards).toBeDefined();
      expect(result.content.behaviour).toBeDefined();
    });
  });

  describe('cards mapping', () => {
    test('should map single pair correctly', () => {
      const pairs = [{ q: 'What is delirium?', a: 'Acute confusional state' }];
      const result = renderDialogCards('Delirium', pairs);

      expect(result.content.cards).toHaveLength(1);
      expect(result.content.cards[0]).toEqual({
        text: 'What is delirium?',
        answer: 'Acute confusional state',
      });
    });

    test('should map multiple pairs correctly', () => {
      const pairs = [
        { q: 'Q1', a: 'A1' },
        { q: 'Q2', a: 'A2' },
        { q: 'Q3', a: 'A3' },
      ];
      const result = renderDialogCards('Test', pairs);

      expect(result.content.cards).toHaveLength(3);
      expect(result.content.cards[0].text).toBe('Q1');
      expect(result.content.cards[1].text).toBe('Q2');
      expect(result.content.cards[2].text).toBe('Q3');
    });

    test('should handle empty pairs array', () => {
      const pairs = [];
      const result = renderDialogCards('Empty Topic', pairs);

      expect(result.content.cards).toHaveLength(0);
    });

    test('should preserve Hebrew content', () => {
      const pairs = [{ q: 'מהו דליריום?', a: 'מצב בלבול חריף' }];
      const result = renderDialogCards('דליריום', pairs);

      expect(result.title).toBe('דליריום');
      expect(result.content.cards[0].text).toBe('מהו דליריום?');
      expect(result.content.cards[0].answer).toBe('מצב בלבול חריף');
    });
  });

  describe('behaviour settings', () => {
    test('should have randomizeCards enabled', () => {
      const pairs = [{ q: 'Q', a: 'A' }];
      const result = renderDialogCards('Test', pairs);

      expect(result.content.behaviour.randomizeCards).toBe(true);
    });

    test('should have scaleText disabled', () => {
      const pairs = [{ q: 'Q', a: 'A' }];
      const result = renderDialogCards('Test', pairs);

      expect(result.content.behaviour.scaleText).toBe(false);
    });

    test('should have disableBack disabled', () => {
      const pairs = [{ q: 'Q', a: 'A' }];
      const result = renderDialogCards('Test', pairs);

      expect(result.content.behaviour.disableBack).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should handle very long content', () => {
      const longQuestion = 'Q'.repeat(1000);
      const longAnswer = 'A'.repeat(1000);
      const pairs = [{ q: longQuestion, a: longAnswer }];
      const result = renderDialogCards('Long Content', pairs);

      expect(result.content.cards[0].text).toBe(longQuestion);
      expect(result.content.cards[0].answer).toBe(longAnswer);
    });

    test('should handle special characters in title', () => {
      const result = renderDialogCards('Test: Topic (With Special) <chars>', [
        { q: 'Q', a: 'A' },
      ]);

      expect(result.title).toBe('Test: Topic (With Special) <chars>');
    });

    test('should handle content with HTML-like strings', () => {
      const pairs = [{ q: '<b>Bold?</b>', a: '<i>Italic</i>' }];
      const result = renderDialogCards('HTML Test', pairs);

      expect(result.content.cards[0].text).toBe('<b>Bold?</b>');
      expect(result.content.cards[0].answer).toBe('<i>Italic</i>');
    });

    test('should handle content with newlines', () => {
      const pairs = [{ q: 'Line1\nLine2', a: 'Answer\nMultiline' }];
      const result = renderDialogCards('Newline Test', pairs);

      expect(result.content.cards[0].text).toContain('\n');
      expect(result.content.cards[0].answer).toContain('\n');
    });
  });
});
