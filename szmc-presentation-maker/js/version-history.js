// SZMC Geriatrics Presentation Maker - Version History System

class VersionHistoryManager {
    constructor() {
        this.dbName = 'szmc_presentation_history';
        this.dbVersion = 1;
        this.storeName = 'versions';
        this.db = null;
        this.maxVersions = 50;
        this.autoSaveInterval = 5 * 60 * 1000; // 5 minutes
        this.autoSaveTimer = null;
        this.isInitialized = false;
        this.currentPresentationId = null;
    }

    /**
     * Initialize IndexedDB connection
     * @returns {Promise} Resolves when database is ready
     */
    async init() {
        if (this.isInitialized) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                this.isInitialized = true;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    store.createIndex('presentationId', 'presentationId', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    /**
     * Set the current presentation ID
     * @param {string} presentationId - Presentation identifier
     */
    setCurrentPresentation(presentationId) {
        this.currentPresentationId = presentationId;
    }

    /**
     * Start auto-save timer
     */
    startAutoSave() {
        this.stopAutoSave();
        this.autoSaveTimer = setInterval(() => {
            this.autoSaveVersion();
        }, this.autoSaveInterval);
    }

    /**
     * Stop auto-save timer
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Auto-save current version
     */
    async autoSaveVersion() {
        if (!window.editor || !window.editor.slides) return;
        
        const presentation = window.editor.getPresentation();
        if (!presentation || !presentation.slides || presentation.slides.length === 0) return;

        try {
            await this.saveVersion(presentation, 'Auto-save');
        } catch (error) {
            console.warn('Auto-save failed:', error);
        }
    }

    /**
     * Save a new version
     * @param {Object} presentation - Presentation data
     * @param {string} label - Version label (optional)
     * @returns {Promise<number>} Version ID
     */
    async saveVersion(presentation, label = '') {
        if (!this.isInitialized) {
            await this.init();
        }

        const presentationId = this.currentPresentationId || 
            presentation.title.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const version = {
            presentationId,
            timestamp: new Date().toISOString(),
            label: label || 'Manual save',
            data: JSON.parse(JSON.stringify(presentation)),
            slideCount: presentation.slides.length,
            checksum: this.generateChecksum(presentation)
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(version);

            request.onsuccess = async () => {
                // Clean up old versions
                await this.cleanupOldVersions(presentationId);
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Get all versions for a presentation
     * @param {string} presentationId - Presentation identifier (optional)
     * @returns {Promise<Array>} Array of versions
     */
    async getVersions(presentationId = null) {
        if (!this.isInitialized) {
            await this.init();
        }

        const pid = presentationId || this.currentPresentationId;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('presentationId');
            const request = pid ? index.getAll(pid) : store.getAll();

            request.onsuccess = () => {
                // Sort by timestamp descending (newest first)
                const versions = request.result.sort((a, b) => 
                    new Date(b.timestamp) - new Date(a.timestamp)
                );
                resolve(versions);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Get a specific version by ID
     * @param {number} versionId - Version ID
     * @returns {Promise<Object>} Version data
     */
    async getVersion(versionId) {
        if (!this.isInitialized) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(versionId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Restore a specific version
     * @param {number} versionId - Version ID to restore
     * @returns {Promise<Object>} Restored presentation data
     */
    async restoreVersion(versionId) {
        const version = await this.getVersion(versionId);
        
        if (!version || !version.data) {
            throw new Error('Version not found');
        }

        // Save current state before restoring
        if (window.editor && window.editor.slides) {
            const currentPresentation = window.editor.getPresentation();
            await this.saveVersion(currentPresentation, 'Before restore');
        }

        // Load the restored version
        if (window.editor) {
            window.editor.loadPresentation(version.data);
        }

        return version.data;
    }

    /**
     * Delete a specific version
     * @param {number} versionId - Version ID to delete
     * @returns {Promise}
     */
    async deleteVersion(versionId) {
        if (!this.isInitialized) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(versionId);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Clean up old versions to stay within limit
     * @param {string} presentationId - Presentation identifier
     */
    async cleanupOldVersions(presentationId) {
        const versions = await this.getVersions(presentationId);
        
        if (versions.length > this.maxVersions) {
            const toDelete = versions.slice(this.maxVersions);
            for (const version of toDelete) {
                await this.deleteVersion(version.id);
            }
        }
    }

    /**
     * Clear all versions for a presentation
     * @param {string} presentationId - Presentation identifier
     */
    async clearAllVersions(presentationId = null) {
        const versions = await this.getVersions(presentationId);
        
        for (const version of versions) {
            await this.deleteVersion(version.id);
        }
    }

    /**
     * Generate a simple checksum for comparison
     * @param {Object} presentation - Presentation data
     * @returns {string} Checksum string
     */
    generateChecksum(presentation) {
        const str = JSON.stringify(presentation);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & 0xffffffff; // Ensure 32-bit integer behavior
        }
        return hash.toString(16);
    }

    /**
     * Compare two versions
     * @param {number} versionId1 - First version ID
     * @param {number} versionId2 - Second version ID
     * @returns {Promise<Object>} Comparison result
     */
    async compareVersions(versionId1, versionId2) {
        const version1 = await this.getVersion(versionId1);
        const version2 = await this.getVersion(versionId2);

        if (!version1 || !version2) {
            throw new Error('One or both versions not found');
        }

        const changes = {
            titleChanged: version1.data.title !== version2.data.title,
            slidesAdded: [],
            slidesRemoved: [],
            slidesModified: [],
            slideCount1: version1.data.slides.length,
            slideCount2: version2.data.slides.length
        };

        // Find added/removed/modified slides
        const slides1 = new Map(version1.data.slides.map(s => [s.id, s]));
        const slides2 = new Map(version2.data.slides.map(s => [s.id, s]));

        // Check for removed slides
        for (const [id, slide] of slides1) {
            if (!slides2.has(id)) {
                changes.slidesRemoved.push({ id, type: slide.type });
            } else {
                // Check if modified
                const slide2 = slides2.get(id);
                if (JSON.stringify(slide.data) !== JSON.stringify(slide2.data)) {
                    changes.slidesModified.push({ id, type: slide.type });
                }
            }
        }

        // Check for added slides
        for (const [id, slide] of slides2) {
            if (!slides1.has(id)) {
                changes.slidesAdded.push({ id, type: slide.type });
            }
        }

        return changes;
    }

    /**
     * Open version history modal
     */
    async openModal() {
        const versions = await this.getVersions();
        this.renderModal(versions);
    }

    /**
     * Render the version history modal
     * @param {Array} versions - Array of versions
     */
    renderModal(versions) {
        const existingModal = document.getElementById('version-history-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'version-history-modal';
        modal.className = 'modal active';
        
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="versionHistory.closeModal()"></div>
            <div class="modal-content version-history-modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-history"></i> Version History</h2>
                    <button class="modal-close" onclick="versionHistory.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="version-actions">
                        <button class="btn-secondary btn-sm" onclick="versionHistory.saveManualVersion()">
                            <i class="fas fa-save"></i> Save Current Version
                        </button>
                        <button class="btn-secondary btn-sm" onclick="versionHistory.clearAll()">
                            <i class="fas fa-trash-alt"></i> Clear History
                        </button>
                    </div>
                    <div class="version-list" id="version-list">
                        ${this.renderVersionList(versions)}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Render the version list
     * @param {Array} versions - Array of versions
     * @returns {string} HTML string
     */
    renderVersionList(versions) {
        if (!versions || versions.length === 0) {
            return `
                <div class="version-empty">
                    <i class="fas fa-clock"></i>
                    <p>No versions saved yet</p>
                    <p class="version-empty-hint">Versions are auto-saved every 5 minutes</p>
                </div>
            `;
        }

        return versions.map(version => {
            const date = new Date(version.timestamp);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isAutoSave = version.label === 'Auto-save';

            return `
                <div class="version-item" data-id="${version.id}">
                    <div class="version-info">
                        <div class="version-label">
                            <span class="version-type ${isAutoSave ? 'auto' : 'manual'}">
                                ${isAutoSave ? 'Auto' : 'Manual'}
                            </span>
                            <span class="version-title">${version.data.title || 'Untitled'}</span>
                        </div>
                        <div class="version-meta">
                            <span class="version-date">
                                <i class="fas fa-calendar-alt"></i> ${formattedDate}
                            </span>
                            <span class="version-time">
                                <i class="fas fa-clock"></i> ${formattedTime}
                            </span>
                            <span class="version-slides">
                                <i class="fas fa-copy"></i> ${version.slideCount} slides
                            </span>
                        </div>
                    </div>
                    <div class="version-actions">
                        <button class="btn-icon" onclick="versionHistory.previewVersion(${version.id})" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="versionHistory.restoreVersionConfirm(${version.id})" title="Restore">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="btn-icon" onclick="versionHistory.deleteVersionConfirm(${version.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Close the modal
     */
    closeModal() {
        const modal = document.getElementById('version-history-modal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Save a manual version
     */
    async saveManualVersion() {
        if (!window.editor) return;

        try {
            const presentation = window.editor.getPresentation();
            const label = prompt('Enter a label for this version (optional):', 'Manual save');
            
            if (label !== null) {
                await this.saveVersion(presentation, label);
                
                // Refresh the list
                const versions = await this.getVersions();
                const listContainer = document.getElementById('version-list');
                if (listContainer) {
                    listContainer.innerHTML = this.renderVersionList(versions);
                }

                if (typeof showToast === 'function') {
                    showToast('Version saved successfully', 'success');
                }
            }
        } catch (error) {
            console.error('Failed to save version:', error);
            if (typeof showToast === 'function') {
                showToast('Failed to save version', 'error');
            }
        }
    }

    /**
     * Preview a version
     * @param {number} versionId - Version ID
     */
    async previewVersion(versionId) {
        const version = await this.getVersion(versionId);
        if (!version) return;

        // Open a simple preview
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Version Preview - ${version.data.title}</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        padding: 20px;
                        background: #f1f5f9;
                    }
                    h1 { color: #1e3a5f; }
                    .slide-preview {
                        background: white;
                        padding: 20px;
                        margin: 10px 0;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .slide-number { 
                        font-size: 12px;
                        color: #64748b;
                        margin-bottom: 8px;
                    }
                    .slide-type {
                        font-weight: 600;
                        color: #1e3a5f;
                    }
                </style>
            </head>
            <body>
                <h1>${version.data.title || 'Untitled Presentation'}</h1>
                <p>Saved: ${new Date(version.timestamp).toLocaleString()}</p>
                <hr>
                ${version.data.slides.map((slide, index) => `
                    <div class="slide-preview">
                        <div class="slide-number">Slide ${index + 1}</div>
                        <div class="slide-type">${slide.type}</div>
                    </div>
                `).join('')}
            </body>
            </html>
        `);
        previewWindow.document.close();
    }

    /**
     * Confirm and restore a version
     * @param {number} versionId - Version ID
     */
    async restoreVersionConfirm(versionId) {
        if (confirm('Are you sure you want to restore this version? Your current work will be saved first.')) {
            try {
                await this.restoreVersion(versionId);
                this.closeModal();
                
                if (typeof showToast === 'function') {
                    showToast('Version restored successfully', 'success');
                }
            } catch (error) {
                console.error('Failed to restore version:', error);
                if (typeof showToast === 'function') {
                    showToast('Failed to restore version', 'error');
                }
            }
        }
    }

    /**
     * Confirm and delete a version
     * @param {number} versionId - Version ID
     */
    async deleteVersionConfirm(versionId) {
        if (confirm('Are you sure you want to delete this version?')) {
            try {
                await this.deleteVersion(versionId);
                
                // Refresh the list
                const versions = await this.getVersions();
                const listContainer = document.getElementById('version-list');
                if (listContainer) {
                    listContainer.innerHTML = this.renderVersionList(versions);
                }

                if (typeof showToast === 'function') {
                    showToast('Version deleted', 'success');
                }
            } catch (error) {
                console.error('Failed to delete version:', error);
                if (typeof showToast === 'function') {
                    showToast('Failed to delete version', 'error');
                }
            }
        }
    }

    /**
     * Clear all versions
     */
    async clearAll() {
        if (confirm('Are you sure you want to clear all version history?')) {
            try {
                await this.clearAllVersions();
                
                const listContainer = document.getElementById('version-list');
                if (listContainer) {
                    listContainer.innerHTML = this.renderVersionList([]);
                }

                if (typeof showToast === 'function') {
                    showToast('Version history cleared', 'success');
                }
            } catch (error) {
                console.error('Failed to clear history:', error);
            }
        }
    }
}

// Create global instance
const versionHistory = new VersionHistoryManager();

// Initialize and start auto-save when document loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await versionHistory.init();
        versionHistory.startAutoSave();
    } catch (error) {
        console.warn('Version history unavailable:', error);
    }
});

// Make globally available
if (typeof window !== 'undefined') {
    window.versionHistory = versionHistory;
}
