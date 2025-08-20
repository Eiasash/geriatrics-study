import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'content.json');
const OUT = path.join(__dirname, 'dist');
await fs.ensureDir(OUT);

function pickBalanced(itemsByDomain, maxQ) {
  const domains = Object.keys(itemsByDomain);
  const queues = domains.map(d => ({ d, arr: [...itemsByDomain[d]] }));
  const res = [];
  while (res.length < maxQ) {
    let progressed = false;
    for (const q of queues) {
      if (!q.arr.length) continue;
      res.push({ _topic: q.d, ...q.arr.shift() });
      progressed = true;
      if (res.length >= maxQ) break;
    }
    if (!progressed) break;
  }
  return res;
}

function buildQuestionSetPayload({ title, mcqs, introHtml, endHtml, passPercentage }) {
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
    title,
    introduction: `<div dir="rtl" style="text-align:right">${introHtml || ''}</div>`
  };

  const endPage = {
    showSolutionButton: true,
    showSummary: true,
    retryButtonText: "נסה שוב",
    finishButtonText: "סיום",
    override: { showSolutionButton: "enabled", retryButton: "enabled" },
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

const topics = JSON.parse(await fs.readFile(DATA, 'utf8'));
const sel = process.env.TOPICS ? process.env.TOPICS.split(',').map(s => s.trim()) : null;
const maxQ = Number(process.env.MAX_Q || 100);
const passPct = Number(process.env.PASS || 70);

let picked = topics.filter(t => !sel || sel.includes(t.topic));
const itemsByDomain = {};
for (const t of picked) {
  const domain = t.topic;
  const list = (t.mcqs || []).map(m => ({ ...m, _topic: domain }));
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  itemsByDomain[domain] = list;
}
const selected = pickBalanced(itemsByDomain, maxQ);

const tmpDir = path.join(__dirname, `.tmp_mega_${Date.now()}`);
await fs.ensureDir(tmpDir);
await fs.ensureDir(path.join(tmpDir, 'content'));

let introText = 'מגה-מבחן גריאטריה — שאלות נבחרות לפי תכנית ה-IMA. בהצלחה!';
let endText = 'תודה! ניתן לעיין בפתרונות או לנסות שוב. ציון המעבר מוגדר במבנה החידון.';

const payload = buildQuestionSetPayload({
  title: `מגה-חידון גריאטריה (${selected.length} שאלות)`,
  mcqs: selected,
  introHtml: introText,
  endHtml: endText,
  passPercentage: passPct
});

const h5pJson = {
  title: payload.title,
  language: payload.language,
  mainLibrary: payload.mainLibrary,
  embedTypes: payload.embedTypes,
  preloadedDependencies: payload.preloadedDependencies
};
await fs.writeJson(path.join(tmpDir, 'h5p.json'), h5pJson, { spaces: 2 });
await fs.writeJson(path.join(tmpDir, 'content', 'content.json'), payload.content, { spaces: 2 });

const outFile = path.join(OUT, 'Mega_QuestionSet.h5p');
execSync(`npx h5p pack "${tmpDir}" "${outFile}"`, { stdio: 'inherit' });
await fs.remove(tmpDir);
console.log('✔ Built', outFile);
console.log('Selected domains:', Object.keys(itemsByDomain));
console.log('Total questions included:', selected.length);
