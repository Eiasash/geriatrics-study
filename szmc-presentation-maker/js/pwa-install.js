/**
 * PWA Install Prompt Handler
 * Manages the install experience for the SZMC Presentation Maker
 */

class PWAInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone === true;
        this.dismissedPermanently = localStorage.getItem('pwa-install-dismissed') === 'true';

        this.init();
    }

    init() {
        // Check if already installed
        if (this.isStandalone) {
            this.isInstalled = true;
            console.log('[PWA] Running in standalone mode');
            return;
        }

        // Check if user permanently dismissed the prompt
        if (this.dismissedPermanently) {
            console.log('[PWA] User previously dismissed install prompt');
            return;
        }

        // Create UI elements
        this.createPromptUI();
        this.createIOSModal();

        // Listen for beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log('[PWA] Install prompt captured');

            // Show install prompt after a delay
            setTimeout(() => this.showPrompt(), 3000);
        });

        // Listen for successful install
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hidePrompt();
            console.log('[PWA] App installed successfully');
            this.showToast('App installed successfully!');
        });

        // Check if should show iOS prompt
        if (this.isIOS && !this.isStandalone) {
            const lastPrompt = localStorage.getItem('pwa-ios-prompt');
            const daysSincePrompt = lastPrompt ?
                (Date.now() - parseInt(lastPrompt)) / (1000 * 60 * 60 * 24) : 999;

            if (daysSincePrompt > 7) {
                setTimeout(() => this.showIOSPrompt(), 5000);
            }
        }
    }

    createPromptUI() {
        const prompt = document.createElement('div');
        prompt.className = 'pwa-install-prompt';
        prompt.id = 'pwa-install-prompt';
        prompt.innerHTML = `
            <button class="pwa-install-close" onclick="pwaInstall.dismissPrompt(false)" aria-label="Close install prompt">
                <i class="fas fa-times"></i>
            </button>
            <div class="pwa-install-icon">
                <i class="fas fa-download"></i>
            </div>
            <div class="pwa-install-content">
                <div class="pwa-install-title">Install SZMC Presentation Maker</div>
                <div class="pwa-install-description">Quick access, works offline</div>
            </div>
            <div class="pwa-install-actions">
                <button class="pwa-install-btn secondary" onclick="pwaInstall.dismissPrompt(true)">Don't show again</button>
                <button class="pwa-install-btn primary" onclick="pwaInstall.install()">Install</button>
            </div>
        `;
        document.body.appendChild(prompt);
    }

    createIOSModal() {
        const modal = document.createElement('div');
        modal.className = 'ios-install-modal';
        modal.id = 'ios-install-modal';
        modal.innerHTML = `
            <div class="ios-install-content">
                <button class="ios-install-close-btn" onclick="pwaInstall.hideIOSModal(true)" aria-label="Don't show again">
                    <i class="fas fa-times"></i>
                </button>
                <h3><i class="fas fa-mobile-alt"></i> Install App</h3>
                <p>Install SZMC Presentation Maker on your device for quick access and offline use.</p>
                <div class="ios-install-steps">
                    <div class="ios-install-step">
                        <i class="fas fa-share-square"></i>
                        <span>Tap the <strong>Share</strong> button</span>
                    </div>
                    <div class="ios-install-step">
                        <i class="fas fa-plus-square"></i>
                        <span>Tap <strong>Add to Home Screen</strong></span>
                    </div>
                    <div class="ios-install-step">
                        <i class="fas fa-check-circle"></i>
                        <span>Tap <strong>Add</strong> to confirm</span>
                    </div>
                </div>
                <div class="ios-install-footer">
                    <button class="ios-install-dismiss" onclick="pwaInstall.hideIOSModal(true)">Don't show again</button>
                    <button class="ios-install-close" onclick="pwaInstall.hideIOSModal(false)">Got it</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showPrompt() {
        if (this.isInstalled || !this.deferredPrompt || this.dismissedPermanently) return;

        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.classList.add('visible');
        }
    }

    hidePrompt() {
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.classList.remove('visible');
        }
    }

    dismissPrompt(permanent = false) {
        this.hidePrompt();
        if (permanent) {
            localStorage.setItem('pwa-install-dismissed', 'true');
            this.dismissedPermanently = true;
            console.log('[PWA] User permanently dismissed install prompt');
        }
    }

    async install() {
        if (!this.deferredPrompt) {
            console.log('[PWA] No install prompt available');
            return;
        }

        this.hidePrompt();

        try {
            const result = await this.deferredPrompt.prompt();
            console.log('[PWA] Install prompt result:', result.outcome);

            if (result.outcome === 'accepted') {
                this.isInstalled = true;
            }
        } catch (error) {
            console.error('[PWA] Install error:', error);
        }

        this.deferredPrompt = null;
    }

    showIOSPrompt() {
        if (this.isStandalone || this.dismissedPermanently) return;

        localStorage.setItem('pwa-ios-prompt', Date.now().toString());
        const modal = document.getElementById('ios-install-modal');
        if (modal) {
            modal.classList.add('visible');
        }
    }

    hideIOSModal(permanent = false) {
        const modal = document.getElementById('ios-install-modal');
        if (modal) {
            modal.classList.remove('visible');
        }
        if (permanent) {
            localStorage.setItem('pwa-install-dismissed', 'true');
            this.dismissedPermanently = true;
            console.log('[PWA] User permanently dismissed iOS install modal');
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10002;
            animation: fadeInOut 3s ease-in-out forwards;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    // Public method to manually trigger install
    triggerInstall() {
        if (this.isIOS) {
            this.showIOSPrompt();
        } else if (this.deferredPrompt) {
            this.install();
        } else {
            this.showToast('App is already installed or not supported');
        }
    }

    // Check if app is installable
    isInstallable() {
        return !this.isInstalled && (this.deferredPrompt !== null || this.isIOS);
    }

    // Reset dismissal (useful for testing or settings)
    resetDismissal() {
        localStorage.removeItem('pwa-install-dismissed');
        localStorage.removeItem('pwa-ios-prompt');
        this.dismissedPermanently = false;
        console.log('[PWA] Install prompt dismissal reset');
    }
}

// Initialize PWA Install Manager
const pwaInstall = new PWAInstallManager();

// Export for use elsewhere
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAInstallManager;
}
