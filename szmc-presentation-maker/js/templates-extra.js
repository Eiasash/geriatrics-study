// SZMC Geriatrics Presentation Maker - Additional Templates

const ExtraSlideTemplates = {

    // ==================== DIAGNOSTIC WORKUP ====================
    'diagnostic-workup': {
        name: 'Diagnostic Workup',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2><i class="fas fa-vials" style="margin-right: 12px; color: var(--secondary);"></i>Diagnostic Workup</h2>
                <div class="workup-grid">
                    <div class="workup-column">
                        <div class="workup-section urgent">
                            <div class="workup-header"><i class="fas fa-exclamation-circle"></i> Urgent / STAT</div>
                            <div class="workup-content" contenteditable="true" data-field="urgent" data-placeholder="• CBC, BMP, Lactate&#10;• ECG&#10;• Chest X-ray">${data.urgent || ''}</div>
                        </div>
                        <div class="workup-section routine">
                            <div class="workup-header"><i class="fas fa-flask"></i> Routine Labs</div>
                            <div class="workup-content" contenteditable="true" data-field="routine" data-placeholder="• LFTs, TSH&#10;• Urinalysis&#10;• B12, Folate">${data.routine || ''}</div>
                        </div>
                    </div>
                    <div class="workup-column">
                        <div class="workup-section imaging">
                            <div class="workup-header"><i class="fas fa-x-ray"></i> Imaging</div>
                            <div class="workup-content" contenteditable="true" data-field="imaging" data-placeholder="• CT/MRI&#10;• Ultrasound&#10;• Echo">${data.imaging || ''}</div>
                        </div>
                        <div class="workup-section special">
                            <div class="workup-header"><i class="fas fa-microscope"></i> Special Tests</div>
                            <div class="workup-content" contenteditable="true" data-field="special" data-placeholder="• LP&#10;• EEG&#10;• Biopsy">${data.special || ''}</div>
                        </div>
                    </div>
                </div>
                <div class="workup-rationale">
                    <h4><i class="fas fa-lightbulb"></i> Clinical Rationale</h4>
                    <div contenteditable="true" data-field="rationale" data-placeholder="Explain why each test was ordered...">${data.rationale || ''}</div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== PROS/CONS ====================
    'pros-cons': {
        name: 'Pros & Cons',
        category: 'general',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="title" data-placeholder="Treatment Options Comparison">${data.title || ''}</h2>
                <div class="pros-cons-container">
                    <div class="pros-section">
                        <div class="pros-header">
                            <i class="fas fa-thumbs-up"></i>
                            <span contenteditable="true" data-field="prosTitle">${data.prosTitle || 'Advantages'}</span>
                        </div>
                        <div class="pros-list" contenteditable="true" data-field="pros" data-placeholder="• Benefit 1&#10;• Benefit 2&#10;• Benefit 3">${data.pros || ''}</div>
                    </div>
                    <div class="cons-section">
                        <div class="cons-header">
                            <i class="fas fa-thumbs-down"></i>
                            <span contenteditable="true" data-field="consTitle">${data.consTitle || 'Disadvantages'}</span>
                        </div>
                        <div class="cons-list" contenteditable="true" data-field="cons" data-placeholder="• Risk 1&#10;• Risk 2&#10;• Risk 3">${data.cons || ''}</div>
                    </div>
                </div>
                <div class="verdict-box">
                    <i class="fas fa-balance-scale"></i>
                    <div contenteditable="true" data-field="verdict" data-placeholder="Overall recommendation or verdict...">${data.verdict || ''}</div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== CASE SUMMARY ====================
    'case-summary': {
        name: 'Case Summary',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content slide-case-summary">
                <h2><i class="fas fa-clipboard-list" style="margin-right: 12px; color: var(--secondary);"></i>Case Summary</h2>
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-icon patient"><i class="fas fa-user"></i></div>
                        <div class="summary-content">
                            <h4>Patient</h4>
                            <p contenteditable="true" data-field="patient" data-placeholder="Age, sex, key history">${data.patient || ''}</p>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon presentation"><i class="fas fa-notes-medical"></i></div>
                        <div class="summary-content">
                            <h4>Presentation</h4>
                            <p contenteditable="true" data-field="presentation" data-placeholder="Chief complaint and key findings">${data.presentation || ''}</p>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon diagnosis"><i class="fas fa-stethoscope"></i></div>
                        <div class="summary-content">
                            <h4>Diagnosis</h4>
                            <p contenteditable="true" data-field="diagnosis" data-placeholder="Primary and secondary diagnoses">${data.diagnosis || ''}</p>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon treatment"><i class="fas fa-prescription"></i></div>
                        <div class="summary-content">
                            <h4>Management</h4>
                            <p contenteditable="true" data-field="management" data-placeholder="Key interventions">${data.management || ''}</p>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon outcome"><i class="fas fa-chart-line"></i></div>
                        <div class="summary-content">
                            <h4>Outcome</h4>
                            <p contenteditable="true" data-field="outcome" data-placeholder="Patient outcome and disposition">${data.outcome || ''}</p>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon learning"><i class="fas fa-graduation-cap"></i></div>
                        <div class="summary-content">
                            <h4>Key Learning</h4>
                            <p contenteditable="true" data-field="learning" data-placeholder="Main teaching point">${data.learning || ''}</p>
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== QUIZ/QUESTION ====================
    'quiz': {
        name: 'Quiz Question',
        category: 'interactive',
        render: (data) => `
            <div class="slide slide-content slide-quiz">
                <div class="quiz-header">
                    <span class="quiz-label">Question</span>
                    <span class="quiz-number" contenteditable="true" data-field="qNum">${data.qNum || '#1'}</span>
                </div>
                <div class="quiz-question" contenteditable="true" data-field="question" data-placeholder="Enter your question here...">${data.question || ''}</div>
                <div class="quiz-options">
                    <div class="quiz-option ${data.correct === 'A' ? 'correct' : ''}" data-option="A">
                        <span class="option-letter">A</span>
                        <span class="option-text" contenteditable="true" data-field="optionA" data-placeholder="Option A">${data.optionA || ''}</span>
                    </div>
                    <div class="quiz-option ${data.correct === 'B' ? 'correct' : ''}" data-option="B">
                        <span class="option-letter">B</span>
                        <span class="option-text" contenteditable="true" data-field="optionB" data-placeholder="Option B">${data.optionB || ''}</span>
                    </div>
                    <div class="quiz-option ${data.correct === 'C' ? 'correct' : ''}" data-option="C">
                        <span class="option-letter">C</span>
                        <span class="option-text" contenteditable="true" data-field="optionC" data-placeholder="Option C">${data.optionC || ''}</span>
                    </div>
                    <div class="quiz-option ${data.correct === 'D' ? 'correct' : ''}" data-option="D">
                        <span class="option-letter">D</span>
                        <span class="option-text" contenteditable="true" data-field="optionD" data-placeholder="Option D">${data.optionD || ''}</span>
                    </div>
                </div>
                <div class="quiz-answer" style="display: ${data.showAnswer ? 'block' : 'none'}">
                    <h4><i class="fas fa-check-circle"></i> Answer: <span contenteditable="true" data-field="correct">${data.correct || 'A'}</span></h4>
                    <p contenteditable="true" data-field="explanation" data-placeholder="Explanation...">${data.explanation || ''}</p>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: { correct: 'A' }
    },

    // ==================== EVIDENCE SUMMARY ====================
    'evidence-summary': {
        name: 'Evidence Summary',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2><i class="fas fa-file-medical-alt" style="margin-right: 12px; color: var(--secondary);"></i>Evidence Summary</h2>
                <div class="evidence-grid">
                    <div class="evidence-card high">
                        <div class="evidence-header">
                            <span class="evidence-grade">⊕⊕⊕⊕</span>
                            <span>High Quality</span>
                        </div>
                        <div class="evidence-content" contenteditable="true" data-field="highEvidence" data-placeholder="Studies with high quality evidence...">${data.highEvidence || ''}</div>
                    </div>
                    <div class="evidence-card moderate">
                        <div class="evidence-header">
                            <span class="evidence-grade">⊕⊕⊕○</span>
                            <span>Moderate Quality</span>
                        </div>
                        <div class="evidence-content" contenteditable="true" data-field="modEvidence" data-placeholder="Studies with moderate quality evidence...">${data.modEvidence || ''}</div>
                    </div>
                    <div class="evidence-card low">
                        <div class="evidence-header">
                            <span class="evidence-grade">⊕⊕○○</span>
                            <span>Low Quality</span>
                        </div>
                        <div class="evidence-content" contenteditable="true" data-field="lowEvidence" data-placeholder="Studies with low quality evidence...">${data.lowEvidence || ''}</div>
                    </div>
                    <div class="evidence-card very-low">
                        <div class="evidence-header">
                            <span class="evidence-grade">⊕○○○</span>
                            <span>Very Low Quality</span>
                        </div>
                        <div class="evidence-content" contenteditable="true" data-field="veryLowEvidence" data-placeholder="Expert opinion, case reports...">${data.veryLowEvidence || ''}</div>
                    </div>
                </div>
                <div class="evidence-recommendation">
                    <h4>Recommendation Strength</h4>
                    <div class="recommendation-scale">
                        <div class="rec-strong-for ${data.recommendation === 'strong-for' ? 'active' : ''}">Strong For</div>
                        <div class="rec-weak-for ${data.recommendation === 'weak-for' ? 'active' : ''}">Weak For</div>
                        <div class="rec-neutral ${data.recommendation === 'neutral' ? 'active' : ''}">Neutral</div>
                        <div class="rec-weak-against ${data.recommendation === 'weak-against' ? 'active' : ''}">Weak Against</div>
                        <div class="rec-strong-against ${data.recommendation === 'strong-against' ? 'active' : ''}">Strong Against</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: { recommendation: 'weak-for' }
    },

    // ==================== GERIATRIC SYNDROMES ====================
    'geriatric-syndromes': {
        name: 'Geriatric Syndromes',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2><i class="fas fa-user-md" style="margin-right: 12px; color: var(--secondary);"></i>Geriatric Syndromes Assessment</h2>
                <div class="syndromes-grid">
                    <div class="syndrome-card ${data.delirium ? 'present' : ''}">
                        <div class="syndrome-icon"><i class="fas fa-brain"></i></div>
                        <h4>Delirium</h4>
                        <div class="syndrome-status" contenteditable="true" data-field="delirium" data-placeholder="CAM: +/-">${data.delirium || ''}</div>
                    </div>
                    <div class="syndrome-card ${data.dementia ? 'present' : ''}">
                        <div class="syndrome-icon"><i class="fas fa-head-side-virus"></i></div>
                        <h4>Dementia</h4>
                        <div class="syndrome-status" contenteditable="true" data-field="dementia" data-placeholder="MMSE/MoCA">${data.dementia || ''}</div>
                    </div>
                    <div class="syndrome-card ${data.depression ? 'present' : ''}">
                        <div class="syndrome-icon"><i class="fas fa-sad-tear"></i></div>
                        <h4>Depression</h4>
                        <div class="syndrome-status" contenteditable="true" data-field="depression" data-placeholder="GDS score">${data.depression || ''}</div>
                    </div>
                    <div class="syndrome-card ${data.falls ? 'present' : ''}">
                        <div class="syndrome-icon"><i class="fas fa-walking"></i></div>
                        <h4>Falls</h4>
                        <div class="syndrome-status" contenteditable="true" data-field="falls" data-placeholder="TUG, history">${data.falls || ''}</div>
                    </div>
                    <div class="syndrome-card ${data.incontinence ? 'present' : ''}">
                        <div class="syndrome-icon"><i class="fas fa-tint"></i></div>
                        <h4>Incontinence</h4>
                        <div class="syndrome-status" contenteditable="true" data-field="incontinence" data-placeholder="Type, severity">${data.incontinence || ''}</div>
                    </div>
                    <div class="syndrome-card ${data.malnutrition ? 'present' : ''}">
                        <div class="syndrome-icon"><i class="fas fa-weight"></i></div>
                        <h4>Malnutrition</h4>
                        <div class="syndrome-status" contenteditable="true" data-field="malnutrition" data-placeholder="MNA, BMI">${data.malnutrition || ''}</div>
                    </div>
                    <div class="syndrome-card ${data.polypharmacy ? 'present' : ''}">
                        <div class="syndrome-icon"><i class="fas fa-pills"></i></div>
                        <h4>Polypharmacy</h4>
                        <div class="syndrome-status" contenteditable="true" data-field="polypharmacy" data-placeholder="# medications">${data.polypharmacy || ''}</div>
                    </div>
                    <div class="syndrome-card ${data.frailty ? 'present' : ''}">
                        <div class="syndrome-icon"><i class="fas fa-user-injured"></i></div>
                        <h4>Frailty</h4>
                        <div class="syndrome-status" contenteditable="true" data-field="frailty" data-placeholder="CFS score">${data.frailty || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== GOALS OF CARE ====================
    'goals-of-care': {
        name: 'Goals of Care',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content slide-goals">
                <h2><i class="fas fa-heart" style="margin-right: 12px; color: var(--accent);"></i>Goals of Care Discussion</h2>
                <div class="goals-container">
                    <div class="goals-section patient-values">
                        <h3><i class="fas fa-user-heart"></i> Patient Values & Preferences</h3>
                        <div contenteditable="true" data-field="values" data-placeholder="What matters most to the patient? Quality of life priorities, cultural/religious considerations...">${data.values || ''}</div>
                    </div>
                    <div class="goals-grid">
                        <div class="goal-option ${data.goal === 'curative' ? 'selected' : ''}" data-goal="curative">
                            <div class="goal-icon"><i class="fas fa-heartbeat"></i></div>
                            <h4>Curative/Life-Prolonging</h4>
                            <p>Focus on treating disease and extending life</p>
                        </div>
                        <div class="goal-option ${data.goal === 'functional' ? 'selected' : ''}" data-goal="functional">
                            <div class="goal-icon"><i class="fas fa-walking"></i></div>
                            <h4>Functional Maintenance</h4>
                            <p>Maintain independence and quality of life</p>
                        </div>
                        <div class="goal-option ${data.goal === 'comfort' ? 'selected' : ''}" data-goal="comfort">
                            <div class="goal-icon"><i class="fas fa-hand-holding-heart"></i></div>
                            <h4>Comfort-Focused</h4>
                            <p>Prioritize symptom control and comfort</p>
                        </div>
                    </div>
                    <div class="goals-decisions">
                        <h3>Advance Directives</h3>
                        <div class="directive-grid">
                            <div class="directive-item">
                                <span class="directive-label">Code Status:</span>
                                <span class="directive-value" contenteditable="true" data-field="codeStatus">${data.codeStatus || ''}</span>
                            </div>
                            <div class="directive-item">
                                <span class="directive-label">Intubation:</span>
                                <span class="directive-value" contenteditable="true" data-field="intubation">${data.intubation || ''}</span>
                            </div>
                            <div class="directive-item">
                                <span class="directive-label">Feeding Tube:</span>
                                <span class="directive-value" contenteditable="true" data-field="feeding">${data.feeding || ''}</span>
                            </div>
                            <div class="directive-item">
                                <span class="directive-label">Healthcare Proxy:</span>
                                <span class="directive-value" contenteditable="true" data-field="proxy">${data.proxy || ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: { goal: 'functional' }
    },

    // ==================== FOREST PLOT ====================
    'forest-plot': {
        name: 'Forest Plot',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="plotTitle" data-placeholder="Forest Plot: Primary Outcome">${data.plotTitle || ''}</h2>
                <div class="forest-plot-container">
                    <div class="forest-plot">
                        <div class="forest-header">
                            <span class="forest-col study">Study</span>
                            <span class="forest-col weight">Weight</span>
                            <span class="forest-col effect">Effect (95% CI)</span>
                            <span class="forest-col visual">Favors Control | Favors Treatment</span>
                        </div>
                        <div class="forest-body" contenteditable="true" data-field="forestData">
                            ${data.forestData || `
                            <div class="forest-row">
                                <span class="forest-col study">Study A (2020)</span>
                                <span class="forest-col weight">25%</span>
                                <span class="forest-col effect">0.75 (0.55-1.02)</span>
                                <span class="forest-col visual">
                                    <div class="forest-bar">
                                        <div class="forest-line"></div>
                                        <div class="forest-point" style="left: 35%">■</div>
                                        <div class="forest-ci" style="left: 25%; width: 20%"></div>
                                    </div>
                                </span>
                            </div>
                            `}
                        </div>
                        <div class="forest-summary">
                            <span class="forest-col study"><strong>Overall</strong></span>
                            <span class="forest-col weight">100%</span>
                            <span class="forest-col effect" contenteditable="true" data-field="overallEffect">${data.overallEffect || '0.82 (0.71-0.95)'}</span>
                            <span class="forest-col visual">
                                <div class="forest-bar">
                                    <div class="forest-line"></div>
                                    <div class="forest-diamond" style="left: 40%">◆</div>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div class="forest-footer">
                        <div class="forest-scale">
                            <span>0.5</span>
                            <span>1.0</span>
                            <span>2.0</span>
                        </div>
                        <div class="forest-interpretation" contenteditable="true" data-field="interpretation" data-placeholder="Interpretation: The pooled effect shows...">${data.interpretation || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== DRUG COMPARISON ====================
    'drug-comparison': {
        name: 'Drug Comparison',
        category: 'treatment',
        render: (data) => `
            <div class="slide slide-content">
                <h2><i class="fas fa-pills" style="margin-right: 12px; color: var(--secondary);"></i>Medication Comparison</h2>
                <div class="drug-comparison-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th contenteditable="true" data-field="drug1Name" data-placeholder="Drug A">${data.drug1Name || ''}</th>
                                <th contenteditable="true" data-field="drug2Name" data-placeholder="Drug B">${data.drug2Name || ''}</th>
                                <th contenteditable="true" data-field="drug3Name" data-placeholder="Drug C">${data.drug3Name || ''}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Mechanism</strong></td>
                                <td contenteditable="true" data-field="drug1Mech">${data.drug1Mech || ''}</td>
                                <td contenteditable="true" data-field="drug2Mech">${data.drug2Mech || ''}</td>
                                <td contenteditable="true" data-field="drug3Mech">${data.drug3Mech || ''}</td>
                            </tr>
                            <tr>
                                <td><strong>Dosing</strong></td>
                                <td contenteditable="true" data-field="drug1Dose">${data.drug1Dose || ''}</td>
                                <td contenteditable="true" data-field="drug2Dose">${data.drug2Dose || ''}</td>
                                <td contenteditable="true" data-field="drug3Dose">${data.drug3Dose || ''}</td>
                            </tr>
                            <tr>
                                <td><strong>Renal Adjustment</strong></td>
                                <td contenteditable="true" data-field="drug1Renal">${data.drug1Renal || ''}</td>
                                <td contenteditable="true" data-field="drug2Renal">${data.drug2Renal || ''}</td>
                                <td contenteditable="true" data-field="drug3Renal">${data.drug3Renal || ''}</td>
                            </tr>
                            <tr>
                                <td><strong>Side Effects</strong></td>
                                <td contenteditable="true" data-field="drug1SE">${data.drug1SE || ''}</td>
                                <td contenteditable="true" data-field="drug2SE">${data.drug2SE || ''}</td>
                                <td contenteditable="true" data-field="drug3SE">${data.drug3SE || ''}</td>
                            </tr>
                            <tr>
                                <td><strong>Geriatric Concerns</strong></td>
                                <td contenteditable="true" data-field="drug1Geri">${data.drug1Geri || ''}</td>
                                <td contenteditable="true" data-field="drug2Geri">${data.drug2Geri || ''}</td>
                                <td contenteditable="true" data-field="drug3Geri">${data.drug3Geri || ''}</td>
                            </tr>
                            <tr>
                                <td><strong>Cost</strong></td>
                                <td contenteditable="true" data-field="drug1Cost">${data.drug1Cost || ''}</td>
                                <td contenteditable="true" data-field="drug2Cost">${data.drug2Cost || ''}</td>
                                <td contenteditable="true" data-field="drug3Cost">${data.drug3Cost || ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="drug-recommendation">
                    <i class="fas fa-star"></i>
                    <span contenteditable="true" data-field="drugRecommendation" data-placeholder="Preferred choice for this patient...">${data.drugRecommendation || ''}</span>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== QR CODE RESOURCES ====================
    'qr-resources': {
        name: 'QR Resources',
        category: 'end',
        render: (data) => `
            <div class="slide slide-content slide-qr">
                <h2><i class="fas fa-qrcode" style="margin-right: 12px; color: var(--secondary);"></i>Additional Resources</h2>
                <div class="qr-grid">
                    <div class="qr-item">
                        <div class="qr-placeholder">
                            <i class="fas fa-qrcode"></i>
                            <span>QR Code</span>
                        </div>
                        <div class="qr-label" contenteditable="true" data-field="qr1Label" data-placeholder="Full Article">${data.qr1Label || ''}</div>
                        <div class="qr-url" contenteditable="true" data-field="qr1Url" data-placeholder="URL">${data.qr1Url || ''}</div>
                    </div>
                    <div class="qr-item">
                        <div class="qr-placeholder">
                            <i class="fas fa-qrcode"></i>
                            <span>QR Code</span>
                        </div>
                        <div class="qr-label" contenteditable="true" data-field="qr2Label" data-placeholder="Guidelines">${data.qr2Label || ''}</div>
                        <div class="qr-url" contenteditable="true" data-field="qr2Url" data-placeholder="URL">${data.qr2Url || ''}</div>
                    </div>
                    <div class="qr-item">
                        <div class="qr-placeholder">
                            <i class="fas fa-qrcode"></i>
                            <span>QR Code</span>
                        </div>
                        <div class="qr-label" contenteditable="true" data-field="qr3Label" data-placeholder="Calculator">${data.qr3Label || ''}</div>
                        <div class="qr-url" contenteditable="true" data-field="qr3Url" data-placeholder="URL">${data.qr3Url || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    }
};

// Merge with existing templates
Object.assign(SlideTemplates, ExtraSlideTemplates);
