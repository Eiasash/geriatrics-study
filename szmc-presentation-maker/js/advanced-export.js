/**
 * Advanced Export Module
 * PowerPoint, PDF, Cloud Save, Template Sharing
 */

// ========================================
// PowerPoint Export (using PptxGenJS)
// ========================================

async function loadPptxLibrary() {
    if (window.PptxGenJS) return true;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load PptxGenJS'));
        document.head.appendChild(script);
    });
}

async function exportToPowerPoint() {
    try {
        showExportProgress('Preparing PowerPoint...', 10);
        await loadPptxLibrary();

        const pptx = new PptxGenJS();
        const presentation = window.currentPresentation || getPresentationData();

        // Set presentation properties
        pptx.author = 'SZMC Geriatrics';
        pptx.title = presentation.title || 'Medical Presentation';
        pptx.subject = 'Geriatric Medicine';
        pptx.company = 'Shamir Medical Center';

        // Define master slide
        pptx.defineSlideMaster({
            title: 'SZMC_MASTER',
            background: { color: 'FFFFFF' },
            objects: [
                { rect: { x: 0, y: 0, w: '100%', h: 0.5, fill: { color: '1e3a5f' } } },
                { text: { text: 'SZMC Geriatrics', options: { x: 0.5, y: 0.1, w: 3, h: 0.3, fontSize: 12, color: 'FFFFFF', fontFace: 'Arial' } } }
            ]
        });

        showExportProgress('Creating slides...', 30);

        // Title slide
        let slide = pptx.addSlide();
        slide.addText(presentation.title || 'Case Presentation', {
            x: 0.5, y: 2, w: 9, h: 1.5,
            fontSize: 44, bold: true, color: '1e3a5f',
            align: 'center', fontFace: 'Arial'
        });
        slide.addText(presentation.subtitle || 'Geriatric Medicine Department', {
            x: 0.5, y: 3.5, w: 9, h: 0.5,
            fontSize: 24, color: '666666',
            align: 'center', fontFace: 'Arial'
        });
        slide.addText(new Date().toLocaleDateString(), {
            x: 0.5, y: 4.5, w: 9, h: 0.3,
            fontSize: 14, color: '999999',
            align: 'center', fontFace: 'Arial'
        });

        showExportProgress('Adding content slides...', 50);

        // Content slides
        const slides = presentation.slides || [];
        slides.forEach((slideData, index) => {
            slide = pptx.addSlide({ masterName: 'SZMC_MASTER' });

            // Slide title
            slide.addText(slideData.title || `Slide ${index + 1}`, {
                x: 0.5, y: 0.7, w: 9, h: 0.6,
                fontSize: 28, bold: true, color: '1e3a5f',
                fontFace: 'Arial'
            });

            // Slide content
            if (slideData.content) {
                const bullets = slideData.content.split('\n').filter(l => l.trim());
                slide.addText(bullets.map(b => ({ text: b.replace(/^[-•]\s*/, ''), options: { bullet: true } })), {
                    x: 0.5, y: 1.5, w: 9, h: 4,
                    fontSize: 18, color: '333333',
                    fontFace: 'Arial', valign: 'top'
                });
            }

            // Notes
            if (slideData.notes) {
                slide.addNotes(slideData.notes);
            }
        });

        showExportProgress('Generating file...', 80);

        // Generate and download
        const fileName = `${(presentation.title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
        await pptx.writeFile({ fileName });

        showExportProgress('Complete!', 100);
        setTimeout(hideExportProgress, 1000);

        showToast('PowerPoint exported successfully!', 'success');

    } catch (error) {
        console.error('PowerPoint export error:', error);
        hideExportProgress();
        showToast('Failed to export PowerPoint: ' + error.message, 'error');
    }
}

// ========================================
// PDF Export (using html2pdf.js)
// ========================================

async function loadPdfLibrary() {
    if (window.html2pdf) return true;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load html2pdf'));
        document.head.appendChild(script);
    });
}

async function exportToPDF() {
    try {
        showExportProgress('Preparing PDF...', 10);
        await loadPdfLibrary();

        const presentation = window.currentPresentation || getPresentationData();

        showExportProgress('Generating PDF...', 30);

        // Create PDF content
        const container = document.createElement('div');
        container.style.cssText = 'width: 800px; padding: 40px; font-family: Arial, sans-serif;';

        // Title page
        container.innerHTML = `
            <div style="text-align: center; padding: 100px 0; page-break-after: always;">
                <h1 style="font-size: 36px; color: #1e3a5f; margin-bottom: 20px;">${presentation.title || 'Case Presentation'}</h1>
                <p style="font-size: 20px; color: #666;">${presentation.subtitle || 'Geriatric Medicine Department'}</p>
                <p style="font-size: 14px; color: #999; margin-top: 40px;">${new Date().toLocaleDateString()}</p>
                <p style="font-size: 14px; color: #999;">SZMC Geriatrics</p>
            </div>
        `;

        // Content slides
        const slides = presentation.slides || [];
        slides.forEach((slide, index) => {
            container.innerHTML += `
                <div style="page-break-after: always; padding: 20px 0;">
                    <div style="background: #1e3a5f; color: white; padding: 10px 20px; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 24px;">${slide.title || `Slide ${index + 1}`}</h2>
                    </div>
                    <div style="font-size: 16px; line-height: 1.8; color: #333;">
                        ${(slide.content || '').split('\n').map(l => `<p style="margin: 10px 0;">${l}</p>`).join('')}
                    </div>
                    ${slide.notes ? `<div style="margin-top: 30px; padding: 15px; background: #f5f5f5; border-left: 4px solid #1e3a5f;"><strong>Notes:</strong><br>${slide.notes}</div>` : ''}
                </div>
            `;
        });

        document.body.appendChild(container);

        showExportProgress('Creating PDF file...', 60);

        const opt = {
            margin: 10,
            filename: `${(presentation.title || 'presentation').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        await html2pdf().set(opt).from(container).save();

        document.body.removeChild(container);

        showExportProgress('Complete!', 100);
        setTimeout(hideExportProgress, 1000);

        showToast('PDF exported successfully!', 'success');

    } catch (error) {
        console.error('PDF export error:', error);
        hideExportProgress();
        showToast('Failed to export PDF: ' + error.message, 'error');
    }
}

// ========================================
// Cloud Save (Google Drive / Dropbox)
// ========================================

const CloudSave = {
    // Google Drive
    googleDrive: {
        clientId: null, // User needs to set this
        apiKey: null,

        async init(clientId, apiKey) {
            this.clientId = clientId;
            this.apiKey = apiKey;

            await this.loadGoogleAPI();
        },

        async loadGoogleAPI() {
            if (window.gapi) return;

            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://apis.google.com/js/api.js';
                script.onload = () => {
                    gapi.load('client:auth2', resolve);
                };
                document.head.appendChild(script);
            });
        },

        async authenticate() {
            if (!this.clientId) {
                showCloudSetupModal('google');
                return false;
            }

            try {
                await gapi.client.init({
                    apiKey: this.apiKey,
                    clientId: this.clientId,
                    scope: 'https://www.googleapis.com/auth/drive.file'
                });

                const authInstance = gapi.auth2.getAuthInstance();
                if (!authInstance.isSignedIn.get()) {
                    await authInstance.signIn();
                }
                return true;
            } catch (error) {
                console.error('Google auth error:', error);
                return false;
            }
        },

        async save(presentation) {
            const authenticated = await this.authenticate();
            if (!authenticated) return;

            showExportProgress('Saving to Google Drive...', 30);

            const content = JSON.stringify(presentation, null, 2);
            const fileName = `${presentation.title || 'presentation'}.json`;

            const file = new Blob([content], { type: 'application/json' });
            const metadata = {
                name: fileName,
                mimeType: 'application/json'
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            try {
                const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
                    },
                    body: form
                });

                if (response.ok) {
                    showExportProgress('Complete!', 100);
                    setTimeout(hideExportProgress, 1000);
                    showToast('Saved to Google Drive!', 'success');
                }
            } catch (error) {
                hideExportProgress();
                showToast('Failed to save to Google Drive', 'error');
            }
        }
    },

    // Dropbox
    dropbox: {
        accessToken: null,

        async save(presentation) {
            if (!this.accessToken) {
                showCloudSetupModal('dropbox');
                return;
            }

            showExportProgress('Saving to Dropbox...', 30);

            const content = JSON.stringify(presentation, null, 2);
            const fileName = `/${presentation.title || 'presentation'}.json`;

            try {
                const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/octet-stream',
                        'Dropbox-API-Arg': JSON.stringify({
                            path: fileName,
                            mode: 'overwrite'
                        })
                    },
                    body: content
                });

                if (response.ok) {
                    showExportProgress('Complete!', 100);
                    setTimeout(hideExportProgress, 1000);
                    showToast('Saved to Dropbox!', 'success');
                }
            } catch (error) {
                hideExportProgress();
                showToast('Failed to save to Dropbox', 'error');
            }
        }
    },

    // Local Storage backup
    local: {
        save(presentation) {
            const key = `presentation_${Date.now()}`;
            const data = {
                ...presentation,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem(key, JSON.stringify(data));

            // Keep only last 10 saves
            const keys = Object.keys(localStorage).filter(k => k.startsWith('presentation_')).sort().reverse();
            keys.slice(10).forEach(k => localStorage.removeItem(k));

            showToast('Saved locally!', 'success');
            return key;
        },

        list() {
            return Object.keys(localStorage)
                .filter(k => k.startsWith('presentation_'))
                .map(k => {
                    const data = JSON.parse(localStorage.getItem(k));
                    return { key: k, title: data.title, savedAt: data.savedAt };
                })
                .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        },

        load(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        }
    }
};

// ========================================
// Template Sharing
// ========================================

const TemplateSharing = {
    // Generate shareable link (base64 encoded)
    generateShareLink(presentation) {
        const data = JSON.stringify({
            title: presentation.title,
            template: presentation.template,
            slides: presentation.slides,
            sharedAt: new Date().toISOString()
        });

        const encoded = btoa(unescape(encodeURIComponent(data)));
        const baseUrl = window.location.origin + window.location.pathname;
        return `${baseUrl}?shared=${encoded}`;
    },

    // Load from share link
    loadFromShareLink() {
        const params = new URLSearchParams(window.location.search);
        const shared = params.get('shared');

        if (shared) {
            try {
                const data = JSON.parse(decodeURIComponent(escape(atob(shared))));
                return data;
            } catch (e) {
                console.error('Failed to load shared template:', e);
            }
        }
        return null;
    },

    // Copy share link
    async copyShareLink(presentation) {
        const link = this.generateShareLink(presentation);

        try {
            await navigator.clipboard.writeText(link);
            showToast('Share link copied to clipboard!', 'success');
        } catch (e) {
            // Fallback
            const input = document.createElement('input');
            input.value = link;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showToast('Share link copied!', 'success');
        }

        return link;
    },

    // Export as template file
    exportTemplate(presentation) {
        const template = {
            name: presentation.title,
            type: presentation.template,
            structure: presentation.slides.map(s => ({
                title: s.title,
                placeholders: s.content ? ['content'] : [],
                layout: s.layout || 'default'
            })),
            createdAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `template_${presentation.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('Template exported!', 'success');
    }
};

// ========================================
// Collaborative Editing (WebSocket-based)
// ========================================

const CollaborativeEditing = {
    socket: null,
    roomId: null,
    userId: null,
    users: [],
    isHost: false,

    // Generate room ID
    generateRoomId() {
        return 'room_' + Math.random().toString(36).substr(2, 9);
    },

    // Create collaboration room
    createRoom(presentation) {
        this.roomId = this.generateRoomId();
        this.userId = 'user_' + Math.random().toString(36).substr(2, 6);
        this.isHost = true;

        // Store room data locally (for demo - in production use WebSocket server)
        const roomData = {
            id: this.roomId,
            host: this.userId,
            presentation: presentation,
            users: [{ id: this.userId, name: 'Host', color: '#1e3a5f' }],
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(`collab_${this.roomId}`, JSON.stringify(roomData));

        this.startPolling();

        return this.roomId;
    },

    // Join room
    joinRoom(roomId, userName) {
        this.roomId = roomId;
        this.userId = 'user_' + Math.random().toString(36).substr(2, 6);
        this.isHost = false;

        const roomData = localStorage.getItem(`collab_${roomId}`);
        if (!roomData) {
            showToast('Room not found', 'error');
            return null;
        }

        const room = JSON.parse(roomData);
        const userColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        room.users.push({ id: this.userId, name: userName || 'Guest', color: userColor });
        localStorage.setItem(`collab_${roomId}`, JSON.stringify(room));

        this.startPolling();

        return room.presentation;
    },

    // Broadcast changes
    broadcastChange(change) {
        if (!this.roomId) return;

        const roomData = JSON.parse(localStorage.getItem(`collab_${this.roomId}`) || '{}');
        if (!roomData.changes) roomData.changes = [];

        roomData.changes.push({
            userId: this.userId,
            change: change,
            timestamp: Date.now()
        });

        // Keep only last 100 changes
        roomData.changes = roomData.changes.slice(-100);

        localStorage.setItem(`collab_${this.roomId}`, JSON.stringify(roomData));
    },

    // Start polling for changes (simple implementation)
    startPolling() {
        this.pollInterval = setInterval(() => {
            this.checkForChanges();
        }, 1000);
    },

    // Check for changes from other users
    checkForChanges() {
        if (!this.roomId) return;

        const roomData = JSON.parse(localStorage.getItem(`collab_${this.roomId}`) || '{}');

        // Update users list
        if (roomData.users) {
            this.users = roomData.users;
            this.updateUsersUI();
        }

        // Apply changes from others
        if (roomData.changes) {
            const newChanges = roomData.changes.filter(c =>
                c.userId !== this.userId &&
                c.timestamp > (this.lastChangeTime || 0)
            );

            newChanges.forEach(c => this.applyChange(c.change));

            if (newChanges.length > 0) {
                this.lastChangeTime = Math.max(...newChanges.map(c => c.timestamp));
            }
        }
    },

    // Apply change from another user
    applyChange(change) {
        if (change.type === 'slideUpdate') {
            // Update slide content
            if (window.updateSlide) {
                window.updateSlide(change.slideIndex, change.data);
            }
        } else if (change.type === 'cursor') {
            // Show other user's cursor (optional)
            this.showRemoteCursor(change.userId, change.position);
        }
    },

    // Update users UI
    updateUsersUI() {
        const container = document.getElementById('collab-users');
        if (!container) return;

        container.innerHTML = this.users.map(u => `
            <div class="collab-user" style="border-color: ${u.color}">
                <span class="user-avatar" style="background: ${u.color}">${u.name[0]}</span>
                <span class="user-name">${u.name}</span>
            </div>
        `).join('');
    },

    // Show remote cursor
    showRemoteCursor(userId, position) {
        let cursor = document.getElementById(`cursor-${userId}`);
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.id = `cursor-${userId}`;
            cursor.className = 'remote-cursor';
            document.body.appendChild(cursor);
        }
        cursor.style.left = position.x + 'px';
        cursor.style.top = position.y + 'px';
    },

    // Leave room
    leaveRoom() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }

        if (this.roomId) {
            const roomData = JSON.parse(localStorage.getItem(`collab_${this.roomId}`) || '{}');
            if (roomData.users) {
                roomData.users = roomData.users.filter(u => u.id !== this.userId);
                localStorage.setItem(`collab_${this.roomId}`, JSON.stringify(roomData));
            }
        }

        this.roomId = null;
        this.userId = null;
    },

    // Get share URL for room
    getShareUrl() {
        if (!this.roomId) return null;
        return `${window.location.origin}${window.location.pathname}?room=${this.roomId}`;
    }
};

// ========================================
// UI Helpers
// ========================================

function showExportProgress(message, percent) {
    let progress = document.getElementById('export-progress');
    if (!progress) {
        progress = document.createElement('div');
        progress.id = 'export-progress';
        progress.innerHTML = `
            <div class="export-progress-overlay">
                <div class="export-progress-modal">
                    <div class="export-progress-spinner"></div>
                    <div class="export-progress-message"></div>
                    <div class="export-progress-bar"><div class="export-progress-fill"></div></div>
                </div>
            </div>
        `;
        document.body.appendChild(progress);
    }

    progress.querySelector('.export-progress-message').textContent = message;
    progress.querySelector('.export-progress-fill').style.width = percent + '%';
    progress.style.display = 'block';
}

function hideExportProgress() {
    const progress = document.getElementById('export-progress');
    if (progress) {
        progress.style.display = 'none';
    }
}

function showCloudSetupModal(provider) {
    const modal = document.createElement('div');
    modal.className = 'cloud-setup-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <h3>Setup ${provider === 'google' ? 'Google Drive' : 'Dropbox'}</h3>
                <p>To enable cloud saving, you need to configure API credentials.</p>
                ${provider === 'google' ? `
                    <div class="form-group">
                        <label>Google Client ID:</label>
                        <input type="text" id="google-client-id" placeholder="your-client-id.apps.googleusercontent.com">
                    </div>
                    <div class="form-group">
                        <label>API Key:</label>
                        <input type="text" id="google-api-key" placeholder="your-api-key">
                    </div>
                ` : `
                    <div class="form-group">
                        <label>Dropbox Access Token:</label>
                        <input type="text" id="dropbox-token" placeholder="your-access-token">
                    </div>
                `}
                <div class="modal-actions">
                    <button onclick="this.closest('.cloud-setup-modal').remove()">Cancel</button>
                    <button onclick="saveCloudConfig('${provider}')">Save</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveCloudConfig(provider) {
    if (provider === 'google') {
        const clientId = document.getElementById('google-client-id').value;
        const apiKey = document.getElementById('google-api-key').value;
        CloudSave.googleDrive.init(clientId, apiKey);
        localStorage.setItem('google_config', JSON.stringify({ clientId, apiKey }));
    } else {
        const token = document.getElementById('dropbox-token').value;
        CloudSave.dropbox.accessToken = token;
        localStorage.setItem('dropbox_token', token);
    }
    document.querySelector('.cloud-setup-modal').remove();
    showToast('Cloud config saved!', 'success');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; padding: 12px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white; border-radius: 8px; z-index: 10000; animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Get presentation data helper
function getPresentationData() {
    // Try to get from current editor state
    if (window.currentPresentation) return window.currentPresentation;

    // Fallback: collect from DOM
    const slides = [];
    document.querySelectorAll('.slide-item, .slide').forEach((el, i) => {
        slides.push({
            title: el.querySelector('.slide-title, h2, h3')?.textContent || `Slide ${i + 1}`,
            content: el.querySelector('.slide-content, .content')?.textContent || '',
            notes: el.querySelector('.slide-notes, .notes')?.textContent || ''
        });
    });

    return {
        title: document.querySelector('.presentation-title, h1')?.textContent || 'Presentation',
        slides: slides
    };
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Load saved cloud configs
    const googleConfig = localStorage.getItem('google_config');
    if (googleConfig) {
        const { clientId, apiKey } = JSON.parse(googleConfig);
        CloudSave.googleDrive.init(clientId, apiKey);
    }

    const dropboxToken = localStorage.getItem('dropbox_token');
    if (dropboxToken) {
        CloudSave.dropbox.accessToken = dropboxToken;
    }

    // Check for shared template
    const shared = TemplateSharing.loadFromShareLink();
    if (shared) {
        showToast('Loading shared template...', 'info');
        window.currentPresentation = shared;
    }

    // Check for collab room
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    if (roomId) {
        const userName = prompt('Enter your name to join:');
        if (userName) {
            CollaborativeEditing.joinRoom(roomId, userName);
        }
    }
});

// Add CSS for progress and modals
const style = document.createElement('style');
style.textContent = `
    .export-progress-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 10000;
    }
    .export-progress-modal {
        background: white; padding: 30px 50px; border-radius: 12px;
        text-align: center; min-width: 300px;
    }
    .export-progress-spinner {
        width: 40px; height: 40px; border: 4px solid #e5e7eb;
        border-top-color: #1e3a5f; border-radius: 50%;
        animation: spin 1s linear infinite; margin: 0 auto 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .export-progress-bar {
        height: 8px; background: #e5e7eb; border-radius: 4px;
        overflow: hidden; margin-top: 15px;
    }
    .export-progress-fill {
        height: 100%; background: #1e3a5f; transition: width 0.3s;
    }
    .cloud-setup-modal .modal-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 10001;
    }
    .cloud-setup-modal .modal-content {
        background: white; padding: 30px; border-radius: 12px;
        max-width: 400px; width: 90%;
    }
    .cloud-setup-modal .form-group { margin: 15px 0; }
    .cloud-setup-modal label { display: block; margin-bottom: 5px; font-weight: 500; }
    .cloud-setup-modal input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
    .cloud-setup-modal .modal-actions { margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end; }
    .cloud-setup-modal button { padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; }
    .cloud-setup-modal button:first-child { background: #e5e7eb; }
    .cloud-setup-modal button:last-child { background: #1e3a5f; color: white; }
    .collab-user { display: inline-flex; align-items: center; gap: 8px; padding: 5px 10px; border: 2px solid; border-radius: 20px; margin: 5px; }
    .user-avatar { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
    .remote-cursor { position: fixed; width: 20px; height: 20px; border-radius: 50%; pointer-events: none; z-index: 9999; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;
document.head.appendChild(style);

// Export functions globally
window.exportToPowerPoint = exportToPowerPoint;
window.exportToPDF = exportToPDF;
window.CloudSave = CloudSave;
window.TemplateSharing = TemplateSharing;
window.CollaborativeEditing = CollaborativeEditing;
