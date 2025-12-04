// --- State Management ---
let currentTab = 'weekly';

// --- Tab Switching ---
function switchTab(tab) {
    currentTab = tab;
    // Update UI
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('section[id$="-section"]').forEach(sec => sec.style.display = 'none');

    if (tab === 'weekly') {
        document.getElementById('weekly-section').style.display = 'block';
        document.querySelector('.nav-btn:first-child').classList.add('active');
    } else {
        document.getElementById('monthly-section').style.display = 'block';
        document.querySelector('.nav-btn:nth-child(2)').classList.add('active');
    }
}

// --- AI Prompt Engine ---
function generatePrompt(mode) {
    // 1. Gather Data based on active tab
    let contextData = "";
    if (currentTab === 'weekly') {
        const demo = document.getElementById('wk-demographics').value || "No demographics provided";
        const hpi = document.getElementById('wk-hpi').value || "No HPI provided";
        const cga = document.getElementById('wk-cga').value || "No CGA provided";
        contextData = `PATIENT CONTEXT:\n- ID/CC: ${demo}\n- HPI/MEDS: ${hpi}\n- GERIATRIC ASSESSMENT: ${cga}`;
    } else {
        const overview = document.getElementById('mo-overview').value;
        const learning = document.getElementById('mo-learning').value;
        contextData = `MONTHLY CONTEXT:\n- Overview: ${overview}\n- Learning Goals: ${learning}`;
    }

    // 2. Select Template based on Chip clicked
    let promptInstruction = "";

    switch(mode) {
        case 'diagnosis':
            promptInstruction = `
TASK: Generate a Differential Diagnosis & Clinical Reasoning summary.
1. List the Top 3 Differential Diagnoses for this geriatric patient.
2. For each, explain "Supporting Evidence" vs "Refuting Evidence" based on the data.
3. Suggest specifically which IMA Syllabus guidelines apply here.
4. Output Format: Bullet points, professional medical tone.
`;
            break;

        case 'teaching':
            promptInstruction = `
TASK: Generate "Clinical Pearls" and Teaching Points.
1. Identify 3 key learning points from this case relevant to Geriatric Fellowship.
2. Connect these points to the Israeli Medical Association (IMA) syllabus.
3. If Polypharmacy is present, highlight specific deprescribing opportunities (e.g., BEERS criteria, STOPP/START).
4. Output Format: "## Key Learning Points" section ready for markdown.
`;
            break;

        case 'plan':
            promptInstruction = `
TASK: Create a Comprehensive Geriatric Management Plan.
1. Break down into: Medical, Functional, Social, and Cognitive domains.
2. Provide concrete "Next Steps" for the team (e.g., "Consult PT for...").
3. Include a "Discharge Planning" section.
4. IMPORTANT: Be direct and actionable. Use numbered lists.
`;
            break;

        case 'full_case':
            promptInstruction = `
TASK: Write the full case study for "geriatrics_weekly_case_template.md".
1. ACT AS: A Geriatrics Fellow at Shaare Tzedek.
2. REWRITE the input notes into a polished, professional narrative.
3. STRUCTURE:
   - Case Presentation (HPI + Background)
   - CGA (Functional/Cognitive status details)
   - Assessment & Plan (Synthesized by problem list)
   - Discussion (Brief literature review/syllabus link)
4. Do not just critique; generate the final text I can copy-paste.
`;
            break;
    }

    // 3. Assemble Final Prompt
    const finalPrompt = `
${promptInstruction}

${contextData}

CONSTRAINTS:
- Use English (UK/Israel medical standard).
- Include Hebrew terminology in parentheses where critical.
- Use LaTeX for any formulas (e.g., creatinine clearance).
- Be concise and direct.
`.trim();

    // 4. Output
    document.getElementById('final-output').value = finalPrompt;
    flashStatus("Prompt Ready!");
}

// --- Utilities ---
function copyToClipboard() {
    const copyText = document.getElementById("final-output");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    flashStatus("Copied to Clipboard!");
}

function flashStatus(msg) {
    const el = document.getElementById('copy-status');
    el.innerText = msg;
    setTimeout(() => el.innerText = "", 3000);
}

// --- Auto-Save (LocalStorage) ---
['wk-demographics', 'wk-hpi', 'wk-cga', 'mo-overview', 'mo-learning'].forEach(id => {
    const el = document.getElementById(id);
    if(el) {
        el.addEventListener('input', () => localStorage.setItem(id, el.value));
        if(localStorage.getItem(id)) el.value = localStorage.getItem(id);
    }
});
