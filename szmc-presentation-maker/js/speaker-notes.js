// SZMC Geriatrics Presentation Maker - Speaker Notes System

class SpeakerNotesManager {
    constructor() {
        this.notes = {};
        this.isCollapsed = false;
        this.storageKey = 'szmc_speaker_notes';
        this.loadFromStorage();
    }

    /**
     * Get notes for a specific slide
     * @param {string} slideId - The slide identifier
     * @returns {string} The notes content
     */
    getNote(slideId) {
        return this.notes[slideId] || '';
    }

    /**
     * Set notes for a specific slide
     * @param {string} slideId - The slide identifier
     * @param {string} content - The notes content
     */
    setNote(slideId, content) {
        this.notes[slideId] = content;
        this.saveToStorage();
        this.triggerUpdate(slideId);
    }

    /**
     * Clear notes for a specific slide
     * @param {string} slideId - The slide identifier
     */
    clearNote(slideId) {
        delete this.notes[slideId];
        this.saveToStorage();
        this.triggerUpdate(slideId);
    }

    /**
     * Get all notes
     * @returns {Object} All notes
     */
    getAllNotes() {
        return { ...this.notes };
    }

    /**
     * Set all notes (used when loading a presentation)
     * @param {Object} notesData - Notes data object
     */
    setAllNotes(notesData) {
        this.notes = notesData || {};
        this.saveToStorage();
    }

    /**
     * Save notes to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
        } catch (e) {
            console.warn('Failed to save speaker notes to storage:', e);
        }
    }

    /**
     * Load notes from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.notes = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load speaker notes from storage:', e);
            this.notes = {};
        }
    }

    /**
     * Trigger an update event
     * @param {string} slideId - The slide identifier
     */
    triggerUpdate(slideId) {
        window.dispatchEvent(new CustomEvent('speakerNotesUpdated', {
            detail: { slideId, content: this.notes[slideId] || '' }
        }));
    }

    /**
     * Toggle the notes panel collapsed state
     */
    toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed;
        this.updateCollapsedState();
    }

    /**
     * Update the visual collapsed state
     */
    updateCollapsedState() {
        const panel = document.getElementById('speaker-notes-panel');
        if (panel) {
            panel.classList.toggle('collapsed', this.isCollapsed);
        }
    }

    /**
     * Render the speaker notes panel in the editor
     * @param {string} slideId - Current slide ID
     */
    renderEditorPanel(slideId) {
        const existingPanel = document.getElementById('speaker-notes-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'speaker-notes-panel';
        panel.className = `speaker-notes-panel ${this.isCollapsed ? 'collapsed' : ''}`;
        
        const currentNote = this.getNote(slideId);
        
        panel.innerHTML = `
            <div class="speaker-notes-header">
                <button class="speaker-notes-toggle" onclick="speakerNotes.toggleCollapsed()" title="Toggle Notes Panel">
                    <i class="fas fa-sticky-note"></i>
                    <span>Speaker Notes</span>
                    <i class="fas fa-chevron-${this.isCollapsed ? 'up' : 'down'} toggle-icon"></i>
                </button>
                <div class="speaker-notes-actions">
                    <button class="btn-icon btn-notes-print" onclick="speakerNotes.printNotes()" title="Print Notes">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn-icon btn-notes-clear" onclick="speakerNotes.clearCurrentNote()" title="Clear Notes">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="speaker-notes-content">
                <textarea 
                    id="speaker-notes-textarea"
                    class="speaker-notes-textarea"
                    placeholder="Add speaker notes for this slide... (Only visible in Speaker View during presentation)"
                    data-slide-id="${slideId}"
                >${currentNote}</textarea>
                <div class="speaker-notes-info">
                    <i class="fas fa-info-circle"></i>
                    <span>Notes are displayed in Speaker View during presentation</span>
                </div>
            </div>
        `;

        // Insert after slide editor
        const slideEditor = document.querySelector('.slide-editor');
        if (slideEditor) {
            slideEditor.parentNode.insertBefore(panel, slideEditor.nextSibling);
        }

        // Add event listener for textarea
        const textarea = document.getElementById('speaker-notes-textarea');
        if (textarea) {
            let saveTimeout;
            textarea.addEventListener('input', (e) => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    const sid = e.target.getAttribute('data-slide-id');
                    this.setNote(sid, e.target.value);
                    this.showSaveIndicator();
                }, 500);
            });
        }
    }

    /**
     * Update the textarea content when slide changes
     * @param {string} slideId - New slide ID
     */
    updateForSlide(slideId) {
        const textarea = document.getElementById('speaker-notes-textarea');
        if (textarea) {
            textarea.setAttribute('data-slide-id', slideId);
            textarea.value = this.getNote(slideId);
        }
    }

    /**
     * Clear notes for the current slide
     */
    clearCurrentNote() {
        const textarea = document.getElementById('speaker-notes-textarea');
        if (textarea) {
            const slideId = textarea.getAttribute('data-slide-id');
            if (confirm('Clear notes for this slide?')) {
                this.clearNote(slideId);
                textarea.value = '';
            }
        }
    }

    /**
     * Show a brief save indicator
     */
    showSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'notes-save-indicator';
        indicator.innerHTML = '<i class="fas fa-check"></i> Notes saved';
        
        const panel = document.getElementById('speaker-notes-panel');
        if (panel) {
            panel.appendChild(indicator);
            setTimeout(() => indicator.remove(), 2000);
        }
    }

    /**
     * Print all notes
     */
    printNotes() {
        if (!window.editor || !window.editor.slides) {
            alert('No presentation loaded');
            return;
        }

        const slides = window.editor.slides;
        let printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Speaker Notes - ${document.getElementById('presentation-title')?.value || 'Presentation'}</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        padding: 40px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    h1 { 
                        color: #1e3a5f; 
                        border-bottom: 2px solid #1e3a5f;
                        padding-bottom: 10px;
                    }
                    .slide-notes {
                        margin: 30px 0;
                        padding: 20px;
                        background: #f8fafc;
                        border-left: 4px solid #3498db;
                        page-break-inside: avoid;
                    }
                    .slide-number {
                        font-weight: 700;
                        color: #1e3a5f;
                        margin-bottom: 10px;
                    }
                    .slide-type {
                        font-size: 0.9em;
                        color: #64748b;
                        margin-bottom: 15px;
                    }
                    .notes-content {
                        white-space: pre-wrap;
                        line-height: 1.6;
                    }
                    .no-notes {
                        color: #94a3b8;
                        font-style: italic;
                    }
                    @media print {
                        body { padding: 20px; }
                        .slide-notes { break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <h1>Speaker Notes</h1>
                <p style="color: #64748b;">Presentation: ${document.getElementById('presentation-title')?.value || 'Untitled'}</p>
        `;

        slides.forEach((slide, index) => {
            const template = window.SlideTemplates ? window.SlideTemplates[slide.type] : null;
            const typeName = template ? template.name : slide.type;
            const notes = this.getNote(slide.id);

            printContent += `
                <div class="slide-notes">
                    <div class="slide-number">Slide ${index + 1}</div>
                    <div class="slide-type">${typeName}</div>
                    <div class="notes-content ${notes ? '' : 'no-notes'}">
                        ${notes || 'No notes for this slide'}
                    </div>
                </div>
            `;
        });

        printContent += '</body></html>';

        // Open print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * Export notes with presentation data
     * @returns {Object} Notes data for export
     */
    exportWithPresentation() {
        return {
            speakerNotes: this.getAllNotes()
        };
    }

    /**
     * Import notes from presentation data
     * @param {Object} data - Presentation data with notes
     */
    importFromPresentation(data) {
        if (data && data.speakerNotes) {
            this.setAllNotes(data.speakerNotes);
        }
    }
}

// Create global instance
const speakerNotes = new SpeakerNotesManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add speaker notes panel when editor loads
    if (document.getElementById('editor-page')) {
        // Listen for slide selection changes
        window.addEventListener('slideSelected', (e) => {
            if (e.detail && e.detail.slideId) {
                speakerNotes.updateForSlide(e.detail.slideId);
            }
        });
    }
});

// Hook into presentation mode for speaker view
if (typeof window !== 'undefined') {
    window.speakerNotes = speakerNotes;
}
