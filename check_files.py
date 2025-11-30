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

# Check H5P files
print(f"\nH5P packages:")
h5p_files = list(h5p_dist.glob("*.h5p")) if h5p_dist.exists() else []
print(f"  H5P files: {len(h5p_files)}")
for f in h5p_files[:5]:  # Show first 5
    size_kb = f.stat().st_size / 1024
    print(f"    ✓ {f.name} ({size_kb:.1f} KB)")
if len(h5p_files) > 5:
    print(f"    ... and {len(h5p_files) - 5} more")

# Check content
data_file = Path("data/content.json")
if data_file.exists():
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\nContent data loaded:")
    print(f"  Total topics: {len(data)}")
    for topic in data[:3]:
        print(f"    - {topic['topic']} ({len(topic.get('mcqs', []))} MCQs)")

print("\n=== SUMMARY ===")
if h5p_files:
    print(f"✓ {len(h5p_files)} H5P packages built successfully")
else:
    print("⚠ No H5P packages found - run 'cd h5p && npm run build:qset' to build")
print("\nTo use H5P packages: Upload to any H5P-compatible platform (Moodle, WordPress, etc.)")
