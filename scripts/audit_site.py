#!/usr/bin/env python3
"""Static audit for the Geriatrics Study site.

Checks:
- internal HTML asset/link references resolve
- manifest icons exist
- JS files parse with `node --check`
- inline <script> blocks in HTML parse with `node --check`
- key HTML pages expose basic metadata (title, viewport, lang, h1)
- built H5P packages exist when the H5P portal is present
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {
    '.git',
    '.github',
    '.venv',
    'venv',
    '__pycache__',
    'node_modules',
    'coverage',
    'dist',
}
REF_ATTRS = {
    'a': 'href',
    'link': 'href',
    'script': 'src',
    'img': 'src',
    'source': 'src',
    'iframe': 'src',
    'audio': 'src',
    'video': 'src',
}
INLINE_SCRIPT_RE = re.compile(r'<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>', re.I | re.S)


def walk_files(suffix: str) -> Iterable[Path]:
    for path in ROOT.rglob(f'*{suffix}'):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        yield path


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str, str, dict[str, str]]] = []
        self.has_title = False
        self.has_viewport = False
        self.has_h1 = False
        self.has_lang = False

    def handle_starttag(self, tag: str, attrs) -> None:
        attr_map = {k: v for k, v in attrs if k}
        if tag == 'html' and attr_map.get('lang'):
            self.has_lang = True
        if tag == 'title':
            self.has_title = True
        if tag == 'h1':
            self.has_h1 = True
        if tag == 'meta' and attr_map.get('name', '').lower() == 'viewport':
            self.has_viewport = True
        ref_attr = REF_ATTRS.get(tag)
        if ref_attr and attr_map.get(ref_attr):
            self.refs.append((tag, ref_attr, attr_map[ref_attr], attr_map))

    def handle_startendtag(self, tag: str, attrs) -> None:
        self.handle_starttag(tag, attrs)


def is_external(value: str) -> bool:
    return value.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:', 'data:', '#'))


def resolve_ref(page: Path, raw: str) -> Path:
    path = raw.split('#', 1)[0].split('?', 1)[0]
    if raw.startswith('/'):
        return (ROOT / path.lstrip('/')).resolve()
    return (page.parent / path).resolve()


errors: list[str] = []
warnings: list[str] = []

html_files = list(walk_files('.html'))
js_files = list(walk_files('.js'))

# HTML checks
for page in html_files:
    content = page.read_text(encoding='utf-8', errors='ignore')
    parser = PageParser()
    parser.feed(content)

    rel_page = page.relative_to(ROOT)

    if not parser.has_title:
        warnings.append(f'{rel_page}: missing <title>')
    if not parser.has_viewport:
        warnings.append(f'{rel_page}: missing viewport meta tag')
    if not parser.has_lang:
        warnings.append(f'{rel_page}: missing html[lang]')
    if rel_page.as_posix() not in {'404.html', 'offline.html'} and not parser.has_h1:
        warnings.append(f'{rel_page}: missing <h1>')

    for tag, attr, raw, attr_map in parser.refs:
        if is_external(raw):
            continue
        if '{' in raw or '}' in raw or '<%' in raw:
            continue
        target = resolve_ref(page, raw)
        if not target.exists():
            errors.append(f'{rel_page}: missing {tag}[{attr}] -> {raw}')

    for idx, match in enumerate(INLINE_SCRIPT_RE.finditer(content), start=1):
        script = match.group(1)
        if not script.strip():
            continue
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as tmp:
            tmp.write(script)
            tmp_path = Path(tmp.name)
        try:
            proc = subprocess.run(
                ['node', '--check', str(tmp_path)],
                capture_output=True,
                text=True,
                cwd=ROOT,
            )
            if proc.returncode != 0:
                details = (proc.stderr or proc.stdout).strip().splitlines()[0]
                errors.append(f'{rel_page}: inline <script> #{idx} failed syntax check ({details})')
        finally:
            tmp_path.unlink(missing_ok=True)

# JS syntax checks
for script in js_files:
    rel_script = script.relative_to(ROOT)
    proc = subprocess.run(
        ['node', '--check', str(script)],
        capture_output=True,
        text=True,
        cwd=ROOT,
    )
    if proc.returncode != 0:
        details = (proc.stderr or proc.stdout).strip().splitlines()[0]
        errors.append(f'{rel_script}: failed JS syntax check ({details})')

# Manifest icons
for manifest in [ROOT / 'manifest.json', ROOT / 'szmc-presentation-maker' / 'manifest.json']:
    if not manifest.exists():
        continue
    try:
        data = json.loads(manifest.read_text(encoding='utf-8'))
    except json.JSONDecodeError as exc:
        errors.append(f'{manifest.relative_to(ROOT)}: invalid JSON ({exc})')
        continue

    for icon in data.get('icons', []):
        src = icon.get('src')
        if not src:
            continue
        icon_path = (manifest.parent / src).resolve()
        if not icon_path.exists():
            errors.append(f'{manifest.relative_to(ROOT)}: missing icon {src}')

# H5P build output
h5p_index = ROOT / 'h5p' / 'index.html'
h5p_dist = ROOT / 'h5p' / 'dist'
if h5p_index.exists():
    packages = list(h5p_dist.glob('*.h5p')) if h5p_dist.exists() else []
    if not packages:
        errors.append('h5p/dist does not contain built .h5p packages')

print('=== SITE AUDIT ===')
print(f'HTML files checked: {len(html_files)}')
print(f'JS files checked:   {len(js_files)}')
print(f'Warnings:           {len(warnings)}')
print(f'Errors:             {len(errors)}')

if warnings:
    print('\nWarnings:')
    for item in warnings[:50]:
        print(f'  - {item}')
    if len(warnings) > 50:
        print(f'  ... and {len(warnings) - 50} more')

if errors:
    print('\nErrors:')
    for item in errors[:100]:
        print(f'  - {item}')
    if len(errors) > 100:
        print(f'  ... and {len(errors) - 100} more')
    sys.exit(1)

print('\nAudit passed.')
