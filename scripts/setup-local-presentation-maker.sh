#!/bin/bash
# Setup script for local SZMC Presentation Maker
# This creates a local copy that is not tracked in git

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$PROJECT_ROOT/szmc-presentation-maker"
TARGET_DIR="$PROJECT_ROOT/local-presentation-maker"

echo "=================================="
echo "SZMC Local Presentation Maker Setup"
echo "=================================="
echo ""

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Source directory not found: $SOURCE_DIR"
    exit 1
fi

# Check if target already exists
if [ -d "$TARGET_DIR" ]; then
    echo "Local presentation maker already exists at: $TARGET_DIR"
    read -p "Do you want to update it? (y/N): " response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
    echo "Updating existing installation..."
    rm -rf "$TARGET_DIR"
fi

# Copy the presentation maker
echo "Copying presentation maker to local directory..."
cp -r "$SOURCE_DIR" "$TARGET_DIR"

# Remove any git-related files from the local copy
rm -f "$TARGET_DIR/.deploy" 2>/dev/null
rm -rf "$TARGET_DIR/.claude" 2>/dev/null

# Create a local config file
cat > "$TARGET_DIR/local-config.js" << 'EOF'
// Local configuration for SZMC Presentation Maker
// This file is not tracked in git - customize as needed

window.LocalConfig = {
    // Your name for auto-filling presenter field
    presenterName: '',

    // Default department
    department: 'Geriatrics Department',

    // Institution name
    institution: 'Shaare Zedek Medical Center',

    // Default theme (azure, forest, sunset, lavender, coral, slate, mint, rose)
    defaultTheme: 'azure',

    // Default language (en, he)
    defaultLanguage: 'he',

    // Enable dark mode by default
    darkModeDefault: false,

    // Auto-save interval in milliseconds (0 to disable)
    autoSaveInterval: 30000,

    // Local storage prefix (change if you want separate storage)
    storagePrefix: 'szmc-local-',

    // Custom branding
    branding: {
        logo: '', // Path to custom logo
        primaryColor: '', // Custom primary color (hex)
        accentColor: '' // Custom accent color (hex)
    }
};
EOF

# Create a launcher HTML that loads local config
cat > "$TARGET_DIR/launch.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SZMC Presentation Maker - Local</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            font-size: 1.2rem;
            background: white;
            color: #667eea;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .info {
            margin-top: 3rem;
            font-size: 0.9rem;
            opacity: 0.7;
        }
        .local-badge {
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-bottom: 1rem;
            display: inline-block;
        }
    </style>
    <script src="local-config.js"></script>
</head>
<body>
    <div class="container">
        <div class="local-badge">LOCAL INSTANCE</div>
        <h1>SZMC Presentation Maker</h1>
        <p>Geriatrics Department - Shaare Zedek Medical Center</p>
        <a href="index.html" class="btn">Open Presentation Maker</a>
        <div class="info">
            <p>This is your local copy - changes here won't affect the repository</p>
            <p>Edit <code>local-config.js</code> to customize your settings</p>
        </div>
    </div>
    <script>
        // Apply local config if available
        if (window.LocalConfig) {
            console.log('Local config loaded:', window.LocalConfig);
        }
    </script>
</body>
</html>
EOF

# Create a README for the local copy
cat > "$TARGET_DIR/LOCAL-README.md" << 'EOF'
# Local SZMC Presentation Maker

This is your LOCAL copy of the SZMC Presentation Maker. It is NOT tracked in git.

## Quick Start

1. Open `launch.html` in your browser, or
2. Open `index.html` directly

## Configuration

Edit `local-config.js` to customize:
- Your presenter name
- Default theme and language
- Auto-save settings
- Custom branding

## Files

- `launch.html` - Launcher page with local branding
- `local-config.js` - Your personal configuration
- `index.html` - Main application
- All other files from the main presentation maker

## Updating

To update to the latest version, run:
```bash
./scripts/setup-local-presentation-maker.sh
```

## Notes

- Your presentations are stored in browser IndexedDB
- Export to JSON to backup your work
- This folder is in .gitignore and won't be committed
EOF

echo ""
echo "Setup complete!"
echo ""
echo "Location: $TARGET_DIR"
echo ""
echo "To open the presentation maker:"
echo "  1. Open in browser: $TARGET_DIR/launch.html"
echo "  2. Or directly: $TARGET_DIR/index.html"
echo ""
echo "To customize, edit: $TARGET_DIR/local-config.js"
echo ""
