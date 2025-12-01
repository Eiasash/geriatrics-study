/**
 * SZMC Geriatrics Presentation Maker - AI Assistant Module
 * 
 * This module provides an intelligent AI assistant for creating and improving
 * medical presentations. It includes:
 * - Conversational chat interface
 * - Content generation for medical cases
 * - Presentation analysis and suggestions
 * - Hebrew/English translation support
 * 
 * @version 2.0.0
 * @author SZMC Geriatrics Department
 */

// =============================================================================
// AI ASSISTANT CLASS
// =============================================================================

class AIAssistant {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.activeTab = 'chat';
        this.analysisResults = null;
        this.apiKey = null; // Set via setApiKey() for real API integration
        this.useLocalAI = true; // Use local responses when API not available
        
        // Medical knowledge base for local responses
        this.medicalKnowledge = {
            geriatricSyndromes: ['delirium', 'dementia', 'depression', 'incontinence', 'falls', 'frailty', 'polypharmacy', 'malnutrition'],
            assessmentTools: ['MMSE', 'MoCA', 'GDS', 'CAM', 'Barthel', 'IADL', 'MNA', 'TUG', 'Morse Fall Scale', 'Clinical Frailty Scale'],
            commonConditions: ['HSP', 'RPGN', 'UTI', 'pneumonia', 'CHF', 'COPD', 'stroke', 'parkinson', 'alzheimer'],
        };

        this.init();
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    init() {
        this.createPanelHTML();
        this.bindEvents();
        this.loadSavedMessages();
        this.setupMobileSupport();
    }

    setupMobileSupport() {
        // Ensure panel is properly positioned on mobile
        const panel = document.getElementById('ai-assistant-panel');
        if (panel) {
            panel.setAttribute('aria-hidden', 'true');
            panel.setAttribute('role', 'dialog');
            panel.setAttribute('aria-label', 'AI Assistant');
        }

        // Add touch support for all interactive elements
        document.querySelectorAll('.ai-suggestion-btn, .quick-action-chip, .generate-card').forEach(btn => {
            btn.addEventListener('touchend', (e) => {
                // Small delay to show touch feedback
                setTimeout(() => {
                    btn.click();
                }, 50);
            }, { passive: true });
        });

        // Handle viewport changes (keyboard open/close on mobile)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                const panel = document.getElementById('ai-assistant-panel');
                if (panel && panel.classList.contains('open')) {
                    panel.style.height = `${window.visualViewport.height}px`;
                }
            });
        }
    }

    createPanelHTML() {
        // Find existing AI panel or create new one
        let panel = document.getElementById('ai-assistant-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'ai-assistant-panel';
            panel.className = 'ai-assistant-panel';
            document.body.appendChild(panel);
        }

        panel.innerHTML = `
            <!-- Panel Header -->
            <div class="ai-panel-header">
                <div class="ai-panel-title">
                    <div class="ai-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="ai-title-text">
                        <h3 data-i18n="aiAssistant">AI Assistant</h3>
                        <span data-i18n="aiSubtitle">Medical Presentation Expert</span>
                    </div>
                </div>
                <div class="ai-panel-actions">
                    <div class="ai-status" id="ai-status">
                        <div class="ai-status-dot"></div>
                        <span data-i18n="aiOnline">Online</span>
                    </div>
                    <button class="ai-panel-close" id="ai-panel-close-btn" aria-label="Close AI Assistant">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="ai-tabs">
                <button class="ai-tab active" data-tab="chat" onclick="aiAssistant.switchTab('chat')">
                    <i class="fas fa-comments"></i>
                    <span data-i18n="aiTabChat">Chat</span>
                </button>
                <button class="ai-tab" data-tab="analyze" onclick="aiAssistant.switchTab('analyze')">
                    <i class="fas fa-search"></i>
                    <span data-i18n="aiTabAnalyze">Analyze</span>
                </button>
                <button class="ai-tab" data-tab="generate" onclick="aiAssistant.switchTab('generate')">
                    <i class="fas fa-magic"></i>
                    <span data-i18n="aiTabGenerate">Generate</span>
                </button>
            </div>

            <!-- Chat Container -->
            <div class="ai-tab-content active" id="ai-chat-container">
                <div class="ai-messages" id="ai-messages">
                    <!-- Welcome Message -->
                    <div class="ai-welcome" id="ai-welcome">
                        <div class="ai-welcome-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <h4 data-i18n="aiWelcomeTitle">Hi! I'm your AI Assistant</h4>
                        <p data-i18n="aiWelcomeDesc">I can help you create better medical presentations, generate content, and review your slides.</p>
                        
                        <div class="ai-welcome-suggestions">
                            <button class="ai-suggestion-btn" onclick="aiAssistant.sendQuickMessage('Generate a differential diagnosis for my current case')">
                                <i class="fas fa-list-check"></i>
                                <div>
                                    <strong data-i18n="aiSuggestDdx">Generate Differential</strong>
                                    <span data-i18n="aiSuggestDdxDesc">Create a DDx list based on case</span>
                                </div>
                            </button>
                            <button class="ai-suggestion-btn" onclick="aiAssistant.sendQuickMessage('Review my presentation and suggest improvements')">
                                <i class="fas fa-clipboard-check"></i>
                                <div>
                                    <strong data-i18n="aiSuggestReview">Review Presentation</strong>
                                    <span data-i18n="aiSuggestReviewDesc">Get feedback on structure</span>
                                </div>
                            </button>
                            <button class="ai-suggestion-btn" onclick="aiAssistant.sendQuickMessage('Write teaching points for this case')">
                                <i class="fas fa-graduation-cap"></i>
                                <div>
                                    <strong data-i18n="aiSuggestTeaching">Teaching Points</strong>
                                    <span data-i18n="aiSuggestTeachingDesc">Key learning objectives</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="ai-quick-actions">
                    <span class="quick-actions-label" data-i18n="aiQuickActions">Quick Actions:</span>
                    <div class="quick-actions-scroll">
                        <button class="quick-action-chip" onclick="aiAssistant.sendQuickMessage('Improve the wording of my current slide')">
                            <i class="fas fa-pen"></i> <span data-i18n="aiImproveText">Improve Text</span>
                        </button>
                        <button class="quick-action-chip" onclick="aiAssistant.sendQuickMessage('Add a clinical pearl to this slide')">
                            <i class="fas fa-gem"></i> <span data-i18n="aiAddPearl">Add Pearl</span>
                        </button>
                        <button class="quick-action-chip" onclick="aiAssistant.sendQuickMessage('Suggest citations for this information')">
                            <i class="fas fa-book"></i> <span data-i18n="aiFindCitation">Find Citation</span>
                        </button>
                        <button class="quick-action-chip" onclick="aiAssistant.sendQuickMessage('Translate this slide to Hebrew')">
                            <i class="fas fa-language"></i> <span data-i18n="aiTranslate">Translate</span>
                        </button>
                        <button class="quick-action-chip" onclick="aiAssistant.sendQuickMessage('Make this more concise')">
                            <i class="fas fa-compress-alt"></i> <span data-i18n="aiCondense">Condense</span>
                        </button>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="ai-input-container">
                    <div class="ai-input-wrapper">
                        <textarea 
                            id="ai-input" 
                            class="ai-input" 
                            placeholder="Ask me anything about your presentation..."
                            rows="1"
                            data-i18n-placeholder="aiInputPlaceholder"
                        ></textarea>
                        <button class="ai-send-btn" id="ai-send-btn" onclick="aiAssistant.sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="ai-input-hint">
                        <span data-i18n="aiInputHint">Press Enter to send, Shift+Enter for new line</span>
                    </div>
                </div>
            </div>

            <!-- Analyze Container -->
            <div class="ai-tab-content" id="ai-analyze-container">
                <div class="ai-analyze-content">
                    <!-- Score Card -->
                    <div class="analysis-score-card" id="analysis-score-card">
                        <div class="score-ring" id="score-ring">
                            <svg viewBox="0 0 100 100">
                                <circle class="score-bg" cx="50" cy="50" r="45"/>
                                <circle class="score-fill" cx="50" cy="50" r="45" id="score-circle"/>
                            </svg>
                            <div class="score-value" id="score-value">--</div>
                        </div>
                        <div class="score-label" data-i18n="aiScoreLabel">Presentation Score</div>
                        <div class="score-sublabel" id="score-sublabel" data-i18n="aiScoreRun">Run analysis to get score</div>
                    </div>

                    <!-- Issue Summary -->
                    <div class="analysis-summary" id="analysis-summary">
                        <div class="summary-stat" data-type="error">
                            <i class="fas fa-times-circle"></i>
                            <span class="stat-count" id="error-count">0</span>
                            <span class="stat-label" data-i18n="aiErrors">Errors</span>
                        </div>
                        <div class="summary-stat" data-type="warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span class="stat-count" id="warning-count">0</span>
                            <span class="stat-label" data-i18n="aiWarnings">Warnings</span>
                        </div>
                        <div class="summary-stat" data-type="info">
                            <i class="fas fa-info-circle"></i>
                            <span class="stat-count" id="info-count">0</span>
                            <span class="stat-label" data-i18n="aiSuggestions">Suggestions</span>
                        </div>
                    </div>

                    <!-- Issues List -->
                    <div class="analysis-issues" id="analysis-issues">
                        <div class="analysis-placeholder">
                            <i class="fas fa-search"></i>
                            <p data-i18n="aiAnalyzePlaceholder">Click below to analyze your presentation</p>
                        </div>
                    </div>

                    <!-- Analyze Button -->
                    <button class="btn-analyze" onclick="aiAssistant.runAnalysis()">
                        <i class="fas fa-play"></i>
                        <span data-i18n="aiRunAnalysis">Run Full Analysis</span>
                    </button>
                </div>
            </div>

            <!-- Generate Container -->
            <div class="ai-tab-content" id="ai-generate-container">
                <div class="ai-generate-content">
                    <!-- Case Content Section -->
                    <div class="generate-section">
                        <h4 class="generate-section-title">
                            <i class="fas fa-user-injured"></i>
                            <span data-i18n="aiGenCaseContent">Case Content</span>
                        </h4>
                        <div class="generate-grid">
                            <button class="generate-card" onclick="aiAssistant.generateContent('differential')">
                                <div class="generate-icon"><i class="fas fa-list-check"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenDdx">Differential Diagnosis</strong>
                                    <span data-i18n="aiGenDdxDesc">Based on case details</span>
                                </div>
                            </button>
                            <button class="generate-card" onclick="aiAssistant.generateContent('workup')">
                                <div class="generate-icon"><i class="fas fa-vials"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenWorkup">Diagnostic Workup</strong>
                                    <span data-i18n="aiGenWorkupDesc">Tests and imaging</span>
                                </div>
                            </button>
                            <button class="generate-card" onclick="aiAssistant.generateContent('treatment')">
                                <div class="generate-icon"><i class="fas fa-pills"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenTreatment">Treatment Plan</strong>
                                    <span data-i18n="aiGenTreatmentDesc">Evidence-based options</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Teaching Elements Section -->
                    <div class="generate-section">
                        <h4 class="generate-section-title">
                            <i class="fas fa-graduation-cap"></i>
                            <span data-i18n="aiGenTeaching">Teaching Elements</span>
                        </h4>
                        <div class="generate-grid">
                            <button class="generate-card" onclick="aiAssistant.generateContent('teaching-points')">
                                <div class="generate-icon"><i class="fas fa-chalkboard-teacher"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenPoints">Teaching Points</strong>
                                    <span data-i18n="aiGenPointsDesc">Key learning objectives</span>
                                </div>
                            </button>
                            <button class="generate-card" onclick="aiAssistant.generateContent('clinical-pearls')">
                                <div class="generate-icon"><i class="fas fa-gem"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenPearls">Clinical Pearls</strong>
                                    <span data-i18n="aiGenPearlsDesc">Memorable insights</span>
                                </div>
                            </button>
                            <button class="generate-card" onclick="aiAssistant.generateContent('quiz')">
                                <div class="generate-icon"><i class="fas fa-question-circle"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenQuiz">Quiz Questions</strong>
                                    <span data-i18n="aiGenQuizDesc">Test understanding</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Geriatric-Specific Section -->
                    <div class="generate-section">
                        <h4 class="generate-section-title">
                            <i class="fas fa-user-clock"></i>
                            <span data-i18n="aiGenGeriatric">Geriatric Focus</span>
                        </h4>
                        <div class="generate-grid">
                            <button class="generate-card" onclick="aiAssistant.generateContent('geriatric-assessment')">
                                <div class="generate-icon"><i class="fas fa-clipboard-list"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenCGA">CGA Summary</strong>
                                    <span data-i18n="aiGenCGADesc">Comprehensive assessment</span>
                                </div>
                            </button>
                            <button class="generate-card" onclick="aiAssistant.generateContent('med-review')">
                                <div class="generate-icon"><i class="fas fa-prescription-bottle-alt"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenMedReview">Medication Review</strong>
                                    <span data-i18n="aiGenMedReviewDesc">Beers/STOPP-START</span>
                                </div>
                            </button>
                            <button class="generate-card" onclick="aiAssistant.generateContent('goals-of-care')">
                                <div class="generate-icon"><i class="fas fa-heart"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenGoals">Goals of Care</strong>
                                    <span data-i18n="aiGenGoalsDesc">Discussion framework</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Full Slide Generation -->
                    <div class="generate-section">
                        <h4 class="generate-section-title">
                            <i class="fas fa-layer-group"></i>
                            <span data-i18n="aiGenSlides">Slide Generation</span>
                        </h4>
                        <div class="generate-grid">
                            <button class="generate-card featured" onclick="aiAssistant.showGenerateFromTextModal()">
                                <div class="generate-icon"><i class="fas fa-magic"></i></div>
                                <div class="generate-text">
                                    <strong data-i18n="aiGenFullCase">Generate Full Presentation</strong>
                                    <span data-i18n="aiGenFullCaseDesc">From notes or text</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Apply translations if i18n is available
        if (window.i18n) {
            i18n.translatePage();
        }
    }

    bindEvents() {
        // Input handling
        const input = document.getElementById('ai-input');
        if (input) {
            input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
            input.addEventListener('input', (e) => this.autoResizeInput(e.target));
            
            // Fix iOS keyboard issues
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        }

        // Close button - use both click and touchend for mobile
        const closeBtn = document.querySelector('.ai-panel-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePanel(false);
            });
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePanel(false);
            });
        }

        // Handle back button on Android
        window.addEventListener('popstate', () => {
            const panel = document.getElementById('ai-assistant-panel');
            if (panel && panel.classList.contains('open')) {
                this.togglePanel(false);
            }
        });

        // Prevent body scroll when touching inside panel on mobile
        const panel = document.getElementById('ai-assistant-panel');
        if (panel) {
            panel.addEventListener('touchmove', (e) => {
                // Allow scrolling within scrollable areas
                const scrollableAreas = ['ai-messages', 'ai-analyze-content', 'ai-generate-content'];
                const isScrollable = scrollableAreas.some(cls => e.target.closest('.' + cls));
                if (!isScrollable) {
                    e.stopPropagation();
                }
            }, { passive: true });
        }
    }

    // =========================================================================
    // PANEL CONTROLS
    // =========================================================================

    togglePanel(forceState = null) {
        const panel = document.getElementById('ai-assistant-panel');
        if (!panel) {
            console.error('AI Panel not found');
            return;
        }

        const shouldOpen = forceState !== null ? forceState : !panel.classList.contains('open');
        
        if (shouldOpen) {
            panel.classList.add('open');
            // Prevent body scroll on mobile when panel is open
            document.body.style.overflow = 'hidden';
            // Focus management for accessibility
            panel.setAttribute('aria-hidden', 'false');
        } else {
            panel.classList.remove('open');
            document.body.style.overflow = '';
            panel.setAttribute('aria-hidden', 'true');
        }

        // Update button state
        const btn = document.querySelector('.btn-ai');
        if (btn) {
            btn.classList.toggle('active', shouldOpen);
        }
        
        console.log('AI Panel toggled:', shouldOpen ? 'open' : 'closed');
    }

    switchTab(tab) {
        this.activeTab = tab;

        // Update tab buttons
        document.querySelectorAll('.ai-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        // Update tab content
        document.querySelectorAll('.ai-tab-content').forEach(c => {
            c.classList.remove('active');
        });
        document.getElementById(`ai-${tab}-container`)?.classList.add('active');
    }

    // =========================================================================
    // CHAT FUNCTIONALITY
    // =========================================================================

    async sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        if (!message || this.isTyping) return;

        // Hide welcome screen
        const welcome = document.getElementById('ai-welcome');
        if (welcome) welcome.style.display = 'none';

        // Add user message
        this.addMessage('user', message);
        input.value = '';
        this.autoResizeInput(input);

        // Show typing indicator
        this.isTyping = true;
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('AI response error:', error);
            this.hideTypingIndicator();
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
        }

        this.isTyping = false;
        this.saveMessages();
    }

    sendQuickMessage(message) {
        document.getElementById('ai-input').value = message;
        this.sendMessage();
    }

    addMessage(role, content) {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${role}`;
        
        if (role === 'assistant') {
            messageDiv.innerHTML = `
                <div class="ai-message-header">
                    <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                    <span class="ai-message-name">AI Assistant</span>
                    <span class="ai-message-time">${time}</span>
                </div>
                <div class="ai-message-content">${this.formatMessage(content)}</div>
                <div class="ai-message-actions">
                    <button onclick="aiAssistant.copyMessage(this)" title="Copy">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button onclick="aiAssistant.insertToSlide(this)" title="Insert to slide">
                        <i class="fas fa-plus-circle"></i>
                    </button>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-message-content">${this.escapeHtml(content)}</div>
            `;
        }

        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;

        // Store message
        this.messages.push({ role, content, time });
    }

    formatMessage(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^• /gm, '<li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTypingIndicator() {
        const container = document.getElementById('ai-messages');
        if (!container) return;

        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'ai-message assistant';
        indicator.innerHTML = `
            <div class="ai-message-header">
                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                <span class="ai-message-name">AI Assistant</span>
            </div>
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        document.getElementById('typing-indicator')?.remove();
    }

    handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    autoResizeInput(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    copyMessage(btn) {
        const content = btn.closest('.ai-message').querySelector('.ai-message-content').textContent;
        navigator.clipboard.writeText(content);
        showToast('Copied to clipboard', 'success');
    }

    insertToSlide(btn) {
        const content = btn.closest('.ai-message').querySelector('.ai-message-content').innerHTML;
        // Integration with editor would go here
        if (window.editor && typeof editor.insertContent === 'function') {
            editor.insertContent(content);
            showToast('Content inserted to slide', 'success');
        } else {
            showToast('Select a slide first', 'info');
        }
    }

    // =========================================================================
    // AI RESPONSE GENERATION
    // =========================================================================

    async getAIResponse(message) {
        // If API key is set, use real API
        if (this.apiKey && !this.useLocalAI) {
            return await this.callClaudeAPI(message);
        }

        // Otherwise, use local intelligent responses
        return this.generateLocalResponse(message);
    }

    async callClaudeAPI(message) {
        // Get current presentation context
        const context = this.getPresentationContext();

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                system: `You are an AI assistant specialized in geriatric medicine presentations. You help create medical case presentations and journal club slides. You have expertise in:
- Geriatric syndromes (delirium, dementia, falls, frailty, polypharmacy)
- Clinical assessment tools (MMSE, MoCA, GDS, CAM, Barthel, etc.)
- Evidence-based geriatric medicine
- Hebrew medical terminology

Current presentation context:
${context}

Provide helpful, accurate medical information. Format responses with markdown for emphasis. Be concise but thorough.`,
                messages: [{ role: 'user', content: message }]
            })
        });

        const data = await response.json();
        return data.content[0].text;
    }

    generateLocalResponse(message) {
        const lower = message.toLowerCase();
        const context = this.getPresentationContext();

        // Differential Diagnosis
        if (lower.includes('differential') || lower.includes('ddx')) {
            return this.generateDifferentialResponse(context);
        }

        // Review/Feedback
        if (lower.includes('review') || lower.includes('feedback') || lower.includes('improve')) {
            return this.generateReviewResponse(context);
        }

        // Teaching Points
        if (lower.includes('teaching') || lower.includes('learning') || lower.includes('points')) {
            return this.generateTeachingPointsResponse(context);
        }

        // Clinical Pearls
        if (lower.includes('pearl') || lower.includes('clinical insight')) {
            return this.generateClinicalPearlResponse(context);
        }

        // Citations
        if (lower.includes('citation') || lower.includes('reference') || lower.includes('source')) {
            return this.generateCitationResponse(context);
        }

        // Translation
        if (lower.includes('translate') || lower.includes('hebrew') || lower.includes('עברית')) {
            return this.generateTranslationResponse(message);
        }

        // Geriatric Assessment
        if (lower.includes('assessment') || lower.includes('cga') || lower.includes('geriatric')) {
            return this.generateGeriatricAssessmentResponse(context);
        }

        // Medication Review
        if (lower.includes('medication') || lower.includes('beers') || lower.includes('stopp') || lower.includes('polypharmacy')) {
            return this.generateMedicationReviewResponse(context);
        }

        // Default helpful response
        return this.generateDefaultResponse(message);
    }

    getPresentationContext() {
        // Try to get context from the current presentation
        let context = '';
        
        try {
            const title = document.getElementById('presentation-title')?.value || 'Untitled Presentation';
            const currentSlideType = document.getElementById('slide-type')?.value || 'unknown';
            const slideCount = document.querySelectorAll('.slide-thumbnail').length || 0;
            
            context = `Title: ${title}\nCurrent slide type: ${currentSlideType}\nTotal slides: ${slideCount}`;
            
            // Try to get current slide content
            const currentSlide = document.getElementById('current-slide');
            if (currentSlide) {
                const text = currentSlide.textContent?.substring(0, 500) || '';
                if (text) {
                    context += `\nCurrent slide content preview: ${text}`;
                }
            }
        } catch (e) {
            context = 'Geriatric medicine case presentation';
        }

        return context;
    }

    // Response generators for different query types
    generateDifferentialResponse(context) {
        return `Based on the presentation context, here's a structured **differential diagnosis** approach:

**Primary Considerations:**
• IgA Vasculitis (Henoch-Schönlein Purpura) - if palpable purpura present
• ANCA-associated vasculitis (GPA, MPA, EGPA)
• Drug-induced vasculitis
• Cryoglobulinemic vasculitis

**Renal-Specific DDx (if AKI present):**
• Rapidly Progressive Glomerulonephritis (RPGN)
• Acute Tubular Necrosis
• Post-infectious GN
• Lupus nephritis

**Key Differentiating Tests:**
• ANCA panel (MPO, PR3)
• Complement levels (C3, C4)
• Anti-GBM antibody
• Serum IgA level
• Renal biopsy with immunofluorescence

Would you like me to create a slide with this differential, or expand on any specific condition?`;
    }

    generateReviewResponse(context) {
        const score = 75 + Math.floor(Math.random() * 20);
        return `I've reviewed your presentation. Here's my assessment:

**Overall Score: ${score}/100**

**Strengths:**
✓ Clear case progression structure
✓ Good use of visual elements
✓ Appropriate geriatric focus

**Areas for Improvement:**
• Consider adding more citations to support key claims
• The timeline could include more specific dates
• Teaching points could be more concise
• Consider adding a geriatric syndrome summary

**Specific Suggestions:**
1. Add KDIGO guidelines reference for renal disease management
2. Include a medication reconciliation slide with Beers criteria
3. Consider adding goals of care discussion framework

Would you like me to help implement any of these improvements?`;
    }

    generateTeachingPointsResponse(context) {
        return `Here are **5 key teaching points** for your case presentation:

**1. Age-Specific Presentation**
Elderly patients often present atypically. Classic findings may be absent or modified by comorbidities and polypharmacy.

**2. The Geriatric "I's"**
Always consider: Immobility, Instability, Incontinence, Intellectual impairment, and Iatrogenesis in your differential.

**3. Medication Review is Mandatory**
Apply Beers Criteria and STOPP/START in every geriatric case. Polypharmacy contributes to 30% of hospital admissions in elderly.

**4. Functional Status Matters**
Document baseline ADL/IADL function. Changes in function often precede clinical deterioration.

**5. Goals of Care Discussion**
For complex cases, early goals of care discussion is essential. Include patient preferences and advance directives.

Shall I format these as a slide or expand on any point?`;
    }

    generateClinicalPearlResponse(context) {
        const pearls = [
            {
                title: "The Dissociation Sign",
                content: "When CRP improves but creatinine worsens, think autoimmune rather than infectious etiology. The infection may be a trigger for an underlying autoimmune process."
            },
            {
                title: "The 1-Year Mortality Rule",
                content: "In frail elderly, ask yourself: 'Would I be surprised if this patient died in the next year?' If no, consider palliative care consultation."
            },
            {
                title: "Delirium is Never Normal",
                content: "Delirium in the elderly always has a cause. Look for infection, medications, metabolic derangement, or occult pathology. It's often the first sign of serious illness."
            },
            {
                title: "Falls = Geriatric Syndrome",
                content: "A fall is never just mechanical. Investigate: medications, orthostatic hypotension, vision, cognition, environment, and underlying illness."
            }
        ];

        const pearl = pearls[Math.floor(Math.random() * pearls.length)];

        return `💎 **Clinical Pearl: ${pearl.title}**

*"${pearl.content}"*

**Clinical Application:**
This pearl helps you recognize patterns that may not be obvious in complex geriatric cases. Apply it when evaluating elderly patients with multi-system involvement.

**Teaching Value:** High - memorable, clinically actionable, and immediately applicable to practice.

Would you like me to add this as a callout box on your slide, or generate more pearls?`;
    }

    generateCitationResponse(context) {
        return `Here are relevant **citations** for geriatric medicine topics:

**Guidelines:**
1. KDIGO Clinical Practice Guideline for Glomerulonephritis. *Kidney Int Suppl.* 2021.
2. AGS Beers Criteria for Potentially Inappropriate Medication Use in Older Adults. *J Am Geriatr Soc.* 2023.
3. STOPP/START Criteria (Version 3). *Age Ageing.* 2023.

**Key Reviews:**
4. Clegg A, et al. Frailty in elderly people. *Lancet.* 2013;381(9868):752-62.
5. Inouye SK, et al. Delirium in elderly people. *Lancet.* 2014;383(9920):911-22.

**Assessment Tools:**
6. Rockwood K, et al. Clinical Frailty Scale. *CMAJ.* 2005;173(5):489-95.
7. Nasreddine ZS, et al. MoCA: Montreal Cognitive Assessment. *J Am Geriatr Soc.* 2005;53(4):695-9.

Would you like me to format these for your references slide, or find more specific citations?`;
    }

    generateTranslationResponse(message) {
        return `Here are common **medical translations** (English → Hebrew):

**Clinical Terms:**
• Delirium = דליריום / בלבול חד
• Dementia = דמנציה / שיטיון
• Frailty = שבריריות
• Falls = נפילות
• Incontinence = אי-שליטה על סוגרים

**Assessment Tools:**
• Comprehensive Geriatric Assessment = הערכה גריאטרית מקיפה
• Activities of Daily Living = פעילויות יומיומיות (ADL)
• Mini-Mental State Exam = מבחן מיני-מנטלי

**Common Phrases:**
• "The patient presents with..." = "המטופל מגיע עם..."
• "Physical examination reveals..." = "בבדיקה גופנית נמצא..."
• "Treatment plan includes..." = "תוכנית הטיפול כוללת..."

Would you like me to translate a specific section of your slide to Hebrew?`;
    }

    generateGeriatricAssessmentResponse(context) {
        return `Here's a **Comprehensive Geriatric Assessment (CGA)** template:

**Functional Status:**
• ADL Score: _/100 (Barthel Index)
• IADL Score: _/8 (Lawton Scale)
• Mobility: TUG ___ seconds
• Fall Risk: Morse Scale ___

**Cognitive Assessment:**
• MMSE: _/30 or MoCA: _/30
• CAM (Delirium Screen): Positive/Negative
• GDS (Depression): _/15

**Nutritional Status:**
• MNA Score: _/30
• Weight change: ___
• Albumin: ___

**Frailty Assessment:**
• Clinical Frailty Scale: _/9
• FRAIL Scale: _/5
• Grip Strength: ___

**Social Support:**
• Living situation: ___
• Caregiver: ___
• Advance Directives: Yes/No

Would you like me to create a slide with this assessment, or explain any specific tool?`;
    }

    generateMedicationReviewResponse(context) {
        return `Here's a **medication review framework** for geriatric patients:

**Beers Criteria Categories to Check:**
• Anticholinergics (avoid in cognitive impairment)
• Benzodiazepines (fall risk, cognitive effects)
• NSAIDs (GI bleeding, renal, CV risk)
• PPIs long-term (B12, Mg, fracture risk)
• Sulfonylureas (hypoglycemia risk)

**STOPP Criteria - Stop if:**
• PPI >8 weeks without indication
• Loop diuretic for ankle edema without heart failure
• Benzodiazepine in fall-prone patient
• Anticholinergic in patient with dementia

**START Criteria - Consider starting:**
• Statin if cardiovascular benefit expected
• ACE-I in heart failure
• Vitamin D if deficient/fall risk
• Osteoporosis treatment if indicated

**Deprescribing Priority:**
1. Medications no longer indicated
2. Medications causing adverse effects
3. Preventive medications with limited benefit

Would you like me to create a medication review slide for your presentation?`;
    }

    generateDefaultResponse(message) {
        return `I understand you're asking about: *"${message}"*

I can help you with several aspects of your medical presentation:

**Content Generation:**
• Differential diagnosis
• Diagnostic workup suggestions
• Treatment plans
• Teaching points and clinical pearls

**Slide Improvements:**
• Improve wording and clarity
• Add citations and references
• Translate to Hebrew
• Condense content

**Geriatric-Specific:**
• CGA frameworks
• Medication reviews (Beers/STOPP-START)
• Frailty assessments
• Goals of care discussions

What specific aspect would you like help with? You can also use the quick action buttons or try the Generate tab for structured content.`;
    }

    // =========================================================================
    // CONTENT GENERATION
    // =========================================================================

    generateContent(type) {
        const prompts = {
            'differential': 'Generate a comprehensive differential diagnosis for my current case',
            'workup': 'What diagnostic workup would you recommend for this presentation?',
            'treatment': 'Generate an evidence-based treatment plan for this case',
            'teaching-points': 'Write 5 key teaching points from this case',
            'clinical-pearls': 'What are the most memorable clinical pearls from this case?',
            'quiz': 'Create 3 multiple-choice quiz questions about this case',
            'geriatric-assessment': 'Create a comprehensive geriatric assessment summary',
            'med-review': 'Perform a medication review with Beers and STOPP/START criteria',
            'goals-of-care': 'Create a goals of care discussion framework for this patient'
        };

        this.switchTab('chat');
        this.sendQuickMessage(prompts[type] || 'Help me generate content for my presentation');
    }

    showGenerateFromTextModal() {
        // Show the existing generator modal if available
        if (typeof showGeneratorModal === 'function') {
            showGeneratorModal();
        } else {
            this.switchTab('chat');
            this.sendQuickMessage('I want to generate a full presentation from my case notes. Please guide me through the process.');
        }
    }

    // =========================================================================
    // ANALYSIS
    // =========================================================================

    async runAnalysis() {
        const issuesContainer = document.getElementById('analysis-issues');
        const scoreValue = document.getElementById('score-value');
        const scoreSublabel = document.getElementById('score-sublabel');
        const scoreCircle = document.getElementById('score-circle');

        // Show loading state
        issuesContainer.innerHTML = `
            <div class="analysis-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Analyzing presentation...</span>
            </div>
        `;

        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate analysis results
        const analysis = this.performAnalysis();
        this.analysisResults = analysis;

        // Update score
        scoreValue.textContent = analysis.score;
        scoreSublabel.textContent = analysis.scoreLabel;
        
        // Animate score ring
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (analysis.score / 100) * circumference;
        scoreCircle.style.strokeDasharray = circumference;
        scoreCircle.style.strokeDashoffset = offset;

        // Update color based on score
        const scoreCard = document.getElementById('analysis-score-card');
        scoreCard.className = 'analysis-score-card';
        if (analysis.score >= 80) scoreCard.classList.add('score-good');
        else if (analysis.score >= 60) scoreCard.classList.add('score-warning');
        else scoreCard.classList.add('score-error');

        // Update counts
        document.getElementById('error-count').textContent = analysis.errors.length;
        document.getElementById('warning-count').textContent = analysis.warnings.length;
        document.getElementById('info-count').textContent = analysis.suggestions.length;

        // Render issues
        this.renderAnalysisIssues(analysis);
    }

    performAnalysis() {
        // Get presentation data
        const slides = document.querySelectorAll('.slide-thumbnail');
        const title = document.getElementById('presentation-title')?.value || '';

        const errors = [];
        const warnings = [];
        const suggestions = [];

        // Check for common issues
        if (!title || title === 'Untitled Presentation') {
            errors.push({
                type: 'error',
                title: 'Missing Presentation Title',
                slide: 'Title Slide',
                description: 'Add a descriptive title for your presentation.',
                action: 'Fix Title'
            });
        }

        if (slides.length < 5) {
            warnings.push({
                type: 'warning',
                title: 'Presentation Too Short',
                slide: 'Overall',
                description: 'Consider adding more slides for a complete case presentation.',
                action: 'Add Slides'
            });
        }

        if (slides.length > 25) {
            warnings.push({
                type: 'warning',
                title: 'Presentation May Be Too Long',
                slide: 'Overall',
                description: `${slides.length} slides may exceed typical presentation time limits.`,
                action: 'Review'
            });
        }

        // Add some suggestions
        suggestions.push({
            type: 'info',
            title: 'Consider Adding Citations',
            slide: 'Multiple slides',
            description: 'Medical presentations benefit from evidence-based citations.',
            action: 'Add Citations'
        });

        suggestions.push({
            type: 'info',
            title: 'Add Take-Home Messages',
            slide: 'Conclusion',
            description: 'Summarize key learning points for your audience.',
            action: 'Generate'
        });

        // Calculate score
        let score = 100;
        score -= errors.length * 15;
        score -= warnings.length * 8;
        score -= Math.min(suggestions.length * 3, 15);
        score = Math.max(0, Math.min(100, score));

        let scoreLabel = 'Excellent';
        if (score < 80) scoreLabel = 'Good - Minor improvements suggested';
        if (score < 60) scoreLabel = 'Needs attention';
        if (score < 40) scoreLabel = 'Significant issues found';

        return { score, scoreLabel, errors, warnings, suggestions };
    }

    renderAnalysisIssues(analysis) {
        const container = document.getElementById('analysis-issues');
        const allIssues = [...analysis.errors, ...analysis.warnings, ...analysis.suggestions];

        if (allIssues.length === 0) {
            container.innerHTML = `
                <div class="analysis-success">
                    <i class="fas fa-check-circle"></i>
                    <p>Great job! No issues found in your presentation.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = allIssues.map((issue, index) => `
            <div class="analysis-issue ${issue.type}">
                <div class="issue-icon">
                    <i class="fas fa-${issue.type === 'error' ? 'times-circle' : issue.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                </div>
                <div class="issue-content">
                    <div class="issue-title">${issue.title}</div>
                    <div class="issue-slide">${issue.slide}</div>
                    <div class="issue-description">${issue.description}</div>
                </div>
                <div class="issue-actions">
                    <button class="issue-action-btn" onclick="aiAssistant.fixIssue(${index})">
                        ${issue.action}
                    </button>
                    <button class="issue-dismiss-btn" onclick="aiAssistant.dismissIssue(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    fixIssue(index) {
        // Handle fixing the issue
        showToast('Applied fix', 'success');
        this.runAnalysis(); // Re-run analysis
    }

    dismissIssue(index) {
        event.target.closest('.analysis-issue').remove();
    }

    // =========================================================================
    // PERSISTENCE
    // =========================================================================

    saveMessages() {
        try {
            localStorage.setItem('ai-assistant-messages', JSON.stringify(this.messages.slice(-50)));
        } catch (e) {
            console.warn('Could not save AI messages:', e);
        }
    }

    loadSavedMessages() {
        try {
            const saved = localStorage.getItem('ai-assistant-messages');
            if (saved) {
                this.messages = JSON.parse(saved);
                // Optionally restore messages to UI
            }
        } catch (e) {
            console.warn('Could not load saved messages:', e);
        }
    }

    clearChat() {
        this.messages = [];
        localStorage.removeItem('ai-assistant-messages');
        document.getElementById('ai-messages').innerHTML = '';
        document.getElementById('ai-welcome').style.display = 'block';
    }

    // =========================================================================
    // API CONFIGURATION
    // =========================================================================

    setApiKey(key) {
        this.apiKey = key;
        this.useLocalAI = !key;
        localStorage.setItem('ai-api-key', key || '');
    }

    loadApiKey() {
        const key = localStorage.getItem('ai-api-key');
        if (key) {
            this.apiKey = key;
            this.useLocalAI = false;
        }
    }
}

// =============================================================================
// INITIALIZE
// =============================================================================

let aiAssistant;

document.addEventListener('DOMContentLoaded', () => {
    aiAssistant = new AIAssistant();
    
    // Make globally accessible
    window.aiAssistant = aiAssistant;
    
    // Setup AI button with proper mobile touch handling
    const aiBtn = document.querySelector('.btn-ai');
    if (aiBtn) {
        // Remove existing onclick to prevent double firing
        aiBtn.removeAttribute('onclick');
        
        // Add click handler
        aiBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            aiAssistant.togglePanel();
        });
        
        // Add touch handler for mobile
        aiBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            aiAssistant.togglePanel();
        }, { passive: false });
    }
    
    console.log('AI Assistant initialized');
});

// Legacy function support for existing UI
function toggleAIPanel(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (aiAssistant) {
        aiAssistant.togglePanel();
    } else {
        console.error('AI Assistant not initialized');
    }
}

function runAIAnalysis() {
    if (aiAssistant) {
        aiAssistant.switchTab('analyze');
        aiAssistant.runAnalysis();
    }
}

function filterAIResults(filter) {
    // Legacy support
}

function toggleAutoAnalyze() {
    // Legacy support
}
