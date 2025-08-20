#!/usr/bin/env python3
import json, os, sys, random, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
data_path = ROOT / "data" / "content.json"

doms = ["דליריום","שבריריות (Frailty)","רישום ודה-פרסקייבינג תרופות","נפילות","דמנציה ומחלת אלצהיימר"]
target_total = 100
min_per_domain = 10

with open(data_path, "r", encoding="utf-8") as f:
    topics = json.load(f)

counts = {}
total_available = 0
for t in topics:
    name = t.get("topic")
    if name in doms:
        n = len(t.get("mcqs", []))
        counts[name] = n
        total_available += n

errors = []
for d in doms:
    if counts.get(d, 0) < min_per_domain:
        errors.append(f"Domain '{d}' has too few MCQs: {counts.get(d,0)} < {min_per_domain}")

if total_available < target_total:
    errors.append(f"Total MCQs available {total_available} < target {target_total}")

if errors:
    print("❌ Validation failed:")
    for e in errors:
        print(" -", e)
    sys.exit(1)

print("✅ Validation passed.")
print("Counts per domain:", counts)
print("Total available:", total_available)
