// SZMC Geriatrics Presentation Maker - Dark Mode Module

class DarkModeManager {
    constructor() {
        this.isDarkMode = false;
        this.storageKey = 'szmc_dark_mode';
        this.init();
    }

    init() {
        // Check for saved preference
        const savedPreference = localStorage.getItem(this.storageKey);
        
        if (savedPreference !== null) {
            this.isDarkMode = savedPreference === 'true';
        } else {
            // Check system preference
            this.isDarkMode = window.matchMedia && 
                window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        // Apply initial state
        this.applyTheme();

        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't set a manual preference
                if (localStorage.getItem(this.storageKey) === null) {
                    this.isDarkMode = e.matches;
                    this.applyTheme();
                }
            });
        }
    }

    applyTheme() {
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.classList.remove('dark-mode');
        }

        // Update toggle button icon if it exists
        this.updateToggleButton();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('darkModeChanged', { 
            detail: { isDarkMode: this.isDarkMode } 
        }));
    }

    toggle() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem(this.storageKey, this.isDarkMode.toString());
        this.applyTheme();

        // Show toast notification
        if (typeof showToast === 'function') {
            const msg = this.isDarkMode ? 'Dark mode enabled' : 'Light mode enabled';
            showToast(msg, 'info');
        }

        return this.isDarkMode;
    }

    updateToggleButton() {
        // Update all dark mode toggle buttons (landing and editor pages have separate buttons)
        const buttons = document.querySelectorAll('.dark-mode-toggle');
        buttons.forEach(btn => {
            // Update icon - replace the entire innerHTML for simplicity
            btn.innerHTML = this.isDarkMode
                ? '<i class="fas fa-sun" aria-hidden="true"></i>'
                : '<i class="fas fa-moon" aria-hidden="true"></i>';

            // Update aria label and title
            btn.setAttribute('aria-label', this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
            btn.title = this.isDarkMode ? 'Light Mode' : 'Dark Mode';
        });
    }

    // Get current state
    getState() {
        return this.isDarkMode;
    }

    // Set specific state
    setState(isDark) {
        this.isDarkMode = isDark;
        localStorage.setItem(this.storageKey, this.isDarkMode.toString());
        this.applyTheme();
    }
}

// Create global instance
const darkMode = new DarkModeManager();

// Global toggle function
function toggleDarkMode() {
    return darkMode.toggle();
}

// Make globally available
window.darkMode = darkMode;
window.toggleDarkMode = toggleDarkMode;

// Keyboard shortcut: Ctrl+Shift+D for dark mode
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleDarkMode();
    }
});
