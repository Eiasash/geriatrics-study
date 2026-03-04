# Quick Start — Geriatrics Fellowship Platform

**Live:** https://geriatrics.netlify.app

## Clinical Tools (Bedside Use)

| Tool | URL | Use |
|------|-----|-----|
| Patient Dashboard | /clinical-tools/dashboard.html | Morning rounds, Beers flagging |
| Medications | /clinical-tools/medications.html | DDI checker, Beers 2023, renal dosing |
| Assessments | /clinical-tools/assessments.html | MMSE, Morse, Barthel, GDS-15 |
| AI Assistant | /clinical-tools/ai-assistant.html | Multi-turn clinical reasoning |
| Study | /clinical-tools/study.html | 280 MCQs, 160 flashcards, SM-2 |
| Exam Simulator | /clinical-tools/exam.html | Board prep, 280 questions |

## Console Diagnostics (F12)

```js
// Check platform stats
await GeriatricsKnowledge.getStatistics()

// Get personalized study plan
smartStudy.generatePersonalizedPlan('2025-09-01')
```

## Privacy

Patient Dashboard uses **in-memory storage only** — no patient data is persisted to localStorage. Data is erased on page refresh. Never enter real names.

## Version

2.1.0 — Last updated March 2026
