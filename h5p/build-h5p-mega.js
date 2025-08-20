const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'content.json');
const ASSETS = path.join(__dirname, 'assets');
const OUT = path.join(__dirname, 'dist');

// Helpers
const readJson = async p => JSON.parse(await fs.readFile(p, 'utf8'));

// Build QuestionSet payload from selected topics' mcqs
function buildQuestionSetPayload({ title, mcqs, introHtml, endHtml, passPercentage, logoPath }) {
  const questions = mcqs.map(m => ({
    library: { machineName: 'H5P.MultiChoice', majorVersion: 1, minorVersion: 0 },
    params: {
      question: `<div dir="rtl" style="text-align:right">${m.q}</div>`,
      answers: m.options.map(opt => ({
        text: `<div dir="rtl" style="text-align:right">${opt}</div>`,
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

  const introPage = {
    showIntroPage: true,
    title: title,
    introduction: `<div dir="rtl" style="text-align:right">${introHtml || ''}</div>`
  };

  const endPage = {
    showSolutionButton: true,
    showSummary: true,
    retryButtonText: "נסה שוב",
    finishButtonText: "סיום",
    override: {
      showSolutionButton: "enabled",
      retryButton: "enabled"
    },
    message: `<div dir="rtl" style="text-align:right">${endHtml || ''}</div>`
  };

  const content = {
    override: { showSolutionButton: "enabled", retryButton: "enabled" },
    introPage,
    questionSet: questions,
    progressType: "textual",
    behaviour: { autoContinue: false, enableRetry: true, enableSolutionsButton: true, passPercentage: passPercentage ?? 70 },
    endPage
  };

  return {
    content,
    title,
    language: "he",
    mainLibrary: "H5P.QuestionSet",
    embedTypes: ["div"],
    preloadedDependencies: [
      { machineName: "H5P.QuestionSet", majorVersion: 1, minorVersion: 0 },
      { machineName: "H5P.MultiChoice", majorVersion: 1, minorVersion: 0 }
    ]
  };
}

async function main() {
  await fs.ensureDir(OUT);
  
  const topics = await readJson(DATA);
  
  // Selection via env var TOPICS (comma-separated, exact match) or fallback to all topics
  const sel = process.env.TOPICS ? process.env.TOPICS.split(',').map(s => s.trim()) : null;
  const passPct = process.env.PASS || 70;
  
  // Collect MCQs from selected topics
  let picked = topics.filter(t => !sel || sel.includes(t.topic));
  const allMcqs = picked.flatMap(t => (t.mcqs || []).map(m => ({ ...m, _topic: t.topic })));
  
  // Basic intro/end with placeholders and logo
  let introText = 'מגה-מבחן גריאטריה — שאלות נבחרות לפי תכנית ה-IMA. בהצלחה!';
  let endText = 'תודה! ניתן לעיין בפתרונות או לנסות שוב. ציון המעבר מוגדר לפי אחוז המינימום שהוגדר.';
  
  // Prepare temp dir
  const tmpDir = path.join(__dirname, `.tmp_mega_${Date.now()}`);
  await fs.ensureDir(tmpDir);
  await fs.ensureDir(path.join(tmpDir, 'content'));
  
  // Try to include logo if exists
  const logoPath = path.join(ASSETS, 'logo.png');
  const hasLogo = await fs.pathExists(logoPath);
  if (hasLogo) {
    // Place logo in content folder and prepend to intro
    const logoName = 'logo.png';
    await fs.copy(logoPath, path.join(tmpDir, 'content', logoName));
    const imgTag = `<div style="text-align:center"><img src="${logoName}" alt="logo" style="max-width:220px;"/></div>`;
    introText = imgTag + '<br/>' + introText;
    endText += '<br/>' + imgTag;
  }
  
  // Build payload and files
  const payload = buildQuestionSetPayload({
    title: 'מגה-חידון גריאטריה (Question Set)',
    mcqs: allMcqs,
    introHtml: introText,
    endHtml: endText,
    passPercentage: Number(passPct)
  });
  
  // h5p.json
  const h5pJson = {
    title: payload.title,
    language: payload.language,
    mainLibrary: payload.mainLibrary,
    embedTypes: payload.embedTypes,
    preloadedDependencies: payload.preloadedDependencies
  };
  await fs.writeJson(path.join(tmpDir, 'h5p.json'), h5pJson, { spaces: 2 });
  
  // content.json
  await fs.writeJson(path.join(tmpDir, 'content', 'content.json'), payload.content, { spaces: 2 });
  
  // pack
  const outFile = path.join(OUT, 'Mega_QuestionSet.h5p');
  execSync(`npx h5p pack "${tmpDir}" "${outFile}"`, { stdio: 'inherit' });
  await fs.remove(tmpDir);
  console.log('✔ Built', outFile);
  console.log('Use env TOPICS and PASS to select topics and pass threshold, e.g.:');
  console.log('TOPICS="דליריום,דמנציה ומחלת אלצהיימר" PASS=75 npm run build:mega');
}

// Only run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = main;