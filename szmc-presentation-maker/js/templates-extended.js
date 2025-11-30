// SZMC Geriatrics Presentation Maker - Extended Templates with Visuals & Citations

// Medical image sources (Creative Commons / Open Access)
const MedicalImages = {
    // Anatomy & General
    'elderly-patient': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    'doctor-patient': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
    'hospital-ward': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    'medication-pills': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
    'stethoscope': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    'lab-tests': 'https://images.unsplash.com/photo-1579165466741-7f35e4755169?w=800',
    'brain-scan': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
    'physical-therapy': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'elderly-walking': 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800',
    'caregiver': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800',

    // Placeholder for medical diagrams
    'ecg-strip': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/SinusRhythmLabels.svg/800px-SinusRhythmLabels.svg.png',
    'chest-xray': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Chest_Xray_PA_3-8-2010.png/462px-Chest_Xray_PA_3-8-2010.png',
    'ct-brain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/CT_of_human_brain%2C_from_base_of_skull_to_top.jpg/640px-CT_of_human_brain%2C_from_base_of_skull_to_top.jpg'
};

// Extended slide templates
const ExtendedSlideTemplates = {

    // ==================== TABLE OF CONTENTS ====================
    'toc': {
        name: 'Table of Contents',
        category: 'navigation',
        render: (data) => `
            <div class="slide slide-content slide-toc">
                <h2><i class="fas fa-list-ol" style="margin-right: 12px; color: var(--secondary);"></i>Table of Contents</h2>
                <div class="toc-container">
                    <div class="toc-column">
                        <div class="toc-section">
                            <div class="toc-section-header">
                                <span class="toc-icon"><i class="fas fa-user-injured"></i></span>
                                <span>Patient Presentation</span>
                            </div>
                            <div class="toc-items">
                                <div class="toc-item"><span class="toc-num">1</span> Introduction & Demographics</div>
                                <div class="toc-item"><span class="toc-num">2</span> Chief Complaint & HPI</div>
                                <div class="toc-item"><span class="toc-num">3</span> Past Medical History</div>
                                <div class="toc-item"><span class="toc-num">4</span> Medications Review</div>
                                <div class="toc-item"><span class="toc-num">5</span> Social & Functional History</div>
                            </div>
                        </div>
                        <div class="toc-section">
                            <div class="toc-section-header">
                                <span class="toc-icon"><i class="fas fa-stethoscope"></i></span>
                                <span>Clinical Assessment</span>
                            </div>
                            <div class="toc-items">
                                <div class="toc-item"><span class="toc-num">6</span> Physical Examination</div>
                                <div class="toc-item"><span class="toc-num">7</span> Geriatric Assessment</div>
                                <div class="toc-item"><span class="toc-num">8</span> Laboratory Results</div>
                                <div class="toc-item"><span class="toc-num">9</span> Imaging Studies</div>
                            </div>
                        </div>
                    </div>
                    <div class="toc-column">
                        <div class="toc-section">
                            <div class="toc-section-header">
                                <span class="toc-icon"><i class="fas fa-diagnoses"></i></span>
                                <span>Diagnosis</span>
                            </div>
                            <div class="toc-items">
                                <div class="toc-item"><span class="toc-num">10</span> Differential Diagnosis</div>
                                <div class="toc-item"><span class="toc-num">11</span> Working Diagnosis</div>
                                <div class="toc-item"><span class="toc-num">12</span> Disease Overview</div>
                                <div class="toc-item"><span class="toc-num">13</span> Pathophysiology</div>
                                <div class="toc-item"><span class="toc-num">14</span> Epidemiology & Risk Factors</div>
                            </div>
                        </div>
                        <div class="toc-section">
                            <div class="toc-section-header">
                                <span class="toc-icon"><i class="fas fa-prescription-bottle-alt"></i></span>
                                <span>Management</span>
                            </div>
                            <div class="toc-items">
                                <div class="toc-item"><span class="toc-num">15</span> Treatment Algorithm</div>
                                <div class="toc-item"><span class="toc-num">16</span> Pharmacotherapy</div>
                                <div class="toc-item"><span class="toc-num">17</span> Non-Pharmacologic Interventions</div>
                                <div class="toc-item"><span class="toc-num">18</span> Prognosis & Follow-up</div>
                                <div class="toc-item"><span class="toc-num">19</span> Teaching Points</div>
                                <div class="toc-item"><span class="toc-num">20</span> Take-Home Messages</div>
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
        defaultData: {}
    },

    // ==================== TAKE HOME MESSAGE ====================
    'take-home': {
        name: 'Take-Home Messages',
        category: 'conclusion',
        render: (data) => `
            <div class="slide slide-take-home">
                <div class="take-home-header">
                    <div class="take-home-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h2>Take-Home Messages</h2>
                </div>
                <div class="take-home-grid">
                    <div class="take-home-card primary">
                        <div class="take-home-number">1</div>
                        <div class="take-home-content" contenteditable="true" data-field="message1" data-placeholder="Key clinical message #1">${data.message1 || ''}</div>
                    </div>
                    <div class="take-home-card">
                        <div class="take-home-number">2</div>
                        <div class="take-home-content" contenteditable="true" data-field="message2" data-placeholder="Key clinical message #2">${data.message2 || ''}</div>
                    </div>
                    <div class="take-home-card">
                        <div class="take-home-number">3</div>
                        <div class="take-home-content" contenteditable="true" data-field="message3" data-placeholder="Key clinical message #3">${data.message3 || ''}</div>
                    </div>
                    <div class="take-home-card accent">
                        <div class="take-home-number">4</div>
                        <div class="take-home-content" contenteditable="true" data-field="message4" data-placeholder="Remember this!">${data.message4 || ''}</div>
                    </div>
                </div>
                <div class="take-home-bottom">
                    <div class="bottom-line-box">
                        <i class="fas fa-quote-left"></i>
                        <span contenteditable="true" data-field="bottomLine" data-placeholder="One sentence bottom line...">${data.bottomLine || ''}</span>
                        <i class="fas fa-quote-right"></i>
                    </div>
                </div>
                <div class="slide-footer" style="color: white; opacity: 0.7;">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== STATISTICS VISUAL ====================
    'statistics-visual': {
        name: 'Statistics & Data',
        category: 'data',
        render: (data) => `
            <div class="slide slide-content slide-statistics">
                <h2><i class="fas fa-chart-bar" style="margin-right: 12px; color: var(--secondary);"></i>Key Statistics</h2>
                <div class="stats-visual-grid">
                    <div class="stat-card stat-primary">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-value" contenteditable="true" data-field="stat1Value" data-placeholder="65%">${data.stat1Value || ''}</div>
                        <div class="stat-label" contenteditable="true" data-field="stat1Label" data-placeholder="Prevalence in elderly">${data.stat1Label || ''}</div>
                        <div class="stat-sublabel" contenteditable="true" data-field="stat1Sub" data-placeholder="(≥65 years)">${data.stat1Sub || ''}</div>
                    </div>
                    <div class="stat-card stat-secondary">
                        <div class="stat-icon"><i class="fas fa-hospital-user"></i></div>
                        <div class="stat-value" contenteditable="true" data-field="stat2Value" data-placeholder="2.5x">${data.stat2Value || ''}</div>
                        <div class="stat-label" contenteditable="true" data-field="stat2Label" data-placeholder="Increased mortality">${data.stat2Label || ''}</div>
                        <div class="stat-sublabel" contenteditable="true" data-field="stat2Sub" data-placeholder="vs. younger adults">${data.stat2Sub || ''}</div>
                    </div>
                    <div class="stat-card stat-accent">
                        <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="stat-value" contenteditable="true" data-field="stat3Value" data-placeholder="48h">${data.stat3Value || ''}</div>
                        <div class="stat-label" contenteditable="true" data-field="stat3Label" data-placeholder="Critical window">${data.stat3Label || ''}</div>
                        <div class="stat-sublabel" contenteditable="true" data-field="stat3Sub" data-placeholder="for intervention">${data.stat3Sub || ''}</div>
                    </div>
                    <div class="stat-card stat-warning">
                        <div class="stat-icon"><i class="fas fa-pills"></i></div>
                        <div class="stat-value" contenteditable="true" data-field="stat4Value" data-placeholder="5+">${data.stat4Value || ''}</div>
                        <div class="stat-label" contenteditable="true" data-field="stat4Label" data-placeholder="Medications">${data.stat4Label || ''}</div>
                        <div class="stat-sublabel" contenteditable="true" data-field="stat4Sub" data-placeholder="average in this population">${data.stat4Sub || ''}</div>
                    </div>
                </div>
                <div class="citation-note" contenteditable="true" data-field="statsCitations" data-placeholder="Data sources: [1,2,3]">${data.statsCitations || ''}</div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== BAR CHART SLIDE ====================
    'chart-bar': {
        name: 'Bar Chart',
        category: 'data',
        render: (data) => `
            <div class="slide slide-content slide-chart">
                <h2 contenteditable="true" data-field="chartTitle" data-placeholder="Chart Title">${data.chartTitle || ''}</h2>
                <div class="chart-container">
                    <div class="bar-chart">
                        <div class="bar-chart-bars">
                            <div class="bar-item">
                                <div class="bar-label" contenteditable="true" data-field="bar1Label">${data.bar1Label || 'Group A'}</div>
                                <div class="bar-wrapper">
                                    <div class="bar bar-primary" style="height: ${data.bar1Value || 75}%"></div>
                                </div>
                                <div class="bar-value" contenteditable="true" data-field="bar1Value">${data.bar1Value || '75'}%</div>
                            </div>
                            <div class="bar-item">
                                <div class="bar-label" contenteditable="true" data-field="bar2Label">${data.bar2Label || 'Group B'}</div>
                                <div class="bar-wrapper">
                                    <div class="bar bar-secondary" style="height: ${data.bar2Value || 45}%"></div>
                                </div>
                                <div class="bar-value" contenteditable="true" data-field="bar2Value">${data.bar2Value || '45'}%</div>
                            </div>
                            <div class="bar-item">
                                <div class="bar-label" contenteditable="true" data-field="bar3Label">${data.bar3Label || 'Group C'}</div>
                                <div class="bar-wrapper">
                                    <div class="bar bar-accent" style="height: ${data.bar3Value || 60}%"></div>
                                </div>
                                <div class="bar-value" contenteditable="true" data-field="bar3Value">${data.bar3Value || '60'}%</div>
                            </div>
                            <div class="bar-item">
                                <div class="bar-label" contenteditable="true" data-field="bar4Label">${data.bar4Label || 'Group D'}</div>
                                <div class="bar-wrapper">
                                    <div class="bar bar-warning" style="height: ${data.bar4Value || 30}%"></div>
                                </div>
                                <div class="bar-value" contenteditable="true" data-field="bar4Value">${data.bar4Value || '30'}%</div>
                            </div>
                        </div>
                    </div>
                    <div class="chart-legend">
                        <div class="legend-item"><span class="legend-color primary"></span><span contenteditable="true" data-field="legend1">${data.legend1 || 'Category 1'}</span></div>
                        <div class="legend-item"><span class="legend-color secondary"></span><span contenteditable="true" data-field="legend2">${data.legend2 || 'Category 2'}</span></div>
                        <div class="legend-item"><span class="legend-color accent"></span><span contenteditable="true" data-field="legend3">${data.legend3 || 'Category 3'}</span></div>
                        <div class="legend-item"><span class="legend-color warning"></span><span contenteditable="true" data-field="legend4">${data.legend4 || 'Category 4'}</span></div>
                    </div>
                </div>
                <div class="chart-source" contenteditable="true" data-field="chartSource" data-placeholder="Source: [Reference]">${data.chartSource || ''}</div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== PIE/DONUT CHART ====================
    'chart-pie': {
        name: 'Pie Chart',
        category: 'data',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="chartTitle" data-placeholder="Distribution Chart">${data.chartTitle || ''}</h2>
                <div class="pie-chart-container">
                    <div class="pie-chart">
                        <svg viewBox="0 0 200 200" class="pie-svg">
                            <circle cx="100" cy="100" r="80" class="pie-segment seg-1"
                                stroke-dasharray="${(data.seg1 || 40) * 5.02} 502"
                                stroke-dashoffset="0"/>
                            <circle cx="100" cy="100" r="80" class="pie-segment seg-2"
                                stroke-dasharray="${(data.seg2 || 30) * 5.02} 502"
                                stroke-dashoffset="${-(data.seg1 || 40) * 5.02}"/>
                            <circle cx="100" cy="100" r="80" class="pie-segment seg-3"
                                stroke-dasharray="${(data.seg3 || 20) * 5.02} 502"
                                stroke-dashoffset="${-((data.seg1 || 40) + (data.seg2 || 30)) * 5.02}"/>
                            <circle cx="100" cy="100" r="80" class="pie-segment seg-4"
                                stroke-dasharray="${(data.seg4 || 10) * 5.02} 502"
                                stroke-dashoffset="${-((data.seg1 || 40) + (data.seg2 || 30) + (data.seg3 || 20)) * 5.02}"/>
                            <circle cx="100" cy="100" r="50" class="pie-center"/>
                        </svg>
                        <div class="pie-center-text">
                            <span class="pie-total" contenteditable="true" data-field="pieTotal">${data.pieTotal || 'N=100'}</span>
                        </div>
                    </div>
                    <div class="pie-legend">
                        <div class="pie-legend-item">
                            <span class="pie-color seg-1"></span>
                            <span class="pie-label" contenteditable="true" data-field="seg1Label">${data.seg1Label || 'Category A'}</span>
                            <span class="pie-value" contenteditable="true" data-field="seg1">${data.seg1 || '40'}%</span>
                        </div>
                        <div class="pie-legend-item">
                            <span class="pie-color seg-2"></span>
                            <span class="pie-label" contenteditable="true" data-field="seg2Label">${data.seg2Label || 'Category B'}</span>
                            <span class="pie-value" contenteditable="true" data-field="seg2">${data.seg2 || '30'}%</span>
                        </div>
                        <div class="pie-legend-item">
                            <span class="pie-color seg-3"></span>
                            <span class="pie-label" contenteditable="true" data-field="seg3Label">${data.seg3Label || 'Category C'}</span>
                            <span class="pie-value" contenteditable="true" data-field="seg3">${data.seg3 || '20'}%</span>
                        </div>
                        <div class="pie-legend-item">
                            <span class="pie-color seg-4"></span>
                            <span class="pie-label" contenteditable="true" data-field="seg4Label">${data.seg4Label || 'Category D'}</span>
                            <span class="pie-value" contenteditable="true" data-field="seg4">${data.seg4 || '10'}%</span>
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

    // ==================== IMAGE SLIDE ====================
    'image-full': {
        name: 'Full Image',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-content slide-image-full">
                <h2 contenteditable="true" data-field="imageTitle" data-placeholder="Image Title">${data.imageTitle || ''}</h2>
                <div class="image-container">
                    <img src="${data.imageUrl || MedicalImages['chest-xray']}" alt="Medical image" class="slide-image" onclick="promptImageUrl(this)"/>
                    <div class="image-caption" contenteditable="true" data-field="imageCaption" data-placeholder="Figure 1: Image description and findings">${data.imageCaption || ''}</div>
                </div>
                <div class="image-annotations" contenteditable="true" data-field="annotations" data-placeholder="Key findings: A) Finding 1  B) Finding 2  C) Finding 3">${data.annotations || ''}</div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {
            imageUrl: MedicalImages['chest-xray']
        }
    },

    // ==================== TWO IMAGES COMPARISON ====================
    'image-comparison': {
        name: 'Image Comparison',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="compTitle" data-placeholder="Before & After / Comparison">${data.compTitle || ''}</h2>
                <div class="image-comparison-grid">
                    <div class="comparison-image-box">
                        <div class="comparison-label" contenteditable="true" data-field="label1">${data.label1 || 'Before / Image A'}</div>
                        <img src="${data.image1Url || MedicalImages['ct-brain']}" alt="Comparison image 1" onclick="promptImageUrl(this)"/>
                        <div class="comparison-caption" contenteditable="true" data-field="caption1" data-placeholder="Description of findings">${data.caption1 || ''}</div>
                    </div>
                    <div class="comparison-image-box">
                        <div class="comparison-label" contenteditable="true" data-field="label2">${data.label2 || 'After / Image B'}</div>
                        <img src="${data.image2Url || MedicalImages['ct-brain']}" alt="Comparison image 2" onclick="promptImageUrl(this)"/>
                        <div class="comparison-caption" contenteditable="true" data-field="caption2" data-placeholder="Description of findings">${data.caption2 || ''}</div>
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

    // ==================== ALGORITHM/FLOWCHART ====================
    'algorithm': {
        name: 'Clinical Algorithm',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-content slide-algorithm">
                <h2><i class="fas fa-project-diagram" style="margin-right: 12px; color: var(--secondary);"></i><span contenteditable="true" data-field="algoTitle" data-placeholder="Treatment Algorithm">${data.algoTitle || ''}</span></h2>
                <div class="algorithm-container">
                    <div class="algo-start">
                        <div class="algo-box algo-start-box" contenteditable="true" data-field="algoStart" data-placeholder="Patient presents with...">${data.algoStart || ''}</div>
                    </div>
                    <div class="algo-arrow"><i class="fas fa-arrow-down"></i></div>
                    <div class="algo-decision">
                        <div class="algo-box algo-decision-box" contenteditable="true" data-field="algoDecision" data-placeholder="Assessment / Decision point">${data.algoDecision || ''}</div>
                    </div>
                    <div class="algo-branches">
                        <div class="algo-branch algo-branch-yes">
                            <div class="branch-label">Yes</div>
                            <div class="algo-arrow"><i class="fas fa-arrow-down"></i></div>
                            <div class="algo-box algo-action-box yes" contenteditable="true" data-field="algoYes" data-placeholder="Action if Yes">${data.algoYes || ''}</div>
                        </div>
                        <div class="algo-branch algo-branch-no">
                            <div class="branch-label">No</div>
                            <div class="algo-arrow"><i class="fas fa-arrow-down"></i></div>
                            <div class="algo-box algo-action-box no" contenteditable="true" data-field="algoNo" data-placeholder="Action if No">${data.algoNo || ''}</div>
                        </div>
                    </div>
                    <div class="algo-arrow"><i class="fas fa-arrow-down"></i></div>
                    <div class="algo-end">
                        <div class="algo-box algo-end-box" contenteditable="true" data-field="algoEnd" data-placeholder="Outcome / Next steps">${data.algoEnd || ''}</div>
                    </div>
                </div>
                <div class="citation-note" contenteditable="true" data-field="algoCitation" data-placeholder="Adapted from: [Reference]">${data.algoCitation || ''}</div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== TIMELINE ====================
    'timeline-visual': {
        name: 'Visual Timeline',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-content">
                <h2><i class="fas fa-stream" style="margin-right: 12px; color: var(--secondary);"></i><span contenteditable="true" data-field="timelineTitle" data-placeholder="Clinical Timeline">${data.timelineTitle || ''}</span></h2>
                <div class="visual-timeline">
                    <div class="timeline-track"></div>
                    <div class="timeline-events">
                        <div class="timeline-event event-1">
                            <div class="event-dot"></div>
                            <div class="event-content">
                                <div class="event-time" contenteditable="true" data-field="time1" data-placeholder="Day 0">${data.time1 || ''}</div>
                                <div class="event-title" contenteditable="true" data-field="event1Title" data-placeholder="Event 1">${data.event1Title || ''}</div>
                                <div class="event-desc" contenteditable="true" data-field="event1Desc" data-placeholder="Description">${data.event1Desc || ''}</div>
                            </div>
                        </div>
                        <div class="timeline-event event-2">
                            <div class="event-dot"></div>
                            <div class="event-content">
                                <div class="event-time" contenteditable="true" data-field="time2" data-placeholder="Day 3">${data.time2 || ''}</div>
                                <div class="event-title" contenteditable="true" data-field="event2Title" data-placeholder="Event 2">${data.event2Title || ''}</div>
                                <div class="event-desc" contenteditable="true" data-field="event2Desc" data-placeholder="Description">${data.event2Desc || ''}</div>
                            </div>
                        </div>
                        <div class="timeline-event event-3">
                            <div class="event-dot"></div>
                            <div class="event-content">
                                <div class="event-time" contenteditable="true" data-field="time3" data-placeholder="Day 7">${data.time3 || ''}</div>
                                <div class="event-title" contenteditable="true" data-field="event3Title" data-placeholder="Event 3">${data.event3Title || ''}</div>
                                <div class="event-desc" contenteditable="true" data-field="event3Desc" data-placeholder="Description">${data.event3Desc || ''}</div>
                            </div>
                        </div>
                        <div class="timeline-event event-4">
                            <div class="event-dot"></div>
                            <div class="event-content">
                                <div class="event-time" contenteditable="true" data-field="time4" data-placeholder="Day 14">${data.time4 || ''}</div>
                                <div class="event-title" contenteditable="true" data-field="event4Title" data-placeholder="Event 4">${data.event4Title || ''}</div>
                                <div class="event-desc" contenteditable="true" data-field="event4Desc" data-placeholder="Description">${data.event4Desc || ''}</div>
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
        defaultData: {}
    },

    // ==================== KEY POINTS WITH ICONS ====================
    'key-points-visual': {
        name: 'Key Points (Visual)',
        category: 'content',
        render: (data) => `
            <div class="slide slide-content">
                <h2 contenteditable="true" data-field="kpTitle" data-placeholder="Key Points">${data.kpTitle || ''}</h2>
                <div class="key-points-grid">
                    <div class="key-point-card kp-1">
                        <div class="kp-icon"><i class="fas fa-exclamation-circle"></i></div>
                        <div class="kp-content" contenteditable="true" data-field="kp1" data-placeholder="Key point 1">${data.kp1 || ''}</div>
                    </div>
                    <div class="key-point-card kp-2">
                        <div class="kp-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="kp-content" contenteditable="true" data-field="kp2" data-placeholder="Key point 2">${data.kp2 || ''}</div>
                    </div>
                    <div class="key-point-card kp-3">
                        <div class="kp-icon"><i class="fas fa-star"></i></div>
                        <div class="kp-content" contenteditable="true" data-field="kp3" data-placeholder="Key point 3">${data.kp3 || ''}</div>
                    </div>
                    <div class="key-point-card kp-4">
                        <div class="kp-icon"><i class="fas fa-lightbulb"></i></div>
                        <div class="kp-content" contenteditable="true" data-field="kp4" data-placeholder="Key point 4">${data.kp4 || ''}</div>
                    </div>
                    <div class="key-point-card kp-5">
                        <div class="kp-icon"><i class="fas fa-hand-point-right"></i></div>
                        <div class="kp-content" contenteditable="true" data-field="kp5" data-placeholder="Key point 5">${data.kp5 || ''}</div>
                    </div>
                    <div class="key-point-card kp-6">
                        <div class="kp-icon"><i class="fas fa-bookmark"></i></div>
                        <div class="kp-content" contenteditable="true" data-field="kp6" data-placeholder="Key point 6">${data.kp6 || ''}</div>
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

    // ==================== REFERENCES SLIDE (FORMATTED) ====================
    'references-formatted': {
        name: 'References (Formatted)',
        category: 'end',
        render: (data) => `
            <div class="slide slide-content slide-references">
                <h2><i class="fas fa-book-medical" style="margin-right: 12px; color: var(--secondary);"></i>References</h2>
                <div class="references-container">
                    <div class="references-list-formatted" id="references-list">
                        ${data.references || `
                        <div class="reference-entry">
                            <span class="ref-num">1.</span>
                            <span class="ref-text">Author AA, Author BB. Title of the article. <em>Journal Name</em>. Year;Volume(Issue):Pages. doi:XX.XXXX</span>
                        </div>
                        <div class="reference-entry">
                            <span class="ref-num">2.</span>
                            <span class="ref-text">Author CC, Author DD, Author EE, et al. Another important article. <em>Journal Name</em>. Year;Volume:Pages.</span>
                        </div>
                        <div class="reference-entry">
                            <span class="ref-num">3.</span>
                            <span class="ref-text">Guidelines Committee. Clinical Practice Guidelines for Management of X. <em>Organization</em>. Year.</span>
                        </div>
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

    // ==================== PATHOPHYSIOLOGY DIAGRAM ====================
    'pathophysiology': {
        name: 'Pathophysiology',
        category: 'disease',
        render: (data) => `
            <div class="slide slide-content slide-pathophys">
                <h2><i class="fas fa-dna" style="margin-right: 12px; color: var(--secondary);"></i><span contenteditable="true" data-field="pathTitle" data-placeholder="Pathophysiology">${data.pathTitle || ''}</span></h2>
                <div class="pathophys-diagram">
                    <div class="path-flow">
                        <div class="path-step path-trigger">
                            <div class="path-step-header">Trigger / Etiology</div>
                            <div class="path-step-content" contenteditable="true" data-field="trigger" data-placeholder="Initial insult or cause">${data.trigger || ''}</div>
                        </div>
                        <div class="path-arrow"><i class="fas fa-long-arrow-alt-down"></i></div>
                        <div class="path-step path-mechanism">
                            <div class="path-step-header">Mechanism</div>
                            <div class="path-step-content" contenteditable="true" data-field="mechanism" data-placeholder="Cellular/molecular changes">${data.mechanism || ''}</div>
                        </div>
                        <div class="path-arrow"><i class="fas fa-long-arrow-alt-down"></i></div>
                        <div class="path-step path-effects">
                            <div class="path-step-header">Pathological Effects</div>
                            <div class="path-step-content" contenteditable="true" data-field="effects" data-placeholder="Tissue/organ changes">${data.effects || ''}</div>
                        </div>
                        <div class="path-arrow"><i class="fas fa-long-arrow-alt-down"></i></div>
                        <div class="path-step path-clinical">
                            <div class="path-step-header">Clinical Manifestations</div>
                            <div class="path-step-content" contenteditable="true" data-field="clinical" data-placeholder="Signs and symptoms">${data.clinical || ''}</div>
                        </div>
                    </div>
                    <div class="path-sidebar">
                        <div class="path-note">
                            <div class="path-note-header"><i class="fas fa-user-md"></i> Geriatric Factors</div>
                            <div class="path-note-content" contenteditable="true" data-field="geriatricFactors" data-placeholder="Age-related changes affecting pathophysiology">${data.geriatricFactors || ''}</div>
                        </div>
                    </div>
                </div>
                <div class="citation-note" contenteditable="true" data-field="pathCitation" data-placeholder="[1,2]">${data.pathCitation || ''}</div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== RISK FACTORS VISUAL ====================
    'risk-factors': {
        name: 'Risk Factors',
        category: 'disease',
        render: (data) => `
            <div class="slide slide-content">
                <h2><i class="fas fa-exclamation-triangle" style="margin-right: 12px; color: var(--accent-warning);"></i>Risk Factors</h2>
                <div class="risk-factors-grid">
                    <div class="risk-category modifiable">
                        <div class="risk-header">
                            <i class="fas fa-check-circle"></i>
                            <span>Modifiable</span>
                        </div>
                        <div class="risk-items" contenteditable="true" data-field="modifiable" data-placeholder="• Smoking&#10;• Obesity&#10;• Physical inactivity&#10;• Diet">${data.modifiable || ''}</div>
                    </div>
                    <div class="risk-category non-modifiable">
                        <div class="risk-header">
                            <i class="fas fa-times-circle"></i>
                            <span>Non-Modifiable</span>
                        </div>
                        <div class="risk-items" contenteditable="true" data-field="nonModifiable" data-placeholder="• Age&#10;• Genetics&#10;• Family history&#10;• Sex">${data.nonModifiable || ''}</div>
                    </div>
                    <div class="risk-category geriatric">
                        <div class="risk-header">
                            <i class="fas fa-user-md"></i>
                            <span>Geriatric-Specific</span>
                        </div>
                        <div class="risk-items" contenteditable="true" data-field="geriatricRisk" data-placeholder="• Frailty&#10;• Polypharmacy&#10;• Cognitive impairment&#10;• Falls history">${data.geriatricRisk || ''}</div>
                    </div>
                </div>
                <div class="risk-stats">
                    <div class="risk-stat">
                        <div class="risk-stat-value" contenteditable="true" data-field="riskStat1">${data.riskStat1 || 'OR 2.5'}</div>
                        <div class="risk-stat-label" contenteditable="true" data-field="riskLabel1">${data.riskLabel1 || 'Age ≥75'}</div>
                    </div>
                    <div class="risk-stat">
                        <div class="risk-stat-value" contenteditable="true" data-field="riskStat2">${data.riskStat2 || 'OR 3.1'}</div>
                        <div class="risk-stat-label" contenteditable="true" data-field="riskLabel2">${data.riskLabel2 || 'Prior episode'}</div>
                    </div>
                    <div class="risk-stat">
                        <div class="risk-stat-value" contenteditable="true" data-field="riskStat3">${data.riskStat3 || 'OR 1.8'}</div>
                        <div class="risk-stat-label" contenteditable="true" data-field="riskLabel3">${data.riskLabel3 || 'Comorbidity'}</div>
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

    // ==================== MEDICATION TABLE WITH HIGHLIGHTS ====================
    'medications-detailed': {
        name: 'Medications (Detailed)',
        category: 'case',
        render: (data) => `
            <div class="slide slide-content">
                <h2><i class="fas fa-pills" style="margin-right: 12px; color: var(--secondary);"></i>Medication Review</h2>
                <div class="med-review-container">
                    <table class="medications-table detailed">
                        <thead>
                            <tr>
                                <th>Medication</th>
                                <th>Dose</th>
                                <th>Frequency</th>
                                <th>Indication</th>
                                <th>Concerns</th>
                            </tr>
                        </thead>
                        <tbody contenteditable="true" data-field="medTable">
                            ${data.medTable || `
                            <tr class="med-normal">
                                <td>Metoprolol</td>
                                <td>25 mg</td>
                                <td>BID</td>
                                <td>HTN, AF</td>
                                <td>-</td>
                            </tr>
                            <tr class="med-beers">
                                <td>Diphenhydramine <span class="med-flag beers">BEERS</span></td>
                                <td>25 mg</td>
                                <td>PRN</td>
                                <td>Insomnia</td>
                                <td>Anticholinergic</td>
                            </tr>
                            <tr class="med-caution">
                                <td>Warfarin <span class="med-flag interaction">DDI</span></td>
                                <td>5 mg</td>
                                <td>Daily</td>
                                <td>AF</td>
                                <td>INR monitoring</td>
                            </tr>
                            `}
                        </tbody>
                    </table>
                    <div class="med-summary">
                        <div class="med-count">
                            <span class="count-number" contenteditable="true" data-field="medCount">${data.medCount || '8'}</span>
                            <span class="count-label">Total Medications</span>
                        </div>
                        <div class="med-alerts">
                            <div class="alert-item beers-alert">
                                <i class="fas fa-exclamation-triangle"></i>
                                <span contenteditable="true" data-field="beersCount">${data.beersCount || '2'}</span> Beers Criteria
                            </div>
                            <div class="alert-item interaction-alert">
                                <i class="fas fa-random"></i>
                                <span contenteditable="true" data-field="ddiCount">${data.ddiCount || '1'}</span> Drug Interaction
                            </div>
                        </div>
                    </div>
                </div>
                <div class="citation-note" contenteditable="true" data-field="medCitation" data-placeholder="Beers Criteria 2023 [1]">${data.medCitation || ''}</div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                    <div></div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    // ==================== NEW VISUAL LAYOUTS ====================

    'quote': {
        name: 'Quote / Statement',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-quote">
                <div class="quote-container">
                    <div class="quote-mark">"</div>
                    <blockquote contenteditable="true" data-field="quote" data-placeholder="Enter an impactful quote or key statement...">${data.quote || ''}</blockquote>
                    <div class="quote-attribution">
                        <span contenteditable="true" data-field="author" data-placeholder="— Author Name">${data.author || ''}</span>
                        <span class="quote-source" contenteditable="true" data-field="source" data-placeholder="Source, Year">${data.source || ''}</span>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: { quote: '', author: '', source: '' }
    },

    'big-number': {
        name: 'Big Number / Statistic',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-big-number">
                <div class="big-number-container">
                    <div class="big-number-value" contenteditable="true" data-field="number" data-placeholder="85%">${data.number || ''}</div>
                    <div class="big-number-label" contenteditable="true" data-field="label" data-placeholder="of elderly patients experience...">${data.label || ''}</div>
                    <div class="big-number-context" contenteditable="true" data-field="context" data-placeholder="Additional context or source">${data.context || ''}</div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: { number: '', label: '', context: '' }
    },

    'icon-grid': {
        name: 'Icon Grid (Features)',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-icon-grid">
                <h2 contenteditable="true" data-field="title" data-placeholder="Key Features">${data.title || ''}</h2>
                <div class="icon-grid-container">
                    <div class="icon-grid-item">
                        <div class="icon-circle" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);"><i class="fas fa-heart"></i></div>
                        <h4 contenteditable="true" data-field="item1Title" data-placeholder="Feature 1">${data.item1Title || ''}</h4>
                        <p contenteditable="true" data-field="item1Desc" data-placeholder="Description">${data.item1Desc || ''}</p>
                    </div>
                    <div class="icon-grid-item">
                        <div class="icon-circle" style="background: linear-gradient(135deg, #10b981, #34d399);"><i class="fas fa-pills"></i></div>
                        <h4 contenteditable="true" data-field="item2Title" data-placeholder="Feature 2">${data.item2Title || ''}</h4>
                        <p contenteditable="true" data-field="item2Desc" data-placeholder="Description">${data.item2Desc || ''}</p>
                    </div>
                    <div class="icon-grid-item">
                        <div class="icon-circle" style="background: linear-gradient(135deg, #f59e0b, #fbbf24);"><i class="fas fa-user-md"></i></div>
                        <h4 contenteditable="true" data-field="item3Title" data-placeholder="Feature 3">${data.item3Title || ''}</h4>
                        <p contenteditable="true" data-field="item3Desc" data-placeholder="Description">${data.item3Desc || ''}</p>
                    </div>
                    <div class="icon-grid-item">
                        <div class="icon-circle" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa);"><i class="fas fa-chart-line"></i></div>
                        <h4 contenteditable="true" data-field="item4Title" data-placeholder="Feature 4">${data.item4Title || ''}</h4>
                        <p contenteditable="true" data-field="item4Desc" data-placeholder="Description">${data.item4Desc || ''}</p>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'process-steps': {
        name: 'Process Steps',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-process-steps">
                <h2 contenteditable="true" data-field="title" data-placeholder="Process Overview">${data.title || ''}</h2>
                <div class="steps-container">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4 contenteditable="true" data-field="step1Title" data-placeholder="Step 1">${data.step1Title || ''}</h4>
                            <p contenteditable="true" data-field="step1Desc" data-placeholder="Description">${data.step1Desc || ''}</p>
                        </div>
                        <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4 contenteditable="true" data-field="step2Title" data-placeholder="Step 2">${data.step2Title || ''}</h4>
                            <p contenteditable="true" data-field="step2Desc" data-placeholder="Description">${data.step2Desc || ''}</p>
                        </div>
                        <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4 contenteditable="true" data-field="step3Title" data-placeholder="Step 3">${data.step3Title || ''}</h4>
                            <p contenteditable="true" data-field="step3Desc" data-placeholder="Description">${data.step3Desc || ''}</p>
                        </div>
                        <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4 contenteditable="true" data-field="step4Title" data-placeholder="Step 4">${data.step4Title || ''}</h4>
                            <p contenteditable="true" data-field="step4Desc" data-placeholder="Description">${data.step4Desc || ''}</p>
                        </div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'before-after': {
        name: 'Before / After Comparison',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-before-after">
                <h2 contenteditable="true" data-field="title" data-placeholder="Comparison">${data.title || ''}</h2>
                <div class="before-after-container">
                    <div class="before-section">
                        <div class="section-header before-header">
                            <i class="fas fa-times-circle"></i>
                            <span contenteditable="true" data-field="beforeLabel" data-placeholder="Before / Problem">${data.beforeLabel || 'Before'}</span>
                        </div>
                        <div class="section-content" contenteditable="true" data-field="beforeContent" data-placeholder="Describe the before state or problem...">${data.beforeContent || ''}</div>
                    </div>
                    <div class="divider-arrow">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="after-section">
                        <div class="section-header after-header">
                            <i class="fas fa-check-circle"></i>
                            <span contenteditable="true" data-field="afterLabel" data-placeholder="After / Solution">${data.afterLabel || 'After'}</span>
                        </div>
                        <div class="section-content" contenteditable="true" data-field="afterContent" data-placeholder="Describe the after state or solution...">${data.afterContent || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: { beforeLabel: 'Before', afterLabel: 'After' }
    },

    'hero-image': {
        name: 'Hero Image with Text',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-hero-image" style="background-image: url('${data.imageUrl || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 450%22><rect fill=%22%231e3a5f%22 width=%22800%22 height=%22450%22/><text x=%22400%22 y=%22225%22 fill=%22%23fff%22 font-size=%2220%22 text-anchor=%22middle%22>Click to add image</text></svg>'}');">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <h1 contenteditable="true" data-field="heroTitle" data-placeholder="Hero Title">${data.heroTitle || ''}</h1>
                    <p contenteditable="true" data-field="heroSubtitle" data-placeholder="Subtitle or key message">${data.heroSubtitle || ''}</p>
                </div>
                <div class="image-edit-hint" onclick="promptImageUrl(this.parentElement)" title="Click to change image">
                    <i class="fas fa-camera"></i> Change Image
                </div>
                <div class="slide-footer hero-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: { imageUrl: '', heroTitle: '', heroSubtitle: '' }
    },

    'cards-grid': {
        name: 'Info Cards Grid',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-cards-grid">
                <h2 contenteditable="true" data-field="title" data-placeholder="Overview">${data.title || ''}</h2>
                <div class="cards-container">
                    <div class="info-card card-blue">
                        <div class="card-icon"><i class="fas fa-info-circle"></i></div>
                        <h4 contenteditable="true" data-field="card1Title" data-placeholder="Card 1">${data.card1Title || ''}</h4>
                        <p contenteditable="true" data-field="card1Content" data-placeholder="Content...">${data.card1Content || ''}</p>
                    </div>
                    <div class="info-card card-green">
                        <div class="card-icon"><i class="fas fa-check-circle"></i></div>
                        <h4 contenteditable="true" data-field="card2Title" data-placeholder="Card 2">${data.card2Title || ''}</h4>
                        <p contenteditable="true" data-field="card2Content" data-placeholder="Content...">${data.card2Content || ''}</p>
                    </div>
                    <div class="info-card card-orange">
                        <div class="card-icon"><i class="fas fa-exclamation-triangle"></i></div>
                        <h4 contenteditable="true" data-field="card3Title" data-placeholder="Card 3">${data.card3Title || ''}</h4>
                        <p contenteditable="true" data-field="card3Content" data-placeholder="Content...">${data.card3Content || ''}</p>
                    </div>
                    <div class="info-card card-purple">
                        <div class="card-icon"><i class="fas fa-lightbulb"></i></div>
                        <h4 contenteditable="true" data-field="card4Title" data-placeholder="Card 4">${data.card4Title || ''}</h4>
                        <p contenteditable="true" data-field="card4Content" data-placeholder="Content...">${data.card4Content || ''}</p>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'gradient-section': {
        name: 'Gradient Section Header',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-gradient-section">
                <div class="gradient-background"></div>
                <div class="section-content-center">
                    <div class="section-icon">
                        <i class="${data.icon || 'fas fa-book-medical'}"></i>
                    </div>
                    <h1 contenteditable="true" data-field="sectionTitle" data-placeholder="Section Title">${data.sectionTitle || ''}</h1>
                    <p contenteditable="true" data-field="sectionSubtitle" data-placeholder="Brief description of this section">${data.sectionSubtitle || ''}</p>
                </div>
            </div>
        `,
        defaultData: { icon: 'fas fa-book-medical' }
    },

    'checklist': {
        name: 'Visual Checklist',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-checklist">
                <h2 contenteditable="true" data-field="title" data-placeholder="Checklist">${data.title || ''}</h2>
                <div class="checklist-container">
                    <div class="checklist-item checked">
                        <div class="check-box"><i class="fas fa-check"></i></div>
                        <span contenteditable="true" data-field="item1" data-placeholder="Checklist item 1">${data.item1 || ''}</span>
                    </div>
                    <div class="checklist-item checked">
                        <div class="check-box"><i class="fas fa-check"></i></div>
                        <span contenteditable="true" data-field="item2" data-placeholder="Checklist item 2">${data.item2 || ''}</span>
                    </div>
                    <div class="checklist-item checked">
                        <div class="check-box"><i class="fas fa-check"></i></div>
                        <span contenteditable="true" data-field="item3" data-placeholder="Checklist item 3">${data.item3 || ''}</span>
                    </div>
                    <div class="checklist-item">
                        <div class="check-box empty"></div>
                        <span contenteditable="true" data-field="item4" data-placeholder="Checklist item 4">${data.item4 || ''}</span>
                    </div>
                    <div class="checklist-item">
                        <div class="check-box empty"></div>
                        <span contenteditable="true" data-field="item5" data-placeholder="Checklist item 5">${data.item5 || ''}</span>
                    </div>
                    <div class="checklist-item">
                        <div class="check-box empty"></div>
                        <span contenteditable="true" data-field="item6" data-placeholder="Checklist item 6">${data.item6 || ''}</span>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'three-column': {
        name: 'Three Column Layout',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-three-column">
                <h2 contenteditable="true" data-field="title" data-placeholder="Title">${data.title || ''}</h2>
                <div class="three-column-container">
                    <div class="column">
                        <div class="column-header" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);">
                            <i class="fas fa-1"></i>
                            <h4 contenteditable="true" data-field="col1Title" data-placeholder="Column 1">${data.col1Title || ''}</h4>
                        </div>
                        <div class="column-content" contenteditable="true" data-field="col1Content" data-placeholder="Content...">${data.col1Content || ''}</div>
                    </div>
                    <div class="column">
                        <div class="column-header" style="background: linear-gradient(135deg, #10b981, #34d399);">
                            <i class="fas fa-2"></i>
                            <h4 contenteditable="true" data-field="col2Title" data-placeholder="Column 2">${data.col2Title || ''}</h4>
                        </div>
                        <div class="column-content" contenteditable="true" data-field="col2Content" data-placeholder="Content...">${data.col2Content || ''}</div>
                    </div>
                    <div class="column">
                        <div class="column-header" style="background: linear-gradient(135deg, #f59e0b, #fbbf24);">
                            <i class="fas fa-3"></i>
                            <h4 contenteditable="true" data-field="col3Title" data-placeholder="Column 3">${data.col3Title || ''}</h4>
                        </div>
                        <div class="column-content" contenteditable="true" data-field="col3Content" data-placeholder="Content...">${data.col3Content || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'pros-cons': {
        name: 'Pros and Cons',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-pros-cons">
                <h2 contenteditable="true" data-field="title" data-placeholder="Pros and Cons">${data.title || ''}</h2>
                <div class="pros-cons-container">
                    <div class="pros-section">
                        <div class="pros-header">
                            <i class="fas fa-thumbs-up"></i>
                            <h3>Pros</h3>
                        </div>
                        <ul class="pros-list" contenteditable="true" data-field="pros" data-placeholder="• Pro 1\n• Pro 2\n• Pro 3">${data.pros || ''}</ul>
                    </div>
                    <div class="cons-section">
                        <div class="cons-header">
                            <i class="fas fa-thumbs-down"></i>
                            <h3>Cons</h3>
                        </div>
                        <ul class="cons-list" contenteditable="true" data-field="cons" data-placeholder="• Con 1\n• Con 2\n• Con 3">${data.cons || ''}</ul>
                    </div>
                </div>
                <div class="verdict-box">
                    <strong>Bottom Line:</strong>
                    <span contenteditable="true" data-field="verdict" data-placeholder="Overall recommendation or conclusion">${data.verdict || ''}</span>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'numbered-list': {
        name: 'Numbered List (Visual)',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-numbered-list">
                <h2 contenteditable="true" data-field="title" data-placeholder="Key Points">${data.title || ''}</h2>
                <div class="numbered-list-container">
                    <div class="numbered-item">
                        <div class="number-badge">1</div>
                        <div class="item-content" contenteditable="true" data-field="point1" data-placeholder="First key point">${data.point1 || ''}</div>
                    </div>
                    <div class="numbered-item">
                        <div class="number-badge">2</div>
                        <div class="item-content" contenteditable="true" data-field="point2" data-placeholder="Second key point">${data.point2 || ''}</div>
                    </div>
                    <div class="numbered-item">
                        <div class="number-badge">3</div>
                        <div class="item-content" contenteditable="true" data-field="point3" data-placeholder="Third key point">${data.point3 || ''}</div>
                    </div>
                    <div class="numbered-item">
                        <div class="number-badge">4</div>
                        <div class="item-content" contenteditable="true" data-field="point4" data-placeholder="Fourth key point">${data.point4 || ''}</div>
                    </div>
                    <div class="numbered-item">
                        <div class="number-badge">5</div>
                        <div class="item-content" contenteditable="true" data-field="point5" data-placeholder="Fifth key point">${data.point5 || ''}</div>
                    </div>
                </div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: {}
    },

    'quiz': {
        name: 'Quiz Question',
        category: 'visual',
        render: (data) => `
            <div class="slide slide-quiz">
                <div class="quiz-header">
                    <i class="fas fa-question-circle"></i>
                    <h2>Quiz Time!</h2>
                </div>
                <div class="quiz-question" contenteditable="true" data-field="question" data-placeholder="Enter your question here...">${data.question || ''}</div>
                <div class="quiz-options">
                    <div class="quiz-option option-a">
                        <span class="option-letter">A</span>
                        <span class="option-text" contenteditable="true" data-field="optionA" data-placeholder="Option A">${data.optionA || ''}</span>
                    </div>
                    <div class="quiz-option option-b">
                        <span class="option-letter">B</span>
                        <span class="option-text" contenteditable="true" data-field="optionB" data-placeholder="Option B">${data.optionB || ''}</span>
                    </div>
                    <div class="quiz-option option-c">
                        <span class="option-letter">C</span>
                        <span class="option-text" contenteditable="true" data-field="optionC" data-placeholder="Option C">${data.optionC || ''}</span>
                    </div>
                    <div class="quiz-option option-d">
                        <span class="option-letter">D</span>
                        <span class="option-text" contenteditable="true" data-field="optionD" data-placeholder="Option D">${data.optionD || ''}</span>
                    </div>
                </div>
                <div class="quiz-answer" contenteditable="true" data-field="answer" data-placeholder="Answer: (revealed on click)">${data.answer || ''}</div>
                <div class="slide-footer">
                    <div class="slide-footer-logo"><i class="fas fa-heartbeat"></i> SZMC Geriatrics</div>
                </div>
            </div>
        `,
        defaultData: { question: '' }
    }
};

// Merge with base templates
Object.assign(SlideTemplates, ExtendedSlideTemplates);

// Extended presets with 20+ slides
const ExtendedTemplatePresets = {
    case: {
        name: 'Case Presentation (Extended)',
        description: 'Complete 20+ slide geriatric case presentation with visuals',
        slides: [
            { type: 'title', data: { subtitle: 'Geriatric Case Presentation' } },
            { type: 'toc', data: {} },
            { type: 'patient-info', data: {} },
            { type: 'hpi', data: {} },
            { type: 'timeline-visual', data: { timelineTitle: 'Clinical Timeline' } },
            { type: 'pmh', data: {} },
            { type: 'medications-detailed', data: {} },
            { type: 'social-history', data: {} },
            { type: 'physical-exam', data: {} },
            { type: 'geriatric-assessment', data: {} },
            { type: 'labs', data: {} },
            { type: 'image-full', data: { imageTitle: 'Imaging Studies' } },
            { type: 'differential', data: {} },
            { type: 'diagnosis', data: {} },
            { type: 'disease-overview', data: {} },
            { type: 'pathophysiology', data: {} },
            { type: 'statistics-visual', data: {} },
            { type: 'risk-factors', data: {} },
            { type: 'algorithm', data: { algoTitle: 'Treatment Algorithm' } },
            { type: 'treatment', data: {} },
            { type: 'prognosis', data: {} },
            { type: 'key-points-visual', data: { kpTitle: 'Teaching Points' } },
            { type: 'take-home', data: {} },
            { type: 'references-formatted', data: {} },
            { type: 'questions', data: {} }
        ]
    },
    journal: {
        name: 'Journal Club (Extended)',
        description: 'Complete 20+ slide journal club with data visualization',
        slides: [
            { type: 'jc-title', data: {} },
            { type: 'toc', data: {} },
            { type: 'jc-background', data: {} },
            { type: 'jc-pico', data: {} },
            { type: 'jc-methods', data: {} },
            { type: 'statistics-visual', data: {} },
            { type: 'chart-bar', data: { chartTitle: 'Primary Outcome Results' } },
            { type: 'jc-results', data: {} },
            { type: 'chart-pie', data: { chartTitle: 'Patient Distribution' } },
            { type: 'jc-statistics', data: {} },
            { type: 'image-comparison', data: { compTitle: 'Forest Plot / Key Figures' } },
            { type: 'jc-discussion', data: {} },
            { type: 'jc-limitations', data: {} },
            { type: 'jc-applicability', data: {} },
            { type: 'key-points-visual', data: { kpTitle: 'Geriatric Considerations' } },
            { type: 'algorithm', data: { algoTitle: 'Clinical Application' } },
            { type: 'jc-conclusion', data: {} },
            { type: 'take-home', data: {} },
            { type: 'references-formatted', data: {} },
            { type: 'questions', data: {} }
        ]
    }
};

// Replace the base presets
Object.assign(TemplatePresets, ExtendedTemplatePresets);

// Helper function to prompt for image URL
function promptImageUrl(imgElement) {
    const url = prompt('Enter image URL:', imgElement.src);
    if (url) {
        imgElement.src = url;
        editor.isDirty = true;
    }
}
