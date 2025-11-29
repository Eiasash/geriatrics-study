// SZMC Geriatrics Presentation Maker - Smart Search & Replace

class SearchManager {
    constructor() {
        this.isOpen = false;
        this.searchQuery = '';
        this.replaceQuery = '';
        this.caseSensitive = false;
        this.wholeWord = false;
        this.currentMatchIndex = -1;
        this.matches = [];
        this.highlightedSlides = new Set();
    }

    /**
     * Open the search panel
     */
    open() {
        if (this.isOpen) {
            document.getElementById('search-input')?.focus();
            return;
        }
        this.isOpen = true;
        this.renderPanel();
    }

    /**
     * Close the search panel
     */
    close() {
        this.isOpen = false;
        this.clearHighlights();
        const panel = document.getElementById('search-panel');
        if (panel) {
            panel.remove();
        }
    }

    /**
     * Toggle the search panel
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Render the search panel
     */
    renderPanel() {
        const existingPanel = document.getElementById('search-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'search-panel';
        panel.className = 'search-panel';
        
        panel.innerHTML = `
            <div class="search-panel-header">
                <div class="search-panel-title">
                    <i class="fas fa-search"></i>
                    <span>Search & Replace</span>
                </div>
                <button class="btn-icon search-close" onclick="searchManager.close()" title="Close (Esc)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-panel-body">
                <div class="search-row">
                    <div class="search-input-wrapper">
                        <i class="fas fa-search"></i>
                        <input type="text" 
                            id="search-input" 
                            placeholder="Find in presentation..." 
                            value="${this.escapeHtml(this.searchQuery)}"
                            oninput="searchManager.onSearchInput(this.value)"
                            onkeydown="searchManager.handleKeydown(event)">
                        <span class="search-count" id="search-count"></span>
                    </div>
                    <div class="search-nav-buttons">
                        <button class="btn-icon" onclick="searchManager.prevMatch()" title="Previous (Shift+Enter)">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        <button class="btn-icon" onclick="searchManager.nextMatch()" title="Next (Enter)">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                </div>
                <div class="search-row replace-row">
                    <div class="search-input-wrapper">
                        <i class="fas fa-exchange-alt"></i>
                        <input type="text" 
                            id="replace-input" 
                            placeholder="Replace with..." 
                            value="${this.escapeHtml(this.replaceQuery)}"
                            oninput="searchManager.onReplaceInput(this.value)"
                            onkeydown="searchManager.handleKeydown(event)">
                    </div>
                    <div class="search-nav-buttons">
                        <button class="btn-secondary btn-sm" onclick="searchManager.replaceCurrent()" title="Replace">
                            Replace
                        </button>
                        <button class="btn-secondary btn-sm" onclick="searchManager.replaceAll()" title="Replace All">
                            All
                        </button>
                    </div>
                </div>
                <div class="search-options">
                    <label class="search-option">
                        <input type="checkbox" id="search-case-sensitive" 
                            ${this.caseSensitive ? 'checked' : ''}
                            onchange="searchManager.toggleCaseSensitive()">
                        <span>Match Case</span>
                    </label>
                    <label class="search-option">
                        <input type="checkbox" id="search-whole-word" 
                            ${this.wholeWord ? 'checked' : ''}
                            onchange="searchManager.toggleWholeWord()">
                        <span>Whole Word</span>
                    </label>
                </div>
                <div class="search-results" id="search-results">
                    <div class="search-results-placeholder">
                        <p>Enter text to search across all slides</p>
                    </div>
                </div>
            </div>
        `;

        // Insert into editor header
        const editorPage = document.getElementById('editor-page');
        if (editorPage) {
            editorPage.appendChild(panel);
        }

        // Focus search input
        setTimeout(() => {
            document.getElementById('search-input')?.focus();
        }, 100);
    }

    /**
     * Handle search input
     * @param {string} value - Search query
     */
    onSearchInput(value) {
        this.searchQuery = value;
        this.performSearch();
    }

    /**
     * Handle replace input
     * @param {string} value - Replace query
     */
    onReplaceInput(value) {
        this.replaceQuery = value;
    }

    /**
     * Toggle case sensitivity
     */
    toggleCaseSensitive() {
        this.caseSensitive = !this.caseSensitive;
        this.performSearch();
    }

    /**
     * Toggle whole word matching
     */
    toggleWholeWord() {
        this.wholeWord = !this.wholeWord;
        this.performSearch();
    }

    /**
     * Handle keyboard events
     * @param {KeyboardEvent} event
     */
    handleKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (event.shiftKey) {
                this.prevMatch();
            } else {
                this.nextMatch();
            }
        } else if (event.key === 'Escape') {
            this.close();
        }
    }

    /**
     * Perform the search across all slides
     */
    performSearch() {
        this.matches = [];
        this.currentMatchIndex = -1;
        this.clearHighlights();

        if (!this.searchQuery || this.searchQuery.length < 1) {
            this.updateResults();
            return;
        }

        if (!window.editor || !window.editor.slides) {
            return;
        }

        const slides = window.editor.slides;
        const query = this.caseSensitive ? this.searchQuery : this.searchQuery.toLowerCase();

        slides.forEach((slide, slideIndex) => {
            const searchText = this.getSlideSearchText(slide);
            const textToSearch = this.caseSensitive ? searchText : searchText.toLowerCase();
            
            let startIndex = 0;
            let index;

            while ((index = this.findInText(textToSearch, query, startIndex)) !== -1) {
                // Get context around the match
                const contextStart = Math.max(0, index - 30);
                const contextEnd = Math.min(searchText.length, index + query.length + 30);
                let context = searchText.substring(contextStart, contextEnd);
                
                if (contextStart > 0) context = '...' + context;
                if (contextEnd < searchText.length) context = context + '...';

                this.matches.push({
                    slideIndex,
                    slideId: slide.id,
                    slideType: slide.type,
                    index,
                    context,
                    query: this.searchQuery
                });

                startIndex = index + 1;
            }
        });

        this.updateResults();
        this.highlightMatchesInThumbnails();

        if (this.matches.length > 0) {
            this.currentMatchIndex = 0;
            this.navigateToCurrentMatch();
        }
    }

    /**
     * Find text considering whole word option
     * @param {string} text - Text to search in
     * @param {string} query - Search query
     * @param {number} startIndex - Start position
     * @returns {number} Index of match or -1
     */
    findInText(text, query, startIndex) {
        const index = text.indexOf(query, startIndex);
        
        if (index === -1 || !this.wholeWord) {
            return index;
        }

        // Check for whole word boundaries
        const beforeChar = index > 0 ? text[index - 1] : ' ';
        const afterChar = index + query.length < text.length ? text[index + query.length] : ' ';
        
        const isWordBoundaryBefore = /\W/.test(beforeChar);
        const isWordBoundaryAfter = /\W/.test(afterChar);

        if (isWordBoundaryBefore && isWordBoundaryAfter) {
            return index;
        }

        // Not a whole word match, continue searching
        return this.findInText(text, query, index + 1);
    }

    /**
     * Get searchable text from a slide
     * @param {Object} slide - Slide object
     * @returns {string} Combined text from slide data
     */
    getSlideSearchText(slide) {
        if (!slide.data) return '';
        
        const texts = [];
        
        Object.values(slide.data).forEach(value => {
            if (typeof value === 'string') {
                // Strip HTML tags for plain text search
                const plainText = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                texts.push(plainText);
            }
        });

        return texts.join(' ');
    }

    /**
     * Update the search results display
     */
    updateResults() {
        const resultsContainer = document.getElementById('search-results');
        const countSpan = document.getElementById('search-count');

        if (!resultsContainer) return;

        if (this.matches.length === 0) {
            const message = this.searchQuery 
                ? 'No matches found' 
                : 'Enter text to search across all slides';
            
            resultsContainer.innerHTML = `
                <div class="search-results-placeholder">
                    <p>${message}</p>
                </div>
            `;
            countSpan.textContent = '';
            return;
        }

        countSpan.textContent = `${this.currentMatchIndex + 1}/${this.matches.length}`;

        // Group matches by slide
        const groupedMatches = {};
        this.matches.forEach((match, idx) => {
            if (!groupedMatches[match.slideIndex]) {
                groupedMatches[match.slideIndex] = [];
            }
            groupedMatches[match.slideIndex].push({ ...match, matchIndex: idx });
        });

        let html = '';
        Object.entries(groupedMatches).forEach(([slideIndex, matches]) => {
            const template = window.SlideTemplates ? window.SlideTemplates[matches[0].slideType] : null;
            const typeName = template ? template.name : matches[0].slideType;
            const isCurrentSlide = parseInt(slideIndex) === this.matches[this.currentMatchIndex]?.slideIndex;

            html += `
                <div class="search-result-group ${isCurrentSlide ? 'current' : ''}">
                    <div class="search-result-slide" onclick="searchManager.goToMatch(${matches[0].matchIndex})">
                        <span class="search-result-slide-num">Slide ${parseInt(slideIndex) + 1}</span>
                        <span class="search-result-slide-type">${typeName}</span>
                        <span class="search-result-count">${matches.length} match${matches.length > 1 ? 'es' : ''}</span>
                    </div>
                    <div class="search-result-matches">
                        ${matches.map(match => `
                            <div class="search-result-match ${match.matchIndex === this.currentMatchIndex ? 'active' : ''}" 
                                 onclick="searchManager.goToMatch(${match.matchIndex})">
                                ${this.highlightMatch(match.context, this.searchQuery)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        resultsContainer.innerHTML = html;
    }

    /**
     * Highlight the search query in context text
     * @param {string} text - Context text
     * @param {string} query - Search query
     * @returns {string} HTML with highlighted matches
     */
    highlightMatch(text, query) {
        const escapedQuery = this.escapeRegex(query);
        const flags = this.caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(`(${escapedQuery})`, flags);
        return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

    /**
     * Highlight matches in slide thumbnails
     */
    highlightMatchesInThumbnails() {
        // Clear existing highlights
        document.querySelectorAll('.slide-thumbnail').forEach(thumb => {
            thumb.classList.remove('has-search-match');
        });

        // Add highlights to matching slides
        const matchingSlideIndices = new Set(this.matches.map(m => m.slideIndex));
        matchingSlideIndices.forEach(index => {
            const thumb = document.querySelector(`.slide-thumbnail[data-index="${index}"]`);
            if (thumb) {
                thumb.classList.add('has-search-match');
            }
        });
    }

    /**
     * Clear all search highlights
     */
    clearHighlights() {
        document.querySelectorAll('.slide-thumbnail.has-search-match').forEach(thumb => {
            thumb.classList.remove('has-search-match');
        });
    }

    /**
     * Navigate to next match
     */
    nextMatch() {
        if (this.matches.length === 0) return;
        
        this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
        this.navigateToCurrentMatch();
        this.updateResults();
    }

    /**
     * Navigate to previous match
     */
    prevMatch() {
        if (this.matches.length === 0) return;
        
        this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matches.length) % this.matches.length;
        this.navigateToCurrentMatch();
        this.updateResults();
    }

    /**
     * Go to a specific match
     * @param {number} matchIndex - Index of the match
     */
    goToMatch(matchIndex) {
        if (matchIndex < 0 || matchIndex >= this.matches.length) return;
        
        this.currentMatchIndex = matchIndex;
        this.navigateToCurrentMatch();
        this.updateResults();
    }

    /**
     * Navigate to the current match
     */
    navigateToCurrentMatch() {
        const match = this.matches[this.currentMatchIndex];
        if (!match || !window.editor) return;

        // Navigate to the slide
        if (window.editor.selectSlide) {
            window.editor.selectSlide(match.slideIndex);
        }

        // Update search count display
        const countSpan = document.getElementById('search-count');
        if (countSpan) {
            countSpan.textContent = `${this.currentMatchIndex + 1}/${this.matches.length}`;
        }
    }

    /**
     * Replace the current match
     */
    replaceCurrent() {
        if (!this.searchQuery || this.currentMatchIndex < 0) return;

        const match = this.matches[this.currentMatchIndex];
        if (!match || !window.editor) return;

        // Navigate to the slide first
        window.editor.selectSlide(match.slideIndex);

        // Perform replacement in slide data
        const slide = window.editor.slides[match.slideIndex];
        if (!slide || !slide.data) return;

        let replaced = false;
        Object.keys(slide.data).forEach(key => {
            if (typeof slide.data[key] === 'string' && !replaced) {
                const newValue = this.replaceInText(slide.data[key], this.searchQuery, this.replaceQuery, true);
                if (newValue !== slide.data[key]) {
                    slide.data[key] = newValue;
                    replaced = true;
                }
            }
        });

        if (replaced) {
            window.editor.isDirty = true;
            window.editor.renderCurrentSlide();
            window.editor.renderThumbnails();
            
            // Re-search to update matches
            this.performSearch();

            if (typeof showToast === 'function') {
                showToast('Replaced 1 occurrence', 'success');
            }
        }
    }

    /**
     * Replace all matches
     */
    replaceAll() {
        if (!this.searchQuery || this.matches.length === 0) return;

        if (!confirm(`Replace all ${this.matches.length} occurrences of "${this.searchQuery}" with "${this.replaceQuery}"?`)) {
            return;
        }

        if (!window.editor || !window.editor.slides) return;

        let totalReplaced = 0;

        window.editor.slides.forEach(slide => {
            if (!slide.data) return;

            Object.keys(slide.data).forEach(key => {
                if (typeof slide.data[key] === 'string') {
                    const original = slide.data[key];
                    const newValue = this.replaceInText(original, this.searchQuery, this.replaceQuery, false);
                    if (newValue !== original) {
                        const count = (original.match(new RegExp(this.escapeRegex(this.searchQuery), this.caseSensitive ? 'g' : 'gi')) || []).length;
                        totalReplaced += count;
                        slide.data[key] = newValue;
                    }
                }
            });
        });

        if (totalReplaced > 0) {
            window.editor.isDirty = true;
            window.editor.renderCurrentSlide();
            window.editor.renderThumbnails();
            
            // Clear search
            this.matches = [];
            this.currentMatchIndex = -1;
            this.updateResults();
            this.clearHighlights();

            if (typeof showToast === 'function') {
                showToast(`Replaced ${totalReplaced} occurrence${totalReplaced > 1 ? 's' : ''}`, 'success');
            }
        }
    }

    /**
     * Replace text in a string
     * @param {string} text - Original text
     * @param {string} search - Search query
     * @param {string} replace - Replace value
     * @param {boolean} firstOnly - Replace only first occurrence
     * @returns {string} Text with replacements
     */
    replaceInText(text, search, replace, firstOnly = false) {
        // Handle HTML content - we need to be careful with tags
        const flags = this.caseSensitive ? (firstOnly ? '' : 'g') : (firstOnly ? 'i' : 'gi');
        const regex = new RegExp(this.escapeRegex(search), flags);
        return text.replace(regex, replace);
    }

    /**
     * Escape special regex characters
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
const searchManager = new SearchManager();

// Make globally available
if (typeof window !== 'undefined') {
    window.searchManager = searchManager;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        const isInEditor = document.getElementById('editor-page')?.classList.contains('active');
        if (isInEditor) {
            e.preventDefault();
            searchManager.open();
        }
    }
    
    // Ctrl+H for replace (in search panel)
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        const isInEditor = document.getElementById('editor-page')?.classList.contains('active');
        if (isInEditor) {
            e.preventDefault();
            searchManager.open();
            setTimeout(() => {
                document.getElementById('replace-input')?.focus();
            }, 100);
        }
    }
    
    // Escape to close
    if (e.key === 'Escape' && searchManager.isOpen) {
        searchManager.close();
    }
});
