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

function renderDialogCards(title, pairs) {
  return {
    "title": title,
    "language": "he",
    "mainLibrary": "H5P.Dialogcards",
    "preloadedDependencies": [
      { "machineName": "H5P.Dialogcards", "majorVersion": 1, "minorVersion": 8 }
    ],
    "content": {
      "cards": pairs.map(p => ({ "text": p.q, "answer": p.a })),
      "behaviour": { "randomizeCards": true, "scaleText": false, "disableBack": false }
    }
  };
}

const topics = JSON.parse(await fs.readFile(DATA, 'utf8'));

for (const t of topics) {
  const title = t.topic;
  const pairs = t.flashcards || [];
  if (!pairs.length) continue;

  const tmpDir = path.join(__dirname, `.tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  await fs.ensureDir(tmpDir);
  await fs.ensureDir(path.join(tmpDir, 'content'));

  const h5pJson = {
    "title": `${title} – Dialog Cards`,
    "language": "he",
    "mainLibrary": "H5P.Dialogcards",
    "embedTypes": ["div"],
    "preloadedDependencies": [
      { "machineName": "H5P.Dialogcards", "majorVersion": 1, "minorVersion": 8 }
    ]
  };
  await fs.writeJson(path.join(tmpDir, 'h5p.json'), h5pJson, { spaces: 2 });

  const content = renderDialogCards(title, pairs);
  await fs.writeJson(path.join(tmpDir, 'content', 'content.json'), content, { spaces: 2 });

  const outFile = path.join(OUT, `${title.replace(/\s+/g, '_')}.h5p`);
  execSync(`npx h5p pack "${tmpDir}" "${outFile}"`, { stdio: 'inherit' });

  await fs.remove(tmpDir);
  console.log(`✔ Built ${outFile}`);
}
console.log('All H5P Dialog Cards packages built into h5p/dist/');