# Setup script for local SZMC Presentation Maker (Windows PowerShell)
# This creates a local copy that is not tracked in git

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$SourceDir = Join-Path $ProjectRoot "szmc-presentation-maker"
$TargetDir = Join-Path $ProjectRoot "local-presentation-maker"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SZMC Local Presentation Maker Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if source exists
if (-not (Test-Path $SourceDir)) {
    Write-Host "Error: Source directory not found: $SourceDir" -ForegroundColor Red
    exit 1
}

# Check if target already exists
if (Test-Path $TargetDir) {
    Write-Host "Local presentation maker already exists at: $TargetDir" -ForegroundColor Yellow
    $response = Read-Host "Do you want to update it? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "Aborted." -ForegroundColor Yellow
        exit 0
    }
    Write-Host "Updating existing installation..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $TargetDir
}

# Copy the presentation maker
Write-Host "Copying presentation maker to local directory..." -ForegroundColor Green
Copy-Item -Recurse $SourceDir $TargetDir

# Remove any git-related files from the local copy
Remove-Item -Path (Join-Path $TargetDir ".deploy") -ErrorAction SilentlyContinue
Remove-Item -Recurse -Path (Join-Path $TargetDir ".claude") -ErrorAction SilentlyContinue

# Create a local config file
$localConfigContent = @'
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
'@
Set-Content -Path (Join-Path $TargetDir "local-config.js") -Value $localConfigContent -Encoding UTF8

# Create a launcher HTML that loads local config
$launchHtmlContent = @'
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
'@
Set-Content -Path (Join-Path $TargetDir "launch.html") -Value $launchHtmlContent -Encoding UTF8

# Create a README for the local copy
$readmeContent = @'
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
```powershell
.\scripts\setup-local-presentation-maker.ps1
```

## Notes

- Your presentations are stored in browser IndexedDB
- Export to JSON to backup your work
- This folder is in .gitignore and won't be committed
'@
Set-Content -Path (Join-Path $TargetDir "LOCAL-README.md") -Value $readmeContent -Encoding UTF8

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Location: $TargetDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "To open the presentation maker:" -ForegroundColor White
Write-Host "  1. Open in browser: $TargetDir\launch.html" -ForegroundColor Gray
Write-Host "  2. Or directly: $TargetDir\index.html" -ForegroundColor Gray
Write-Host ""
Write-Host "To customize, edit: $TargetDir\local-config.js" -ForegroundColor White
Write-Host ""

# Open in default browser
$openBrowser = Read-Host "Open in browser now? (Y/n)"
if ($openBrowser -ne 'n' -and $openBrowser -ne 'N') {
    Start-Process (Join-Path $TargetDir "launch.html")
}
