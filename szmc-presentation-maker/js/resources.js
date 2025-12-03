// SZMC Geriatrics Presentation Maker - Medical Resources Integration

// ==================== MEDICAL RESOURCE LINKS ====================
const MedicalResources = {
    // AI-Powered Evidence
    openEvidence: {
        name: 'OpenEvidence AI',
        url: 'https://www.openevidence.com',
        searchUrl: 'https://www.openevidence.com/search?q=',
        description: 'AI-powered clinical decision support with real-time evidence synthesis',
        icon: 'fas fa-robot',
        color: '#6366f1'
    },
    perplexityHealth: {
        name: 'Perplexity Health',
        url: 'https://www.perplexity.ai',
        searchUrl: 'https://www.perplexity.ai/search?q=',
        description: 'AI search with medical focus',
        icon: 'fas fa-brain',
        color: '#20b2aa'
    },

    // Primary Evidence Sources
    pubmed: {
        name: 'PubMed',
        url: 'https://pubmed.ncbi.nlm.nih.gov',
        searchUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=',
        description: 'Biomedical literature database',
        icon: 'fas fa-book-medical',
        color: '#326599'
    },
    cochrane: {
        name: 'Cochrane Library',
        url: 'https://www.cochranelibrary.com',
        searchUrl: 'https://www.cochranelibrary.com/search?q=',
        description: 'Systematic reviews and meta-analyses',
        icon: 'fas fa-search-plus',
        color: '#5c2d91'
    },

    // Clinical Guidelines
    uptodate: {
        name: 'UpToDate',
        url: 'https://www.uptodate.com',
        searchUrl: 'https://www.uptodate.com/contents/search?search=',
        description: 'Clinical decision support resource',
        icon: 'fas fa-graduation-cap',
        color: '#00a3e0'
    },
    dynamed: {
        name: 'DynaMed',
        url: 'https://www.dynamed.com',
        searchUrl: 'https://www.dynamed.com/search?q=',
        description: 'Evidence-based clinical reference',
        icon: 'fas fa-stethoscope',
        color: '#e31837'
    },

    // Geriatric-Specific
    ags: {
        name: 'AGS GeriatricsCareOnline',
        url: 'https://geriatricscareonline.org',
        searchUrl: 'https://geriatricscareonline.org/ProductSearch?search=',
        description: 'American Geriatrics Society resources',
        icon: 'fas fa-user-md',
        color: '#1e3a5f'
    },
    bgs: {
        name: 'BGS Resources',
        url: 'https://www.bgs.org.uk/resources',
        searchUrl: 'https://www.bgs.org.uk/search/node/',
        description: 'British Geriatrics Society',
        icon: 'fas fa-heartbeat',
        color: '#003366'
    },

    // Drug Information
    beers: {
        name: 'Beers Criteria (2023)',
        url: 'https://geriatricscareonline.org/ProductAbstract/american-geriatrics-society-beers-criteria-for-potentially-inappropriate-medication-use-in-older-adults/CL001',
        description: 'AGS Beers Criteria for inappropriate medications',
        icon: 'fas fa-pills',
        color: '#dc3545'
    },
    stopp: {
        name: 'STOPP/START Criteria',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4339726/',
        description: 'European prescribing criteria for elderly',
        icon: 'fas fa-hand-paper',
        color: '#fd7e14'
    },
    lexicomp: {
        name: 'Lexicomp',
        url: 'https://online.lexi.com',
        description: 'Drug information database',
        icon: 'fas fa-capsules',
        color: '#28a745'
    },

    // Calculators & Tools
    mdcalc: {
        name: 'MDCalc',
        url: 'https://www.mdcalc.com',
        searchUrl: 'https://www.mdcalc.com/search?q=',
        description: 'Medical calculators and scores',
        icon: 'fas fa-calculator',
        color: '#2196f3'
    },
    qxmd: {
        name: 'Calculate by QxMD',
        url: 'https://qxmd.com/calculate',
        description: 'Clinical calculators',
        icon: 'fas fa-percentage',
        color: '#ff5722'
    },

    // Guidelines
    nice: {
        name: 'NICE Guidelines',
        url: 'https://www.nice.org.uk/guidance',
        searchUrl: 'https://www.nice.org.uk/search?q=',
        description: 'UK National Institute for Health and Care Excellence',
        icon: 'fas fa-file-medical',
        color: '#005eb8'
    },
    aafp: {
        name: 'AAFP Guidelines',
        url: 'https://www.aafp.org/family-physician/patient-care/clinical-recommendations.html',
        description: 'American Academy of Family Physicians',
        icon: 'fas fa-users',
        color: '#003b71'
    },

    // Imaging
    radiopaedia: {
        name: 'Radiopaedia',
        url: 'https://radiopaedia.org',
        searchUrl: 'https://radiopaedia.org/search?q=',
        description: 'Radiology reference and cases',
        icon: 'fas fa-x-ray',
        color: '#333333'
    },

    // Free Full Text
    pmc: {
        name: 'PubMed Central',
        url: 'https://www.ncbi.nlm.nih.gov/pmc',
        searchUrl: 'https://www.ncbi.nlm.nih.gov/pmc/?term=',
        description: 'Free full-text archive',
        icon: 'fas fa-unlock',
        color: '#20603c'
    }
};

// ==================== GERIATRIC ASSESSMENT TOOLS ====================
const GeriatricTools = {
    cognitive: [
        { name: 'MMSE', fullName: 'Mini-Mental State Examination', mdcalc: 'https://www.mdcalc.com/mini-mental-state-exam-mmse' },
        { name: 'MoCA', fullName: 'Montreal Cognitive Assessment', url: 'https://www.mocatest.org' },
        { name: 'Mini-Cog', fullName: 'Mini-Cog', mdcalc: 'https://www.mdcalc.com/mini-cog' },
        { name: 'CAM', fullName: 'Confusion Assessment Method', mdcalc: 'https://www.mdcalc.com/confusion-assessment-method-cam' },
        { name: '4AT', fullName: '4AT Delirium Screening', mdcalc: 'https://www.mdcalc.com/4-test-delirium-assessment' }
    ],
    functional: [
        { name: 'Barthel Index', fullName: 'Barthel Index for ADLs', mdcalc: 'https://www.mdcalc.com/barthel-index-activities-daily-living-adl' },
        { name: 'Katz ADL', fullName: 'Katz Index of Independence', mdcalc: 'https://www.mdcalc.com/katz-index-independence-activities-daily-living' },
        { name: 'Lawton IADL', fullName: 'Lawton Instrumental ADL', mdcalc: 'https://www.mdcalc.com/lawton-instrumental-activities-daily-living-scale' }
    ],
    mobility: [
        { name: 'TUG', fullName: 'Timed Up and Go', mdcalc: 'https://www.mdcalc.com/timed-up-go-test-tug' },
        { name: 'Gait Speed', fullName: '4-Meter Gait Speed', mdcalc: 'https://www.mdcalc.com/gait-speed' },
        { name: 'Tinetti', fullName: 'Tinetti Balance Assessment', url: 'https://www.apta.org/patient-care/evidence-based-practice-resources/test-measures/tinetti-performance-oriented-mobility-assessment' },
        { name: 'Berg Balance', fullName: 'Berg Balance Scale', mdcalc: 'https://www.mdcalc.com/berg-balance-scale' }
    ],
    nutrition: [
        { name: 'MNA', fullName: 'Mini Nutritional Assessment', url: 'https://www.mna-elderly.com' },
        { name: 'MUST', fullName: 'Malnutrition Universal Screening Tool', url: 'https://www.bapen.org.uk/screening-and-must/must-calculator' }
    ],
    mood: [
        { name: 'GDS-15', fullName: 'Geriatric Depression Scale', mdcalc: 'https://www.mdcalc.com/geriatric-depression-scale-gds' },
        { name: 'PHQ-9', fullName: 'Patient Health Questionnaire', mdcalc: 'https://www.mdcalc.com/phq-9-patient-health-questionnaire-9' },
        { name: 'GAD-7', fullName: 'Generalized Anxiety Disorder 7', mdcalc: 'https://www.mdcalc.com/gad-7-general-anxiety-disorder-7' }
    ],
    frailty: [
        { name: 'CFS', fullName: 'Clinical Frailty Scale', mdcalc: 'https://www.mdcalc.com/clinical-frailty-scale-cfs' },
        { name: 'FRAIL Scale', fullName: 'FRAIL Questionnaire', mdcalc: 'https://www.mdcalc.com/frail-questionnaire' },
        { name: 'Fried Criteria', fullName: 'Fried Frailty Phenotype', url: 'https://pubmed.ncbi.nlm.nih.gov/11253156/' }
    ],
    prognosis: [
        { name: 'ePrognosis', fullName: 'Geriatric Prognosis Calculators', url: 'https://eprognosis.ucsf.edu' },
        { name: 'Surprise Question', fullName: 'Would you be surprised?', description: 'Prognostic tool for palliative care' }
    ]
};

// ==================== EVIDENCE GRADING ====================
const EvidenceGrades = {
    oxford: {
        name: 'Oxford CEBM Levels',
        levels: [
            { level: '1a', description: 'Systematic review of RCTs', color: '#1e8449' },
            { level: '1b', description: 'Individual RCT', color: '#27ae60' },
            { level: '2a', description: 'Systematic review of cohort studies', color: '#f1c40f' },
            { level: '2b', description: 'Individual cohort study', color: '#f39c12' },
            { level: '3a', description: 'Systematic review of case-control studies', color: '#e67e22' },
            { level: '3b', description: 'Individual case-control study', color: '#d35400' },
            { level: '4', description: 'Case series', color: '#e74c3c' },
            { level: '5', description: 'Expert opinion', color: '#c0392b' }
        ]
    },
    grade: {
        name: 'GRADE Quality',
        levels: [
            { level: 'High', description: 'Further research very unlikely to change confidence', color: '#1e8449', icon: '⊕⊕⊕⊕' },
            { level: 'Moderate', description: 'Further research likely to have important impact', color: '#f1c40f', icon: '⊕⊕⊕○' },
            { level: 'Low', description: 'Further research very likely to have important impact', color: '#e67e22', icon: '⊕⊕○○' },
            { level: 'Very Low', description: 'Any estimate of effect is very uncertain', color: '#e74c3c', icon: '⊕○○○' }
        ]
    },
    uspstf: {
        name: 'USPSTF Recommendations',
        levels: [
            { level: 'A', description: 'High certainty of substantial benefit', color: '#1e8449' },
            { level: 'B', description: 'High certainty of moderate benefit', color: '#27ae60' },
            { level: 'C', description: 'Offer selectively based on circumstances', color: '#f1c40f' },
            { level: 'D', description: 'Recommend against', color: '#e74c3c' },
            { level: 'I', description: 'Insufficient evidence', color: '#95a5a6' }
        ]
    }
};

// ==================== RESOURCE SEARCH FUNCTIONS ====================

function searchOpenEvidence(query) {
    const url = MedicalResources.openEvidence.searchUrl + encodeURIComponent(query);
    window.open(url, '_blank', 'noopener,noreferrer');
}

function searchPerplexityHealth(query) {
    const url = MedicalResources.perplexityHealth.searchUrl + encodeURIComponent(query);
    window.open(url, '_blank', 'noopener,noreferrer');
}

function searchPubMed(query, filters = {}) {
    let searchQuery = query;
    if (filters.elderly) {
        searchQuery += ' AND (aged[MeSH] OR elderly OR geriatric OR older adults)';
    }
    if (filters.reviewsOnly) {
        searchQuery += ' AND (systematic review[pt] OR meta-analysis[pt])';
    }
    if (filters.freeFullText) {
        searchQuery += ' AND free full text[filter]';
    }
    const url = MedicalResources.pubmed.searchUrl + encodeURIComponent(searchQuery);
    window.open(url, '_blank', 'noopener,noreferrer');
}

function searchCochrane(query) {
    const url = MedicalResources.cochrane.searchUrl + encodeURIComponent(query);
    window.open(url, '_blank', 'noopener,noreferrer');
}

function searchUpToDate(query) {
    const url = MedicalResources.uptodate.searchUrl + encodeURIComponent(query);
    window.open(url, '_blank', 'noopener,noreferrer');
}

function searchMDCalc(query) {
    const url = MedicalResources.mdcalc.searchUrl + encodeURIComponent(query);
    window.open(url, '_blank', 'noopener,noreferrer');
}

function searchRadiopaedia(query) {
    const url = MedicalResources.radiopaedia.searchUrl + encodeURIComponent(query);
    window.open(url, '_blank', 'noopener,noreferrer');
}

function openResource(resourceKey) {
    const resource = MedicalResources[resourceKey];
    if (resource) {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
}

// ==================== EVIDENCE PANEL UI ====================

function showResourcePanel() {
    const panel = document.getElementById('resource-panel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

function createResourcePanelHTML() {
    return `
        <div id="resource-panel" class="resource-panel">
            <div class="resource-panel-header">
                <h3><i class="fas fa-book-medical"></i> Medical Resources</h3>
                <button class="btn-icon" onclick="showResourcePanel()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="resource-search">
                <input type="text" id="resource-search-input" placeholder="Search medical databases...">
                <div class="search-buttons">
                    <button onclick="searchFromPanel('openEvidence')" title="OpenEvidence AI" style="background: ${MedicalResources.openEvidence.color}">
                        <i class="${MedicalResources.openEvidence.icon}"></i>
                    </button>
                    <button onclick="searchFromPanel('pubmed')" title="PubMed" style="background: ${MedicalResources.pubmed.color}">
                        <i class="${MedicalResources.pubmed.icon}"></i>
                    </button>
                    <button onclick="searchFromPanel('uptodate')" title="UpToDate" style="background: ${MedicalResources.uptodate.color}">
                        <i class="${MedicalResources.uptodate.icon}"></i>
                    </button>
                    <button onclick="searchFromPanel('cochrane')" title="Cochrane" style="background: ${MedicalResources.cochrane.color}">
                        <i class="${MedicalResources.cochrane.icon}"></i>
                    </button>
                </div>
            </div>

            <div class="resource-categories">
                <div class="resource-category">
                    <h4><i class="fas fa-robot"></i> AI-Powered Evidence</h4>
                    <div class="resource-links">
                        ${createResourceLink('openEvidence')}
                        ${createResourceLink('perplexityHealth')}
                    </div>
                </div>

                <div class="resource-category">
                    <h4><i class="fas fa-search"></i> Evidence Databases</h4>
                    <div class="resource-links">
                        ${createResourceLink('pubmed')}
                        ${createResourceLink('cochrane')}
                        ${createResourceLink('pmc')}
                    </div>
                </div>

                <div class="resource-category">
                    <h4><i class="fas fa-file-medical"></i> Clinical References</h4>
                    <div class="resource-links">
                        ${createResourceLink('uptodate')}
                        ${createResourceLink('dynamed')}
                        ${createResourceLink('nice')}
                    </div>
                </div>

                <div class="resource-category">
                    <h4><i class="fas fa-user-md"></i> Geriatric Resources</h4>
                    <div class="resource-links">
                        ${createResourceLink('ags')}
                        ${createResourceLink('bgs')}
                        ${createResourceLink('beers')}
                        ${createResourceLink('stopp')}
                    </div>
                </div>

                <div class="resource-category">
                    <h4><i class="fas fa-calculator"></i> Tools & Calculators</h4>
                    <div class="resource-links">
                        ${createResourceLink('mdcalc')}
                        ${createResourceLink('qxmd')}
                    </div>
                </div>

                <div class="resource-category">
                    <h4><i class="fas fa-x-ray"></i> Imaging</h4>
                    <div class="resource-links">
                        ${createResourceLink('radiopaedia')}
                    </div>
                </div>
            </div>

            <div class="geriatric-tools-section">
                <h4><i class="fas fa-clipboard-check"></i> Geriatric Assessment Tools</h4>
                <div class="tools-grid">
                    ${createToolsHTML()}
                </div>
            </div>
        </div>
    `;
}

function createResourceLink(key) {
    const resource = MedicalResources[key];
    return `
        <a href="${resource.url}" target="_blank" class="resource-link" style="--resource-color: ${resource.color}">
            <i class="${resource.icon}"></i>
            <span>${resource.name}</span>
        </a>
    `;
}

function createToolsHTML() {
    let html = '';
    for (const [category, tools] of Object.entries(GeriatricTools)) {
        html += `<div class="tool-category">
            <h5>${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
            <div class="tool-links">`;
        tools.forEach(tool => {
            const url = tool.mdcalc || tool.url || '#';
            html += `<a href="${url}" target="_blank" class="tool-link" title="${tool.fullName}">${tool.name}</a>`;
        });
        html += `</div></div>`;
    }
    return html;
}

function searchFromPanel(resourceKey) {
    const input = document.getElementById('resource-search-input');
    const query = input ? input.value.trim() : '';
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    const resource = MedicalResources[resourceKey];
    if (resource && resource.searchUrl) {
        window.open(resource.searchUrl + encodeURIComponent(query), '_blank', 'noopener,noreferrer');
    }
}

// ==================== EVIDENCE BADGE GENERATOR ====================

function createEvidenceBadge(level, system = 'grade') {
    const grading = EvidenceGrades[system];
    if (!grading) return '';

    const levelData = grading.levels.find(l => l.level.toLowerCase() === level.toLowerCase());
    if (!levelData) return '';

    return `<span class="evidence-badge" style="background: ${levelData.color}" title="${levelData.description}">
        ${system === 'grade' ? levelData.icon : levelData.level}
    </span>`;
}

function insertEvidenceBadge(level, system = 'grade') {
    const badge = createEvidenceBadge(level, system);
    document.execCommand('insertHTML', false, badge);
}

// ==================== QUICK CITATION FROM PUBMED ====================

async function fetchPubMedCitation(pmid) {
    try {
        const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.result && data.result[pmid]) {
            const article = data.result[pmid];
            return {
                authors: article.authors ? article.authors.map(a => a.name).join(', ') : '',
                title: article.title || '',
                journal: article.source || '',
                year: article.pubdate ? article.pubdate.split(' ')[0] : '',
                volume: article.volume || '',
                issue: article.issue || '',
                pages: article.pages || '',
                pmid: pmid,
                doi: article.elocationid ? article.elocationid.replace('doi: ', '') : ''
            };
        }
    } catch (error) {
        console.error('Error fetching PubMed citation:', error);
    }
    return null;
}

async function addCitationFromPMID(pmid) {
    const citation = await fetchPubMedCitation(pmid);
    if (citation) {
        const num = citationManager.addCitation(citation);
        alert(`Citation added as reference [${num}]`);
        return num;
    } else {
        alert('Could not fetch citation. Please check the PMID.');
        return null;
    }
}

// ==================== INITIALIZE RESOURCE PANEL ====================

function initializeResourcePanel() {
    // Add resource button to editor header
    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
        const resourceBtn = document.createElement('button');
        resourceBtn.className = 'btn-secondary';
        resourceBtn.innerHTML = '<i class="fas fa-book-medical"></i> Resources';
        resourceBtn.onclick = showResourcePanel;
        headerRight.insertBefore(resourceBtn, headerRight.firstChild);
    }

    // Add resource panel to page
    const editorPage = document.getElementById('editor-page');
    if (editorPage) {
        editorPage.insertAdjacentHTML('beforeend', createResourcePanelHTML());
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeResourcePanel);
