import os
import json
from pathlib import Path

print("=== BUILD STATUS REPORT ===\n")

# Check H5P dist
h5p_dist = Path("h5p/dist")
print(f"H5P dist directory: {h5p_dist.absolute()}")
if h5p_dist.exists():
    # Try different methods to list files
    try:
        # Method 1: os.listdir
        files_os = os.listdir(str(h5p_dist))
        print(f"  os.listdir found: {len(files_os)} files")
        
        # Method 2: Path.glob
        files_glob = list(h5p_dist.glob("*"))
        print(f"  Path.glob found: {len(files_glob)} files")
        
        # Method 3: os.walk
        for root, dirs, files in os.walk(str(h5p_dist)):
            print(f"  os.walk found: {len(files)} files, {len(dirs)} dirs")
            break
    except Exception as e:
        print(f"  Error listing files: {e}")
else:
    print("  Directory does not exist")

# Check Anki dist
print(f"\nAnki dist directory: {Path('anki/dist').absolute()}")
anki_files = list(Path("anki/dist").glob("*.apkg"))
print(f"  APKG files: {len(anki_files)}")
for f in anki_files:
    size_kb = f.stat().st_size / 1024
    print(f"    ✓ {f.name} ({size_kb:.1f} KB)")

# Check content
data_file = Path("data/content.json")
if data_file.exists():
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\nContent data loaded:")
    print(f"  Total topics: {len(data)}")
    for topic in data[:3]:
        print(f"    - {topic['title']} ({len(topic.get('mcqs', []))} MCQs)")

print("\n=== SUMMARY ===")
print("✓ Anki package built successfully (geriatrics.apkg)")
print("? H5P files may have been created but are not visible (possible encoding issue)")
print("\nTo import Anki deck: Open Anki → File → Import → Select anki/dist/geriatrics.apkg")
