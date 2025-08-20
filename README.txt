# Geriatrics Study – H5P + Anki (Turn‑key)

**Last generated:** 2025-08-20T16:58:20.662198Z

## What you get
- `data/content.json` – single source of truth (Hebrew) for topics → flashcards (+ MCQs for future use).
- H5P builder → creates **Dialog Cards** `.h5p` (one per topic) from the JSON.
- Anki builder → creates a ready **geriatrics.apkg** (spaced repetition) from the same JSON.
- Optional **AnkiConnect** push script (no manual import; requires Anki + AnkiConnect open).

## Quickstart

### 1) Build H5P Dialog Cards
```bash
cd h5p
npm install
npm run build
# upload .h5p files from h5p/dist/ to WordPress/Moodle/H5P.com
```

### 2) Build Anki deck (.apkg)
```bash
cd anki
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python build_apkg.py
# import anki/dist/geriatrics.apkg into Anki
```

### 3) (Optional) Push directly via AnkiConnect
```bash
pip install requests
python push_ankiconnect.py  # keep Anki open with AnkiConnect add‑on
```

## References
- H5P Dialog Cards tutorial and docs (H5P.com/H5P.org).
- h5p-cli pack command.
- genanki (programmatic Anki deck builder).
- AnkiConnect API.

