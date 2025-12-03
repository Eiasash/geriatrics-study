#!/usr/bin/env node

/**
 * H5P Content Validation Script
 * Validates the structure and content of data/content.json
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

let errorCount = 0;
let warningCount = 0;
let topicCount = 0;
let questionCount = 0;
let flashcardCount = 0;

/**
 * Validate a single MCQ question
 */
function validateMCQ(mcq, topicName, index) {
  const issues = [];

  // Required fields (support both 'q' and 'question')
  const questionText = mcq.q || mcq.question;
  if (!questionText || questionText.trim() === '') {
    issues.push(`Question ${index + 1}: Missing or empty question text`);
  }

  if (!Array.isArray(mcq.options) || mcq.options.length < 2) {
    issues.push(`Question ${index + 1}: Must have at least 2 options`);
  } else if (mcq.options.length < 4) {
    issues.push(`Question ${index + 1}: Should have 4 options for best practice (has ${mcq.options.length})`);
  }

  // Support both 'correct' (string) and 'correctAnswer' (number)
  const correctAnswer = mcq.correct || mcq.correctAnswer;
  if (!correctAnswer && correctAnswer !== 0) {
    issues.push(`Question ${index + 1}: Missing correct answer`);
  } else if (typeof correctAnswer === 'number') {
    // Numeric index
    if (correctAnswer < 0 || correctAnswer >= mcq.options.length) {
      issues.push(`Question ${index + 1}: correctAnswer (${correctAnswer}) is out of range`);
    }
  } else if (typeof correctAnswer === 'string') {
    // String answer - should match one of the options
    if (!mcq.options.includes(correctAnswer)) {
      issues.push(`Question ${index + 1}: correct answer "${correctAnswer}" not found in options`);
    }
  }

  // Check for duplicate options
  if (Array.isArray(mcq.options)) {
    const uniqueOptions = new Set(mcq.options);
    if (uniqueOptions.size !== mcq.options.length) {
      issues.push(`Question ${index + 1}: Has duplicate options`);
    }
  }

  // Check explanation
  if (!mcq.explanation || mcq.explanation.trim() === '') {
    issues.push(`Question ${index + 1}: Missing explanation (recommended for learning)`);
  }

  // Check question length
  if (questionText && questionText.length > 500) {
    issues.push(`Question ${index + 1}: Question text is very long (${questionText.length} chars) - consider splitting`);
  }

  return issues;
}

/**
 * Validate a single flashcard
 */
function validateFlashcard(flashcard, topicName, index) {
  const issues = [];

  // Support both formats: 'q'/'a' and 'term'/'definition'
  const term = flashcard.q || flashcard.term;
  const definition = flashcard.a || flashcard.definition;

  // Required fields
  if (!term || term.trim() === '') {
    issues.push(`Flashcard ${index + 1}: Missing or empty question/term`);
  }

  if (!definition || definition.trim() === '') {
    issues.push(`Flashcard ${index + 1}: Missing or empty answer/definition`);
  }

  // Check for very short content
  if (term && term.length < 2) {
    issues.push(`Flashcard ${index + 1}: Question/term is too short`);
  }

  if (definition && definition.length < 5) {
    issues.push(`Flashcard ${index + 1}: Answer/definition is too short`);
  }

  // Check for very long content
  if (term && term.length > 300) {
    issues.push(`Flashcard ${index + 1}: Question/term is very long (${term.length} chars)`);
  }

  if (definition && definition.length > 1000) {
    issues.push(`Flashcard ${index + 1}: Answer/definition is very long (${definition.length} chars)`);
  }

  return issues;
}

/**
 * Validate a topic
 */
function validateTopic(topic) {
  const issues = [];

  // Topic name
  if (!topic.topic || topic.topic.trim() === '') {
    issues.push('Missing or empty topic name');
    return issues; // Can't continue without a topic name
  }

  // Flashcards
  if (!Array.isArray(topic.flashcards)) {
    issues.push('flashcards must be an array');
  } else {
    topic.flashcards.forEach((flashcard, i) => {
      const flashcardIssues = validateFlashcard(flashcard, topic.topic, i);
      issues.push(...flashcardIssues);
    });

    if (topic.flashcards.length === 0) {
      issues.push('No flashcards defined (at least 1 recommended)');
    }

    flashcardCount += topic.flashcards.length;
  }

  // MCQs
  if (!Array.isArray(topic.mcqs)) {
    issues.push('mcqs must be an array');
  } else {
    topic.mcqs.forEach((mcq, i) => {
      const mcqIssues = validateMCQ(mcq, topic.topic, i);
      issues.push(...mcqIssues);
    });

    if (topic.mcqs.length === 0) {
      issues.push('No MCQs defined (at least 5 recommended)');
    } else if (topic.mcqs.length < 5) {
      issues.push(`Only ${topic.mcqs.length} MCQs (5+ recommended for effective learning)`);
    }

    questionCount += topic.mcqs.length;
  }

  return issues;
}

/**
 * Main validation function
 */
function validateContent() {
  log.section('🔍 H5P Content Validation');

  const contentPath = path.join(__dirname, '..', 'data', 'content.json');

  // Check if file exists
  if (!fs.existsSync(contentPath)) {
    log.error(`Content file not found: ${contentPath}`);
    return false;
  }

  log.info(`Reading: ${contentPath}`);

  // Parse JSON
  let content;
  try {
    const fileContent = fs.readFileSync(contentPath, 'utf8');
    content = JSON.parse(fileContent);
  } catch (err) {
    log.error(`Failed to parse JSON: ${err.message}`);
    return false;
  }

  log.success('JSON is valid');

  // Check if content is an array (topics array)
  let topics;
  if (Array.isArray(content)) {
    topics = content;
  } else if (Array.isArray(content.topics)) {
    topics = content.topics;
  } else {
    log.error('content must be an array or have a topics array property');
    return false;
  }

  if (topics.length === 0) {
    log.error('No topics defined in content.json');
    return false;
  }

  log.section(`📚 Validating ${topics.length} topics...`);

  // Validate each topic
  topics.forEach((topic, index) => {
    topicCount++;
    const topicName = topic.topic || `Topic ${index + 1}`;
    log.info(`\nValidating: ${topicName}`);

    const issues = validateTopic(topic, index);

    if (issues.length === 0) {
      log.success(`${topicName}: No issues found`);
    } else {
      issues.forEach((issue) => {
        if (issue.includes('recommend') || issue.includes('should') || issue.includes('very long')) {
          log.warning(`  ${issue}`);
          warningCount++;
        } else {
          log.error(`  ${issue}`);
          errorCount++;
        }
      });
    }
  });

  // Summary
  log.section('📊 Validation Summary');
  log.info(`Topics: ${topicCount}`);
  log.info(`Questions: ${questionCount}`);
  log.info(`Flashcards: ${flashcardCount}`);

  if (errorCount === 0 && warningCount === 0) {
    log.success('🎉 All validation checks passed!');
  } else {
    if (errorCount > 0) {
      log.error(`${errorCount} error(s) found`);
    }
    if (warningCount > 0) {
      log.warning(`${warningCount} warning(s) found`);
    }
  }

  // Statistics
  if (topicCount > 0) {
    const avgQuestionsPerTopic = (questionCount / topicCount).toFixed(1);
    const avgFlashcardsPerTopic = (flashcardCount / topicCount).toFixed(1);

    log.section('📈 Content Statistics');
    log.info(`Average questions per topic: ${avgQuestionsPerTopic}`);
    log.info(`Average flashcards per topic: ${avgFlashcardsPerTopic}`);
  }

  return errorCount === 0;
}

// Run validation
const success = validateContent();
process.exit(success ? 0 : 1);
