import json, requests, os

ROOT = os.path.dirname(os.path.dirname(__file__))
DATA = os.path.join(ROOT, 'data', 'content.json')

with open(DATA, 'r', encoding='utf-8') as f:
    topics = json.load(f)

def invoke(action, **params):
    return requests.post('http://127.0.0.1:8765', json={"action": action, "version": 6, "params": params}).json()

invoke('createDeck', deck='Geriatrics')

notes = []
for t in topics:
    topic = t.get('topic','')
    for card in t.get('flashcards', []):
        notes.append({
            "deckName": "Geriatrics",
            "modelName": "Basic",
            "fields": {"Front": card["q"], "Back": card["a"]},
            "options": {"allowDuplicate": False},
            "tags": [topic.replace(' ', '_')]
        })

res = invoke('addNotes', notes=notes)
print('addNotes:', res)