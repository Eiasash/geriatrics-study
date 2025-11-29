"""
Test suite for Anki package builder
"""
import json
import os
import sys
import pytest
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

def test_content_json_exists():
    """Test that content.json exists and is valid"""
    content_path = Path(__file__).parent.parent / "data" / "content.json"
    assert content_path.exists(), "content.json file not found"
    
    with open(content_path, 'r', encoding='utf-8') as f:
        content = json.load(f)
    
    assert "topics" in content, "content.json missing 'topics' key"
    assert len(content["topics"]) > 0, "No topics found in content.json"

def test_build_script_exists():
    """Test that build_apkg.py exists"""
    build_script = Path(__file__).parent / "build_apkg.py"
    assert build_script.exists(), "build_apkg.py not found"

def test_requirements_file():
    """Test that requirements.txt exists and contains genanki"""
    req_file = Path(__file__).parent / "requirements.txt"
    assert req_file.exists(), "requirements.txt not found"
    
    with open(req_file, 'r') as f:
        requirements = f.read()
    
    assert "genanki" in requirements, "genanki not in requirements.txt"

def test_output_directory():
    """Test that dist directory can be created"""
    dist_dir = Path(__file__).parent / "dist"
    if not dist_dir.exists():
        dist_dir.mkdir(parents=True, exist_ok=True)
    assert dist_dir.exists(), "Could not create dist directory"

def test_hebrew_encoding():
    """Test Hebrew text encoding"""
    hebrew_text = "דליריום"
    encoded = hebrew_text.encode('utf-8')
    decoded = encoded.decode('utf-8')
    assert decoded == hebrew_text, "Hebrew encoding/decoding failed"

def test_content_structure():
    """Test content.json structure for required fields"""
    content_path = Path(__file__).parent.parent / "data" / "content.json"
    
    with open(content_path, 'r', encoding='utf-8') as f:
        content = json.load(f)
    
    for topic in content["topics"]:
        assert "id" in topic, f"Topic missing 'id' field"
        assert "title" in topic, f"Topic missing 'title' field"
        assert "questions" in topic, f"Topic missing 'questions' field"
        
        for question in topic["questions"]:
            assert "q" in question, "Question missing 'q' field"
            assert "a" in question, "Question missing 'a' field"

if __name__ == "__main__":
    pytest.main([__file__, "-v"])