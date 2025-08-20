const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'content.json');
const OUT = path.join(__dirname, 'dist');

// Build an H5P Question Set package (.h5p) from per-topic MCQs
// Uses H5P.QuestionSet as main library and nests H5P.MultiChoice items.
function renderQuestionSet(title, mcqs) {
  const questions = mcqs.map((m) => ({
    library: { machineName: 'H5P.MultiChoice', majorVersion: 1, minorVersion: 0 },
    params: {
      question: m.q,
      answers: m.options.map((opt) => ({
        text: opt,
        correct: opt === m.correct
      })),
      behaviour: {
        randomAnswers: true,
        singleAnswer: true,
        showSolutionButton: true,
        enableRetry: true
      }
    }
  }));

  return {
    "content": {
      "override": {
        "showSolutionButton": "enabled",
        "retryButton": "enabled"
      },
      "introPage": {
        "showIntroPage": false
      },
      "questionSet": questions,
      "progressType": "textual",
      "behaviour": {
        "autoContinue": false,
        "enableRetry": true,
        "enableSolutionsButton": true,
        "passPercentage": 60
      },
      "endPage": {
        "showSolutionButton": true,
        "showSummary": true
      }
    },
    "title": `${title} – Question Set`,
    "language": "he",
    "mainLibrary": "H5P.QuestionSet",
    "embedTypes": ["div"],
    "preloadedDependencies": [
      { "machineName": "H5P.QuestionSet", "majorVersion": 1, "minorVersion": 0 },
      { "machineName": "H5P.MultiChoice", "majorVersion": 1, "minorVersion": 0 }
    ]
  };
}

async function main() {
  await fs.ensureDir(OUT);
  
  const topics = JSON.parse(await fs.readFile(DATA, 'utf8'));
  
  for (const t of topics) {
    const title = t.topic;
    const mcqs = Array.isArray(t.mcqs) ? t.mcqs : [];
    if (!mcqs.length) continue;

    const tmpDir = path.join(__dirname, `.tmp_qset_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    await fs.ensureDir(tmpDir);
    await fs.ensureDir(path.join(tmpDir, 'content'));

    const payload = renderQuestionSet(title, mcqs);

    // h5p.json metadata/package definition
    const h5pJson = {
      title: payload.title,
      language: payload.language,
      mainLibrary: payload.mainLibrary,
      embedTypes: payload.embedTypes,
      preloadedDependencies: payload.preloadedDependencies
    };
    await fs.writeJson(path.join(tmpDir, 'h5p.json'), h5pJson, { spaces: 2 });

    // content/content.json with QuestionSet params
    await fs.writeJson(path.join(tmpDir, 'content', 'content.json'), payload.content, { spaces: 2 });

    const outFile = path.join(OUT, `${title.replace(/\s+/g, '_')}_QuestionSet.h5p`);
    execSync(`npx h5p pack "${tmpDir}" "${outFile}"`, { stdio: 'inherit' });

    await fs.remove(tmpDir);
    console.log(`✔ Built ${outFile}`);
  }

  console.log('All H5P Question Set packages built into h5p/dist/');
}

// Only run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = main;