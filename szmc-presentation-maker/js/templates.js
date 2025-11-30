// SZMC Geriatrics Presentation Maker - Slide Templates

const SlideTemplates = {
    // ==================== CASE PRESENTATION TEMPLATES ====================

    'title': {
        name: 'Title Slide',
        category: 'case',
        render: (data) => `
            <div class="slide slide-title">
                <div class="title-content">
                    <h1 contenteditable="true" data-field="title" data-placeholder="Case Presentation Title">${data.title || ''}</h1>
                    <div class="subtitle" contenteditable="true" data-field="subtitle" data-placeholder="Subtitle or Case Type">${data.subtitle || ''}</div>
                    <div class="presenter-info" contenteditable="true" data-field="presenter" data-placeholder="Presenter Name, MD">${data.presenter || ''}</div>
                    <div class="date" contenteditable="true" data-field="date" data-placeholder="Date">${data.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div class="institution-logo">
                    <i class="fas fa-heartbeat"></i>
                    <span>Shaare Zedek Medical Center - Geriatrics Department</span>
                </div>
            </div>
        `,
        defaultData: {
            title: '',
            subtitle: '',
            presenter: '',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
    },

    'patient-info': {
        name: 'Patient Information',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content slide-patient-info">
                <div class="patient-header">
                    <div class="patient-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="patient-basic-info">
                        <h2 contenteditable="true" data-field="patientId" data-placeholder="Patient ID / Initials">${data.patientId || ''}</h2>
                        <div class="demographics" contenteditable="true" data-field="demographics" data-placeholder="Age, Sex, Ethnicity">${data.demographics || ''}</div>
                    </div>
                </div>
                <div class="patient-details">
                    <div class="detail-card">
                        <h4>Chief Complaint</h4>
                        <p contenteditable="true" data-field="chiefComplaint" data-placeholder="Primary reason for presentation">${data.chiefComplaint || ''}</p>
                    </div>
                    <div class="detail-card">
                        <h4>Source</h4>
                        <p contenteditable="true" data-field="source" data-placeholder="Patient, family, caregiver, etc.">${data.source || ''}</p>
                    </div>
                    <div class="detail-card">
                        <h4>Setting</h4>
                        <p contenteditable="true" data-field="setting" data-placeholder="ED, Clinic, Ward, etc.">${data.setting || ''}</p>
                    </div>
                    <div class="detail-card">
                        <h4>Living Situation</h4>
                        <p contenteditable="true" data-field="living" data-placeholder="Home, assisted living, nursing home">${data.living || ''}</p>
                    </div>
                    <div class="detail-card">
                        <h4>Baseline Function</h4>
                        <p contenteditable="true" data-field="baseline" data-placeholder="ADLs, IADLs, mobility">${data.baseline || ''}</p>
                    </div>
                    <div class="detail-card">
                        <h4>Code Status</h4>
                        <p contenteditable="true" data-field="codeStatus" data-placeholder="Full code, DNR, etc.">${data.codeStatus || ''}</p>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Case Presentation</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'hpi': {
        name: 'History of Present Illness',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content slide-hpi">
                <h2>History of Present Illness</h2>
                <div class="chief-complaint">
                    <h3>Chief Complaint</h3>
                    <p contenteditable="true" data-field="chiefComplaint" data-placeholder="Main presenting symptom in patient's own words">${data.chiefComplaint || ''}</p>
                </div>
                <div class="content-body">
                    <div class="hpi-timeline" contenteditable="true" data-field="hpiContent" data-placeholder="Describe the history of present illness chronologically...">
                        ${data.hpiContent || ''}
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>History of Present Illness</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'pmh': {
        name: 'Past Medical History',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Past Medical History</h2>
                <div class="content-body two-column">
                    <div class="column">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                            <i class="fas fa-notes-medical" style="margin-right: 8px;"></i>Medical Conditions
                        </h3>
                        <div contenteditable="true" data-field="medicalHistory" data-placeholder="• Hypertension&#10;• Type 2 Diabetes&#10;• Atrial Fibrillation&#10;• etc.">${data.medicalHistory || ''}</div>
                    </div>
                    <div class="column">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                            <i class="fas fa-procedures" style="margin-right: 8px;"></i>Surgical History
                        </h3>
                        <div contenteditable="true" data-field="surgicalHistory" data-placeholder="• Previous surgeries&#10;• Procedures&#10;• Dates if known">${data.surgicalHistory || ''}</div>

                        <h3 style="font-size: 1rem; color: var(--primary); margin: 20px 0 12px;">
                            <i class="fas fa-allergies" style="margin-right: 8px;"></i>Allergies
                        </h3>
                        <div contenteditable="true" data-field="allergies" data-placeholder="• Drug allergies with reactions&#10;• NKDA if none">${data.allergies || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Past Medical History</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'medications': {
        name: 'Medications',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Current Medications</h2>
                <div class="content-body">
                    <table class="medications-table">
                        <thead>
                            <tr>
                                <th>Medication</th>
                                <th>Dose</th>
                                <th>Frequency</th>
                                <th>Indication</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody contenteditable="true" data-field="medications" data-placeholder="Add medications here">
                            ${data.medications || `
                            <tr>
                                <td>Metoprolol</td>
                                <td>25mg</td>
                                <td>BID</td>
                                <td>HTN/AF</td>
                                <td></td>
                            </tr>
                            `}
                        </tbody>
                    </table>
                    <div class="callout callout-warning" style="margin-top: 16px;">
                        <div class="callout-title"><i class="fas fa-exclamation-triangle"></i> Geriatric Considerations</div>
                        <div class="callout-content" contenteditable="true" data-field="medNotes" data-placeholder="Beers criteria medications, polypharmacy concerns, drug interactions...">${data.medNotes || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Medications</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'social-history': {
        name: 'Social History',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Social History</h2>
                <div class="content-body">
                    <div class="patient-details" style="grid-template-columns: repeat(2, 1fr);">
                        <div class="detail-card">
                            <h4><i class="fas fa-home" style="margin-right: 8px;"></i>Living Situation</h4>
                            <p contenteditable="true" data-field="living" data-placeholder="Where does the patient live? With whom?">${data.living || ''}</p>
                        </div>
                        <div class="detail-card">
                            <h4><i class="fas fa-users" style="margin-right: 8px;"></i>Support System</h4>
                            <p contenteditable="true" data-field="support" data-placeholder="Family, caregivers, POA">${data.support || ''}</p>
                        </div>
                        <div class="detail-card">
                            <h4><i class="fas fa-walking" style="margin-right: 8px;"></i>Functional Status</h4>
                            <p contenteditable="true" data-field="functional" data-placeholder="ADLs, IADLs, mobility aids">${data.functional || ''}</p>
                        </div>
                        <div class="detail-card">
                            <h4><i class="fas fa-briefcase" style="margin-right: 8px;"></i>Occupation</h4>
                            <p contenteditable="true" data-field="occupation" data-placeholder="Current or previous occupation">${data.occupation || ''}</p>
                        </div>
                        <div class="detail-card">
                            <h4><i class="fas fa-smoking" style="margin-right: 8px;"></i>Tobacco/Alcohol</h4>
                            <p contenteditable="true" data-field="substances" data-placeholder="Smoking, alcohol use history">${data.substances || ''}</p>
                        </div>
                        <div class="detail-card">
                            <h4><i class="fas fa-heart" style="margin-right: 8px;"></i>Advanced Directives</h4>
                            <p contenteditable="true" data-field="directives" data-placeholder="Code status, healthcare proxy, goals of care">${data.directives || ''}</p>
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Social History</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'physical-exam': {
        name: 'Physical Examination',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Physical Examination</h2>
                <div class="vitals-grid">
                    <div class="vital-card ${data.bpAbnormal ? 'abnormal' : ''}">
                        <div class="value" contenteditable="true" data-field="bp" data-placeholder="120/80">${data.bp || ''}</div>
                        <div class="label">BP (mmHg)</div>
                    </div>
                    <div class="vital-card ${data.hrAbnormal ? 'abnormal' : ''}">
                        <div class="value" contenteditable="true" data-field="hr" data-placeholder="72">${data.hr || ''}</div>
                        <div class="label">HR (bpm)</div>
                    </div>
                    <div class="vital-card ${data.rrAbnormal ? 'abnormal' : ''}">
                        <div class="value" contenteditable="true" data-field="rr" data-placeholder="16">${data.rr || ''}</div>
                        <div class="label">RR (/min)</div>
                    </div>
                    <div class="vital-card ${data.tempAbnormal ? 'abnormal' : ''}">
                        <div class="value" contenteditable="true" data-field="temp" data-placeholder="36.8">${data.temp || ''}</div>
                        <div class="label">Temp (°C)</div>
                    </div>
                    <div class="vital-card ${data.satAbnormal ? 'abnormal' : ''}">
                        <div class="value" contenteditable="true" data-field="sat" data-placeholder="98%">${data.sat || ''}</div>
                        <div class="label">SpO2</div>
                    </div>
                </div>
                <div class="exam-findings">
                    <div class="exam-system">
                        <h4><i class="fas fa-brain"></i> Neurological</h4>
                        <p contenteditable="true" data-field="neuro" data-placeholder="Mental status, cranial nerves, motor, sensory, reflexes, gait">${data.neuro || ''}</p>
                    </div>
                    <div class="exam-system">
                        <h4><i class="fas fa-lungs"></i> Cardiovascular/Respiratory</h4>
                        <p contenteditable="true" data-field="cardioResp" data-placeholder="Heart sounds, lung sounds, JVP, peripheral pulses, edema">${data.cardioResp || ''}</p>
                    </div>
                    <div class="exam-system">
                        <h4><i class="fas fa-stomach"></i> Abdominal</h4>
                        <p contenteditable="true" data-field="abdominal" data-placeholder="Inspection, palpation, bowel sounds, tenderness">${data.abdominal || ''}</p>
                    </div>
                    <div class="exam-system">
                        <h4><i class="fas fa-bone"></i> Musculoskeletal/Skin</h4>
                        <p contenteditable="true" data-field="mskSkin" data-placeholder="Joint exam, skin integrity, pressure injuries, wounds">${data.mskSkin || ''}</p>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Physical Examination</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'labs': {
        name: 'Laboratory Results',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Laboratory Results</h2>
                <div class="content-body two-column">
                    <div class="column">
                        <h3 style="font-size: 0.875rem; color: var(--primary); margin-bottom: 12px;">Complete Blood Count</h3>
                        <div contenteditable="true" data-field="cbc" data-placeholder="WBC:
Hgb:
Plt: ">${data.cbc || ''}</div>

                        <h3 style="font-size: 0.875rem; color: var(--primary); margin: 20px 0 12px;">Basic Metabolic Panel</h3>
                        <div contenteditable="true" data-field="bmp" data-placeholder="Na: K: Cl: HCO3:
BUN: Cr: Glucose:
Ca: Mg: Phos:">${data.bmp || ''}</div>
                    </div>
                    <div class="column">
                        <h3 style="font-size: 0.875rem; color: var(--primary); margin-bottom: 12px;">Other Labs</h3>
                        <div contenteditable="true" data-field="otherLabs" data-placeholder="LFTs, coagulation, urinalysis, cultures, etc.">${data.otherLabs || ''}</div>

                        <h3 style="font-size: 0.875rem; color: var(--primary); margin: 20px 0 12px;">Key Abnormalities</h3>
                        <div class="callout callout-danger">
                            <div class="callout-content" contenteditable="true" data-field="abnormals" data-placeholder="Highlight significant lab abnormalities">${data.abnormals || ''}</div>
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Laboratory Results</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'imaging': {
        name: 'Imaging Studies',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Imaging Studies</h2>
                <div class="content-body two-column">
                    <div class="column">
                        <div class="detail-card" style="height: 100%; display: flex; flex-direction: column;">
                            <h4><i class="fas fa-x-ray" style="margin-right: 8px;"></i>Study Type & Date</h4>
                            <p contenteditable="true" data-field="imagingType" data-placeholder="CT Head, CXR, etc.">${data.imagingType || ''}</p>
                            <div style="flex: 1; background: var(--gray-200); border-radius: var(--radius); margin-top: 12px; display: flex; align-items: center; justify-content: center; min-height: 200px;">
                                <div style="text-align: center; color: var(--gray-400);">
                                    <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 8px;"></i>
                                    <p style="font-size: 0.75rem;">Click to add image</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column">
                        <h3 style="font-size: 0.875rem; color: var(--primary); margin-bottom: 12px;">Findings</h3>
                        <div contenteditable="true" data-field="findings" data-placeholder="Describe imaging findings...">${data.findings || ''}</div>

                        <h3 style="font-size: 0.875rem; color: var(--primary); margin: 20px 0 12px;">Impression</h3>
                        <div class="callout callout-info">
                            <div class="callout-content" contenteditable="true" data-field="impression" data-placeholder="Radiologist's impression / Key takeaways">${data.impression || ''}</div>
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Imaging Studies</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'geriatric-assessment': {
        name: 'Geriatric Assessment',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Comprehensive Geriatric Assessment</h2>
                <div class="assessment-grid">
                    <div class="assessment-card">
                        <h4><i class="fas fa-brain"></i> Cognition (MMSE/MoCA)</h4>
                        <div class="assessment-score">
                            <span class="score" contenteditable="true" data-field="cogScore" data-placeholder="24">${data.cogScore || ''}</span>
                            <span class="max">/ 30</span>
                        </div>
                        <div class="assessment-interpretation interpretation-mild" contenteditable="true" data-field="cogInterp" data-placeholder="Normal / MCI / Dementia">${data.cogInterp || ''}</div>
                    </div>
                    <div class="assessment-card">
                        <h4><i class="fas fa-walking"></i> Mobility (TUG)</h4>
                        <div class="assessment-score">
                            <span class="score" contenteditable="true" data-field="tugScore" data-placeholder="12">${data.tugScore || ''}</span>
                            <span class="max">seconds</span>
                        </div>
                        <div class="assessment-interpretation interpretation-normal" contenteditable="true" data-field="tugInterp" data-placeholder="Low / Moderate / High fall risk">${data.tugInterp || ''}</div>
                    </div>
                    <div class="assessment-card">
                        <h4><i class="fas fa-utensils"></i> Nutrition (MNA-SF)</h4>
                        <div class="assessment-score">
                            <span class="score" contenteditable="true" data-field="mnaScore" data-placeholder="10">${data.mnaScore || ''}</span>
                            <span class="max">/ 14</span>
                        </div>
                        <div class="assessment-interpretation interpretation-mild" contenteditable="true" data-field="mnaInterp" data-placeholder="Normal / At risk / Malnourished">${data.mnaInterp || ''}</div>
                    </div>
                    <div class="assessment-card">
                        <h4><i class="fas fa-sad-tear"></i> Depression (GDS-15)</h4>
                        <div class="assessment-score">
                            <span class="score" contenteditable="true" data-field="gdsScore" data-placeholder="3">${data.gdsScore || ''}</span>
                            <span class="max">/ 15</span>
                        </div>
                        <div class="assessment-interpretation interpretation-normal" contenteditable="true" data-field="gdsInterp" data-placeholder="Normal / Mild / Moderate depression">${data.gdsInterp || ''}</div>
                    </div>
                    <div class="assessment-card">
                        <h4><i class="fas fa-hand-holding-medical"></i> ADLs (Barthel Index)</h4>
                        <div class="assessment-score">
                            <span class="score" contenteditable="true" data-field="adlScore" data-placeholder="85">${data.adlScore || ''}</span>
                            <span class="max">/ 100</span>
                        </div>
                        <div class="assessment-interpretation interpretation-mild" contenteditable="true" data-field="adlInterp" data-placeholder="Independent / Mild / Moderate / Severe dependence">${data.adlInterp || ''}</div>
                    </div>
                    <div class="assessment-card">
                        <h4><i class="fas fa-home"></i> IADLs (Lawton Scale)</h4>
                        <div class="assessment-score">
                            <span class="score" contenteditable="true" data-field="iadlScore" data-placeholder="6">${data.iadlScore || ''}</span>
                            <span class="max">/ 8</span>
                        </div>
                        <div class="assessment-interpretation interpretation-mild" contenteditable="true" data-field="iadlInterp" data-placeholder="Independent / Needs assistance">${data.iadlInterp || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Geriatric Assessment</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'differential': {
        name: 'Differential Diagnosis',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Differential Diagnosis</h2>
                <div class="content-body">
                    <div class="differential-list" contenteditable="true" data-field="differentials">
                        ${data.differentials || `
                        <div class="differential-item likely">
                            <div class="differential-rank">1</div>
                            <div class="differential-content">
                                <h4>Most Likely Diagnosis</h4>
                                <p>Supporting evidence and reasoning</p>
                            </div>
                            <span class="differential-probability prob-high">High</span>
                        </div>
                        <div class="differential-item possible">
                            <div class="differential-rank">2</div>
                            <div class="differential-content">
                                <h4>Alternative Diagnosis</h4>
                                <p>Supporting evidence and reasoning</p>
                            </div>
                            <span class="differential-probability prob-medium">Medium</span>
                        </div>
                        <div class="differential-item unlikely">
                            <div class="differential-rank">3</div>
                            <div class="differential-content">
                                <h4>Less Likely but Important</h4>
                                <p>Must rule out because...</p>
                            </div>
                            <span class="differential-probability prob-low">Low</span>
                        </div>
                        `}
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Differential Diagnosis</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'diagnosis': {
        name: 'Final Diagnosis',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Final Diagnosis</h2>
                <div class="content-body">
                    <div class="callout callout-success" style="margin-bottom: 24px;">
                        <div class="callout-title"><i class="fas fa-check-circle"></i> Primary Diagnosis</div>
                        <div class="callout-content" style="font-size: 1.25rem; font-weight: 600;" contenteditable="true" data-field="primaryDx" data-placeholder="Primary diagnosis">${data.primaryDx || ''}</div>
                    </div>

                    <div class="two-column">
                        <div class="column">
                            <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                                <i class="fas fa-clipboard-check" style="margin-right: 8px;"></i>Supporting Evidence
                            </h3>
                            <div contenteditable="true" data-field="evidence" data-placeholder="• Key clinical findings&#10;• Laboratory results&#10;• Imaging findings&#10;• Response to treatment">${data.evidence || ''}</div>
                        </div>
                        <div class="column">
                            <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                                <i class="fas fa-diagnoses" style="margin-right: 8px;"></i>Secondary Diagnoses
                            </h3>
                            <div contenteditable="true" data-field="secondaryDx" data-placeholder="• Contributing conditions&#10;• Comorbidities&#10;• Complications">${data.secondaryDx || ''}</div>
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Final Diagnosis</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'disease-overview': {
        name: 'Disease Overview',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="diseaseName" data-placeholder="Disease Name">${data.diseaseName || 'Disease Overview'}</h2>
                <div class="disease-overview">
                    <div class="disease-main">
                        <div class="disease-section">
                            <h3><i class="fas fa-info-circle"></i> Definition & Epidemiology</h3>
                            <div contenteditable="true" data-field="definition" data-placeholder="• Definition&#10;• Prevalence in elderly&#10;• Risk factors">${data.definition || ''}</div>
                        </div>
                        <div class="disease-section">
                            <h3><i class="fas fa-cogs"></i> Pathophysiology</h3>
                            <div contenteditable="true" data-field="pathophys" data-placeholder="• Mechanism of disease&#10;• Age-related changes&#10;• Contributing factors">${data.pathophys || ''}</div>
                        </div>
                        <div class="disease-section">
                            <h3><i class="fas fa-stethoscope"></i> Clinical Presentation</h3>
                            <div contenteditable="true" data-field="presentation" data-placeholder="• Typical symptoms&#10;• Atypical presentations in elderly&#10;• Red flags">${data.presentation || ''}</div>
                        </div>
                    </div>
                    <div class="disease-sidebar">
                        <div class="key-facts">
                            <h4>Key Facts</h4>
                            <div class="key-fact-item">
                                <div class="key-fact-icon"><i class="fas fa-chart-line"></i></div>
                                <div class="key-fact-text">
                                    <div class="label">Prevalence (≥65y)</div>
                                    <div class="value" contenteditable="true" data-field="prevalence" data-placeholder="X%">${data.prevalence || ''}</div>
                                </div>
                            </div>
                            <div class="key-fact-item">
                                <div class="key-fact-icon"><i class="fas fa-skull-crossbones"></i></div>
                                <div class="key-fact-text">
                                    <div class="label">Mortality</div>
                                    <div class="value" contenteditable="true" data-field="mortality" data-placeholder="X%">${data.mortality || ''}</div>
                                </div>
                            </div>
                            <div class="key-fact-item">
                                <div class="key-fact-icon"><i class="fas fa-venus-mars"></i></div>
                                <div class="key-fact-text">
                                    <div class="label">Gender</div>
                                    <div class="value" contenteditable="true" data-field="gender" data-placeholder="M:F ratio">${data.gender || ''}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Disease Overview</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'treatment': {
        name: 'Treatment Plan',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Treatment Plan</h2>
                <div class="treatment-columns">
                    <div class="treatment-column pharmacologic">
                        <div class="treatment-column-header">
                            <i class="fas fa-pills"></i> Pharmacologic
                        </div>
                        <div class="treatment-column-body" contenteditable="true" data-field="pharmacologic" data-placeholder="• First-line medications&#10;• Dosing considerations&#10;• Geriatric adjustments">
                            ${data.pharmacologic || ''}
                        </div>
                    </div>
                    <div class="treatment-column non-pharmacologic">
                        <div class="treatment-column-header">
                            <i class="fas fa-hand-holding-heart"></i> Non-Pharmacologic
                        </div>
                        <div class="treatment-column-body" contenteditable="true" data-field="nonPharmacologic" data-placeholder="• Lifestyle modifications&#10;• Physical therapy&#10;• Occupational therapy&#10;• Social interventions">
                            ${data.nonPharmacologic || ''}
                        </div>
                    </div>
                    <div class="treatment-column monitoring">
                        <div class="treatment-column-header">
                            <i class="fas fa-chart-line"></i> Monitoring
                        </div>
                        <div class="treatment-column-body" contenteditable="true" data-field="monitoring" data-placeholder="• Labs to follow&#10;• Clinical parameters&#10;• Follow-up schedule&#10;• Safety monitoring">
                            ${data.monitoring || ''}
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Treatment Plan</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'prognosis': {
        name: 'Prognosis & Follow-up',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Prognosis & Follow-up</h2>
                <div class="content-body two-column">
                    <div class="column">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                            <i class="fas fa-chart-line" style="margin-right: 8px;"></i>Prognosis
                        </h3>
                        <div contenteditable="true" data-field="prognosis" data-placeholder="• Expected outcomes&#10;• Factors affecting prognosis&#10;• Functional trajectory">${data.prognosis || ''}</div>

                        <h3 style="font-size: 1rem; color: var(--primary); margin: 24px 0 12px;">
                            <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>Potential Complications
                        </h3>
                        <div contenteditable="true" data-field="complications" data-placeholder="• Short-term risks&#10;• Long-term complications&#10;• Prevention strategies">${data.complications || ''}</div>
                    </div>
                    <div class="column">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                            <i class="fas fa-calendar-check" style="margin-right: 8px;"></i>Follow-up Plan
                        </h3>
                        <div contenteditable="true" data-field="followup" data-placeholder="• Appointment schedule&#10;• Specialist referrals&#10;• Repeat testing">${data.followup || ''}</div>

                        <h3 style="font-size: 1rem; color: var(--primary); margin: 24px 0 12px;">
                            <i class="fas fa-graduation-cap" style="margin-right: 8px;"></i>Patient Education
                        </h3>
                        <div contenteditable="true" data-field="education" data-placeholder="• Warning signs to watch&#10;• Lifestyle recommendations&#10;• Resources provided">${data.education || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Prognosis & Follow-up</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'teaching-points': {
        name: 'Teaching Points',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Key Teaching Points</h2>
                <div class="content-body">
                    <div class="teaching-points" contenteditable="true" data-field="teachingPoints">
                        ${data.teachingPoints || `
                        <div class="teaching-point">
                            <div class="teaching-point-number">1</div>
                            <div class="teaching-point-content">
                                <h4>Teaching Point Title</h4>
                                <p>Explanation and clinical relevance</p>
                            </div>
                        </div>
                        <div class="teaching-point">
                            <div class="teaching-point-number">2</div>
                            <div class="teaching-point-content">
                                <h4>Teaching Point Title</h4>
                                <p>Explanation and clinical relevance</p>
                            </div>
                        </div>
                        <div class="teaching-point">
                            <div class="teaching-point-number">3</div>
                            <div class="teaching-point-content">
                                <h4>Teaching Point Title</h4>
                                <p>Explanation and clinical relevance</p>
                            </div>
                        </div>
                        `}
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Teaching Points</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'references': {
        name: 'References',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2>References</h2>
                <div class="content-body">
                    <div class="references-list" contenteditable="true" data-field="references" data-placeholder="1. Author et al. Title. Journal. Year;Vol:Pages.">
                        ${data.references || ''}
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>References</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== JOURNAL CLUB TEMPLATES ====================

    'jc-title': {
        name: 'Article Title',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-jc-title">
                <div class="article-info">
                    <div class="journal" contenteditable="true" data-field="journal" data-placeholder="Journal Name">${data.journal || ''}</div>
                    <h1 contenteditable="true" data-field="articleTitle" data-placeholder="Article Title">${data.articleTitle || ''}</h1>
                    <div class="authors" contenteditable="true" data-field="authors" data-placeholder="Authors">${data.authors || ''}</div>
                    <div class="citation" contenteditable="true" data-field="citation" data-placeholder="Year;Volume:Pages. DOI">${data.citation || ''}</div>
                </div>
                <div class="institution-logo" style="color: white;">
                    <i class="fas fa-heartbeat"></i>
                    <span>SZMC Geriatrics Journal Club</span>
                </div>
                <div style="position: absolute; bottom: 48px; right: 48px; text-align: right; color: white; opacity: 0.8;">
                    <div contenteditable="true" data-field="presenter" data-placeholder="Presenter Name">${data.presenter || ''}</div>
                    <div contenteditable="true" data-field="date" data-placeholder="Date">${data.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-background': {
        name: 'Background & Rationale',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Background & Rationale</h2>
                <div class="content-body two-column">
                    <div class="column">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                            <i class="fas fa-book" style="margin-right: 8px;"></i>Current Knowledge
                        </h3>
                        <div contenteditable="true" data-field="currentKnowledge" data-placeholder="• What was known before this study&#10;• Previous research findings&#10;• Current guidelines">${data.currentKnowledge || ''}</div>
                    </div>
                    <div class="column">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                            <i class="fas fa-question-circle" style="margin-right: 8px;"></i>Knowledge Gap
                        </h3>
                        <div contenteditable="true" data-field="knowledgeGap" data-placeholder="• What was unknown&#10;• Why this study was needed&#10;• Clinical importance">${data.knowledgeGap || ''}</div>
                    </div>
                </div>
                <div class="callout callout-info" style="margin-top: 24px;">
                    <div class="callout-title"><i class="fas fa-bullseye"></i> Study Objective</div>
                    <div class="callout-content" contenteditable="true" data-field="objective" data-placeholder="Primary objective of this study">${data.objective || ''}</div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-pico': {
        name: 'PICO Question',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>PICO Framework</h2>
                <div class="pico-grid">
                    <div class="pico-card" style="border-left-color: #3498db;">
                        <h3>P - Population</h3>
                        <div class="pico-label">Who was studied?</div>
                        <p contenteditable="true" data-field="population" data-placeholder="Inclusion/exclusion criteria, demographics, setting">${data.population || ''}</p>
                    </div>
                    <div class="pico-card" style="border-left-color: #27ae60;">
                        <h3>I - Intervention</h3>
                        <div class="pico-label">What was done?</div>
                        <p contenteditable="true" data-field="intervention" data-placeholder="Treatment, exposure, or intervention studied">${data.intervention || ''}</p>
                    </div>
                    <div class="pico-card" style="border-left-color: #f39c12;">
                        <h3>C - Comparison</h3>
                        <div class="pico-label">Compared to what?</div>
                        <p contenteditable="true" data-field="comparison" data-placeholder="Control group, placebo, standard care, etc.">${data.comparison || ''}</p>
                    </div>
                    <div class="pico-card" style="border-left-color: #e74c3c;">
                        <h3>O - Outcome</h3>
                        <div class="pico-label">What was measured?</div>
                        <p contenteditable="true" data-field="outcome" data-placeholder="Primary and secondary outcomes">${data.outcome || ''}</p>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-methods': {
        name: 'Study Methods',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Study Methods</h2>
                <div class="methods-overview">
                    <div class="method-card">
                        <span class="study-design-badge" contenteditable="true" data-field="studyDesign" data-placeholder="RCT / Cohort / Case-Control">${data.studyDesign || ''}</span>
                        <h4><i class="fas fa-users"></i> Study Population</h4>
                        <div contenteditable="true" data-field="studyPop" data-placeholder="• Sample size&#10;• Inclusion criteria&#10;• Exclusion criteria&#10;• Recruitment setting">${data.studyPop || ''}</div>
                    </div>
                    <div class="method-card">
                        <h4><i class="fas fa-random"></i> Randomization/Allocation</h4>
                        <div contenteditable="true" data-field="randomization" data-placeholder="• Randomization method&#10;• Blinding&#10;• Allocation concealment">${data.randomization || ''}</div>
                    </div>
                    <div class="method-card">
                        <h4><i class="fas fa-clipboard-list"></i> Intervention Protocol</h4>
                        <div contenteditable="true" data-field="protocol" data-placeholder="• Intervention details&#10;• Duration&#10;• Follow-up period">${data.protocol || ''}</div>
                    </div>
                    <div class="method-card">
                        <h4><i class="fas fa-chart-bar"></i> Statistical Analysis</h4>
                        <div contenteditable="true" data-field="stats" data-placeholder="• Primary analysis&#10;• Power calculation&#10;• Statistical tests used">${data.stats || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-results': {
        name: 'Results',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Results</h2>
                <div class="results-highlight">
                    <div class="result-card primary">
                        <div class="result-value" contenteditable="true" data-field="primaryResult" data-placeholder="X%">${data.primaryResult || ''}</div>
                        <div class="result-label" contenteditable="true" data-field="primaryLabel" data-placeholder="Primary Outcome">${data.primaryLabel || ''}</div>
                        <div class="result-ci" contenteditable="true" data-field="primaryCI" data-placeholder="95% CI: X-X">${data.primaryCI || ''}</div>
                    </div>
                    <div class="result-card">
                        <div class="result-value" contenteditable="true" data-field="secondaryResult1" data-placeholder="X%">${data.secondaryResult1 || ''}</div>
                        <div class="result-label" contenteditable="true" data-field="secondaryLabel1" data-placeholder="Secondary Outcome">${data.secondaryLabel1 || ''}</div>
                        <div class="result-ci" contenteditable="true" data-field="secondaryCI1" data-placeholder="p = X">${data.secondaryCI1 || ''}</div>
                    </div>
                    <div class="result-card">
                        <div class="result-value" contenteditable="true" data-field="secondaryResult2" data-placeholder="X%">${data.secondaryResult2 || ''}</div>
                        <div class="result-label" contenteditable="true" data-field="secondaryLabel2" data-placeholder="Secondary Outcome">${data.secondaryLabel2 || ''}</div>
                        <div class="result-ci" contenteditable="true" data-field="secondaryCI2" data-placeholder="p = X">${data.secondaryCI2 || ''}</div>
                    </div>
                </div>
                <div contenteditable="true" data-field="additionalResults" data-placeholder="Additional key findings, subgroup analyses, etc.">${data.additionalResults || ''}</div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-statistics': {
        name: 'Statistical Analysis',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Statistical Analysis</h2>
                <div class="content-body">
                    <table class="stats-table">
                        <thead>
                            <tr>
                                <th>Outcome</th>
                                <th>Intervention</th>
                                <th>Control</th>
                                <th>Effect Size</th>
                                <th>95% CI</th>
                                <th>P-value</th>
                            </tr>
                        </thead>
                        <tbody contenteditable="true" data-field="statsTable">
                            ${data.statsTable || `
                            <tr>
                                <td>Primary Outcome</td>
                                <td>X%</td>
                                <td>X%</td>
                                <td>RR X.XX</td>
                                <td>X.XX - X.XX</td>
                                <td class="stat-significant">&lt;0.05</td>
                            </tr>
                            `}
                        </tbody>
                    </table>
                    <div class="callout callout-info">
                        <div class="callout-title"><i class="fas fa-calculator"></i> Key Statistical Considerations</div>
                        <div class="callout-content" contenteditable="true" data-field="statNotes" data-placeholder="• NNT/NNH&#10;• Absolute vs relative risk reduction&#10;• Confidence interval interpretation">${data.statNotes || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-discussion': {
        name: 'Discussion',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Discussion</h2>
                <div class="content-body two-column">
                    <div class="column">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                            <i class="fas fa-lightbulb" style="margin-right: 8px;"></i>Key Findings
                        </h3>
                        <div contenteditable="true" data-field="keyFindings" data-placeholder="• Main findings summarized&#10;• How they answer the research question&#10;• Comparison to hypothesis">${data.keyFindings || ''}</div>
                    </div>
                    <div class="column">
                        <h3 style="font-size: 1rem; color: var(--primary); margin-bottom: 12px;">
                            <i class="fas fa-balance-scale" style="margin-right: 8px;"></i>Comparison to Literature
                        </h3>
                        <div contenteditable="true" data-field="comparison" data-placeholder="• Consistency with prior studies&#10;• Differences and explanations&#10;• Novel contributions">${data.comparison || ''}</div>
                    </div>
                </div>
                <div class="callout callout-warning" style="margin-top: 24px;">
                    <div class="callout-title"><i class="fas fa-comment-medical"></i> Authors' Interpretation</div>
                    <div class="callout-content" contenteditable="true" data-field="interpretation" data-placeholder="How do the authors interpret these results?">${data.interpretation || ''}</div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-limitations': {
        name: 'Limitations',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Study Limitations</h2>
                <div class="limitations-grid" contenteditable="true" data-field="limitations">
                    ${data.limitations || `
                    <div class="limitation-item">
                        <div class="limitation-icon"><i class="fas fa-users"></i></div>
                        <div class="limitation-content">
                            <h4>Selection Bias</h4>
                            <p>Description of potential selection bias issues</p>
                        </div>
                    </div>
                    <div class="limitation-item">
                        <div class="limitation-icon"><i class="fas fa-globe"></i></div>
                        <div class="limitation-content">
                            <h4>Generalizability</h4>
                            <p>How applicable to our patient population?</p>
                        </div>
                    </div>
                    <div class="limitation-item">
                        <div class="limitation-icon"><i class="fas fa-clock"></i></div>
                        <div class="limitation-content">
                            <h4>Follow-up Duration</h4>
                            <p>Was follow-up adequate for outcomes?</p>
                        </div>
                    </div>
                    <div class="limitation-item">
                        <div class="limitation-icon"><i class="fas fa-eye-slash"></i></div>
                        <div class="limitation-content">
                            <h4>Blinding</h4>
                            <p>Issues with blinding or lack thereof</p>
                        </div>
                    </div>
                    `}
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-applicability': {
        name: 'Clinical Applicability',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Clinical Applicability</h2>
                <div class="applicability-sections">
                    <div class="applicability-card pros">
                        <h4><i class="fas fa-check-circle"></i> Reasons to Apply</h4>
                        <div contenteditable="true" data-field="pros" data-placeholder="• Strong evidence for...&#10;• Patient population similar to...&#10;• Clinically significant benefit">${data.pros || ''}</div>
                    </div>
                    <div class="applicability-card cons">
                        <h4><i class="fas fa-times-circle"></i> Reasons for Caution</h4>
                        <div contenteditable="true" data-field="cons" data-placeholder="• Our patients differ in...&#10;• Limited generalizability because...&#10;• Potential harms include...">${data.cons || ''}</div>
                    </div>
                    <div class="applicability-card consider">
                        <h4><i class="fas fa-exclamation-circle"></i> Special Considerations for Geriatric Patients</h4>
                        <div contenteditable="true" data-field="geriatricConsiderations" data-placeholder="• Frailty considerations&#10;• Polypharmacy implications&#10;• Goals of care alignment&#10;• Life expectancy and time to benefit">${data.geriatricConsiderations || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'jc-conclusion': {
        name: 'Conclusions',
        category: 'journal',
        render: (data) => `
            <div class="slide slide-content">
                <h2>Conclusions & Take-Home Points</h2>
                <div class="content-body">
                    <div class="callout callout-success" style="margin-bottom: 24px;">
                        <div class="callout-title"><i class="fas fa-star"></i> Bottom Line</div>
                        <div class="callout-content" style="font-size: 1.125rem;" contenteditable="true" data-field="bottomLine" data-placeholder="One-sentence summary of the clinical bottom line">${data.bottomLine || ''}</div>
                    </div>
                    <div class="teaching-points" contenteditable="true" data-field="takeaways">
                        ${data.takeaways || `
                        <div class="teaching-point">
                            <div class="teaching-point-number">1</div>
                            <div class="teaching-point-content">
                                <h4>Key Takeaway</h4>
                                <p>Clinical implication and how it changes practice</p>
                            </div>
                        </div>
                        <div class="teaching-point">
                            <div class="teaching-point-number">2</div>
                            <div class="teaching-point-content">
                                <h4>Key Takeaway</h4>
                                <p>Clinical implication and how it changes practice</p>
                            </div>
                        </div>
                        `}
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div>Journal Club</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== GENERAL TEMPLATES ====================

    'section-header': {
        name: 'Section Header',
        category: 'general',
        render: (data) => `
            <div class="slide slide-section-header">
                <h2 contenteditable="true" data-field="sectionTitle" data-placeholder="Section Title">${data.sectionTitle || ''}</h2>
                <div class="section-number" contenteditable="true" data-field="sectionNumber" data-placeholder="1">${data.sectionNumber || ''}</div>
            </div>
        `,
        defaultData: {}
    },

    'content': {
        name: 'Content Slide',
        category: 'general',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="title" data-placeholder="Slide Title">${data.title || ''}</h2>
                <div class="content-body" contenteditable="true" data-field="content" data-placeholder="Add your content here...">
                    ${data.content || ''}
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'two-column': {
        name: 'Two Column',
        category: 'general',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="title" data-placeholder="Slide Title">${data.title || ''}</h2>
                <div class="content-body two-column">
                    <div class="column" contenteditable="true" data-field="leftColumn" data-placeholder="Left column content">
                        ${data.leftColumn || ''}
                    </div>
                    <div class="column" contenteditable="true" data-field="rightColumn" data-placeholder="Right column content">
                        ${data.rightColumn || ''}
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

    'comparison': {
        name: 'Comparison',
        category: 'general',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="title" data-placeholder="Comparison Title">${data.title || ''}</h2>
                <div class="content-body">
                    <div class="comparison-table" contenteditable="true" data-field="comparison">
                        ${data.comparison || `
                        <div class="comparison-header">Option A</div>
                        <div class="comparison-header">Option B</div>
                        <div class="comparison-cell">Feature 1</div>
                        <div class="comparison-cell">Feature 1</div>
                        <div class="comparison-cell">Feature 2</div>
                        <div class="comparison-cell">Feature 2</div>
                        `}
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

    'questions': {
        name: 'Questions',
        category: 'general',
        render: (data) => `
            <div class="slide slide-questions">
                <h2>Questions?</h2>
                <p contenteditable="true" data-field="subtitle" data-placeholder="Thank you for your attention">${data.subtitle || 'Thank you for your attention'}</p>
                <div class="contact-info" contenteditable="true" data-field="contact" data-placeholder="Contact information">${data.contact || ''}</div>
            </div>
        `,
        defaultData: {
            subtitle: 'Thank you for your attention'
        }
    }
};

// Template presets for quick start
const TemplatePresets = {
    case: {
        name: 'Case Presentation',
        description: 'Complete geriatric case presentation with all standard sections',
        slides: [
            { type: 'title', data: { subtitle: 'Geriatric Case Presentation' } },
            { type: 'patient-info', data: {} },
            { type: 'hpi', data: {} },
            { type: 'pmh', data: {} },
            { type: 'medications', data: {} },
            { type: 'social-history', data: {} },
            { type: 'physical-exam', data: {} },
            { type: 'labs', data: {} },
            { type: 'geriatric-assessment', data: {} },
            { type: 'differential', data: {} },
            { type: 'diagnosis', data: {} },
            { type: 'disease-overview', data: {} },
            { type: 'treatment', data: {} },
            { type: 'prognosis', data: {} },
            { type: 'teaching-points', data: {} },
            { type: 'references', data: {} },
            { type: 'questions', data: {} }
        ]
    },
    journal: {
        name: 'Journal Club',
        description: 'Structured journal club presentation for critical appraisal',
        slides: [
            { type: 'jc-title', data: {} },
            { type: 'jc-background', data: {} },
            { type: 'jc-pico', data: {} },
            { type: 'jc-methods', data: {} },
            { type: 'jc-results', data: {} },
            { type: 'jc-statistics', data: {} },
            { type: 'jc-discussion', data: {} },
            { type: 'jc-limitations', data: {} },
            { type: 'jc-applicability', data: {} },
            { type: 'jc-conclusion', data: {} },
            { type: 'references', data: {} },
            { type: 'questions', data: {} }
        ]
    },
    lecture: {
        name: 'Teaching Lecture',
        description: 'Educational lecture with learning objectives and assessments',
        slides: [
            { type: 'title', data: { subtitle: 'Teaching Lecture' } },
            { type: 'content', data: { title: 'Learning Objectives', content: '<ul><li>Objective 1</li><li>Objective 2</li><li>Objective 3</li></ul>' } },
            { type: 'content', data: { title: 'Overview', content: '' } },
            { type: 'content', data: { title: 'Key Concepts', content: '' } },
            { type: 'two-column', data: { title: 'Comparison', leftTitle: 'Topic A', rightTitle: 'Topic B' } },
            { type: 'content', data: { title: 'Clinical Pearls', content: '' } },
            { type: 'content', data: { title: 'Case Example', content: '' } },
            { type: 'quiz', data: { question: 'Test your knowledge' } },
            { type: 'teaching-points', data: {} },
            { type: 'content', data: { title: 'Additional Resources', content: '' } },
            { type: 'references', data: {} },
            { type: 'questions', data: {} }
        ]
    },
    grandRounds: {
        name: 'Grand Rounds',
        description: 'Comprehensive case with literature review and evidence-based discussion',
        slides: [
            { type: 'title', data: { subtitle: 'Grand Rounds Presentation' } },
            { type: 'patient-info', data: {} },
            { type: 'hpi', data: {} },
            { type: 'pmh', data: {} },
            { type: 'medications', data: {} },
            { type: 'physical-exam', data: {} },
            { type: 'labs', data: {} },
            { type: 'geriatric-assessment', data: {} },
            { type: 'differential', data: {} },
            { type: 'diagnosis', data: {} },
            { type: 'disease-overview', data: {} },
            { type: 'content', data: { title: 'Literature Review', content: '' } },
            { type: 'content', data: { title: 'Current Guidelines', content: '' } },
            { type: 'content', data: { title: 'Evidence Summary', content: '<p><strong>High Quality Evidence:</strong></p><ul><li></li></ul><p><strong>Moderate Quality:</strong></p><ul><li></li></ul>' } },
            { type: 'treatment', data: {} },
            { type: 'prognosis', data: {} },
            { type: 'content', data: { title: 'Discussion Points', content: '<ul><li>Point for panel discussion 1</li><li>Point for panel discussion 2</li></ul>' } },
            { type: 'teaching-points', data: {} },
            { type: 'references', data: {} },
            { type: 'questions', data: {} }
        ]
    },
    quickCase: {
        name: 'Quick Case',
        description: '5-minute focused case presentation for morning report',
        slides: [
            { type: 'title', data: { subtitle: 'Quick Case Presentation' } },
            { type: 'content', data: { title: 'One-Liner', content: '<p class="one-liner" style="font-size: 1.3em; font-style: italic;">[Age] year old [sex] with [relevant PMH] presenting with [chief complaint]</p>' } },
            { type: 'hpi', data: {} },
            { type: 'content', data: { title: 'Key Findings', content: '<h4>Vitals</h4><p></p><h4>Physical Exam</h4><p></p><h4>Labs/Imaging</h4><p></p>' } },
            { type: 'differential', data: {} },
            { type: 'diagnosis', data: {} },
            { type: 'treatment', data: {} },
            { type: 'content', data: { title: 'Teaching Point', content: '<div class="teaching-box" style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;"><p style="font-size: 1.1em;"></p></div>' } }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SlideTemplates, TemplatePresets };
}
