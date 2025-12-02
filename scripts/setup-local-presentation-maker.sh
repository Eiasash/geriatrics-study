#!/bin/bash
# Enhanced Setup Script for Local SZMC Presentation Maker
# Creates a fully-featured local copy not tracked in git

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$PROJECT_ROOT/szmc-presentation-maker"
TARGET_DIR="$PROJECT_ROOT/local-presentation-maker"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}     ${GREEN}SZMC Local Presentation Maker - Enhanced Setup${NC}        ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}     ${BLUE}Geriatrics Department - Shaare Zedek Medical Center${NC}   ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_substep() {
    echo -e "  ${BLUE}→${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_header

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}Error: Source directory not found: $SOURCE_DIR${NC}"
    exit 1
fi

# Check if target already exists
if [ -d "$TARGET_DIR" ]; then
    print_warning "Local presentation maker already exists at: $TARGET_DIR"
    echo ""
    echo "Options:"
    echo "  [u] Update - Refresh core files, keep your data"
    echo "  [r] Reinstall - Complete fresh install (loses local changes)"
    echo "  [c] Cancel"
    echo ""
    read -p "Choose an option (u/r/c): " response
    case $response in
        [Uu]*)
            print_step "Updating core files (preserving your data)..."
            # Backup user data
            mkdir -p /tmp/szmc-backup
            [ -f "$TARGET_DIR/local-config.js" ] && cp "$TARGET_DIR/local-config.js" /tmp/szmc-backup/
            [ -d "$TARGET_DIR/my-presentations" ] && cp -r "$TARGET_DIR/my-presentations" /tmp/szmc-backup/
            [ -d "$TARGET_DIR/backups" ] && cp -r "$TARGET_DIR/backups" /tmp/szmc-backup/
            [ -d "$TARGET_DIR/exports" ] && cp -r "$TARGET_DIR/exports" /tmp/szmc-backup/

            # Remove and recreate
            rm -rf "$TARGET_DIR"
            ;;
        [Rr]*)
            print_step "Performing complete reinstall..."
            rm -rf "$TARGET_DIR"
            ;;
        *)
            echo "Cancelled."
            exit 0
            ;;
    esac
fi

# Copy the presentation maker
print_step "Copying presentation maker..."
cp -r "$SOURCE_DIR" "$TARGET_DIR"

# Remove git-related files
rm -f "$TARGET_DIR/.deploy" 2>/dev/null
rm -rf "$TARGET_DIR/.claude" 2>/dev/null

# Restore backed up data if exists
if [ -d "/tmp/szmc-backup" ]; then
    print_substep "Restoring your saved data..."
    [ -f "/tmp/szmc-backup/local-config.js" ] && cp /tmp/szmc-backup/local-config.js "$TARGET_DIR/"
    [ -d "/tmp/szmc-backup/my-presentations" ] && cp -r /tmp/szmc-backup/my-presentations "$TARGET_DIR/"
    [ -d "/tmp/szmc-backup/backups" ] && cp -r /tmp/szmc-backup/backups "$TARGET_DIR/"
    [ -d "/tmp/szmc-backup/exports" ] && cp -r /tmp/szmc-backup/exports "$TARGET_DIR/"
    rm -rf /tmp/szmc-backup
fi

# Create directory structure
print_step "Creating local directories..."
mkdir -p "$TARGET_DIR/my-presentations"
mkdir -p "$TARGET_DIR/backups"
mkdir -p "$TARGET_DIR/exports"
mkdir -p "$TARGET_DIR/templates-custom"
mkdir -p "$TARGET_DIR/tools"

# Create enhanced local config
print_step "Creating configuration..."
if [ ! -f "$TARGET_DIR/local-config.js" ]; then
cat > "$TARGET_DIR/local-config.js" << 'CONFIGEOF'
// ═══════════════════════════════════════════════════════════════════════════
// SZMC Presentation Maker - Local Configuration
// ═══════════════════════════════════════════════════════════════════════════
// This file is NOT tracked in git - customize freely!

window.LocalConfig = {
    // ─────────────────────────────────────────────────────────────────────────
    // USER PROFILE
    // ─────────────────────────────────────────────────────────────────────────
    user: {
        name: '',                    // Your name (auto-fills presenter field)
        title: '',                   // e.g., "MD", "Resident", "Fellow"
        email: '',                   // For citations/contact
        department: 'Geriatrics Department',
        institution: 'Shaare Zedek Medical Center',
        institutionHebrew: 'המרכז הרפואי שערי צדק'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // APPEARANCE
    // ─────────────────────────────────────────────────────────────────────────
    appearance: {
        // Themes: azure, forest, sunset, lavender, coral, slate, mint, rose
        defaultTheme: 'azure',
        darkModeDefault: false,

        // Custom colors (leave empty to use theme defaults)
        primaryColor: '',            // e.g., '#667eea'
        accentColor: '',             // e.g., '#764ba2'

        // Custom logo path (relative to this folder)
        logo: '',                    // e.g., 'assets/my-logo.png'

        // Presentation defaults
        showSlideNumbers: true,
        showProgressBar: true,
        defaultTransition: 'fade'    // fade, slide, none
    },

    // ─────────────────────────────────────────────────────────────────────────
    // LANGUAGE & LOCALIZATION
    // ─────────────────────────────────────────────────────────────────────────
    language: {
        default: 'he',               // 'he' for Hebrew, 'en' for English
        enableRTL: true,             // Right-to-left support
        dateFormat: 'DD/MM/YYYY',    // Date display format
        useHebrewDates: false        // Show Hebrew calendar dates
    },

    // ─────────────────────────────────────────────────────────────────────────
    // AUTO-SAVE & STORAGE
    // ─────────────────────────────────────────────────────────────────────────
    storage: {
        autoSaveInterval: 30000,     // Milliseconds (0 to disable)
        keepVersionHistory: true,    // Save version history
        maxVersions: 10,             // Max versions to keep per presentation
        storagePrefix: 'szmc-local-' // IndexedDB prefix
    },

    // ─────────────────────────────────────────────────────────────────────────
    // EXPORT DEFAULTS
    // ─────────────────────────────────────────────────────────────────────────
    export: {
        defaultFormat: 'pptx',       // pptx, pdf, html, json
        includeNotes: true,          // Include speaker notes in exports
        embedFonts: false,           // Embed fonts in PPTX
        pdfQuality: 'high',          // low, medium, high
        autoOpenAfterExport: true    // Open file after export
    },

    // ─────────────────────────────────────────────────────────────────────────
    // KEYBOARD SHORTCUTS
    // ─────────────────────────────────────────────────────────────────────────
    shortcuts: {
        save: 'Ctrl+S',
        newSlide: 'Ctrl+N',
        present: 'F5',
        export: 'Ctrl+E',
        search: 'Ctrl+F'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // QUICK TEMPLATES (shown in dashboard)
    // ─────────────────────────────────────────────────────────────────────────
    quickTemplates: [
        { name: 'Morning Report', type: 'case', icon: '🌅' },
        { name: 'Journal Club', type: 'journal-club', icon: '📚' },
        { name: 'M&M Conference', type: 'case', icon: '🔍' },
        { name: 'Grand Rounds', type: 'educational', icon: '🎓' },
        { name: 'Teaching Session', type: 'educational', icon: '📖' }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // SERVER SETTINGS (for local server mode)
    // ─────────────────────────────────────────────────────────────────────────
    server: {
        defaultPort: 8080,
        autoOpenBrowser: true
    }
};

// Apply configuration on load
(function() {
    console.log('📋 SZMC Local Config Loaded');
    console.log('   User:', window.LocalConfig.user.name || '(not set)');
    console.log('   Theme:', window.LocalConfig.appearance.defaultTheme);
    console.log('   Language:', window.LocalConfig.language.default);
})();
CONFIGEOF
fi

# Create enhanced dashboard/launcher
print_step "Creating dashboard..."
cat > "$TARGET_DIR/dashboard.html" << 'DASHEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SZMC Presentation Maker - Local Dashboard</title>
    <script src="local-config.js"></script>
    <style>
        :root {
            --primary: #667eea;
            --primary-dark: #5a6fd6;
            --accent: #764ba2;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #1e293b;
            --text-muted: #64748b;
            --border: #e2e8f0;
            --success: #10b981;
            --warning: #f59e0b;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
        }

        .dark-mode {
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text: #f1f5f9;
            --text-muted: #94a3b8;
            --border: #334155;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            line-height: 1.6;
        }

        .header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            color: white;
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .badge {
            background: rgba(255,255,255,0.2);
            padding: 0.35rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .header-actions button {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.2s;
            margin-left: 0.5rem;
        }

        .header-actions button:hover {
            background: rgba(255,255,255,0.3);
        }

        h1 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }

        .subtitle {
            opacity: 0.9;
            font-size: 1.1rem;
        }

        .user-greeting {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255,255,255,0.2);
            font-size: 1rem;
        }

        .main {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .card {
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: var(--shadow);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .card-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-title {
            font-weight: 600;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .card-body {
            padding: 1.5rem;
        }

        .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem 1rem;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .action-btn:hover {
            transform: scale(1.02);
            box-shadow: var(--shadow-lg);
        }

        .action-btn.secondary {
            background: var(--card-bg);
            color: var(--text);
            border: 2px solid var(--border);
        }

        .action-btn.secondary:hover {
            border-color: var(--primary);
            color: var(--primary);
        }

        .action-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .template-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .template-item {
            display: flex;
            align-items: center;
            padding: 0.875rem 1rem;
            background: var(--bg);
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.2s, transform 0.2s;
            text-decoration: none;
            color: var(--text);
        }

        .template-item:hover {
            background: var(--primary);
            color: white;
            transform: translateX(4px);
        }

        .template-icon {
            font-size: 1.5rem;
            margin-right: 1rem;
            width: 2rem;
            text-align: center;
        }

        .template-name {
            font-weight: 500;
        }

        .recent-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .recent-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: var(--bg);
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .recent-item:hover {
            background: var(--border);
        }

        .recent-info {
            display: flex;
            flex-direction: column;
        }

        .recent-title {
            font-weight: 500;
            font-size: 0.95rem;
        }

        .recent-date {
            font-size: 0.8rem;
            color: var(--text-muted);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            text-align: center;
        }

        .stat-item {
            padding: 1rem;
            background: var(--bg);
            border-radius: 10px;
        }

        .stat-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--primary);
        }

        .stat-label {
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-top: 0.25rem;
        }

        .tools-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }

        .tool-btn {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.875rem 1rem;
            background: var(--bg);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 0.9rem;
            color: var(--text);
            text-decoration: none;
        }

        .tool-btn:hover {
            background: var(--border);
        }

        .tool-icon {
            font-size: 1.25rem;
        }

        .empty-state {
            text-align: center;
            padding: 2rem;
            color: var(--text-muted);
        }

        .empty-state-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        .server-status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background: var(--bg);
            border-radius: 8px;
            margin-top: 1rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--success);
        }

        .status-dot.offline {
            background: var(--text-muted);
        }

        @media (max-width: 768px) {
            .grid { grid-template-columns: 1fr; }
            .quick-actions { grid-template-columns: 1fr; }
            .stats-grid { grid-template-columns: 1fr; }
            .tools-grid { grid-template-columns: 1fr; }
            h1 { font-size: 1.5rem; }
            .main { padding: 1rem; }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="header-top">
                <span class="badge">Local Instance</span>
                <div class="header-actions">
                    <button onclick="toggleDarkMode()" title="Toggle dark mode">🌓</button>
                    <button onclick="openSettings()" title="Settings">⚙️</button>
                </div>
            </div>
            <h1>SZMC Presentation Maker</h1>
            <p class="subtitle">Geriatrics Department - Shaare Zedek Medical Center</p>
            <p class="user-greeting" id="greeting"></p>
        </div>
    </header>

    <main class="main">
        <div class="grid">
            <!-- Quick Actions -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">⚡ Quick Actions</span>
                </div>
                <div class="card-body">
                    <div class="quick-actions">
                        <a href="index.html#new-case" class="action-btn">
                            <span class="action-icon">📋</span>
                            New Case
                        </a>
                        <a href="index.html#new-journal" class="action-btn">
                            <span class="action-icon">📚</span>
                            Journal Club
                        </a>
                        <a href="index.html#generate" class="action-btn secondary">
                            <span class="action-icon">✨</span>
                            AI Generate
                        </a>
                        <a href="index.html" class="action-btn secondary">
                            <span class="action-icon">📂</span>
                            Open Editor
                        </a>
                    </div>
                </div>
            </div>

            <!-- Quick Templates -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">📝 Quick Templates</span>
                </div>
                <div class="card-body">
                    <div class="template-list" id="templateList">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>

            <!-- Recent Presentations -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">🕐 Recent Presentations</span>
                    <button onclick="refreshRecent()" style="background:none;border:none;cursor:pointer;font-size:1rem;">🔄</button>
                </div>
                <div class="card-body">
                    <div class="recent-list" id="recentList">
                        <div class="empty-state">
                            <div class="empty-state-icon">📭</div>
                            <p>No recent presentations</p>
                            <p style="font-size: 0.85rem; margin-top: 0.5rem;">
                                Create your first presentation above
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">📊 Your Statistics</span>
                </div>
                <div class="card-body">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value" id="statTotal">0</div>
                            <div class="stat-label">Presentations</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="statSlides">0</div>
                            <div class="stat-label">Total Slides</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="statExports">0</div>
                            <div class="stat-label">Exports</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tools -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">🛠️ Tools</span>
                </div>
                <div class="card-body">
                    <div class="tools-grid">
                        <a href="my-presentations/" class="tool-btn">
                            <span class="tool-icon">📁</span>
                            My Files
                        </a>
                        <a href="exports/" class="tool-btn">
                            <span class="tool-icon">📤</span>
                            Exports
                        </a>
                        <button class="tool-btn" onclick="backupData()">
                            <span class="tool-icon">💾</span>
                            Backup
                        </button>
                        <button class="tool-btn" onclick="restoreData()">
                            <span class="tool-icon">📥</span>
                            Restore
                        </button>
                        <a href="templates-custom/" class="tool-btn">
                            <span class="tool-icon">🎨</span>
                            Custom Templates
                        </a>
                        <button class="tool-btn" onclick="openConfig()">
                            <span class="tool-icon">⚙️</span>
                            Configuration
                        </button>
                    </div>

                    <div class="server-status">
                        <span class="status-dot" id="serverStatus"></span>
                        <span id="serverText">Checking server...</span>
                    </div>
                </div>
            </div>

            <!-- Help -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">❓ Help & Info</span>
                </div>
                <div class="card-body">
                    <div class="tools-grid">
                        <a href="LOCAL-README.md" class="tool-btn">
                            <span class="tool-icon">📖</span>
                            Documentation
                        </a>
                        <button class="tool-btn" onclick="showKeyboardShortcuts()">
                            <span class="tool-icon">⌨️</span>
                            Shortcuts
                        </button>
                        <button class="tool-btn" onclick="showAbout()">
                            <span class="tool-icon">ℹ️</span>
                            About
                        </button>
                        <button class="tool-btn" onclick="checkUpdates()">
                            <span class="tool-icon">🔄</span>
                            Check Updates
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            initGreeting();
            initTemplates();
            loadRecentPresentations();
            loadStatistics();
            checkServerStatus();

            // Check dark mode preference
            if (window.LocalConfig?.appearance?.darkModeDefault) {
                document.body.classList.add('dark-mode');
            }
        });

        function initGreeting() {
            const greeting = document.getElementById('greeting');
            const hour = new Date().getHours();
            let timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

            const userName = window.LocalConfig?.user?.name;
            if (userName) {
                greeting.textContent = `${timeGreeting}, ${userName}! Ready to create presentations?`;
            } else {
                greeting.innerHTML = `${timeGreeting}! <a href="#" onclick="openConfig()" style="color:white;">Set up your profile</a> to personalize.`;
            }
        }

        function initTemplates() {
            const container = document.getElementById('templateList');
            const templates = window.LocalConfig?.quickTemplates || [
                { name: 'Morning Report', type: 'case', icon: '🌅' },
                { name: 'Journal Club', type: 'journal-club', icon: '📚' },
                { name: 'M&M Conference', type: 'case', icon: '🔍' },
                { name: 'Grand Rounds', type: 'educational', icon: '🎓' }
            ];

            container.innerHTML = templates.map(t => `
                <a href="index.html#new-${t.type}?template=${encodeURIComponent(t.name)}" class="template-item">
                    <span class="template-icon">${t.icon}</span>
                    <span class="template-name">${t.name}</span>
                </a>
            `).join('');
        }

        function loadRecentPresentations() {
            // Try to load from IndexedDB
            const request = indexedDB.open('szmc-presentations', 1);
            request.onsuccess = function(event) {
                const db = event.target.result;
                if (db.objectStoreNames.contains('presentations')) {
                    const tx = db.transaction('presentations', 'readonly');
                    const store = tx.objectStore('presentations');
                    const all = store.getAll();
                    all.onsuccess = function() {
                        displayRecentPresentations(all.result || []);
                    };
                }
            };
            request.onerror = function() {
                console.log('IndexedDB not available');
            };
        }

        function displayRecentPresentations(presentations) {
            const container = document.getElementById('recentList');
            if (!presentations.length) return;

            // Sort by date and take last 5
            const recent = presentations
                .sort((a, b) => new Date(b.modified || b.created) - new Date(a.modified || a.created))
                .slice(0, 5);

            container.innerHTML = recent.map(p => `
                <div class="recent-item" onclick="openPresentation('${p.id}')">
                    <div class="recent-info">
                        <span class="recent-title">${p.title || 'Untitled'}</span>
                        <span class="recent-date">${formatDate(p.modified || p.created)}</span>
                    </div>
                </div>
            `).join('');
        }

        function loadStatistics() {
            // Load from localStorage
            const stats = JSON.parse(localStorage.getItem('szmc-local-stats') || '{}');
            document.getElementById('statTotal').textContent = stats.total || 0;
            document.getElementById('statSlides').textContent = stats.slides || 0;
            document.getElementById('statExports').textContent = stats.exports || 0;
        }

        function checkServerStatus() {
            const dot = document.getElementById('serverStatus');
            const text = document.getElementById('serverText');

            // Check if running from a server
            if (location.protocol === 'file:') {
                dot.classList.add('offline');
                text.textContent = 'File mode (some features limited)';
            } else {
                dot.classList.remove('offline');
                text.textContent = `Running on ${location.host}`;
            }
        }

        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('szmc-dark-mode', document.body.classList.contains('dark-mode'));
        }

        function openSettings() {
            window.open('local-config.js', '_blank');
        }

        function openConfig() {
            alert('Open local-config.js in your text editor to customize settings.');
        }

        function backupData() {
            // Export all data from IndexedDB
            const data = {
                timestamp: new Date().toISOString(),
                localStorage: { ...localStorage },
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `szmc-backup-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        function restoreData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function(e) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.localStorage) {
                            Object.entries(data.localStorage).forEach(([key, value]) => {
                                localStorage.setItem(key, value);
                            });
                            alert('Backup restored successfully!');
                            location.reload();
                        }
                    } catch (err) {
                        alert('Error restoring backup: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }

        function showKeyboardShortcuts() {
            alert(`Keyboard Shortcuts:

Ctrl+S - Save presentation
Ctrl+N - New slide
F5 - Start presentation
Ctrl+E - Export
Ctrl+F - Search
Esc - Exit presentation mode

Arrow keys - Navigate slides
Space - Next slide`);
        }

        function showAbout() {
            alert(`SZMC Presentation Maker
Local Instance

Geriatrics Department
Shaare Zedek Medical Center
Jerusalem, Israel

This is your local copy that is not tracked in git.
Customize freely!`);
        }

        function checkUpdates() {
            alert('To update, run:\n./scripts/setup-local-presentation-maker.sh\n\nThis will update core files while preserving your data.');
        }

        function openPresentation(id) {
            window.location.href = `index.html#edit/${id}`;
        }

        function refreshRecent() {
            loadRecentPresentations();
        }

        function formatDate(dateStr) {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;

            if (diff < 60000) return 'Just now';
            if (diff < 3600000) return Math.floor(diff/60000) + ' min ago';
            if (diff < 86400000) return Math.floor(diff/3600000) + ' hours ago';
            if (diff < 604800000) return Math.floor(diff/86400000) + ' days ago';

            return date.toLocaleDateString();
        }

        // Check saved dark mode preference
        if (localStorage.getItem('szmc-dark-mode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    </script>
</body>
</html>
DASHEOF

# Create Python server script
print_step "Creating server scripts..."
cat > "$TARGET_DIR/tools/server.py" << 'PYEOF'
#!/usr/bin/env python3
"""
SZMC Presentation Maker - Local Development Server
Simple HTTP server with live reload support
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import signal
from pathlib import Path

PORT = 8080
DIRECTORY = Path(__file__).parent.parent

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

    def log_message(self, format, *args):
        # Only log errors and important requests
        if args[1] != '200' or '.html' in args[0] or args[0] == 'GET / ':
            print(f"  {args[0]} - {args[1]}")

    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    global PORT

    # Allow custom port
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port: {sys.argv[1]}")
            sys.exit(1)

    # Find available port
    original_port = PORT
    while PORT < original_port + 100:
        try:
            with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
                print()
                print("╔════════════════════════════════════════════════════╗")
                print("║     SZMC Presentation Maker - Local Server         ║")
                print("╠════════════════════════════════════════════════════╣")
                print(f"║  🌐 Server running at: http://localhost:{PORT:<10}  ║")
                print(f"║  📁 Serving from: {str(DIRECTORY)[:30]:<30} ║")
                print("║                                                    ║")
                print("║  Press Ctrl+C to stop                              ║")
                print("╚════════════════════════════════════════════════════╝")
                print()

                # Open browser
                if '--no-browser' not in sys.argv:
                    webbrowser.open(f'http://localhost:{PORT}/dashboard.html')

                # Handle graceful shutdown
                def signal_handler(sig, frame):
                    print("\n\nServer stopped.")
                    sys.exit(0)

                signal.signal(signal.SIGINT, signal_handler)

                httpd.serve_forever()
        except OSError:
            PORT += 1

    print(f"Could not find available port in range {original_port}-{PORT}")
    sys.exit(1)

if __name__ == "__main__":
    main()
PYEOF

# Create Node.js server script
cat > "$TARGET_DIR/tools/server.js" << 'NODEEOF'
#!/usr/bin/env node
/**
 * SZMC Presentation Maker - Local Development Server (Node.js)
 * Simple HTTP server with live reload support
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = parseInt(process.argv[2]) || 8080;
const ROOT = path.join(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    let filePath = path.join(ROOT, req.url === '/' ? 'dashboard.html' : req.url.split('?')[0]);

    // Security: prevent directory traversal
    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log();
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║     SZMC Presentation Maker - Local Server         ║');
    console.log('╠════════════════════════════════════════════════════╣');
    console.log(`║  🌐 Server running at: http://localhost:${PORT}          ║`);
    console.log(`║  📁 Serving from: ${ROOT.substring(0, 30).padEnd(30)} ║`);
    console.log('║                                                    ║');
    console.log('║  Press Ctrl+C to stop                              ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log();

    // Open browser
    const url = `http://localhost:${PORT}/dashboard.html`;
    const cmd = process.platform === 'darwin' ? 'open' :
                process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${cmd} ${url}`);
});

process.on('SIGINT', () => {
    console.log('\n\nServer stopped.');
    process.exit(0);
});
NODEEOF

# Create launcher scripts
cat > "$TARGET_DIR/start-server.sh" << 'SHEOF'
#!/bin/bash
# Start local development server
cd "$(dirname "$0")"

if command -v python3 &> /dev/null; then
    python3 tools/server.py "$@"
elif command -v node &> /dev/null; then
    node tools/server.js "$@"
else
    echo "Error: Neither Python 3 nor Node.js found."
    echo "Please install one of them or open dashboard.html directly."
    exit 1
fi
SHEOF
chmod +x "$TARGET_DIR/start-server.sh"

cat > "$TARGET_DIR/start-server.bat" << 'BATEOF'
@echo off
cd /d "%~dp0"

where python >nul 2>&1
if %errorlevel% equ 0 (
    python tools/server.py %*
    goto :eof
)

where node >nul 2>&1
if %errorlevel% equ 0 (
    node tools/server.js %*
    goto :eof
)

echo Error: Neither Python nor Node.js found.
echo Please install one of them or open dashboard.html directly.
pause
BATEOF

# Create enhanced README
print_step "Creating documentation..."
cat > "$TARGET_DIR/LOCAL-README.md" << 'READMEEOF'
# SZMC Presentation Maker - Local Instance

Your personal, offline-capable presentation maker for medical education.

## 🚀 Quick Start

### Option 1: Local Server (Recommended)
```bash
# Linux/macOS
./start-server.sh

# Windows
start-server.bat
```
Opens dashboard at http://localhost:8080

### Option 2: Direct File Access
Open `dashboard.html` in your browser

## 📁 Directory Structure

```
local-presentation-maker/
├── dashboard.html          # Main dashboard (start here!)
├── index.html              # Presentation editor
├── local-config.js         # Your personal settings
├── start-server.sh/.bat    # Server launchers
├── my-presentations/       # Your saved JSON files
├── exports/                # Exported PPTX/PDF files
├── backups/                # Automatic backups
├── templates-custom/       # Your custom templates
└── tools/                  # Utility scripts
    ├── server.py           # Python server
    └── server.js           # Node.js server
```

## ⚙️ Configuration

Edit `local-config.js` to customize:

```javascript
window.LocalConfig = {
    user: {
        name: 'Your Name',
        title: 'MD',
        department: 'Geriatrics'
    },
    appearance: {
        defaultTheme: 'azure',  // azure, forest, sunset, lavender, coral, slate, mint, rose
        darkModeDefault: false
    },
    language: {
        default: 'he'  // 'he' for Hebrew, 'en' for English
    }
};
```

## 🔧 Features

### Dashboard
- Quick access to new presentations
- Recent presentations history
- Statistics tracking
- Backup/restore tools
- Dark mode support

### Presentation Types
- **Case Presentations** - Patient cases for morning reports
- **Journal Club** - Literature review presentations
- **Educational** - Teaching and grand rounds

### Export Formats
- PowerPoint (.pptx)
- PDF
- HTML
- JSON (for backup/sharing)

## 💾 Data Storage

- **Browser IndexedDB** - Presentations stored locally
- **my-presentations/** - Save JSON files here for file-based storage
- **backups/** - Use dashboard backup feature
- **exports/** - Exported files land here

## 🔄 Updating

To update to the latest version while keeping your data:
```bash
./scripts/setup-local-presentation-maker.sh
# Choose 'u' for update
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+S | Save |
| Ctrl+N | New slide |
| F5 | Start presentation |
| Ctrl+E | Export |
| Ctrl+F | Search |
| Esc | Exit presentation |
| ←/→ | Navigate slides |

## 🔒 Privacy

This local instance:
- ✅ Works completely offline
- ✅ Stores data only on your computer
- ✅ Not tracked in git
- ✅ No external data transmission

## ❓ Troubleshooting

### "Some features limited" in file mode
Run the local server for full functionality:
```bash
./start-server.sh
```

### Server won't start
- Check if port 8080 is in use
- Try: `./start-server.sh 3000` for a different port

### Lost presentations
1. Check IndexedDB in browser DevTools
2. Look in `backups/` folder
3. Check `my-presentations/` for JSON files

---

**Geriatrics Department - Shaare Zedek Medical Center**
READMEEOF

# Create a sample presentation for the user
cat > "$TARGET_DIR/my-presentations/welcome.json" << 'SAMPLEEOF'
{
    "title": "Welcome to SZMC Presentation Maker",
    "type": "educational",
    "created": "2024-01-01",
    "author": "SZMC Geriatrics",
    "slides": [
        {
            "id": "slide-001",
            "type": "title",
            "order": 0,
            "data": {
                "title": "Welcome!",
                "subtitle": "Your Local Presentation Maker",
                "presenter": "SZMC Geriatrics Department"
            }
        },
        {
            "id": "slide-002",
            "type": "content",
            "order": 1,
            "data": {
                "title": "Getting Started",
                "content": "<ul><li>Create case presentations</li><li>Build journal club slides</li><li>Use AI to generate content</li><li>Export to PowerPoint or PDF</li></ul>"
            }
        },
        {
            "id": "slide-003",
            "type": "content",
            "order": 2,
            "data": {
                "title": "This is Your Local Copy",
                "content": "<ul><li>Not tracked in git</li><li>Customize freely</li><li>Your data stays on your computer</li><li>Edit local-config.js for personal settings</li></ul>"
            }
        }
    ]
}
SAMPLEEOF

# Print final summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}                    ${GREEN}Setup Complete!${NC}                          ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Location:${NC} $TARGET_DIR"
echo ""
echo -e "${CYAN}Quick Start:${NC}"
echo ""
echo "  1. Start local server (recommended):"
echo -e "     ${YELLOW}./local-presentation-maker/start-server.sh${NC}"
echo ""
echo "  2. Or open directly in browser:"
echo -e "     ${YELLOW}$TARGET_DIR/dashboard.html${NC}"
echo ""
echo -e "${CYAN}Customize:${NC}"
echo -e "     Edit ${YELLOW}$TARGET_DIR/local-config.js${NC}"
echo ""
echo -e "${CYAN}Directory Structure:${NC}"
echo "     dashboard.html     - Main dashboard"
echo "     index.html         - Presentation editor"
echo "     my-presentations/  - Your saved presentations"
echo "     exports/           - Exported files"
echo "     backups/           - Backup files"
echo ""

# Ask to start server
if command -v python3 &> /dev/null || command -v node &> /dev/null; then
    echo ""
    read -p "Start local server now? (Y/n): " start_server
    if [[ ! "$start_server" =~ ^[Nn]$ ]]; then
        cd "$TARGET_DIR"
        exec ./start-server.sh
    fi
fi
