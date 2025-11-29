// SZMC Geriatrics Presentation Maker - Mobile & View Toggle Module

class MobileManager {
    constructor() {
        this.currentView = 'auto'; // auto, mobile, desktop
        this.isMobileDevice = this.detectMobile();
        this.drawer = null;
        this.overlay = null;
        this.toolbar = null;
        this.slideTypeModal = null;
        this.actionsSheet = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    detectMobile() {
        return window.innerWidth <= 768 ||
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        this.loadViewPreference();
        this.createMobileUI();
        this.bindEvents();
        this.applyView();
    }

    loadViewPreference() {
        const saved = localStorage.getItem('szmc_view_mode');
        if (saved && ['auto', 'mobile', 'desktop'].includes(saved)) {
            this.currentView = saved;
        }
    }

    saveViewPreference() {
        localStorage.setItem('szmc_view_mode', this.currentView);
    }

    createMobileUI() {
        // Create view toggle button
        this.createViewToggle();

        // Create mobile navigation drawer
        this.createMobileDrawer();

        // Create mobile overlay
        this.createOverlay();

        // Create mobile toolbar
        this.createMobileToolbar();

        // Create slide type modal
        this.createSlideTypeModal();

        // Create actions sheet
        this.createActionsSheet();
    }

    createViewToggle() {
        const container = document.createElement('div');
        container.className = 'view-mode-container';
        container.id = 'view-mode-container';

        container.innerHTML = `
            <button class="view-toggle-btn" onclick="mobileManager.toggleView()" title="${i18n ? i18n.t('toggleView') : 'Toggle View'}">
                <i class="fas fa-mobile-alt" id="view-toggle-icon"></i>
                <span class="btn-text" id="view-toggle-text" data-i18n="mobileView">${i18n ? i18n.t('mobileView') : 'Mobile View'}</span>
            </button>
        `;

        document.body.appendChild(container);
    }

    createMobileDrawer() {
        this.drawer = document.createElement('div');
        this.drawer.className = 'mobile-nav-drawer';
        this.drawer.id = 'mobile-nav-drawer';

        this.drawer.innerHTML = `
            <div class="mobile-nav-header">
                <div class="logo">
                    <i class="fas fa-heartbeat"></i>
                    <span data-i18n="logo">${i18n ? i18n.t('logo') : 'SZMC Geriatrics'}</span>
                </div>
                <button class="mobile-nav-close" onclick="mobileManager.closeDrawer()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mobile-lang-selector">
                <button class="mobile-lang-btn ${i18n && i18n.getLanguage() === 'en' ? 'active' : ''}" onclick="mobileManager.setLanguage('en')">
                    English
                </button>
                <button class="mobile-lang-btn ${i18n && i18n.getLanguage() === 'he' ? 'active' : ''}" onclick="mobileManager.setLanguage('he')">
                    עברית
                </button>
            </div>
            <div class="mobile-nav-content">
                <ul class="mobile-slide-list" id="mobile-slide-list">
                    <!-- Populated dynamically -->
                </ul>
            </div>
        `;

        document.body.appendChild(this.drawer);
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-overlay';
        this.overlay.id = 'mobile-overlay';
        this.overlay.onclick = () => this.closeDrawer();
        document.body.appendChild(this.overlay);
    }

    createMobileToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'mobile-toolbar';
        this.toolbar.id = 'mobile-toolbar';

        this.toolbar.innerHTML = `
            <button class="mobile-toolbar-btn" onclick="mobileManager.openDrawer()" title="Slides">
                <i class="fas fa-layer-group"></i>
                <span data-i18n="slides">${i18n ? i18n.t('slides') : 'Slides'}</span>
            </button>
            <button class="mobile-toolbar-btn" onclick="mobileManager.showSlideTypes()" title="Add Slide">
                <i class="fas fa-plus-circle"></i>
                <span data-i18n="addSlide">${i18n ? i18n.t('addSlide') : 'Add'}</span>
            </button>
            <button class="mobile-toolbar-btn" onclick="mobileManager.showActions()" title="Actions">
                <i class="fas fa-ellipsis-h"></i>
                <span data-i18n="slideActions">${i18n ? i18n.t('slideActions') : 'Actions'}</span>
            </button>
            <button class="mobile-toolbar-btn" onclick="showPresentationOptions()" title="Present">
                <i class="fas fa-play"></i>
                <span data-i18n="present">${i18n ? i18n.t('present') : 'Present'}</span>
            </button>
            <button class="mobile-toolbar-btn" onclick="mobileManager.showExportMenu()" title="Export">
                <i class="fas fa-download"></i>
                <span data-i18n="save">${i18n ? i18n.t('save') : 'Export'}</span>
            </button>
        `;

        document.body.appendChild(this.toolbar);
    }

    createSlideTypeModal() {
        this.slideTypeModal = document.createElement('div');
        this.slideTypeModal.className = 'mobile-slide-type-modal';
        this.slideTypeModal.id = 'mobile-slide-type-modal';

        const groups = {
            navigation: ['title', 'toc', 'section-header'],
            case: ['patient-info', 'hpi', 'timeline-visual', 'pmh', 'medications', 'physical-exam', 'labs', 'differential', 'diagnosis', 'treatment'],
            journal: ['jc-title', 'jc-background', 'jc-pico', 'jc-methods', 'jc-results', 'jc-conclusion'],
            visuals: ['statistics-visual', 'chart-bar', 'key-points-visual', 'algorithm', 'pathophysiology'],
            conclusion: ['teaching-points', 'take-home', 'references', 'questions']
        };

        const typeIcons = {
            'title': 'fa-heading',
            'toc': 'fa-list-ol',
            'section-header': 'fa-bookmark',
            'patient-info': 'fa-user',
            'hpi': 'fa-notes-medical',
            'timeline-visual': 'fa-clock',
            'pmh': 'fa-history',
            'medications': 'fa-pills',
            'physical-exam': 'fa-stethoscope',
            'labs': 'fa-vial',
            'differential': 'fa-balance-scale',
            'diagnosis': 'fa-diagnoses',
            'treatment': 'fa-prescription',
            'jc-title': 'fa-newspaper',
            'jc-background': 'fa-book',
            'jc-pico': 'fa-question-circle',
            'jc-methods': 'fa-flask',
            'jc-results': 'fa-chart-line',
            'jc-conclusion': 'fa-check-double',
            'statistics-visual': 'fa-chart-bar',
            'chart-bar': 'fa-chart-column',
            'key-points-visual': 'fa-lightbulb',
            'algorithm': 'fa-project-diagram',
            'pathophysiology': 'fa-dna',
            'teaching-points': 'fa-chalkboard-teacher',
            'take-home': 'fa-home',
            'references': 'fa-quote-left',
            'questions': 'fa-question'
        };

        let html = `
            <div class="mobile-slide-type-header">
                <h3 data-i18n="addSlide">${i18n ? i18n.t('addSlide') : 'Add Slide'}</h3>
                <button class="mobile-slide-type-close" onclick="mobileManager.hideSlideTypes()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mobile-slide-type-content">
        `;

        const groupNames = {
            navigation: 'Navigation',
            case: 'Case Presentation',
            journal: 'Journal Club',
            visuals: 'Data & Visuals',
            conclusion: 'Conclusion'
        };

        for (const [groupKey, types] of Object.entries(groups)) {
            html += `
                <div class="mobile-slide-type-group">
                    <h4>${groupNames[groupKey]}</h4>
                    <div class="mobile-slide-type-list">
            `;

            for (const type of types) {
                const template = SlideTemplates && SlideTemplates[type];
                const name = template ? template.name : type;
                const icon = typeIcons[type] || 'fa-file';

                html += `
                    <div class="mobile-slide-type-item" onclick="mobileManager.addSlideOfType('${type}')">
                        <i class="fas ${icon}"></i>
                        <span>${name}</span>
                    </div>
                `;
            }

            html += `</div></div>`;
        }

        html += `</div>`;

        this.slideTypeModal.innerHTML = html;
        document.body.appendChild(this.slideTypeModal);
    }

    createActionsSheet() {
        this.actionsSheet = document.createElement('div');
        this.actionsSheet.className = 'mobile-actions-sheet';
        this.actionsSheet.id = 'mobile-actions-sheet';

        this.actionsSheet.innerHTML = `
            <button class="mobile-action-btn" onclick="mobileManager.duplicateSlide()">
                <i class="fas fa-copy"></i>
                <span data-i18n="duplicate">${i18n ? i18n.t('duplicate') : 'Duplicate Slide'}</span>
            </button>
            <button class="mobile-action-btn" onclick="mobileManager.changeSlideType()">
                <i class="fas fa-exchange-alt"></i>
                <span data-i18n="slideType">${i18n ? i18n.t('slideType') : 'Change Type'}</span>
            </button>
            <button class="mobile-action-btn" onclick="mobileManager.moveSlideUp()">
                <i class="fas fa-arrow-up"></i>
                <span>${i18n ? i18n.t('previousNextSlide') : 'Move Up'}</span>
            </button>
            <button class="mobile-action-btn" onclick="mobileManager.moveSlideDown()">
                <i class="fas fa-arrow-down"></i>
                <span>${i18n ? i18n.t('previousNextSlide') : 'Move Down'}</span>
            </button>
            <button class="mobile-action-btn danger" onclick="mobileManager.deleteSlide()">
                <i class="fas fa-trash"></i>
                <span data-i18n="delete">${i18n ? i18n.t('delete') : 'Delete Slide'}</span>
            </button>
        `;

        document.body.appendChild(this.actionsSheet);
    }

    bindEvents() {
        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Touch gestures for slide navigation
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Language change event
        window.addEventListener('languageChanged', () => this.updateMobileSlideList());

        // Click outside to close modals
        document.addEventListener('click', (e) => {
            if (this.slideTypeModal && this.slideTypeModal.classList.contains('active')) {
                if (!this.slideTypeModal.contains(e.target)) {
                    this.hideSlideTypes();
                }
            }
            if (this.actionsSheet && this.actionsSheet.classList.contains('active')) {
                if (!this.actionsSheet.contains(e.target)) {
                    this.hideActions();
                }
            }
        });
    }

    handleResize() {
        this.isMobileDevice = this.detectMobile();
        if (this.currentView === 'auto') {
            this.applyView();
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const threshold = 100;
        const diff = this.touchStartX - this.touchEndX;

        // Check if we're in presentation mode or editor
        if (presentation && presentation.isActive) {
            if (diff > threshold) {
                // Swipe left - next slide
                presentation.next();
            } else if (diff < -threshold) {
                // Swipe right - previous slide
                presentation.prev();
            }
        } else if (document.getElementById('editor-page').classList.contains('active')) {
            // In editor mode, swipe to change slides
            if (diff > threshold && editor) {
                editor.nextSlide();
            } else if (diff < -threshold && editor) {
                editor.prevSlide();
            }
        }
    }

    toggleView() {
        if (this.currentView === 'auto' || this.currentView === 'desktop') {
            this.currentView = 'mobile';
        } else {
            this.currentView = 'desktop';
        }

        this.saveViewPreference();
        this.applyView();
        this.updateToggleButton();

        if (typeof showToast === 'function') {
            const viewName = this.currentView === 'mobile' ?
                (i18n ? i18n.t('mobileView') : 'Mobile View') :
                (i18n ? i18n.t('desktopView') : 'Desktop View');
            showToast(`${i18n ? i18n.t('toggleView') : 'View changed to'}: ${viewName}`);
        }
    }

    applyView() {
        const body = document.body;
        body.classList.remove('force-mobile-view', 'force-desktop-view');

        if (this.currentView === 'mobile') {
            body.classList.add('force-mobile-view');
        } else if (this.currentView === 'desktop') {
            body.classList.add('force-desktop-view');
        }
        // 'auto' lets CSS media queries handle it

        this.updateToggleButton();
    }

    updateToggleButton() {
        const icon = document.getElementById('view-toggle-icon');
        const text = document.getElementById('view-toggle-text');

        if (!icon || !text) return;

        if (this.currentView === 'mobile' || (this.currentView === 'auto' && this.isMobileDevice)) {
            icon.className = 'fas fa-desktop';
            text.textContent = i18n ? i18n.t('desktopView') : 'Desktop View';
            text.setAttribute('data-i18n', 'desktopView');
        } else {
            icon.className = 'fas fa-mobile-alt';
            text.textContent = i18n ? i18n.t('mobileView') : 'Mobile View';
            text.setAttribute('data-i18n', 'mobileView');
        }
    }

    openDrawer() {
        if (this.drawer && this.overlay) {
            this.updateMobileSlideList();
            this.drawer.classList.add('active');
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeDrawer() {
        if (this.drawer && this.overlay) {
            this.drawer.classList.remove('active');
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    updateMobileSlideList() {
        const list = document.getElementById('mobile-slide-list');
        if (!list || !editor || !editor.slides) return;

        list.innerHTML = editor.slides.map((slide, index) => {
            const template = SlideTemplates && SlideTemplates[slide.type];
            const typeName = template ? template.name : slide.type;
            const isActive = index === editor.currentSlideIndex;

            return `
                <li class="mobile-slide-item ${isActive ? 'active' : ''}" onclick="mobileManager.selectSlide(${index})">
                    <span class="slide-num">${index + 1}</span>
                    <span class="slide-type">${typeName}</span>
                </li>
            `;
        }).join('');
    }

    selectSlide(index) {
        if (editor) {
            editor.selectSlide(index);
            this.closeDrawer();
            this.updateMobileSlideList();
        }
    }

    showSlideTypes() {
        if (this.slideTypeModal) {
            this.slideTypeModal.classList.add('active');
            this.overlay.classList.add('active');
        }
    }

    hideSlideTypes() {
        if (this.slideTypeModal) {
            this.slideTypeModal.classList.remove('active');
            this.overlay.classList.remove('active');
        }
    }

    addSlideOfType(type) {
        if (editor) {
            editor.addSlide(type);
            this.hideSlideTypes();
            this.updateMobileSlideList();
        }
    }

    showActions() {
        if (this.actionsSheet) {
            this.actionsSheet.classList.add('active');
            this.overlay.classList.add('active');
        }
    }

    hideActions() {
        if (this.actionsSheet) {
            this.actionsSheet.classList.remove('active');
            this.overlay.classList.remove('active');
        }
    }

    duplicateSlide() {
        if (editor) {
            duplicateCurrentSlide();
            this.hideActions();
            this.updateMobileSlideList();
        }
    }

    deleteSlide() {
        if (editor && editor.slides.length > 1) {
            const confirmMsg = i18n ? i18n.t('deleteSlideConfirm') : 'Delete this slide?';
            if (confirm(confirmMsg)) {
                editor.deleteSlide(editor.currentSlideIndex);
                this.hideActions();
                this.updateMobileSlideList();
            }
        } else {
            const msg = i18n ? i18n.t('cannotDeleteLastSlide') : 'Cannot delete the last slide';
            if (typeof showToast === 'function') {
                showToast(msg, 'warning');
            } else {
                alert(msg);
            }
        }
    }

    changeSlideType() {
        this.hideActions();
        this.showSlideTypes();
    }

    moveSlideUp() {
        if (editor && editor.currentSlideIndex > 0) {
            editor.moveSlide(editor.currentSlideIndex, editor.currentSlideIndex - 1);
            this.hideActions();
            this.updateMobileSlideList();
        }
    }

    moveSlideDown() {
        if (editor && editor.currentSlideIndex < editor.slides.length - 1) {
            editor.moveSlide(editor.currentSlideIndex, editor.currentSlideIndex + 1);
            this.hideActions();
            this.updateMobileSlideList();
        }
    }

    showExportMenu() {
        // Create a temporary export actions sheet
        const exportSheet = document.createElement('div');
        exportSheet.className = 'mobile-actions-sheet active';
        exportSheet.id = 'mobile-export-sheet';
        exportSheet.style.zIndex = '2002';

        exportSheet.innerHTML = `
            <button class="mobile-action-btn" onclick="savePresentation(); document.getElementById('mobile-export-sheet').remove();">
                <i class="fas fa-save"></i>
                <span>${i18n ? i18n.t('save') : 'Save (JSON)'}</span>
            </button>
            <button class="mobile-action-btn" onclick="exportToPPTX(); document.getElementById('mobile-export-sheet').remove();">
                <i class="fas fa-file-powerpoint"></i>
                <span>${i18n ? i18n.t('exportPPTX') : 'Export PowerPoint'}</span>
            </button>
            <button class="mobile-action-btn" onclick="exportToHTML(); document.getElementById('mobile-export-sheet').remove();">
                <i class="fas fa-file-code"></i>
                <span>${i18n ? i18n.t('exportHTML') : 'Export HTML'}</span>
            </button>
            <button class="mobile-action-btn" onclick="loadPresentation(); document.getElementById('mobile-export-sheet').remove();">
                <i class="fas fa-folder-open"></i>
                <span>${i18n ? i18n.t('importJSON') : 'Import JSON'}</span>
            </button>
            <button class="mobile-action-btn" onclick="document.getElementById('mobile-export-sheet').remove();">
                <i class="fas fa-times"></i>
                <span>${i18n ? i18n.t('cancel') : 'Cancel'}</span>
            </button>
        `;

        document.body.appendChild(exportSheet);
        this.overlay.classList.add('active');

        // Close on overlay click
        const closeExport = () => {
            const sheet = document.getElementById('mobile-export-sheet');
            if (sheet) sheet.remove();
            this.overlay.classList.remove('active');
        };

        this.overlay.onclick = closeExport;
    }

    setLanguage(lang) {
        if (i18n) {
            i18n.setLanguage(lang);

            // Update language buttons
            const langBtns = document.querySelectorAll('.mobile-lang-btn');
            langBtns.forEach(btn => {
                btn.classList.remove('active');
                if ((lang === 'en' && btn.textContent.includes('English')) ||
                    (lang === 'he' && btn.textContent.includes('עברית'))) {
                    btn.classList.add('active');
                }
            });

            this.updateMobileSlideList();
        }
    }
}

// Create global instance
const mobileManager = new MobileManager();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    mobileManager.init();
});

// Make globally available
window.mobileManager = mobileManager;
