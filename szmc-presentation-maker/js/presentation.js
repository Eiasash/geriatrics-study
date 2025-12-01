// SZMC Geriatrics Presentation Maker - Enhanced Presentation Mode

class PresentationMode {
    constructor() {
        this.isActive = false;
        this.currentIndex = 0;
        this.slides = [];
        this.mode = 'standard'; // standard, speaker, overview, rehearsal
        this.timer = null;
        this.elapsedTime = 0;
        this.speakerNotes = {};
        this.transitionEffect = 'fade'; // fade, slide, zoom, none
    }

    start(slides, mode = 'standard') {
        console.log('Starting presentation with', slides.length, 'slides');
        this.slides = slides;
        this.currentIndex = editor.currentSlideIndex || 0;
        this.isActive = true;
        this.mode = mode;

        // Hide editor, show presentation
        const editorPage = document.getElementById('editor-page');
        const presentationMode = document.getElementById('presentation-mode');
        
        if (editorPage) editorPage.classList.remove('active');
        if (presentationMode) {
            presentationMode.classList.add('active');
            // Force display on mobile
            presentationMode.style.display = 'flex';
            console.log('Presentation mode activated');
        }

        // Setup based on mode
        this.setupPresentationMode();

        // Enter fullscreen for standard/rehearsal modes (skip on mobile)
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && (mode === 'standard' || mode === 'rehearsal')) {
            this.enterFullscreen();
        }

        this.renderSlide();
        this.updateCounter();
        this.bindEvents();

        // Start timer for rehearsal mode
        if (mode === 'rehearsal') {
            this.startTimer();
        }
    }

    setupPresentationMode() {
        const container = document.getElementById('presentation-mode');
        container.setAttribute('data-mode', this.mode);
        container.setAttribute('data-transition', this.transitionEffect);

        // Add mode-specific UI elements
        this.addModeUI();
    }

    addModeUI() {
        const controls = document.querySelector('.presentation-controls');

        // Remove existing mode UI
        const existingModeUI = document.querySelector('.mode-ui');
        if (existingModeUI) existingModeUI.remove();

        let modeUI = document.createElement('div');
        modeUI.className = 'mode-ui';

        switch (this.mode) {
            case 'speaker':
                modeUI.innerHTML = `
                    <div class="speaker-view">
                        <div class="speaker-notes-panel">
                            <h4><i class="fas fa-sticky-note"></i> Speaker Notes</h4>
                            <div id="speaker-notes-content" class="speaker-notes-content">
                                Click to add notes for this slide...
                            </div>
                        </div>
                        <div class="speaker-preview">
                            <div class="preview-label">Next Slide</div>
                            <div id="next-slide-preview" class="next-preview"></div>
                        </div>
                        <div class="speaker-timer">
                            <span id="speaker-time">00:00</span>
                        </div>
                    </div>
                `;
                break;

            case 'overview':
                modeUI.innerHTML = `
                    <div class="overview-grid" id="overview-grid">
                        <!-- Grid populated by renderOverview -->
                    </div>
                `;
                break;

            case 'rehearsal':
                modeUI.innerHTML = `
                    <div class="rehearsal-panel">
                        <div class="timer-display">
                            <i class="fas fa-clock"></i>
                            <span id="rehearsal-timer">00:00</span>
                        </div>
                        <div class="slide-timing">
                            <span>Slide time: </span>
                            <span id="slide-timer">00:00</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="presentation-progress"></div>
                        </div>
                    </div>
                `;
                break;
        }

        // Add mode UI before controls
        controls.parentNode.insertBefore(modeUI, controls);

        // Mode-specific setup
        if (this.mode === 'overview') {
            this.renderOverview();
        } else if (this.mode === 'speaker') {
            this.startTimer();
            this.updateNextPreview();
        }
    }

    enterFullscreen() {
        const container = document.getElementById('presentation-mode');
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    }

    exit() {
        this.isActive = false;
        this.stopTimer();

        // Exit fullscreen
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        // Clean up mode UI
        const modeUI = document.querySelector('.mode-ui');
        if (modeUI) modeUI.remove();

        // Return to editor
        document.getElementById('presentation-mode').classList.remove('active');
        document.getElementById('editor-page').classList.add('active');

        this.unbindEvents();
    }

    next() {
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
            this.renderSlide();
            this.updateCounter();
            if (this.mode === 'speaker') this.updateNextPreview();
            if (this.mode === 'rehearsal') this.resetSlideTimer();
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderSlide();
            this.updateCounter();
            if (this.mode === 'speaker') this.updateNextPreview();
            if (this.mode === 'rehearsal') this.resetSlideTimer();
        }
    }

    goTo(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentIndex = index;
            this.renderSlide();
            this.updateCounter();
            if (this.mode === 'overview') {
                this.mode = 'standard';
                this.setupPresentationMode();
                this.enterFullscreen();
            }
            if (this.mode === 'speaker') this.updateNextPreview();
        }
    }

    renderSlide() {
        const slide = this.slides[this.currentIndex];
        if (!slide) {
            console.error('Presentation: No slide at index', this.currentIndex);
            return;
        }

        const template = SlideTemplates[slide.type];
        if (!template) {
            console.error('Presentation: No template for type', slide.type);
            return;
        }

        const container = document.getElementById('presentation-container');
        if (!container) {
            console.error('Presentation: Container not found');
            return;
        }

        console.log('Rendering slide:', slide.type, 'at index', this.currentIndex);

        // Render immediately on mobile
        const isMobile = window.innerWidth <= 768;
        
        try {
            const slideHtml = template.render(slide.data);
            console.log('Slide HTML generated, length:', slideHtml.length);
            
            // Create slide canvas with forced inline styles for mobile
            const canvasStyles = isMobile ? 
                'width: calc(100vw - 16px); max-width: none; aspect-ratio: 16/9; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);' :
                '';
            
            container.innerHTML = `
                <div class="slide-canvas presentation-slide" style="${canvasStyles}">
                    ${slideHtml}
                </div>
            `;

            // Make content non-editable
            container.querySelectorAll('[contenteditable]').forEach(el => {
                el.removeAttribute('contenteditable');
            });
            
            console.log('Slide rendered successfully');
        } catch (e) {
            console.error('Presentation render error:', e);
            container.innerHTML = `
                <div class="slide-canvas presentation-slide" style="width: 90vw; aspect-ratio: 16/9; background: #1e3a5f; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <p style="color: white; font-size: 1rem; padding: 20px; text-align: center;">Error rendering slide: ${e.message}</p>
                </div>
            `;
        }

        // Update progress
        this.updateProgress();
    }

    renderOverview() {
        const grid = document.getElementById('overview-grid');
        if (!grid) return;

        grid.innerHTML = this.slides.map((slide, index) => {
            const template = SlideTemplates[slide.type];
            const typeName = template ? template.name : slide.type;
            const isActive = index === this.currentIndex;

            return `
                <div class="overview-slide ${isActive ? 'active' : ''}"
                     onclick="presentation.goTo(${index})"
                     data-index="${index}">
                    <div class="overview-number">${index + 1}</div>
                    <div class="overview-type">${typeName}</div>
                    <div class="overview-mini">
                        <div class="mini-preview">${template ? this.getMiniPreview(slide) : ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getMiniPreview(slide) {
        // Return a simplified preview of the slide
        const data = slide.data || {};
        let preview = '';

        if (data.title) preview = data.title;
        else if (data.chiefComplaint) preview = data.chiefComplaint;
        else if (data.diagnosis) preview = data.diagnosis;
        else preview = SlideTemplates[slide.type]?.name || slide.type;

        return `<span class="preview-text">${preview.substring(0, 50)}...</span>`;
    }

    updateNextPreview() {
        const preview = document.getElementById('next-slide-preview');
        if (!preview) return;

        if (this.currentIndex < this.slides.length - 1) {
            const nextSlide = this.slides[this.currentIndex + 1];
            const template = SlideTemplates[nextSlide.type];
            if (template) {
                preview.innerHTML = `
                    <div class="mini-slide">
                        ${template.render(nextSlide.data)}
                    </div>
                `;
                preview.querySelectorAll('[contenteditable]').forEach(el => {
                    el.removeAttribute('contenteditable');
                });
            }
        } else {
            preview.innerHTML = '<div class="end-preview">End of Presentation</div>';
        }
    }

    updateCounter() {
        const counter = document.getElementById('slide-counter');
        if (counter) {
            counter.textContent = `${this.currentIndex + 1} / ${this.slides.length}`;
        }
    }

    updateProgress() {
        const progressBar = document.getElementById('presentation-progress');
        if (progressBar) {
            const progress = ((this.currentIndex + 1) / this.slides.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    // Timer functions
    startTimer() {
        this.elapsedTime = 0;
        this.slideTime = 0;
        this.timer = setInterval(() => {
            this.elapsedTime++;
            this.slideTime++;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resetSlideTimer() {
        this.slideTime = 0;
    }

    updateTimerDisplay() {
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        // Update various timer displays based on mode
        const speakerTime = document.getElementById('speaker-time');
        if (speakerTime) speakerTime.textContent = formatTime(this.elapsedTime);

        const rehearsalTimer = document.getElementById('rehearsal-timer');
        if (rehearsalTimer) rehearsalTimer.textContent = formatTime(this.elapsedTime);

        const slideTimer = document.getElementById('slide-timer');
        if (slideTimer) slideTimer.textContent = formatTime(this.slideTime);
    }

    // Set transition effect
    setTransition(effect) {
        this.transitionEffect = effect;
        const container = document.getElementById('presentation-mode');
        container.setAttribute('data-transition', effect);
    }

    handleKeydown = (e) => {
        if (!this.isActive) return;

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                this.next();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.prev();
                break;
            case 'Escape':
                this.exit();
                break;
            case 'Home':
                e.preventDefault();
                this.goTo(0);
                break;
            case 'End':
                e.preventDefault();
                this.goTo(this.slides.length - 1);
                break;
            case 'o':
            case 'O':
                // Toggle overview mode
                if (this.mode !== 'overview') {
                    this.mode = 'overview';
                    this.setupPresentationMode();
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                }
                break;
            case 'b':
            case 'B':
            case '.':
                // Blank screen (black)
                this.toggleBlankScreen('black');
                break;
            case 'w':
            case 'W':
                // Blank screen (white)
                this.toggleBlankScreen('white');
                break;
        }
    }

    toggleBlankScreen(color) {
        const container = document.getElementById('presentation-container');
        if (container.classList.contains('blanked')) {
            container.classList.remove('blanked', 'blank-black', 'blank-white');
        } else {
            container.classList.add('blanked', `blank-${color}`);
        }
    }

    handleClick = (e) => {
        if (!this.isActive || this.mode === 'overview') return;

        const container = document.getElementById('presentation-container');

        // If blanked, unblank
        if (container.classList.contains('blanked')) {
            container.classList.remove('blanked', 'blank-black', 'blank-white');
            return;
        }

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;

        if (x < rect.width / 3) {
            this.prev();
        } else if (x > rect.width * 2 / 3) {
            this.next();
        }
    }

    bindEvents() {
        document.addEventListener('keydown', this.handleKeydown);
        document.getElementById('presentation-container').addEventListener('click', this.handleClick);
    }

    unbindEvents() {
        document.removeEventListener('keydown', this.handleKeydown);
        const container = document.getElementById('presentation-container');
        if (container) {
            container.removeEventListener('click', this.handleClick);
        }
    }
}

// Create global presentation instance
const presentation = new PresentationMode();

// Global functions for UI
function startPresentation(mode = 'standard') {
    editor.saveCurrentSlideData();
    presentation.start(editor.slides, mode);
}

function startSpeakerView() {
    startPresentation('speaker');
}

function startOverview() {
    startPresentation('overview');
}

function startRehearsal() {
    startPresentation('rehearsal');
}

function exitPresentation() {
    presentation.exit();
}

function nextSlide() {
    if (presentation.isActive) {
        presentation.next();
    } else {
        editor.nextSlide();
    }
}

function prevSlide() {
    if (presentation.isActive) {
        presentation.prev();
    } else {
        editor.prevSlide();
    }
}

function setTransitionEffect(effect) {
    presentation.setTransition(effect);
}

// Handle fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && presentation.isActive && presentation.mode !== 'overview') {
        // Don't exit if switching to overview
        if (presentation.mode === 'standard' || presentation.mode === 'rehearsal') {
            // User pressed ESC or exited fullscreen
        }
    }
});

// Show presentation mode selector
function showPresentationOptions() {
    const modal = document.getElementById('presentation-options-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hidePresentationOptions() {
    const modal = document.getElementById('presentation-options-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}
