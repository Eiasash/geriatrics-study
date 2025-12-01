// SZMC Geriatrics Presentation Maker - Editor Module

class PresentationEditor {
    constructor() {
        this.slides = [];
        this.currentSlideIndex = 0;
        this.presentationType = 'case';
        this.isDirty = false;

        // Undo/Redo history
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 50;

        // Clipboard for copy/paste
        this.clipboard = null;
    }

    initialize(type) {
        this.presentationType = type;
        const preset = TemplatePresets[type];

        if (preset) {
            this.slides = preset.slides.map((slideConfig, index) => ({
                id: this.generateId(),
                type: slideConfig.type,
                data: { ...SlideTemplates[slideConfig.type].defaultData, ...slideConfig.data },
                order: index
            }));
        } else {
            // Default to a single title slide
            this.slides = [{
                id: this.generateId(),
                type: 'title',
                data: { ...SlideTemplates['title'].defaultData },
                order: 0
            }];
        }

        this.currentSlideIndex = 0;
        this.renderThumbnails();
        this.renderCurrentSlide();
        this.updateSlideTypeSelector();
    }

    generateId() {
        return 'slide-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    addSlide(type = 'content', afterIndex = this.currentSlideIndex) {
        const template = SlideTemplates[type];
        if (!template) {
            console.error('Unknown slide type:', type);
            return;
        }

        const newSlide = {
            id: this.generateId(),
            type: type,
            data: { ...template.defaultData },
            order: afterIndex + 1
        };

        // Insert after current slide
        this.slides.splice(afterIndex + 1, 0, newSlide);

        // Update order for all slides
        this.slides.forEach((slide, index) => {
            slide.order = index;
        });

        this.currentSlideIndex = afterIndex + 1;
        this.isDirty = true;

        this.renderThumbnails();
        this.renderCurrentSlide();
        this.updateSlideTypeSelector();

        // Trigger AI analysis on change
        if (typeof triggerAIAnalysisOnChange === 'function') {
            triggerAIAnalysisOnChange();
        }
    }

    deleteSlide(index) {
        if (this.slides.length <= 1) {
            alert('Cannot delete the last slide');
            return;
        }

        this.slides.splice(index, 1);

        // Update order
        this.slides.forEach((slide, i) => {
            slide.order = i;
        });

        // Adjust current index if needed
        if (this.currentSlideIndex >= this.slides.length) {
            this.currentSlideIndex = this.slides.length - 1;
        }

        this.isDirty = true;
        this.renderThumbnails();
        this.renderCurrentSlide();
        this.updateSlideTypeSelector();

        // Trigger AI analysis on change
        if (typeof triggerAIAnalysisOnChange === 'function') {
            triggerAIAnalysisOnChange();
        }
    }

    duplicateSlide(index) {
        const originalSlide = this.slides[index];
        const duplicatedSlide = {
            id: this.generateId(),
            type: originalSlide.type,
            data: JSON.parse(JSON.stringify(originalSlide.data)),
            order: index + 1
        };

        this.slides.splice(index + 1, 0, duplicatedSlide);

        // Update order
        this.slides.forEach((slide, i) => {
            slide.order = i;
        });

        this.isDirty = true;
        this.renderThumbnails();

        // Trigger AI analysis on change
        if (typeof triggerAIAnalysisOnChange === 'function') {
            triggerAIAnalysisOnChange();
        }
    }

    insertSlide(index, slideConfig) {
        // Insert a slide at a specific index
        const template = SlideTemplates[slideConfig.type];
        if (!template) {
            console.error('Unknown slide type:', slideConfig.type);
            return;
        }

        const newSlide = {
            id: slideConfig.id || this.generateId(),
            type: slideConfig.type,
            data: slideConfig.data || { ...template.defaultData },
            order: index
        };

        this.slides.splice(index, 0, newSlide);

        // Update order for all slides
        this.slides.forEach((slide, i) => {
            slide.order = i;
        });

        this.isDirty = true;
        this.renderThumbnails();
        this.renderCurrentSlide();

        // Trigger AI analysis on change
        if (typeof triggerAIAnalysisOnChange === 'function') {
            triggerAIAnalysisOnChange();
        }

        return newSlide;
    }

    moveSlide(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= this.slides.length) return;

        const [slide] = this.slides.splice(fromIndex, 1);
        this.slides.splice(toIndex, 0, slide);

        // Update order
        this.slides.forEach((s, i) => {
            s.order = i;
        });

        if (this.currentSlideIndex === fromIndex) {
            this.currentSlideIndex = toIndex;
        }

        this.isDirty = true;
        this.renderThumbnails();

        // Trigger AI analysis on change
        if (typeof triggerAIAnalysisOnChange === 'function') {
            triggerAIAnalysisOnChange();
        }
    }

    // Convenience method for rendering
    render() {
        this.renderThumbnails();
        this.renderCurrentSlide();
    }

    selectSlide(index) {
        this.saveCurrentSlideData();
        this.currentSlideIndex = index;
        this.renderCurrentSlide();
        this.updateSlideTypeSelector();
        this.updateThumbnailSelection();
    }

    openSlideEditor(index) {
        // Select the slide
        this.selectSlide(index);
        
        // Scroll to the slide canvas
        const canvas = document.getElementById('current-slide');
        if (canvas) {
            canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Focus the first editable element after a short delay
            setTimeout(() => {
                const firstEditable = canvas.querySelector('[contenteditable="true"]');
                if (firstEditable) {
                    firstEditable.focus();
                }
            }, 300);
        }

        // Close AI panel on mobile to show the slide
        if (window.innerWidth <= 768) {
            const aiPanel = document.querySelector('.ai-assistant-panel');
            if (aiPanel && aiPanel.classList.contains('active')) {
                if (typeof toggleAIAssistant === 'function') {
                    toggleAIAssistant();
                } else {
                    aiPanel.classList.remove('active');
                }
            }
        }

        // Show a toast notification
        if (typeof showToast === 'function') {
            showToast(`Editing slide ${index + 1}`, 'info');
        }
    }

    changeSlideType(newType) {
        const currentSlide = this.slides[this.currentSlideIndex];
        if (!currentSlide || !SlideTemplates[newType]) return;

        currentSlide.type = newType;
        // Keep compatible data, add new defaults
        currentSlide.data = {
            ...SlideTemplates[newType].defaultData,
            ...currentSlide.data
        };

        this.isDirty = true;
        this.renderCurrentSlide();
        this.renderThumbnails();

        // Trigger AI analysis on change
        if (typeof triggerAIAnalysisOnChange === 'function') {
            triggerAIAnalysisOnChange();
        }
    }

    saveCurrentSlideData() {
        const currentSlide = this.slides[this.currentSlideIndex];
        if (!currentSlide) return;

        const canvas = document.getElementById('current-slide');
        const editableElements = canvas.querySelectorAll('[data-field]');

        editableElements.forEach(el => {
            const field = el.getAttribute('data-field');
            currentSlide.data[field] = el.innerHTML;
        });

        this.isDirty = true;
    }

    renderCurrentSlide() {
        const currentSlide = this.slides[this.currentSlideIndex];
        if (!currentSlide) return;

        const template = SlideTemplates[currentSlide.type];
        if (!template) return;

        const canvas = document.getElementById('current-slide');
        if (!canvas) return;

        canvas.innerHTML = template.render(currentSlide.data);

        // Use event delegation to avoid memory leaks from accumulated listeners
        // Remove old delegated handler if exists
        if (this._canvasInputHandler) {
            canvas.removeEventListener('input', this._canvasInputHandler);
        }
        if (this._canvasBlurHandler) {
            canvas.removeEventListener('focusout', this._canvasBlurHandler);
        }

        // Create new delegated handlers
        this._canvasInputHandler = (e) => {
            if (e.target.hasAttribute('contenteditable')) {
                this.isDirty = true;
                this.updateThumbnailContent(this.currentSlideIndex);
            }
        };

        this._canvasBlurHandler = (e) => {
            if (e.target.hasAttribute('contenteditable')) {
                this.saveCurrentSlideData();
                if (typeof triggerAIAnalysisOnChange === 'function') {
                    triggerAIAnalysisOnChange();
                }
            }
        };

        canvas.addEventListener('input', this._canvasInputHandler);
        canvas.addEventListener('focusout', this._canvasBlurHandler);

        // Add spellcheck="false" to all contenteditable elements for medical terms
        const editableElements = canvas.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(el => {
            el.setAttribute('spellcheck', 'false');
        });
    }

    renderThumbnails() {
        const container = document.getElementById('slide-thumbnails');
        if (!container) return;

        container.innerHTML = '';

        this.slides.forEach((slide, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `slide-thumbnail ${index === this.currentSlideIndex ? 'active' : ''}`;
            thumbnail.setAttribute('data-index', index);
            thumbnail.setAttribute('role', 'button');
            thumbnail.setAttribute('tabindex', '0');

            const template = SlideTemplates[slide.type];
            const typeName = template ? template.name : slide.type;

            // Get preview text from slide data
            const previewText = this.getSlidePreviewText(slide);

            thumbnail.setAttribute('aria-label', `Slide ${index + 1}: ${typeName}${previewText ? ' - ' + previewText : ''}`);

            thumbnail.innerHTML = `
                <div class="slide-thumbnail-number">${index + 1}</div>
                <div class="slide-thumbnail-content">${typeName}</div>
                <div class="slide-thumbnail-preview">${previewText || ''}</div>
                <div class="slide-thumbnail-delete" onclick="event.stopPropagation(); editor.deleteSlide(${index})" role="button" aria-label="Delete slide ${index + 1}" tabindex="0">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </div>
                <div class="drag-handle" title="Drag to reorder" aria-hidden="true"></div>
            `;

            thumbnail.addEventListener('click', () => this.selectSlide(index));
            thumbnail.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectSlide(index);
                }
            });

            // Drag and drop
            thumbnail.setAttribute('draggable', 'true');
            thumbnail.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                thumbnail.classList.add('dragging');
            });
            thumbnail.addEventListener('dragend', () => {
                thumbnail.classList.remove('dragging');
            });
            thumbnail.addEventListener('dragover', (e) => {
                e.preventDefault();
                thumbnail.classList.add('drag-over');
            });
            thumbnail.addEventListener('dragleave', () => {
                thumbnail.classList.remove('drag-over');
            });
            thumbnail.addEventListener('drop', (e) => {
                e.preventDefault();
                thumbnail.classList.remove('drag-over');
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                this.moveSlide(fromIndex, index);
            });

            container.appendChild(thumbnail);
        });
    }

    // Get preview text from slide data for thumbnail
    getSlidePreviewText(slide) {
        if (!slide || !slide.data) return '';
        const data = slide.data;

        // Try common text fields
        const textFields = ['title', 'chiefComplaint', 'content', 'question', 'assessment'];
        for (const field of textFields) {
            if (data[field] && typeof data[field] === 'string') {
                // Strip HTML and truncate
                const text = data[field].replace(/<[^>]*>/g, '').trim();
                if (text.length > 0) {
                    return text.length > 30 ? text.substring(0, 30) + '...' : text;
                }
            }
        }
        return '';
    }

    updateThumbnailSelection() {
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentSlideIndex);
        });
    }

    updateThumbnailContent(index) {
        const thumbnail = document.querySelector(`.slide-thumbnail[data-index="${index}"]`);
        if (!thumbnail || !this.slides[index]) return;

        const slide = this.slides[index];
        const previewText = this.getSlidePreviewText(slide);
        const previewEl = thumbnail.querySelector('.slide-thumbnail-preview');

        if (previewEl) {
            previewEl.textContent = previewText || '';
        }

        // Update aria-label
        const template = SlideTemplates[slide.type];
        const typeName = template ? template.name : slide.type;
        thumbnail.setAttribute('aria-label', `Slide ${index + 1}: ${typeName}${previewText ? ' - ' + previewText : ''}`);
    }

    updateSlideTypeSelector() {
        const selector = document.getElementById('slide-type');
        if (selector && this.slides[this.currentSlideIndex]) {
            selector.value = this.slides[this.currentSlideIndex].type;
        }
    }

    getPresentation() {
        this.saveCurrentSlideData();
        return {
            title: document.getElementById('presentation-title').value,
            type: this.presentationType,
            slides: this.slides,
            createdAt: new Date().toISOString(),
            version: '1.0'
        };
    }

    loadPresentation(data) {
        if (!data || !data.slides) {
            console.error('Invalid presentation data');
            return;
        }

        document.getElementById('presentation-title').value = data.title || 'Untitled Presentation';
        this.presentationType = data.type || 'case';
        this.slides = data.slides;
        this.currentSlideIndex = 0;

        this.renderThumbnails();
        this.renderCurrentSlide();
        this.updateSlideTypeSelector();
    }

    // Initialize from generated slides
    initializeWithSlides(type, generatedSlides, title) {
        this.presentationType = type;

        // Convert generated slide objects to editor format
        this.slides = generatedSlides.map((slideConfig, index) => {
            // Get the template for this slide type
            const template = SlideTemplates[slideConfig.type];
            const defaultData = template ? template.defaultData : {};

            return {
                id: this.generateId(),
                type: slideConfig.type,
                data: { ...defaultData, ...slideConfig.data },
                order: index
            };
        });

        this.currentSlideIndex = 0;
        this.isDirty = true;

        // Update title
        const titleInput = document.getElementById('presentation-title');
        if (titleInput) {
            titleInput.value = title || (type === 'case' ? 'Case Presentation' : 'Journal Club');
        }

        this.renderThumbnails();
        this.renderCurrentSlide();
        this.updateSlideTypeSelector();
    }

    exportToJSON() {
        const data = this.getPresentation();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.title.replace(/[^a-z0-9]/gi, '_')}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    // Navigation
    nextSlide() {
        if (this.currentSlideIndex < this.slides.length - 1) {
            this.selectSlide(this.currentSlideIndex + 1);
        }
    }

    prevSlide() {
        if (this.currentSlideIndex > 0) {
            this.selectSlide(this.currentSlideIndex - 1);
        }
    }

    // Undo/Redo functionality
    saveState() {
        // Remove any states after current index (for redo)
        this.history = this.history.slice(0, this.historyIndex + 1);

        // Save current state
        const state = {
            slides: JSON.parse(JSON.stringify(this.slides)),
            currentSlideIndex: this.currentSlideIndex
        };

        this.history.push(state);
        this.historyIndex++;

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.historyIndex--;
        }

        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const state = this.history[this.historyIndex];
            this.slides = JSON.parse(JSON.stringify(state.slides));
            this.currentSlideIndex = state.currentSlideIndex;
            this.renderThumbnails();
            this.renderCurrentSlide();
            this.updateSlideTypeSelector();
            this.isDirty = true;
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const state = this.history[this.historyIndex];
            this.slides = JSON.parse(JSON.stringify(state.slides));
            this.currentSlideIndex = state.currentSlideIndex;
            this.renderThumbnails();
            this.renderCurrentSlide();
            this.updateSlideTypeSelector();
            this.isDirty = true;
            this.updateUndoRedoButtons();
        }
    }

    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('btn-undo');
        const redoBtn = document.getElementById('btn-redo');

        if (undoBtn) {
            undoBtn.disabled = this.historyIndex <= 0;
        }
        if (redoBtn) {
            redoBtn.disabled = this.historyIndex >= this.history.length - 1;
        }
    }

    // Copy/Paste slides
    copySlide(index = this.currentSlideIndex) {
        this.clipboard = JSON.parse(JSON.stringify(this.slides[index]));
        showToast('Slide copied');
    }

    pasteSlide() {
        if (!this.clipboard) {
            showToast('Nothing to paste', 'warning');
            return;
        }

        const newSlide = {
            ...this.clipboard,
            id: this.generateId(),
            order: this.currentSlideIndex + 1
        };

        this.slides.splice(this.currentSlideIndex + 1, 0, newSlide);
        this.slides.forEach((slide, i) => slide.order = i);

        this.currentSlideIndex++;
        this.isDirty = true;
        this.saveState();

        this.renderThumbnails();
        this.renderCurrentSlide();
        showToast('Slide pasted');
    }

    // Image upload handling
    insertImage(imageData, targetElement = null) {
        if (targetElement) {
            targetElement.innerHTML = `<img src="${imageData}" alt="Uploaded image" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
        }
        this.isDirty = true;
    }

    handleImageUpload(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Please select an image file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // Search functionality
    searchSlides(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        this.slides.forEach((slide, index) => {
            const template = SlideTemplates[slide.type];
            const typeName = template ? template.name.toLowerCase() : '';

            // Search in slide data
            const dataStr = JSON.stringify(slide.data).toLowerCase();

            if (typeName.includes(lowerQuery) || dataStr.includes(lowerQuery)) {
                results.push({
                    index,
                    type: slide.type,
                    typeName: template ? template.name : slide.type
                });
            }
        });

        return results;
    }

    // Get slide statistics
    getStats() {
        return {
            totalSlides: this.slides.length,
            presentationType: this.presentationType,
            slideTypes: this.slides.reduce((acc, slide) => {
                acc[slide.type] = (acc[slide.type] || 0) + 1;
                return acc;
            }, {}),
            estimatedDuration: Math.round(this.slides.length * 1.5) // ~1.5 min per slide
        };
    }
}

// Create global editor instance
const editor = new PresentationEditor();
window.editor = editor; // Expose to window for AI assistant access

// Expose editor to window for AI assistant and other modules
window.editor = editor;

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const isEditing = e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

    // Ctrl+Z for undo (works everywhere)
    if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        editor.undo();
        return;
    }

    // Ctrl+Shift+Z or Ctrl+Y for redo
    if ((e.key === 'z' && e.shiftKey && (e.ctrlKey || e.metaKey)) || (e.key === 'y' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        editor.redo();
        return;
    }

    // Ctrl+C for copy slide (when not editing)
    if (e.key === 'c' && (e.ctrlKey || e.metaKey) && !isEditing) {
        e.preventDefault();
        editor.copySlide();
        return;
    }

    // Ctrl+V for paste slide (when not editing)
    if (e.key === 'v' && (e.ctrlKey || e.metaKey) && !isEditing) {
        e.preventDefault();
        editor.pasteSlide();
        return;
    }

    // Don't trigger other shortcuts when editing text
    if (isEditing) {
        return;
    }

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        editor.nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        editor.prevSlide();
    } else if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        addSlide();
    } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        savePresentation();
    } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        duplicateCurrentSlide();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (confirm('Delete this slide?')) {
            editor.deleteSlide(editor.currentSlideIndex);
        }
    } else if (e.key === '?') {
        showKeyboardShortcuts();
    }
});

// Toast notification - uses window.showToast from main.js

// Duplicate current slide helper
function duplicateCurrentSlide() {
    editor.duplicateSlide(editor.currentSlideIndex);
    editor.currentSlideIndex++;
    editor.renderCurrentSlide();
    editor.updateThumbnailSelection();
    showToast('Slide duplicated');
}

// Show keyboard shortcuts modal
function showKeyboardShortcuts() {
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hideKeyboardShortcuts() {
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Image upload function for UI
function triggerImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const imageData = await editor.handleImageUpload(file);
                // Find current focused element or create new image element
                const activeElement = document.activeElement;
                if (activeElement && activeElement.closest('.slide')) {
                    editor.insertImage(imageData, activeElement);
                } else {
                    // Insert at current slide content area
                    const contentArea = document.querySelector('#current-slide .content-body');
                    if (contentArea) {
                        const imgWrapper = document.createElement('div');
                        imgWrapper.innerHTML = `<img src="${imageData}" alt="Uploaded image" style="max-width: 100%; margin: 10px 0;">`;
                        contentArea.appendChild(imgWrapper);
                    }
                }
                showToast('Image inserted');
            } catch (error) {
                showToast(error.message, 'warning');
            }
        }
    };
    input.click();
}

// Drag and drop for images
document.addEventListener('DOMContentLoaded', () => {
    const slideCanvas = document.getElementById('current-slide');
    if (slideCanvas) {
        slideCanvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            slideCanvas.classList.add('drag-over');
        });

        slideCanvas.addEventListener('dragleave', (e) => {
            e.preventDefault();
            slideCanvas.classList.remove('drag-over');
        });

        slideCanvas.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            slideCanvas.classList.remove('drag-over');

            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                try {
                    const imageData = await editor.handleImageUpload(files[0]);
                    const target = e.target.closest('[contenteditable="true"]') || e.target;
                    if (target) {
                        const img = document.createElement('img');
                        img.src = imageData;
                        img.alt = 'Dropped image';
                        img.style.cssText = 'max-width: 100%; margin: 10px 0;';
                        target.appendChild(img);
                        showToast('Image added');
                    }
                } catch (error) {
                    showToast(error.message, 'warning');
                }
            }
        });
    }
});
