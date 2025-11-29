import json
import os
import genanki

ROOT = os.path.dirname(os.path.dirname(__file__))
DATA = os.path.join(ROOT, 'data', 'content.json')
OUT  = os.path.join(ROOT, 'anki', 'dist')
os.makedirs(OUT, exist_ok=True)

with open(DATA, 'r', encoding='utf-8') as f:
    topics = json.load(f)

def mk_id(seed):
    import hashlib
    return int(hashlib.md5(seed.encode('utf-8')).hexdigest()[:8], 16)

DECK_ID = mk_id('geriatrics-deck')
MODEL_ID = mk_id('geriatrics-basic-model')

model = genanki.Model(
    MODEL_ID,
    'Geriatrics Basic (Hebrew)',
    fields=[{'name': 'Front'}, {'name': 'Back'}, {'name': 'Topic'}],
    templates=[{
        'name': 'Card 1',
        'qfmt': '{{Front}}<br><br><span style="font-size:12px;color:#777;">{{Topic}}</span>',
        'afmt': '{{Front}}<hr id="answer">{{Back}}<br><br><span style="font-size:12px;color:#777;">{{Topic}}</span>'
    }]
)

deck = genanki.Deck(DECK_ID, 'Geriatrics – Study Deck')

notes_count = 0
for t in topics:
    topic = t.get('topic','')
    for card in t.get('flashcards', []):
        n = genanki.Note(model=model, fields=[card['q'], card['a'], topic], tags=[topic.replace(' ', '_')])
        deck.add_note(n); notes_count += 1

pkg = genanki.Package(deck)
apkg_path = os.path.join(OUT, 'geriatrics.apkg')
pkg.write_to_file(apkg_path)
print(f'✔ Wrote {apkg_path} with {notes_count} notes')