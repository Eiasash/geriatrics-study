/**
 * Tests for content validation script
 */

const fs = require('fs');
const path = require('path');

describe('Content Validation', () => {
  let contentPath;
  let content;

  beforeAll(() => {
    contentPath = path.join(__dirname, '..', '..', 'data', 'content.json');
    const fileContent = fs.readFileSync(contentPath, 'utf8');
    content = JSON.parse(fileContent);
  });

  test('content.json exists and is valid JSON', () => {
    expect(fs.existsSync(contentPath)).toBe(true);
    expect(content).toBeDefined();
    expect(Array.isArray(content)).toBe(true);
  });

  test('content has at least one topic', () => {
    expect(content.length).toBeGreaterThan(0);
  });

  describe('Topic Structure', () => {
    test('all topics have required fields', () => {
      content.forEach((topic, index) => {
        expect(topic.topic).toBeDefined();
        expect(typeof topic.topic).toBe('string');
        expect(topic.topic.length).toBeGreaterThan(0);
        
        expect(Array.isArray(topic.flashcards)).toBe(true);
        expect(Array.isArray(topic.mcqs)).toBe(true);
      });
    });

    test('topics have meaningful content', () => {
      content.forEach((topic) => {
        const totalContent = topic.flashcards.length + topic.mcqs.length;
        expect(totalContent).toBeGreaterThan(0);
      });
    });
  });

  describe('Flashcard Validation', () => {
    test('flashcards have question and answer', () => {
      content.forEach((topic) => {
        topic.flashcards.forEach((flashcard, index) => {
          const question = flashcard.q || flashcard.term;
          const answer = flashcard.a || flashcard.definition;
          
          expect(question).toBeDefined();
          expect(typeof question).toBe('string');
          expect(question.length).toBeGreaterThan(0);
          
          expect(answer).toBeDefined();
          expect(typeof answer).toBe('string');
          expect(answer.length).toBeGreaterThan(0);
        });
      });
    });

    test('flashcards are not too short', () => {
      content.forEach((topic) => {
        topic.flashcards.forEach((flashcard) => {
          const question = flashcard.q || flashcard.term;
          const answer = flashcard.a || flashcard.definition;
          
          expect(question.length).toBeGreaterThan(2);
          expect(answer.length).toBeGreaterThan(5);
        });
      });
    });
  });

  describe('MCQ Validation', () => {
    test('MCQs have required fields', () => {
      content.forEach((topic) => {
        topic.mcqs.forEach((mcq, index) => {
          const question = mcq.q || mcq.question;
          
          expect(question).toBeDefined();
          expect(typeof question).toBe('string');
          expect(question.length).toBeGreaterThan(0);
          
          expect(Array.isArray(mcq.options)).toBe(true);
          expect(mcq.options.length).toBeGreaterThanOrEqual(2);
          
          const correctAnswer = mcq.correct || mcq.correctAnswer;
          expect(correctAnswer).toBeDefined();
        });
      });
    });

    test('MCQs have at least 2 options', () => {
      content.forEach((topic) => {
        topic.mcqs.forEach((mcq) => {
          expect(mcq.options.length).toBeGreaterThanOrEqual(2);
        });
      });
    });

    test('correct answer exists in options (for string answers)', () => {
      content.forEach((topic) => {
        topic.mcqs.forEach((mcq, index) => {
          const correctAnswer = mcq.correct || mcq.correctAnswer;
          
          if (typeof correctAnswer === 'string') {
            expect(mcq.options).toContain(correctAnswer);
          } else if (typeof correctAnswer === 'number') {
            expect(correctAnswer).toBeGreaterThanOrEqual(0);
            expect(correctAnswer).toBeLessThan(mcq.options.length);
          }
        });
      });
    });

    test('MCQ options are unique', () => {
      content.forEach((topic) => {
        topic.mcqs.forEach((mcq) => {
          const uniqueOptions = new Set(mcq.options);
          expect(uniqueOptions.size).toBe(mcq.options.length);
        });
      });
    });

    test('MCQs have explanations', () => {
      let missingExplanations = 0;
      
      content.forEach((topic) => {
        topic.mcqs.forEach((mcq) => {
          if (!mcq.explanation || mcq.explanation.trim() === '') {
            missingExplanations++;
          }
        });
      });
      
      // Allow some questions to not have explanations
      const totalQuestions = content.reduce((sum, topic) => sum + topic.mcqs.length, 0);
      const explainedPercentage = ((totalQuestions - missingExplanations) / totalQuestions) * 100;
      
      expect(explainedPercentage).toBeGreaterThan(70); // At least 70% should have explanations
    });
  });

  describe('Content Statistics', () => {
    test('content has expected number of topics', () => {
      expect(content.length).toBeGreaterThanOrEqual(10); // Should have at least 10 geriatrics topics
    });

    test('average questions per topic is reasonable', () => {
      const totalQuestions = content.reduce((sum, topic) => sum + topic.mcqs.length, 0);
      const avgQuestions = totalQuestions / content.length;
      
      expect(avgQuestions).toBeGreaterThan(3); // At least 3 questions per topic on average
    });

    test('total content is substantial', () => {
      const totalFlashcards = content.reduce((sum, topic) => sum + topic.flashcards.length, 0);
      const totalQuestions = content.reduce((sum, topic) => sum + topic.mcqs.length, 0);
      const totalContent = totalFlashcards + totalQuestions;
      
      expect(totalContent).toBeGreaterThan(50); // At least 50 items total
    });
  });

  describe('Hebrew Content Support', () => {
    test('topics include Hebrew text', () => {
      const hasHebrew = content.some((topic) => {
        // Check if topic name contains Hebrew characters
        return /[\u0590-\u05FF]/.test(topic.topic);
      });
      
      expect(hasHebrew).toBe(true);
    });
  });
});
