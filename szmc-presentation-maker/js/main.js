// SZMC Geriatrics Presentation Maker - Main Application

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function goBack() {
    // Check for unsaved changes
    if (editor.isDirty) {
        if (!confirm('You have unsaved changes. Are you sure you want to go back?')) {
            return;
        }
    }
    showPage('landing-page');
}

// Template Selection
function selectTemplate(type) {
    editor.initialize(type);
    showPage('editor-page');

    // Set default title based on type
    const titleInput = document.getElementById('presentation-title');
    if (type === 'case') {
        titleInput.value = 'Case Presentation';
    } else if (type === 'journal') {
        titleInput.value = 'Journal Club';
    }
}

// Slide Management
function addSlide() {
    // Show slide type picker or add default content slide
    const slideType = document.getElementById('slide-type').value;
    editor.addSlide(slideType || 'content');
}

function changeSlideType() {
    const selector = document.getElementById('slide-type');
    editor.changeSlideType(selector.value);
}

// Save/Load
function savePresentation() {
    const presentation = editor.getPresentation();

    // Save to localStorage
    const saves = JSON.parse(localStorage.getItem('szmc_presentations') || '{}');
    const saveId = presentation.title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    saves[saveId] = presentation;
    localStorage.setItem('szmc_presentations', JSON.stringify(saves));

    // Also download as JSON
    editor.exportToJSON();

    editor.isDirty = false;
    alert('Presentation saved successfully!');
}

function loadPresentation() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                editor.loadPresentation(data);
                showPage('editor-page');
            } catch (error) {
                alert('Error loading presentation: ' + error.message);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// Insert Elements
function insertElement(type) {
    const canvas = document.getElementById('current-slide');
    const selection = window.getSelection();

    let html = '';

    switch (type) {
        case 'table':
            html = `
                <table class="medications-table" style="margin: 16px 0;">
                    <thead>
                        <tr>
                            <th>Column 1</th>
                            <th>Column 2</th>
                            <th>Column 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                    </tbody>
                </table>
            `;
            break;

        case 'list':
            html = `
                <ul style="margin: 16px 0; padding-left: 24px;">
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
            `;
            break;

        case 'image':
            const imageUrl = prompt('Enter image URL:');
            if (imageUrl) {
                html = `<img src="${imageUrl}" alt="Image" style="max-width: 100%; margin: 16px 0; border-radius: 8px;">`;
            }
            break;

        case 'chart':
            html = `
                <div style="background: var(--gray-100); padding: 40px; text-align: center; border-radius: 8px; margin: 16px 0;">
                    <i class="fas fa-chart-bar" style="font-size: 48px; color: var(--gray-400);"></i>
                    <p style="color: var(--gray-500); margin-top: 8px;">Chart placeholder - replace with actual chart image</p>
                </div>
            `;
            break;

        case 'callout':
            html = `
                <div class="callout callout-info" style="margin: 16px 0;">
                    <div class="callout-title"><i class="fas fa-info-circle"></i> Note</div>
                    <div class="callout-content">Important information here...</div>
                </div>
            `;
            break;

        case 'reference':
            html = `
                <div class="reference-item" style="margin: 8px 0;">
                    <span class="reference-number">1.</span>
                    <span class="reference-text">Author et al. Title. Journal. Year;Vol:Pages.</span>
                </div>
            `;
            break;
    }

    if (html) {
        // Find an editable area to insert into
        const editableArea = canvas.querySelector('[contenteditable="true"]');
        if (editableArea) {
            editableArea.focus();
            document.execCommand('insertHTML', false, html);
            editor.isDirty = true;
        }
    }
}

// Auto-save
let autoSaveInterval;
let autoSaveTimeout;

function updateAutoSaveIndicator(status) {
    const indicator = document.getElementById('autosave-indicator');
    if (!indicator) return;

    indicator.classList.remove('saving', 'saved', 'error');

    switch (status) {
        case 'saving':
            indicator.classList.add('saving');
            indicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Saving...</span>';
            break;
        case 'saved':
            indicator.classList.add('saved');
            indicator.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Saved</span>';
            break;
        case 'error':
            indicator.classList.add('error');
            indicator.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Error</span>';
            break;
        default:
            indicator.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Saved</span>';
    }
}

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (editor.isDirty) {
            updateAutoSaveIndicator('saving');
            try {
                const presentation = editor.getPresentation();
                localStorage.setItem('szmc_autosave', JSON.stringify(presentation));
                editor.isDirty = false;
                setTimeout(() => updateAutoSaveIndicator('saved'), 500);
            } catch (e) {
                updateAutoSaveIndicator('error');
                console.error('Auto-save failed:', e);
            }
        }
    }, 30000); // Auto-save every 30 seconds

    // Also save after 5 seconds of inactivity
    document.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            if (editor.isDirty) {
                updateAutoSaveIndicator('saving');
                try {
                    const presentation = editor.getPresentation();
                    localStorage.setItem('szmc_autosave', JSON.stringify(presentation));
                    setTimeout(() => updateAutoSaveIndicator('saved'), 500);
                } catch (e) {
                    updateAutoSaveIndicator('error');
                }
            }
        }, 5000);
    });
}

function checkAutoSave() {
    const autosave = localStorage.getItem('szmc_autosave');
    if (autosave) {
        try {
            const data = JSON.parse(autosave);
            if (confirm('Found an auto-saved presentation. Would you like to restore it?')) {
                editor.loadPresentation(data);
                showPage('editor-page');
            }
        } catch (e) {
            localStorage.removeItem('szmc_autosave');
        }
    }
}

// Apply theme to the presentation
function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('szmc_current_theme', themeName);

    // Update CSS variables based on theme
    const themes = {
        'szmc-blue': { primary: '#1e40af', light: '#3b82f6', accent: '#60a5fa' },
        'clinical-green': { primary: '#047857', light: '#059669', accent: '#34d399' },
        'modern-purple': { primary: '#5b21b6', light: '#7c3aed', accent: '#a78bfa' },
        'warm-orange': { primary: '#c2410c', light: '#ea580c', accent: '#fb923c' },
        'dark-professional': { primary: '#1f2937', light: '#374151', accent: '#60a5fa' },
        'medical-red': { primary: '#b91c1c', light: '#dc2626', accent: '#f87171' },
        'minimal-gray': { primary: '#374151', light: '#6b7280', accent: '#9ca3af' },
        'navy-gold': { primary: '#1e3a5f', light: '#2563eb', accent: '#fbbf24' }
    };

    const theme = themes[themeName];
    if (theme) {
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--primary-light', theme.light);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
    }

    // Show toast confirmation
    if (typeof showToast === 'function') {
        showToast(`Theme changed to ${themeName.replace(/-/g, ' ')}`);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check for auto-saved content
    checkAutoSave();

    // Start auto-save
    startAutoSave();

    // Prevent accidental navigation away
    window.onbeforeunload = (e) => {
        if (editor.isDirty) {
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    };

    // Initialize generator text detection
    initializeGeneratorListeners();

    // Load saved theme
    const savedTheme = localStorage.getItem('szmc_current_theme');
    if (savedTheme && typeof applyTheme === 'function') {
        applyTheme(savedTheme);
        const themeSelect = document.getElementById('gen-theme-select');
        if (themeSelect) themeSelect.value = savedTheme;
        const editorThemeSelect = document.getElementById('editor-theme-select');
        if (editorThemeSelect) editorThemeSelect.value = savedTheme;
    }
});

// Generator text input listeners
function initializeGeneratorListeners() {
    const textInput = document.getElementById('paste-text-input');
    const detectedDisplay = document.getElementById('detected-type-display');
    const themeSelect = document.getElementById('gen-theme-select');

    if (textInput && detectedDisplay) {
        let debounceTimer;

        textInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const text = textInput.value;
                if (text.length > 50) {
                    const type = detectPresentationType(text);
                    updateDetectedTypeDisplay(type, detectedDisplay);
                } else {
                    detectedDisplay.innerHTML = '<i class="fas fa-info-circle"></i><span>Keep typing to auto-detect presentation type...</span>';
                    detectedDisplay.className = 'detected-type';
                }
            }, 300);
        });
    }

    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            updateThemePreview(e.target.value);
        });
    }
}

function detectPresentationType(text) {
    const textLower = text.toLowerCase();

    const journalIndicators = [
        'abstract', 'methods', 'results', 'conclusion', 'study design',
        'randomized', 'cohort', 'meta-analysis', 'systematic review',
        'p-value', 'confidence interval', 'odds ratio', 'hazard ratio',
        'primary outcome', 'secondary outcome', 'inclusion criteria',
        'exclusion criteria', 'intention to treat', 'per protocol'
    ];

    const caseIndicators = [
        'chief complaint', 'history of present illness', 'hpi',
        'past medical history', 'pmh', 'physical exam', 'vitals',
        'blood pressure', 'heart rate', 'medications', 'allergies',
        'social history', 'family history', 'differential diagnosis',
        'assessment and plan', 'year old', 'y/o', 'presents with',
        'admitted for', 'admission'
    ];

    let journalScore = 0;
    let caseScore = 0;

    journalIndicators.forEach(ind => {
        if (textLower.includes(ind)) journalScore++;
    });

    caseIndicators.forEach(ind => {
        if (textLower.includes(ind)) caseScore++;
    });

    return caseScore >= journalScore ? 'case' : 'journal';
}

function updateDetectedTypeDisplay(type, element) {
    element.classList.add('animate');
    setTimeout(() => element.classList.remove('animate'), 300);

    if (type === 'case') {
        element.className = 'detected-type case';
        element.innerHTML = '<i class="fas fa-user-injured"></i><span>Detected: <strong>Case Presentation</strong> - Patient case notes identified</span>';
    } else {
        element.className = 'detected-type journal';
        element.innerHTML = '<i class="fas fa-book-medical"></i><span>Detected: <strong>Journal Club</strong> - Research article identified</span>';
    }
}

function updateThemePreview(themeName) {
    const themes = {
        'szmc-blue': { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa' },
        'clinical-green': { primary: '#047857', secondary: '#059669', accent: '#34d399' },
        'modern-purple': { primary: '#5b21b6', secondary: '#7c3aed', accent: '#a78bfa' },
        'warm-orange': { primary: '#c2410c', secondary: '#ea580c', accent: '#fb923c' },
        'dark-professional': { primary: '#1f2937', secondary: '#374151', accent: '#60a5fa' },
        'medical-red': { primary: '#b91c1c', secondary: '#dc2626', accent: '#f87171' },
        'minimal-gray': { primary: '#374151', secondary: '#6b7280', accent: '#9ca3af' },
        'navy-gold': { primary: '#1e3a5f', secondary: '#2563eb', accent: '#fbbf24' }
    };

    const theme = themes[themeName];
    if (theme) {
        const preview = document.getElementById('theme-preview');
        if (preview) {
            const colors = preview.querySelectorAll('.preview-color');
            if (colors[0]) colors[0].style.background = theme.primary;
            if (colors[1]) colors[1].style.background = theme.secondary;
            if (colors[2]) colors[2].style.background = theme.accent;
        }
    }
}

// Toggle theme panel in editor
function toggleThemePanel() {
    const panel = document.getElementById('theme-panel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

// Service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered:', registration.scope);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            if (confirm('New version available! Reload to update?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch((error) => {
                console.log('SW registration failed:', error);
            });
    });
}

// ================================
// AI Assistant Integration
// ================================

let aiAutoAnalyzeEnabled = false;
let aiAnalysisDebounceTimer = null;
let currentAIFilter = 'all';
let lastAnalysisResults = null;

// Toggle AI Panel visibility
function toggleAIPanel() {
    const panel = document.getElementById('ai-panel');
    if (panel) {
        panel.classList.toggle('active');

        // Run analysis when opening if no results yet
        if (panel.classList.contains('active') && !lastAnalysisResults) {
            runAIAnalysis();
        }
    }
}

// Run AI analysis on the presentation
function runAIAnalysis() {
    if (!window.aiAssistant || !window.editor) {
        console.error('AI Assistant or Editor not available');
        return;
    }

    const resultsContainer = document.getElementById('ai-results');

    // Show loading state
    resultsContainer.innerHTML = `
        <div class="ai-loading">
            <div class="ai-loading-spinner"></div>
            <p>Analyzing your presentation...</p>
        </div>
    `;

    // Small delay for visual feedback
    setTimeout(() => {
        const slides = editor.slides || [];
        const results = aiAssistant.analyzePresentation(slides);
        lastAnalysisResults = results;

        // Update stats
        updateAIStats(results.stats);

        // Update badge
        updateAIBadge(results.stats);

        // Update score display
        updateAIScore(results.score);

        // Update timing estimate
        updateTimingEstimate(slides);

        // Render results
        renderAIResults(results, currentAIFilter);
    }, 300);
}

// Update stats display
function updateAIStats(stats) {
    document.getElementById('ai-error-count').textContent = stats.errorCount;
    document.getElementById('ai-warning-count').textContent = stats.warningCount;
    document.getElementById('ai-info-count').textContent = stats.infoCount;
    document.getElementById('ai-tip-count').textContent = stats.tipCount;
}

// NEW: Update presentation score display
function updateAIScore(score) {
    const scoreEl = document.getElementById('ai-score');
    const scoreBarEl = document.getElementById('ai-score-bar');

    if (scoreEl) {
        scoreEl.textContent = score;
        scoreEl.className = 'ai-score-value';

        // Add color class based on score
        if (score >= 80) {
            scoreEl.classList.add('score-good');
        } else if (score >= 60) {
            scoreEl.classList.add('score-ok');
        } else {
            scoreEl.classList.add('score-poor');
        }
    }

    if (scoreBarEl) {
        scoreBarEl.style.width = `${score}%`;
        scoreBarEl.className = 'ai-score-bar-fill';

        if (score >= 80) {
            scoreBarEl.classList.add('bar-good');
        } else if (score >= 60) {
            scoreBarEl.classList.add('bar-ok');
        } else {
            scoreBarEl.classList.add('bar-poor');
        }
    }
}

// NEW: Update timing estimate display
function updateTimingEstimate(slides) {
    if (!window.aiAssistant) return;

    const timing = aiAssistant.getTimingEstimate(slides);
    const timingEl = document.getElementById('ai-timing');

    if (timingEl) {
        timingEl.innerHTML = `<i class="fas fa-clock"></i> Est. ${timing.formatted} (${timing.perSlide}s/slide)`;
    }
}

// Update badge on AI button
function updateAIBadge(stats) {
    const badge = document.getElementById('ai-issue-badge');
    const totalIssues = stats.errorCount + stats.warningCount;

    if (totalIssues > 0) {
        badge.textContent = totalIssues > 9 ? '9+' : totalIssues;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Filter AI results
function filterAIResults(filter) {
    currentAIFilter = filter;

    // Update tab active state
    document.querySelectorAll('.ai-filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === filter);
    });

    // Re-render with filter
    if (lastAnalysisResults) {
        renderAIResults(lastAnalysisResults, filter);
    }
}

// Render AI results list
function renderAIResults(results, filter) {
    const container = document.getElementById('ai-results');
    let items = [];

    if (filter === 'all' || filter === 'issues') {
        items = items.concat(results.issues.map(i => ({ ...i, type: 'issue' })));
    }

    if (filter === 'all' || filter === 'suggestions') {
        items = items.concat(results.suggestions.map(s => ({ ...s, type: 'suggestion' })));
    }

    // Sort by severity (errors first, then warnings, then info, then tips)
    const severityOrder = { error: 0, warning: 1, info: 2, tip: 3 };
    items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    if (items.length === 0) {
        container.innerHTML = `
            <div class="ai-success">
                <i class="fas fa-check-circle"></i>
                <h4>Looking Good!</h4>
                <p>No issues found in your presentation.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => renderAIResultItem(item)).join('');
}

// Render a single result item
function renderAIResultItem(item) {
    const icon = aiAssistant.getSeverityIcon(item.severity);
    const quickFix = aiAssistant.getQuickFix(item);
    const slideLabel = item.slideIndex !== null ? `Slide ${item.slideIndex + 1}` : '';

    return `
        <div class="ai-result-item severity-${item.severity}" onclick="handleAIResultClick(${item.slideIndex})">
            <div class="ai-result-header">
                <i class="ai-result-icon fas ${icon}"></i>
                <span class="ai-result-title">${escapeHtml(item.title)}</span>
                ${slideLabel ? `<span class="ai-result-slide">${slideLabel}</span>` : ''}
            </div>
            <div class="ai-result-message">${escapeHtml(item.message)}</div>
            ${quickFix ? `
                <div class="ai-result-actions">
                    <button class="ai-quick-fix" onclick="event.stopPropagation(); executeQuickFix('${item.action}', ${item.slideIndex})">
                        <i class="fas fa-wrench"></i> ${quickFix.label}
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// Handle clicking on a result item
function handleAIResultClick(slideIndex) {
    if (slideIndex !== null && window.editor) {
        editor.selectSlide(slideIndex);
    }
}

// Execute a quick fix action
function executeQuickFix(action, slideIndex) {
    if (!window.aiAssistant) return;

    const fakeIssue = { action, slideIndex };
    const quickFix = aiAssistant.getQuickFix(fakeIssue);

    if (quickFix && quickFix.action) {
        quickFix.action();

        // Re-analyze after a short delay
        setTimeout(runAIAnalysis, 500);
    }
}

// Toggle auto-analyze feature
function toggleAutoAnalyze() {
    const checkbox = document.getElementById('ai-auto-analyze');
    aiAutoAnalyzeEnabled = checkbox.checked;

    if (aiAutoAnalyzeEnabled) {
        showToast('Auto-analyze enabled', 'info');
    }
}

// Trigger AI analysis on editor changes (called from editor.js)
function triggerAIAnalysisOnChange() {
    if (!aiAutoAnalyzeEnabled) return;

    // Debounce to avoid too many analyses
    clearTimeout(aiAnalysisDebounceTimer);
    aiAnalysisDebounceTimer = setTimeout(() => {
        const panel = document.getElementById('ai-panel');
        if (panel && panel.classList.contains('active')) {
            runAIAnalysis();
        } else {
            // Just update the badge silently
            if (window.aiAssistant && window.editor) {
                const slides = editor.slides || [];
                const results = aiAssistant.analyzePresentation(slides);
                lastAnalysisResults = results;
                updateAIBadge(results.stats);
            }
        }
    }, 1000);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show toast notification (if not already defined)
if (typeof showToast !== 'function') {
    window.showToast = function(message, type = 'info') {
        // Check if toast container exists
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999;';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            padding: 12px 20px;
            margin-top: 8px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
            background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : type === 'success' ? '#10b981' : '#3b82f6'};
        `;
        toast.textContent = message;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
}

// Make functions globally available
window.toggleAIPanel = toggleAIPanel;
window.runAIAnalysis = runAIAnalysis;
window.filterAIResults = filterAIResults;
window.toggleAutoAnalyze = toggleAutoAnalyze;
window.handleAIResultClick = handleAIResultClick;
window.executeQuickFix = executeQuickFix;
window.triggerAIAnalysisOnChange = triggerAIAnalysisOnChange;
