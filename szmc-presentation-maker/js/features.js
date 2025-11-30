// SZMC Geriatrics Presentation Maker - Enhanced Features Module

// ================================
// DARK MODE
// ================================

const DarkMode = {
    storageKey: 'szmc_dark_mode',

    init() {
        // Check for saved preference or system preference
        const saved = localStorage.getItem(this.storageKey);
        if (saved !== null) {
            this.setTheme(saved === 'true');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme(true);
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem(this.storageKey) === null) {
                this.setTheme(e.matches);
            }
        });
    },

    toggle() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        this.setTheme(!isDark);
    },

    setTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem(this.storageKey, isDark);
        this.updateToggleButton(isDark);
    },

    updateToggleButton(isDark) {
        const btn = document.getElementById('dark-mode-toggle');
        if (btn) {
            btn.innerHTML = isDark
                ? '<i class="fas fa-sun" aria-hidden="true"></i>'
                : '<i class="fas fa-moon" aria-hidden="true"></i>';
            btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            btn.title = isDark ? 'Light Mode' : 'Dark Mode';
        }
    }
};

// ================================
// PRESENTATION TIMER
// ================================

const PresentationTimer = {
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    intervalId: null,
    slideTimings: [],

    // Estimated time per slide type (in seconds)
    slideEstimates: {
        'title': 30,
        'toc': 20,
        'section-header': 10,
        'content': 90,
        'two-column': 90,
        'patient-info': 60,
        'hpi': 120,
        'pmh': 60,
        'medications': 90,
        'physical-exam': 90,
        'labs': 60,
        'imaging': 90,
        'differential': 90,
        'assessment': 90,
        'plan': 120,
        'teaching-points': 90,
        'take-home': 60,
        'references': 30,
        'questions': 60,
        'quiz': 120,
        'default': 60
    },

    init() {
        this.createTimerUI();
    },

    createTimerUI() {
        // Create timer display element
        const timerContainer = document.createElement('div');
        timerContainer.id = 'presentation-timer';
        timerContainer.className = 'presentation-timer';
        timerContainer.innerHTML = `
            <div class="timer-display">
                <span class="timer-time" id="timer-display">00:00</span>
                <span class="timer-estimate" id="timer-estimate"></span>
            </div>
            <div class="timer-controls">
                <button class="timer-btn" id="timer-start" onclick="PresentationTimer.toggle()" title="Start/Pause Timer">
                    <i class="fas fa-play" aria-hidden="true"></i>
                </button>
                <button class="timer-btn" id="timer-reset" onclick="PresentationTimer.reset()" title="Reset Timer">
                    <i class="fas fa-redo" aria-hidden="true"></i>
                </button>
            </div>
        `;

        // Add to editor header if it exists
        const editorHeader = document.querySelector('.editor-header .toolbar-right');
        if (editorHeader) {
            editorHeader.insertBefore(timerContainer, editorHeader.firstChild);
        }
    },

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },

    start() {
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.intervalId = setInterval(() => this.update(), 1000);

        const btn = document.getElementById('timer-start');
        if (btn) btn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
    },

    pause() {
        this.isRunning = false;
        this.elapsedTime = Date.now() - this.startTime;
        clearInterval(this.intervalId);

        const btn = document.getElementById('timer-start');
        if (btn) btn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
    },

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.slideTimings = [];
        this.updateDisplay(0);
    },

    update() {
        const elapsed = Date.now() - this.startTime;
        this.updateDisplay(elapsed);
    },

    updateDisplay(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    },

    getEstimatedTime(slides) {
        if (!slides || !Array.isArray(slides)) return { minutes: 0, seconds: 0 };

        let totalSeconds = 0;
        slides.forEach(slide => {
            const estimate = this.slideEstimates[slide.type] || this.slideEstimates['default'];
            totalSeconds += estimate;
        });

        return {
            minutes: Math.floor(totalSeconds / 60),
            seconds: totalSeconds % 60,
            totalSeconds
        };
    },

    updateEstimate() {
        if (!window.editor || !window.editor.slides) return;

        const estimate = this.getEstimatedTime(window.editor.slides);
        const display = document.getElementById('timer-estimate');
        if (display) {
            display.textContent = `Est. ${estimate.minutes}:${estimate.seconds.toString().padStart(2, '0')}`;
        }
    }
};

// ================================
// KEYBOARD SHORTCUTS MANAGER
// ================================

const KeyboardShortcuts = {
    shortcuts: {},

    init() {
        this.registerDefaults();
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    },

    registerDefaults() {
        // Navigation
        this.register('ArrowRight', 'Next slide', () => window.editor?.nextSlide());
        this.register('ArrowLeft', 'Previous slide', () => window.editor?.prevSlide());
        this.register('Home', 'First slide', () => window.editor?.selectSlide(0));
        this.register('End', 'Last slide', () => {
            if (window.editor?.slides) window.editor.selectSlide(window.editor.slides.length - 1);
        });

        // Editing
        this.register('ctrl+s', 'Save presentation', () => {
            if (typeof savePresentation === 'function') savePresentation();
        });
        this.register('ctrl+n', 'New slide', () => {
            if (typeof addSlide === 'function') addSlide();
        });
        this.register('ctrl+d', 'Duplicate slide', () => {
            if (typeof duplicateCurrentSlide === 'function') duplicateCurrentSlide();
        });
        this.register('ctrl+shift+d', 'Toggle dark mode', () => DarkMode.toggle());

        // Presentation
        this.register('F5', 'Start presentation', () => {
            if (typeof showPresentationOptions === 'function') showPresentationOptions();
        });
        this.register('Escape', 'Exit/Close', () => {
            // Close any open modals
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        });

        // AI Assistant
        this.register('ctrl+shift+a', 'Toggle AI panel', () => {
            if (typeof toggleAIPanel === 'function') toggleAIPanel();
        });

        // Timer
        this.register('ctrl+t', 'Toggle timer', () => PresentationTimer.toggle());
    },

    register(combo, description, callback) {
        this.shortcuts[combo.toLowerCase()] = { description, callback };
    },

    handleKeydown(e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Allow some shortcuts even in inputs
            if (!['ctrl+s', 'ctrl+shift+d', 'Escape'].includes(this.getCombo(e))) {
                return;
            }
        }

        const combo = this.getCombo(e);
        const shortcut = this.shortcuts[combo];

        if (shortcut) {
            e.preventDefault();
            shortcut.callback();
        }
    },

    getCombo(e) {
        const parts = [];
        if (e.ctrlKey || e.metaKey) parts.push('ctrl');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    },

    showHelp() {
        const shortcuts = Object.entries(this.shortcuts)
            .map(([combo, { description }]) => `<tr><td><kbd>${combo}</kbd></td><td>${description}</td></tr>`)
            .join('');

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'shortcuts-help-modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                    <button class="btn-icon" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="shortcuts-table">
                        <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
                        <tbody>${shortcuts}</tbody>
                    </table>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
};

// ================================
// AUTOSAVE INDICATOR
// ================================

const AutoSaveIndicator = {
    element: null,

    init() {
        this.createIndicator();
    },

    createIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'autosave-status';
        indicator.className = 'autosave-indicator';
        indicator.innerHTML = '<i class="fas fa-cloud"></i> <span>Saved</span>';

        const header = document.querySelector('.editor-header .toolbar-right');
        if (header) {
            header.appendChild(indicator);
        }
        this.element = indicator;
    },

    setSaving() {
        if (this.element) {
            this.element.className = 'autosave-indicator saving';
            this.element.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> <span>Saving...</span>';
        }
    },

    setSaved() {
        if (this.element) {
            this.element.className = 'autosave-indicator saved';
            this.element.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> <span>Saved</span>';
        }
    },

    setError() {
        if (this.element) {
            this.element.className = 'autosave-indicator error';
            this.element.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Error</span>';
        }
    }
};

// ================================
// FOCUS MODE
// ================================

const FocusMode = {
    isActive: false,

    toggle() {
        this.isActive = !this.isActive;
        document.body.classList.toggle('focus-mode', this.isActive);

        if (typeof showToast === 'function') {
            showToast(this.isActive ? 'Focus mode enabled' : 'Focus mode disabled', 'info');
        }
    }
};

// ================================
// WORD COUNT
// ================================

const WordCount = {
    getSlideWordCount(slide) {
        if (!slide || !slide.data) return 0;

        let text = Object.values(slide.data)
            .filter(v => typeof v === 'string')
            .join(' ');
        // Remove HTML tags (incomplete multi-char sanitization fix)
        let prevText;
        do {
            prevText = text;
            text = text.replace(/<[^>]*>/g, '');
        } while (text !== prevText);
        text = text.trim();
        const text = Object.values(slide.data)
            .filter(v => typeof v === 'string')
            .join(' ')
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .trim();

        return text.split(/\s+/).filter(w => w.length > 0).length;
    },

    getPresentationWordCount(slides) {
        if (!slides || !Array.isArray(slides)) return 0;
        return slides.reduce((total, slide) => total + this.getSlideWordCount(slide), 0);
    },

    updateDisplay() {
        if (!window.editor || !window.editor.slides) return;

        const total = this.getPresentationWordCount(window.editor.slides);
        const current = this.getSlideWordCount(window.editor.slides[window.editor.currentSlideIndex]);

        const display = document.getElementById('word-count-display');
        if (display) {
            display.textContent = `${current} / ${total} words`;
        }
    }
};

// ================================
// QUICK ACTIONS
// ================================

const QuickActions = {
    actions: [
        { icon: 'fa-plus', label: 'Add Slide', action: () => addSlide?.() },
        { icon: 'fa-copy', label: 'Duplicate', action: () => duplicateCurrentSlide?.() },
        { icon: 'fa-trash', label: 'Delete', action: () => window.editor?.deleteSlide(window.editor?.currentSlideIndex) },
        { icon: 'fa-robot', label: 'AI Analysis', action: () => toggleAIPanel?.() },
        { icon: 'fa-download', label: 'Export', action: () => document.getElementById('export-dropdown')?.classList.toggle('show') }
    ],

    createQuickBar() {
        const bar = document.createElement('div');
        bar.className = 'quick-actions-bar';
        bar.innerHTML = this.actions.map(a =>
            `<button class="quick-action-btn" onclick="${a.action}" title="${a.label}">
                <i class="fas ${a.icon}"></i>
            </button>`
        ).join('');
        return bar;
    }
};

// ================================
// RECENT FILES
// ================================

const RecentFiles = {
    storageKey: 'szmc_recent_files',
    maxFiles: 5,

    add(file) {
        const recent = this.getAll();
        const filtered = recent.filter(f => f.id !== file.id);
        filtered.unshift({
            id: file.id || Date.now(),
            title: file.title,
            type: file.type,
            lastModified: new Date().toISOString(),
            slideCount: file.slides?.length || 0
        });

        localStorage.setItem(this.storageKey, JSON.stringify(filtered.slice(0, this.maxFiles)));
    },

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch {
            return [];
        }
    },

    clear() {
        localStorage.removeItem(this.storageKey);
    }
};

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    DarkMode.init();
    PresentationTimer.init();
    KeyboardShortcuts.init();
    AutoSaveIndicator.init();

    // Update timer estimate when slides change
    if (window.editor) {
        const originalAddSlide = window.editor.addSlide.bind(window.editor);
        window.editor.addSlide = function(...args) {
            const result = originalAddSlide(...args);
            PresentationTimer.updateEstimate();
            WordCount.updateDisplay();
            return result;
        };
    }
});

// Export for global access
window.DarkMode = DarkMode;
window.PresentationTimer = PresentationTimer;
window.KeyboardShortcuts = KeyboardShortcuts;
window.FocusMode = FocusMode;
window.WordCount = WordCount;
window.RecentFiles = RecentFiles;
