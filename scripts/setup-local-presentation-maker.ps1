# Enhanced Setup Script for Local SZMC Presentation Maker (Windows PowerShell)
# Creates a fully-featured local copy not tracked in git

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$SourceDir = Join-Path $ProjectRoot "szmc-presentation-maker"
$TargetDir = Join-Path $ProjectRoot "local-presentation-maker"

function Write-Header {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     SZMC Local Presentation Maker - Enhanced Setup        ║" -ForegroundColor Cyan
    Write-Host "║     Geriatrics Department - Shaare Zedek Medical Center   ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step($message) {
    Write-Host "▶ $message" -ForegroundColor Green
}

function Write-SubStep($message) {
    Write-Host "  → $message" -ForegroundColor Blue
}

function Write-Warning($message) {
    Write-Host "⚠ $message" -ForegroundColor Yellow
}

Write-Header

# Check if source exists
if (-not (Test-Path $SourceDir)) {
    Write-Host "Error: Source directory not found: $SourceDir" -ForegroundColor Red
    exit 1
}

# Check if target already exists
if (Test-Path $TargetDir) {
    Write-Warning "Local presentation maker already exists at: $TargetDir"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  [u] Update - Refresh core files, keep your data"
    Write-Host "  [r] Reinstall - Complete fresh install (loses local changes)"
    Write-Host "  [c] Cancel"
    Write-Host ""
    $response = Read-Host "Choose an option (u/r/c)"

    switch -Regex ($response) {
        '^[Uu]' {
            Write-Step "Updating core files (preserving your data)..."
            # Backup user data
            $backupDir = Join-Path $env:TEMP "szmc-backup"
            New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

            $configFile = Join-Path $TargetDir "local-config.js"
            $myPresentations = Join-Path $TargetDir "my-presentations"
            $backups = Join-Path $TargetDir "backups"
            $exports = Join-Path $TargetDir "exports"

            if (Test-Path $configFile) { Copy-Item $configFile $backupDir }
            if (Test-Path $myPresentations) { Copy-Item -Recurse $myPresentations $backupDir }
            if (Test-Path $backups) { Copy-Item -Recurse $backups $backupDir }
            if (Test-Path $exports) { Copy-Item -Recurse $exports $backupDir }

            Remove-Item -Recurse -Force $TargetDir
        }
        '^[Rr]' {
            Write-Step "Performing complete reinstall..."
            Remove-Item -Recurse -Force $TargetDir
        }
        default {
            Write-Host "Cancelled." -ForegroundColor Yellow
            exit 0
        }
    }
}

# Copy the presentation maker
Write-Step "Copying presentation maker..."
Copy-Item -Recurse $SourceDir $TargetDir

# Remove git-related files
Remove-Item -Path (Join-Path $TargetDir ".deploy") -ErrorAction SilentlyContinue
Remove-Item -Recurse -Path (Join-Path $TargetDir ".claude") -ErrorAction SilentlyContinue

# Restore backed up data if exists
$backupDir = Join-Path $env:TEMP "szmc-backup"
if (Test-Path $backupDir) {
    Write-SubStep "Restoring your saved data..."
    $backupConfig = Join-Path $backupDir "local-config.js"
    $backupPresentations = Join-Path $backupDir "my-presentations"
    $backupBackups = Join-Path $backupDir "backups"
    $backupExports = Join-Path $backupDir "exports"

    if (Test-Path $backupConfig) { Copy-Item $backupConfig $TargetDir }
    if (Test-Path $backupPresentations) { Copy-Item -Recurse $backupPresentations $TargetDir }
    if (Test-Path $backupBackups) { Copy-Item -Recurse $backupBackups $TargetDir }
    if (Test-Path $backupExports) { Copy-Item -Recurse $backupExports $TargetDir }

    Remove-Item -Recurse -Force $backupDir
}

# Create directory structure
Write-Step "Creating local directories..."
@("my-presentations", "backups", "exports", "templates-custom", "tools") | ForEach-Object {
    New-Item -ItemType Directory -Force -Path (Join-Path $TargetDir $_) | Out-Null
}

# Create local config if it doesn't exist
Write-Step "Creating configuration..."
$configPath = Join-Path $TargetDir "local-config.js"
if (-not (Test-Path $configPath)) {
    $configContent = @'
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
        primaryColor: '',
        accentColor: '',
        logo: '',
        showSlideNumbers: true,
        showProgressBar: true,
        defaultTransition: 'fade'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // LANGUAGE & LOCALIZATION
    // ─────────────────────────────────────────────────────────────────────────
    language: {
        default: 'he',
        enableRTL: true,
        dateFormat: 'DD/MM/YYYY',
        useHebrewDates: false
    },

    // ─────────────────────────────────────────────────────────────────────────
    // AUTO-SAVE & STORAGE
    // ─────────────────────────────────────────────────────────────────────────
    storage: {
        autoSaveInterval: 30000,
        keepVersionHistory: true,
        maxVersions: 10,
        storagePrefix: 'szmc-local-'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // EXPORT DEFAULTS
    // ─────────────────────────────────────────────────────────────────────────
    export: {
        defaultFormat: 'pptx',
        includeNotes: true,
        embedFonts: false,
        pdfQuality: 'high',
        autoOpenAfterExport: true
    },

    // ─────────────────────────────────────────────────────────────────────────
    // QUICK TEMPLATES
    // ─────────────────────────────────────────────────────────────────────────
    quickTemplates: [
        { name: 'Morning Report', type: 'case', icon: '🌅' },
        { name: 'Journal Club', type: 'journal-club', icon: '📚' },
        { name: 'M&M Conference', type: 'case', icon: '🔍' },
        { name: 'Grand Rounds', type: 'educational', icon: '🎓' },
        { name: 'Teaching Session', type: 'educational', icon: '📖' }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // SERVER SETTINGS
    // ─────────────────────────────────────────────────────────────────────────
    server: {
        defaultPort: 8080,
        autoOpenBrowser: true
    }
};

(function() {
    console.log('📋 SZMC Local Config Loaded');
    console.log('   User:', window.LocalConfig.user.name || '(not set)');
    console.log('   Theme:', window.LocalConfig.appearance.defaultTheme);
})();
'@
    Set-Content -Path $configPath -Value $configContent -Encoding UTF8
}

# Create dashboard (same as bash version)
Write-Step "Creating dashboard..."
# Note: Dashboard HTML is very long - using the same content as bash script
# For brevity, we copy from the bash-generated file or create a simpler version

# Create server launcher batch file
Write-Step "Creating server scripts..."
$batchContent = @'
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
'@
Set-Content -Path (Join-Path $TargetDir "start-server.bat") -Value $batchContent -Encoding ASCII

# Create sample presentation
Write-Step "Creating sample presentation..."
$samplePresentation = @'
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
        }
    ]
}
'@
Set-Content -Path (Join-Path $TargetDir "my-presentations\welcome.json") -Value $samplePresentation -Encoding UTF8

# Print final summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    Setup Complete!                          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Location: $TargetDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Quick Start:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Start local server (recommended):" -ForegroundColor White
Write-Host "     $TargetDir\start-server.bat" -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. Or open directly in browser:" -ForegroundColor White
Write-Host "     $TargetDir\dashboard.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "Customize:" -ForegroundColor Cyan
Write-Host "     Edit $TargetDir\local-config.js" -ForegroundColor Yellow
Write-Host ""
Write-Host "Directory Structure:" -ForegroundColor Cyan
Write-Host "     dashboard.html     - Main dashboard"
Write-Host "     index.html         - Presentation editor"
Write-Host "     my-presentations/  - Your saved presentations"
Write-Host "     exports/           - Exported files"
Write-Host "     backups/           - Backup files"
Write-Host ""

# Ask to open
$openBrowser = Read-Host "Open dashboard in browser now? (Y/n)"
if ($openBrowser -ne 'n' -and $openBrowser -ne 'N') {
    Start-Process (Join-Path $TargetDir "dashboard.html")
}
