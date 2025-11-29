// SZMC Geriatrics Presentation Maker - Animations System

class AnimationManager {
    constructor() {
        this.transitions = {
            fade: {
                name: 'Fade',
                duration: 400,
                enter: 'animation-fade-in',
                exit: 'animation-fade-out'
            },
            slide: {
                name: 'Slide',
                duration: 400,
                enter: 'animation-slide-in',
                exit: 'animation-slide-out'
            },
            slideLeft: {
                name: 'Slide Left',
                duration: 400,
                enter: 'animation-slide-left-in',
                exit: 'animation-slide-left-out'
            },
            slideRight: {
                name: 'Slide Right',
                duration: 400,
                enter: 'animation-slide-right-in',
                exit: 'animation-slide-right-out'
            },
            zoom: {
                name: 'Zoom',
                duration: 400,
                enter: 'animation-zoom-in',
                exit: 'animation-zoom-out'
            },
            flip: {
                name: 'Flip',
                duration: 600,
                enter: 'animation-flip-in',
                exit: 'animation-flip-out'
            },
            dissolve: {
                name: 'Dissolve',
                duration: 500,
                enter: 'animation-dissolve-in',
                exit: 'animation-dissolve-out'
            },
            none: {
                name: 'None (Instant)',
                duration: 0,
                enter: '',
                exit: ''
            }
        };

        this.elementAnimations = {
            appear: {
                name: 'Appear',
                class: 'element-appear',
                duration: 300
            },
            fadeIn: {
                name: 'Fade In',
                class: 'element-fade-in',
                duration: 400
            },
            flyInLeft: {
                name: 'Fly In (Left)',
                class: 'element-fly-in-left',
                duration: 500
            },
            flyInRight: {
                name: 'Fly In (Right)',
                class: 'element-fly-in-right',
                duration: 500
            },
            flyInTop: {
                name: 'Fly In (Top)',
                class: 'element-fly-in-top',
                duration: 500
            },
            flyInBottom: {
                name: 'Fly In (Bottom)',
                class: 'element-fly-in-bottom',
                duration: 500
            },
            zoomIn: {
                name: 'Zoom In',
                class: 'element-zoom-in',
                duration: 400
            },
            bounce: {
                name: 'Bounce',
                class: 'element-bounce',
                duration: 600
            },
            typewriter: {
                name: 'Typewriter',
                class: 'element-typewriter',
                duration: 1000
            }
        };

        this.currentTransition = 'fade';
        this.slideTransitionSettings = {};
    }

    /**
     * Get available transitions
     * @returns {Object} Transitions object
     */
    getTransitions() {
        return this.transitions;
    }

    /**
     * Get available element animations
     * @returns {Object} Element animations object
     */
    getElementAnimations() {
        return this.elementAnimations;
    }

    /**
     * Set the default transition for all slides
     * @param {string} transitionName - Name of the transition
     */
    setDefaultTransition(transitionName) {
        if (this.transitions[transitionName]) {
            this.currentTransition = transitionName;
        }
    }

    /**
     * Set transition for a specific slide
     * @param {string} slideId - Slide identifier
     * @param {string} transitionName - Name of the transition
     */
    setSlideTransition(slideId, transitionName) {
        if (this.transitions[transitionName]) {
            this.slideTransitionSettings[slideId] = transitionName;
        }
    }

    /**
     * Get transition for a specific slide
     * @param {string} slideId - Slide identifier
     * @returns {Object} Transition configuration
     */
    getSlideTransition(slideId) {
        const transitionName = this.slideTransitionSettings[slideId] || this.currentTransition;
        return this.transitions[transitionName];
    }

    /**
     * Apply enter transition to an element
     * @param {HTMLElement} element - Target element
     * @param {string} transitionName - Transition name (optional)
     * @returns {Promise} Resolves when animation completes
     */
    applyEnterTransition(element, transitionName = null) {
        const transition = transitionName ? 
            this.transitions[transitionName] : 
            this.transitions[this.currentTransition];

        if (!transition || transition.duration === 0) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            element.classList.add(transition.enter);
            
            setTimeout(() => {
                element.classList.remove(transition.enter);
                resolve();
            }, transition.duration);
        });
    }

    /**
     * Apply exit transition to an element
     * @param {HTMLElement} element - Target element
     * @param {string} transitionName - Transition name (optional)
     * @returns {Promise} Resolves when animation completes
     */
    applyExitTransition(element, transitionName = null) {
        const transition = transitionName ? 
            this.transitions[transitionName] : 
            this.transitions[this.currentTransition];

        if (!transition || transition.duration === 0) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            element.classList.add(transition.exit);
            
            setTimeout(() => {
                element.classList.remove(transition.exit);
                resolve();
            }, transition.duration);
        });
    }

    /**
     * Apply element animation
     * @param {HTMLElement} element - Target element
     * @param {string} animationName - Animation name
     * @returns {Promise} Resolves when animation completes
     */
    applyElementAnimation(element, animationName) {
        const animation = this.elementAnimations[animationName];
        
        if (!animation) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            element.classList.add(animation.class);
            
            setTimeout(() => {
                element.classList.remove(animation.class);
                resolve();
            }, animation.duration);
        });
    }

    /**
     * Animate slide transition
     * @param {HTMLElement} currentSlide - Current slide element
     * @param {HTMLElement} nextSlide - Next slide element
     * @param {string} direction - 'forward' or 'backward'
     * @param {string} slideId - Slide identifier for per-slide transitions
     * @returns {Promise} Resolves when animation completes
     */
    async animateSlideTransition(currentSlide, nextSlide, direction = 'forward', slideId = null) {
        const transition = slideId ? 
            this.getSlideTransition(slideId) : 
            this.transitions[this.currentTransition];

        if (!transition || transition.duration === 0) {
            return;
        }

        const enterClass = direction === 'forward' ? transition.enter : transition.enter.replace('in', 'reverse-in');
        const exitClass = direction === 'forward' ? transition.exit : transition.exit.replace('out', 'reverse-out');

        return new Promise(resolve => {
            // Start exit animation
            if (currentSlide) {
                currentSlide.classList.add(exitClass);
            }

            // Start enter animation
            if (nextSlide) {
                nextSlide.classList.add(enterClass);
            }

            setTimeout(() => {
                if (currentSlide) {
                    currentSlide.classList.remove(exitClass);
                }
                if (nextSlide) {
                    nextSlide.classList.remove(enterClass);
                }
                resolve();
            }, transition.duration);
        });
    }

    /**
     * Preview a transition effect
     * @param {HTMLElement} previewContainer - Container for preview
     * @param {string} transitionName - Name of the transition
     */
    previewTransition(previewContainer, transitionName) {
        const transition = this.transitions[transitionName];
        if (!transition || transition.duration === 0) {
            return;
        }

        // Create preview elements
        const slide1 = document.createElement('div');
        slide1.className = 'preview-slide preview-slide-1';
        slide1.innerHTML = '<span>Slide 1</span>';

        const slide2 = document.createElement('div');
        slide2.className = 'preview-slide preview-slide-2';
        slide2.innerHTML = '<span>Slide 2</span>';
        slide2.style.opacity = '0';

        previewContainer.innerHTML = '';
        previewContainer.appendChild(slide1);
        previewContainer.appendChild(slide2);

        // Animate transition
        setTimeout(() => {
            slide1.classList.add(transition.exit);
            slide2.classList.add(transition.enter);
            slide2.style.opacity = '1';
        }, 300);

        // Reset after animation
        setTimeout(() => {
            slide1.classList.remove(transition.exit);
            slide2.classList.remove(transition.enter);
        }, 300 + transition.duration);
    }

    /**
     * Render transition selector UI
     * @param {string} currentValue - Currently selected transition
     * @returns {string} HTML for selector
     */
    renderTransitionSelector(currentValue = 'fade') {
        let html = '<select id="transition-selector" class="transition-selector" onchange="animationManager.onTransitionChange(this.value)">';
        
        Object.entries(this.transitions).forEach(([key, transition]) => {
            const selected = key === currentValue ? 'selected' : '';
            html += `<option value="${key}" ${selected}>${transition.name}</option>`;
        });
        
        html += '</select>';
        return html;
    }

    /**
     * Handle transition change
     * @param {string} transitionName - New transition name
     */
    onTransitionChange(transitionName) {
        this.setDefaultTransition(transitionName);
        
        // Update presentation mode if active
        if (window.presentation && window.presentation.setTransition) {
            window.presentation.setTransition(transitionName);
        }

        if (typeof showToast === 'function') {
            showToast(`Transition: ${this.transitions[transitionName].name}`, 'success');
        }
    }

    /**
     * Render animation selector for elements
     * @param {string} currentValue - Currently selected animation
     * @returns {string} HTML for selector
     */
    renderElementAnimationSelector(currentValue = 'fadeIn') {
        let html = '<select id="element-animation-selector" class="element-animation-selector">';
        html += '<option value="">No Animation</option>';
        
        Object.entries(this.elementAnimations).forEach(([key, animation]) => {
            const selected = key === currentValue ? 'selected' : '';
            html += `<option value="${key}" ${selected}>${animation.name}</option>`;
        });
        
        html += '</select>';
        return html;
    }

    /**
     * Export animation settings
     * @returns {Object} Animation settings
     */
    exportSettings() {
        return {
            defaultTransition: this.currentTransition,
            slideTransitions: { ...this.slideTransitionSettings }
        };
    }

    /**
     * Import animation settings
     * @param {Object} settings - Animation settings to import
     */
    importSettings(settings) {
        if (settings) {
            if (settings.defaultTransition) {
                this.currentTransition = settings.defaultTransition;
            }
            if (settings.slideTransitions) {
                this.slideTransitionSettings = { ...settings.slideTransitions };
            }
        }
    }
}

// Create global instance
const animationManager = new AnimationManager();

// Make globally available
if (typeof window !== 'undefined') {
    window.animationManager = animationManager;
}

// Integrate with presentation mode
document.addEventListener('DOMContentLoaded', () => {
    // Hook into presentation mode transition selector
    const transitionSelect = document.getElementById('transition-select');
    if (transitionSelect) {
        transitionSelect.addEventListener('change', (e) => {
            animationManager.setDefaultTransition(e.target.value);
        });
    }
});
