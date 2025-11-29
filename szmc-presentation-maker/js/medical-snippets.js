// SZMC Geriatrics Presentation Maker - Medical Quick-Insert Library

class MedicalSnippetsLibrary {
    constructor() {
        this.categories = this.initializeCategories();
        this.isModalOpen = false;
        this.searchQuery = '';
        this.selectedCategory = 'all';
    }

    /**
     * Initialize all medical snippet categories
     */
    initializeCategories() {
        return {
            assessments: {
                name: 'Geriatric Assessment Templates',
                icon: 'fa-clipboard-check',
                color: '#3498db',
                snippets: [
                    {
                        title: 'MMSE (Mini-Mental State Examination)',
                        description: 'Cognitive screening tool, max score 30',
                        content: `<div class="assessment-table">
<h4>Mini-Mental State Examination (MMSE)</h4>
<table class="assessment-grid">
<tr><th>Domain</th><th>Points</th><th>Score</th></tr>
<tr><td>Orientation to Time</td><td>5</td><td>__/5</td></tr>
<tr><td>Orientation to Place</td><td>5</td><td>__/5</td></tr>
<tr><td>Registration</td><td>3</td><td>__/3</td></tr>
<tr><td>Attention/Calculation</td><td>5</td><td>__/5</td></tr>
<tr><td>Recall</td><td>3</td><td>__/3</td></tr>
<tr><td>Language</td><td>8</td><td>__/8</td></tr>
<tr><td>Visuospatial</td><td>1</td><td>__/1</td></tr>
<tr><td><strong>Total</strong></td><td><strong>30</strong></td><td><strong>__/30</strong></td></tr>
</table>
<p><em>Interpretation: Normal ≥24, Mild 19-23, Moderate 10-18, Severe <10</em></p>
</div>`
                    },
                    {
                        title: 'MoCA (Montreal Cognitive Assessment)',
                        description: 'More sensitive for mild cognitive impairment',
                        content: `<div class="assessment-table">
<h4>Montreal Cognitive Assessment (MoCA)</h4>
<table class="assessment-grid">
<tr><th>Domain</th><th>Points</th><th>Score</th></tr>
<tr><td>Visuospatial/Executive</td><td>5</td><td>__/5</td></tr>
<tr><td>Naming</td><td>3</td><td>__/3</td></tr>
<tr><td>Attention</td><td>6</td><td>__/6</td></tr>
<tr><td>Language</td><td>3</td><td>__/3</td></tr>
<tr><td>Abstraction</td><td>2</td><td>__/2</td></tr>
<tr><td>Delayed Recall</td><td>5</td><td>__/5</td></tr>
<tr><td>Orientation</td><td>6</td><td>__/6</td></tr>
<tr><td><strong>Total</strong></td><td><strong>30</strong></td><td><strong>__/30</strong></td></tr>
</table>
<p><em>Add 1 point if education ≤12 years. Normal ≥26</em></p>
</div>`
                    },
                    {
                        title: 'GDS-15 (Geriatric Depression Scale)',
                        description: '15-item depression screening',
                        content: `<div class="assessment-table">
<h4>Geriatric Depression Scale (GDS-15)</h4>
<ol>
<li>Are you basically satisfied with your life? (No=1)</li>
<li>Have you dropped many activities? (Yes=1)</li>
<li>Do you feel your life is empty? (Yes=1)</li>
<li>Do you often get bored? (Yes=1)</li>
<li>Are you in good spirits most of the time? (No=1)</li>
<li>Are you afraid something bad will happen? (Yes=1)</li>
<li>Do you feel happy most of the time? (No=1)</li>
<li>Do you often feel helpless? (Yes=1)</li>
<li>Do you prefer to stay home? (Yes=1)</li>
<li>Do you have more memory problems? (Yes=1)</li>
<li>Is it wonderful to be alive now? (No=1)</li>
<li>Do you feel worthless? (Yes=1)</li>
<li>Do you feel full of energy? (No=1)</li>
<li>Do you feel your situation is hopeless? (Yes=1)</li>
<li>Do you think others are better off? (Yes=1)</li>
</ol>
<p><strong>Score: __/15</strong> <em>(Normal 0-4, Mild 5-8, Moderate 9-11, Severe 12-15)</em></p>
</div>`
                    },
                    {
                        title: 'TUG (Timed Up and Go)',
                        description: 'Mobility and fall risk assessment',
                        content: `<div class="assessment-table">
<h4>Timed Up and Go (TUG) Test</h4>
<p><strong>Instructions:</strong></p>
<ol>
<li>Patient sits in chair with arms</li>
<li>On "Go", patient stands, walks 3 meters</li>
<li>Turns around, walks back, sits down</li>
<li>Time from "Go" to seated</li>
</ol>
<p><strong>Time: _____ seconds</strong></p>
<p><strong>Interpretation:</strong></p>
<ul>
<li>&lt;10 sec: Normal mobility</li>
<li>10-20 sec: Mostly independent</li>
<li>20-30 sec: Variable mobility, may need assistance</li>
<li>&gt;30 sec: Impaired mobility, higher fall risk</li>
</ul>
</div>`
                    },
                    {
                        title: 'Barthel Index (ADLs)',
                        description: 'Activities of Daily Living assessment',
                        content: `<div class="assessment-table">
<h4>Barthel Index - Activities of Daily Living</h4>
<table class="assessment-grid">
<tr><th>Activity</th><th>Score</th></tr>
<tr><td>Feeding (0, 5, 10)</td><td>__</td></tr>
<tr><td>Bathing (0, 5)</td><td>__</td></tr>
<tr><td>Grooming (0, 5)</td><td>__</td></tr>
<tr><td>Dressing (0, 5, 10)</td><td>__</td></tr>
<tr><td>Bowel Control (0, 5, 10)</td><td>__</td></tr>
<tr><td>Bladder Control (0, 5, 10)</td><td>__</td></tr>
<tr><td>Toilet Use (0, 5, 10)</td><td>__</td></tr>
<tr><td>Transfers (0, 5, 10, 15)</td><td>__</td></tr>
<tr><td>Mobility (0, 5, 10, 15)</td><td>__</td></tr>
<tr><td>Stairs (0, 5, 10)</td><td>__</td></tr>
<tr><td><strong>Total</strong></td><td><strong>__/100</strong></td></tr>
</table>
<p><em>80-100: Independent, 60-79: Mild dependence, 40-59: Moderate, 20-39: Severe, <20: Total</em></p>
</div>`
                    },
                    {
                        title: 'Frailty Phenotype (Fried Criteria)',
                        description: 'Assess physical frailty status',
                        content: `<div class="assessment-table">
<h4>Frailty Phenotype (Fried Criteria)</h4>
<table class="assessment-grid">
<tr><th>Criterion</th><th>Present</th></tr>
<tr><td>Unintentional weight loss (>4.5kg/year)</td><td>☐</td></tr>
<tr><td>Self-reported exhaustion</td><td>☐</td></tr>
<tr><td>Low physical activity</td><td>☐</td></tr>
<tr><td>Slow walking speed (<0.8 m/s)</td><td>☐</td></tr>
<tr><td>Weak grip strength (lowest 20%)</td><td>☐</td></tr>
</table>
<p><strong>Total criteria present: __/5</strong></p>
<p><strong>Classification:</strong></p>
<ul>
<li>0: Robust</li>
<li>1-2: Pre-frail</li>
<li>3+: Frail</li>
</ul>
</div>`
                    }
                ]
            },
            abbreviations: {
                name: 'Common Medical Abbreviations',
                icon: 'fa-spell-check',
                color: '#27ae60',
                snippets: [
                    {
                        title: 'Dosing Abbreviations',
                        description: 'Common prescription abbreviations',
                        content: `<div class="abbreviation-table">
<table>
<tr><th>Abbreviation</th><th>Meaning</th></tr>
<tr><td>QD / OD</td><td>Once daily</td></tr>
<tr><td>BID</td><td>Twice daily</td></tr>
<tr><td>TID</td><td>Three times daily</td></tr>
<tr><td>QID</td><td>Four times daily</td></tr>
<tr><td>PRN</td><td>As needed</td></tr>
<tr><td>HS / QHS</td><td>At bedtime</td></tr>
<tr><td>AC</td><td>Before meals</td></tr>
<tr><td>PC</td><td>After meals</td></tr>
<tr><td>PO</td><td>By mouth</td></tr>
<tr><td>IV</td><td>Intravenous</td></tr>
<tr><td>IM</td><td>Intramuscular</td></tr>
<tr><td>SC / SQ</td><td>Subcutaneous</td></tr>
</table>
</div>`
                    },
                    {
                        title: 'Lab & Diagnostic Abbreviations',
                        description: 'Common laboratory terms',
                        content: `<div class="abbreviation-table">
<table>
<tr><th>Abbreviation</th><th>Meaning</th></tr>
<tr><td>CBC</td><td>Complete Blood Count</td></tr>
<tr><td>BMP</td><td>Basic Metabolic Panel</td></tr>
<tr><td>CMP</td><td>Comprehensive Metabolic Panel</td></tr>
<tr><td>LFTs</td><td>Liver Function Tests</td></tr>
<tr><td>PT/INR</td><td>Prothrombin Time/International Normalized Ratio</td></tr>
<tr><td>PTT / aPTT</td><td>(Activated) Partial Thromboplastin Time</td></tr>
<tr><td>BNP</td><td>Brain Natriuretic Peptide</td></tr>
<tr><td>TSH</td><td>Thyroid Stimulating Hormone</td></tr>
<tr><td>HbA1c</td><td>Glycated Hemoglobin</td></tr>
<tr><td>GFR / eGFR</td><td>Estimated Glomerular Filtration Rate</td></tr>
<tr><td>UA</td><td>Urinalysis</td></tr>
<tr><td>ABG</td><td>Arterial Blood Gas</td></tr>
</table>
</div>`
                    },
                    {
                        title: 'Geriatric Syndromes Abbreviations',
                        description: 'Common geriatric terminology',
                        content: `<div class="abbreviation-table">
<table>
<tr><th>Abbreviation</th><th>Meaning</th></tr>
<tr><td>ADL</td><td>Activities of Daily Living</td></tr>
<tr><td>IADL</td><td>Instrumental ADLs</td></tr>
<tr><td>CGA</td><td>Comprehensive Geriatric Assessment</td></tr>
<tr><td>MCI</td><td>Mild Cognitive Impairment</td></tr>
<tr><td>BPSD</td><td>Behavioral & Psychological Symptoms of Dementia</td></tr>
<tr><td>PIM</td><td>Potentially Inappropriate Medication</td></tr>
<tr><td>ACP</td><td>Advance Care Planning</td></tr>
<tr><td>GOC</td><td>Goals of Care</td></tr>
<tr><td>DNR/DNI</td><td>Do Not Resuscitate / Intubate</td></tr>
<tr><td>POLST</td><td>Physician Orders for Life-Sustaining Treatment</td></tr>
</table>
</div>`
                    }
                ]
            },
            medications: {
                name: 'Drug Classes & Considerations',
                icon: 'fa-pills',
                color: '#e74c3c',
                snippets: [
                    {
                        title: 'Beers Criteria Highlights',
                        description: 'PIMs to avoid in elderly',
                        content: `<div class="drug-table beers-list">
<h4>AGS Beers Criteria® - Key PIMs in Elderly</h4>
<table>
<tr><th>Drug Class</th><th>Examples</th><th>Concern</th></tr>
<tr class="high-risk"><td>Anticholinergics</td><td>Diphenhydramine, Oxybutynin</td><td>Cognitive impairment, delirium</td></tr>
<tr class="high-risk"><td>Benzodiazepines</td><td>Diazepam, Lorazepam</td><td>Falls, cognitive impairment, delirium</td></tr>
<tr class="high-risk"><td>Non-Benzo Hypnotics</td><td>Zolpidem, Eszopiclone</td><td>Falls, delirium</td></tr>
<tr class="high-risk"><td>1st Gen Antihistamines</td><td>Chlorpheniramine</td><td>Anticholinergic effects</td></tr>
<tr class="high-risk"><td>Antipsychotics</td><td>All (long-term)</td><td>Stroke risk, mortality in dementia</td></tr>
<tr class="moderate-risk"><td>NSAIDs</td><td>Ibuprofen, Naproxen</td><td>GI bleed, AKI, HTN</td></tr>
<tr class="moderate-risk"><td>PPIs (>8 weeks)</td><td>Omeprazole</td><td>C. diff, fractures, B12 deficiency</td></tr>
<tr class="moderate-risk"><td>Sulfonylureas</td><td>Glyburide</td><td>Prolonged hypoglycemia</td></tr>
</table>
</div>`
                    },
                    {
                        title: 'STOPP/START Criteria Summary',
                        description: 'European deprescribing guidelines',
                        content: `<div class="drug-table">
<h4>STOPP Criteria (Consider Stopping)</h4>
<ul>
<li>Loop diuretics for ankle edema without heart failure</li>
<li>PPIs >8 weeks without indication</li>
<li>Long-acting benzodiazepines in any elderly</li>
<li>Anticholinergics with cognitive impairment</li>
<li>Aspirin without documented cardiovascular disease</li>
</ul>
<h4>START Criteria (Consider Starting)</h4>
<ul>
<li>Vitamin D in those with falls or osteoporosis</li>
<li>ACEI in heart failure with reduced EF</li>
<li>Statin in documented cardiovascular disease (if life expectancy >3 years)</li>
<li>Bisphosphonate in patients on chronic steroids</li>
<li>Anticoagulation in atrial fibrillation (if no contraindication)</li>
</ul>
</div>`
                    },
                    {
                        title: 'Renal Dosing Considerations',
                        description: 'Common medications requiring adjustment',
                        content: `<div class="drug-table">
<h4>Medications Requiring Renal Dose Adjustment</h4>
<table>
<tr><th>Drug</th><th>CrCl Threshold</th><th>Action</th></tr>
<tr><td>Metformin</td><td>&lt;30 mL/min</td><td>Contraindicated</td></tr>
<tr><td>DOACs (Dabigatran)</td><td>&lt;30 mL/min</td><td>Contraindicated</td></tr>
<tr><td>DOACs (Rivaroxaban, Apixaban)</td><td>&lt;15-25 mL/min</td><td>Dose reduce or avoid</td></tr>
<tr><td>Gabapentin</td><td>&lt;60 mL/min</td><td>Dose reduce</td></tr>
<tr><td>Pregabalin</td><td>&lt;60 mL/min</td><td>Dose reduce</td></tr>
<tr><td>Spironolactone</td><td>&lt;30 mL/min</td><td>Avoid (hyperkalemia)</td></tr>
<tr><td>Allopurinol</td><td>&lt;60 mL/min</td><td>Start low, go slow</td></tr>
<tr><td>Enoxaparin</td><td>&lt;30 mL/min</td><td>Reduce or use UFH</td></tr>
</table>
</div>`
                    },
                    {
                        title: 'Anticholinergic Burden Scale',
                        description: 'Cumulative anticholinergic effects',
                        content: `<div class="drug-table">
<h4>Anticholinergic Cognitive Burden (ACB) Scale</h4>
<p><strong>Score 3 (Definite Anticholinergic):</strong></p>
<p>Amitriptyline, Oxybutynin, Diphenhydramine, Paroxetine, Olanzapine, Quetiapine, Tolterodine</p>
<p><strong>Score 2 (Moderate):</strong></p>
<p>Carbamazepine, Cyclobenzaprine, Loperamide, Nortriptyline</p>
<p><strong>Score 1 (Possible):</strong></p>
<p>Atenolol, Cetirizine, Furosemide, Metoprolol, Prednisone, Ranitidine, Trazodone</p>
<p><em>Total ACB Score ≥3: Increased risk of cognitive impairment and mortality</em></p>
</div>`
                    }
                ]
            },
            labValues: {
                name: 'Lab Value Reference Ranges',
                icon: 'fa-vial',
                color: '#9b59b6',
                snippets: [
                    {
                        title: 'Complete Blood Count (CBC)',
                        description: 'Normal ranges for CBC',
                        content: `<div class="lab-table">
<h4>Complete Blood Count - Reference Ranges</h4>
<table>
<tr><th>Test</th><th>Normal Range</th><th>Units</th></tr>
<tr><td>WBC</td><td>4.5 - 11.0</td><td>×10⁹/L</td></tr>
<tr><td>RBC (M)</td><td>4.5 - 5.5</td><td>×10¹²/L</td></tr>
<tr><td>RBC (F)</td><td>4.0 - 5.0</td><td>×10¹²/L</td></tr>
<tr><td>Hemoglobin (M)</td><td>13.5 - 17.5</td><td>g/dL</td></tr>
<tr><td>Hemoglobin (F)</td><td>12.0 - 16.0</td><td>g/dL</td></tr>
<tr><td>Hematocrit (M)</td><td>40 - 54</td><td>%</td></tr>
<tr><td>Hematocrit (F)</td><td>36 - 48</td><td>%</td></tr>
<tr><td>MCV</td><td>80 - 100</td><td>fL</td></tr>
<tr><td>Platelets</td><td>150 - 400</td><td>×10⁹/L</td></tr>
</table>
</div>`
                    },
                    {
                        title: 'Basic Metabolic Panel (BMP)',
                        description: 'Electrolytes and renal function',
                        content: `<div class="lab-table">
<h4>Basic Metabolic Panel - Reference Ranges</h4>
<table>
<tr><th>Test</th><th>Normal Range</th><th>Units</th></tr>
<tr><td>Sodium</td><td>136 - 145</td><td>mEq/L</td></tr>
<tr><td>Potassium</td><td>3.5 - 5.0</td><td>mEq/L</td></tr>
<tr><td>Chloride</td><td>98 - 106</td><td>mEq/L</td></tr>
<tr><td>CO₂ (Bicarbonate)</td><td>22 - 29</td><td>mEq/L</td></tr>
<tr><td>BUN</td><td>7 - 20</td><td>mg/dL</td></tr>
<tr><td>Creatinine</td><td>0.7 - 1.3</td><td>mg/dL</td></tr>
<tr><td>Glucose (fasting)</td><td>70 - 100</td><td>mg/dL</td></tr>
<tr><td>Calcium</td><td>8.5 - 10.5</td><td>mg/dL</td></tr>
</table>
<p><em>Note: Reference ranges may vary by lab</em></p>
</div>`
                    },
                    {
                        title: 'Liver Function Tests',
                        description: 'Hepatic panel reference ranges',
                        content: `<div class="lab-table">
<h4>Liver Function Tests - Reference Ranges</h4>
<table>
<tr><th>Test</th><th>Normal Range</th><th>Units</th></tr>
<tr><td>AST (SGOT)</td><td>10 - 40</td><td>U/L</td></tr>
<tr><td>ALT (SGPT)</td><td>7 - 56</td><td>U/L</td></tr>
<tr><td>ALP</td><td>44 - 147</td><td>U/L</td></tr>
<tr><td>GGT</td><td>9 - 48</td><td>U/L</td></tr>
<tr><td>Total Bilirubin</td><td>0.1 - 1.2</td><td>mg/dL</td></tr>
<tr><td>Direct Bilirubin</td><td>0.0 - 0.3</td><td>mg/dL</td></tr>
<tr><td>Albumin</td><td>3.5 - 5.0</td><td>g/dL</td></tr>
<tr><td>Total Protein</td><td>6.0 - 8.3</td><td>g/dL</td></tr>
</table>
</div>`
                    },
                    {
                        title: 'Coagulation Studies',
                        description: 'PT, INR, PTT reference values',
                        content: `<div class="lab-table">
<h4>Coagulation Studies - Reference Ranges</h4>
<table>
<tr><th>Test</th><th>Normal Range</th><th>Therapeutic Target</th></tr>
<tr><td>PT</td><td>11 - 13.5 sec</td><td>-</td></tr>
<tr><td>INR</td><td>0.9 - 1.1</td><td>2.0 - 3.0 (standard)<br>2.5 - 3.5 (mechanical valve)</td></tr>
<tr><td>aPTT</td><td>25 - 35 sec</td><td>1.5 - 2.5× control (heparin)</td></tr>
<tr><td>Fibrinogen</td><td>200 - 400</td><td>mg/dL</td></tr>
<tr><td>D-dimer</td><td>&lt;500</td><td>ng/mL (varies by assay)</td></tr>
</table>
</div>`
                    },
                    {
                        title: 'Thyroid Function Tests',
                        description: 'TSH and thyroid hormone levels',
                        content: `<div class="lab-table">
<h4>Thyroid Function Tests - Reference Ranges</h4>
<table>
<tr><th>Test</th><th>Normal Range</th><th>Units</th></tr>
<tr><td>TSH</td><td>0.4 - 4.0</td><td>mIU/L</td></tr>
<tr><td>Free T4</td><td>0.8 - 1.8</td><td>ng/dL</td></tr>
<tr><td>Free T3</td><td>2.3 - 4.2</td><td>pg/mL</td></tr>
<tr><td>Total T4</td><td>5.0 - 12.0</td><td>μg/dL</td></tr>
<tr><td>Total T3</td><td>80 - 200</td><td>ng/dL</td></tr>
</table>
<p><strong>Interpretation:</strong></p>
<ul>
<li>↑TSH + ↓T4: Primary hypothyroidism</li>
<li>↓TSH + ↑T4: Hyperthyroidism</li>
<li>↑TSH + Normal T4: Subclinical hypothyroidism</li>
</ul>
</div>`
                    }
                ]
            },
            criteria: {
                name: 'Clinical Criteria & Scores',
                icon: 'fa-calculator',
                color: '#f39c12',
                snippets: [
                    {
                        title: 'CHA₂DS₂-VASc Score',
                        description: 'Stroke risk in atrial fibrillation',
                        content: `<div class="score-table">
<h4>CHA₂DS₂-VASc Score for AF Stroke Risk</h4>
<table>
<tr><th>Risk Factor</th><th>Points</th><th>Score</th></tr>
<tr><td>C - CHF/LV dysfunction</td><td>1</td><td>☐</td></tr>
<tr><td>H - Hypertension</td><td>1</td><td>☐</td></tr>
<tr><td>A₂ - Age ≥75</td><td>2</td><td>☐</td></tr>
<tr><td>D - Diabetes</td><td>1</td><td>☐</td></tr>
<tr><td>S₂ - Stroke/TIA/thromboembolism</td><td>2</td><td>☐</td></tr>
<tr><td>V - Vascular disease</td><td>1</td><td>☐</td></tr>
<tr><td>A - Age 65-74</td><td>1</td><td>☐</td></tr>
<tr><td>Sc - Sex category (female)</td><td>1</td><td>☐</td></tr>
<tr><td><strong>Total</strong></td><td></td><td><strong>__/9</strong></td></tr>
</table>
<p><em>≥2 in men, ≥3 in women: Consider anticoagulation</em></p>
</div>`
                    },
                    {
                        title: 'HAS-BLED Score',
                        description: 'Bleeding risk on anticoagulation',
                        content: `<div class="score-table">
<h4>HAS-BLED Score - Bleeding Risk</h4>
<table>
<tr><th>Risk Factor</th><th>Points</th><th>Score</th></tr>
<tr><td>H - Hypertension (uncontrolled, >160)</td><td>1</td><td>☐</td></tr>
<tr><td>A - Abnormal renal/liver function</td><td>1-2</td><td>☐</td></tr>
<tr><td>S - Stroke history</td><td>1</td><td>☐</td></tr>
<tr><td>B - Bleeding history/predisposition</td><td>1</td><td>☐</td></tr>
<tr><td>L - Labile INR</td><td>1</td><td>☐</td></tr>
<tr><td>E - Elderly (>65)</td><td>1</td><td>☐</td></tr>
<tr><td>D - Drugs/alcohol</td><td>1-2</td><td>☐</td></tr>
<tr><td><strong>Total</strong></td><td></td><td><strong>__/9</strong></td></tr>
</table>
<p><em>≥3: High bleeding risk - caution with anticoagulation, not a contraindication</em></p>
</div>`
                    },
                    {
                        title: 'Wells Score for DVT',
                        description: 'Clinical probability of DVT',
                        content: `<div class="score-table">
<h4>Wells Score - DVT Probability</h4>
<table>
<tr><th>Clinical Feature</th><th>Points</th></tr>
<tr><td>Active cancer</td><td>+1</td></tr>
<tr><td>Paralysis/immobilization of lower extremity</td><td>+1</td></tr>
<tr><td>Bedridden >3 days or major surgery within 12 weeks</td><td>+1</td></tr>
<tr><td>Localized tenderness along deep venous system</td><td>+1</td></tr>
<tr><td>Entire leg swollen</td><td>+1</td></tr>
<tr><td>Calf swelling >3cm compared to asymptomatic leg</td><td>+1</td></tr>
<tr><td>Pitting edema (greater in symptomatic leg)</td><td>+1</td></tr>
<tr><td>Collateral superficial veins (non-varicose)</td><td>+1</td></tr>
<tr><td>Previously documented DVT</td><td>+1</td></tr>
<tr><td>Alternative diagnosis at least as likely as DVT</td><td>-2</td></tr>
</table>
<p><strong>Score: ___</strong></p>
<p><em>Low: ≤0 (3% risk), Moderate: 1-2 (17%), High: ≥3 (75%)</em></p>
</div>`
                    },
                    {
                        title: 'CURB-65 Score',
                        description: 'Pneumonia severity assessment',
                        content: `<div class="score-table">
<h4>CURB-65 - Pneumonia Severity</h4>
<table>
<tr><th>Criterion</th><th>Points</th><th>Present</th></tr>
<tr><td>C - Confusion (new onset)</td><td>1</td><td>☐</td></tr>
<tr><td>U - Urea >7 mmol/L (BUN >19)</td><td>1</td><td>☐</td></tr>
<tr><td>R - Respiratory rate ≥30</td><td>1</td><td>☐</td></tr>
<tr><td>B - BP (Systolic <90 or Diastolic ≤60)</td><td>1</td><td>☐</td></tr>
<tr><td>65 - Age ≥65 years</td><td>1</td><td>☐</td></tr>
<tr><td><strong>Total</strong></td><td></td><td><strong>__/5</strong></td></tr>
</table>
<p><strong>Management:</strong></p>
<ul>
<li>0-1: Outpatient treatment</li>
<li>2: Short admission or supervised outpatient</li>
<li>3-5: Hospital admission (4-5: Consider ICU)</li>
</ul>
</div>`
                    }
                ]
            }
        };
    }

    /**
     * Open the snippets modal
     */
    openModal() {
        if (this.isModalOpen) return;
        this.isModalOpen = true;
        this.renderModal();
    }

    /**
     * Close the snippets modal
     */
    closeModal() {
        this.isModalOpen = false;
        const modal = document.getElementById('medical-snippets-modal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Render the modal UI
     */
    renderModal() {
        const existingModal = document.getElementById('medical-snippets-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'medical-snippets-modal';
        modal.className = 'modal active';
        
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="medicalSnippets.closeModal()"></div>
            <div class="modal-content medical-snippets-modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-hospital-symbol"></i> Medical Quick-Insert Library</h2>
                    <button class="modal-close" onclick="medicalSnippets.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="snippets-search">
                        <i class="fas fa-search"></i>
                        <input type="text" id="snippets-search-input" placeholder="Search templates..." 
                            oninput="medicalSnippets.filterSnippets(this.value)">
                    </div>
                    <div class="snippets-layout">
                        <div class="snippets-categories">
                            <button class="category-btn active" data-category="all" onclick="medicalSnippets.selectCategory('all')">
                                <i class="fas fa-th"></i> All
                            </button>
                            ${Object.entries(this.categories).map(([key, cat]) => `
                                <button class="category-btn" data-category="${key}" onclick="medicalSnippets.selectCategory('${key}')">
                                    <i class="fas ${cat.icon}" style="color: ${cat.color}"></i> ${cat.name}
                                </button>
                            `).join('')}
                        </div>
                        <div class="snippets-list" id="snippets-list">
                            ${this.renderSnippetsList()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Focus search input
        setTimeout(() => {
            document.getElementById('snippets-search-input')?.focus();
        }, 100);
    }

    /**
     * Render the list of snippets
     */
    renderSnippetsList() {
        let html = '';
        const query = this.searchQuery.toLowerCase();

        Object.entries(this.categories).forEach(([categoryKey, category]) => {
            if (this.selectedCategory !== 'all' && this.selectedCategory !== categoryKey) {
                return;
            }

            const filteredSnippets = category.snippets.filter(snippet => {
                if (!query) return true;
                return snippet.title.toLowerCase().includes(query) || 
                       snippet.description.toLowerCase().includes(query);
            });

            if (filteredSnippets.length === 0) return;

            html += `
                <div class="snippet-category-section">
                    <h3 class="snippet-category-title">
                        <i class="fas ${category.icon}" style="color: ${category.color}"></i>
                        ${category.name}
                    </h3>
                    <div class="snippet-cards">
                        ${filteredSnippets.map((snippet, index) => `
                            <div class="snippet-card" onclick="medicalSnippets.insertSnippet('${categoryKey}', ${index})">
                                <div class="snippet-card-header">
                                    <span class="snippet-title">${snippet.title}</span>
                                    <button class="snippet-insert-btn" title="Insert into slide">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <p class="snippet-description">${snippet.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        if (!html) {
            html = `
                <div class="snippets-empty">
                    <i class="fas fa-search"></i>
                    <p>No templates found matching your search.</p>
                </div>
            `;
        }

        return html;
    }

    /**
     * Filter snippets by search query
     * @param {string} query - Search query
     */
    filterSnippets(query) {
        this.searchQuery = query;
        const listContainer = document.getElementById('snippets-list');
        if (listContainer) {
            listContainer.innerHTML = this.renderSnippetsList();
        }
    }

    /**
     * Select a category
     * @param {string} category - Category key
     */
    selectCategory(category) {
        this.selectedCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === category);
        });

        // Re-render list
        const listContainer = document.getElementById('snippets-list');
        if (listContainer) {
            listContainer.innerHTML = this.renderSnippetsList();
        }
    }

    /**
     * Insert a snippet into the current slide
     * @param {string} categoryKey - Category key
     * @param {number} snippetIndex - Index of snippet in category
     */
    insertSnippet(categoryKey, snippetIndex) {
        const category = this.categories[categoryKey];
        if (!category || !category.snippets[snippetIndex]) return;

        const snippet = category.snippets[snippetIndex];
        const content = snippet.content;

        // Find the active editable element in the slide
        const slideCanvas = document.getElementById('current-slide');
        if (!slideCanvas) {
            alert('Please select a slide first');
            return;
        }

        // Find an editable area
        const editableArea = slideCanvas.querySelector('[contenteditable="true"]');
        if (editableArea) {
            // Insert at cursor or at end
            editableArea.focus();
            document.execCommand('insertHTML', false, content);
            
            // Mark editor as dirty
            if (window.editor) {
                window.editor.isDirty = true;
            }

            // Show success toast
            if (typeof showToast === 'function') {
                showToast(`Inserted: ${snippet.title}`, 'success');
            }

            // Close modal
            this.closeModal();
        } else {
            // Try to find any content area
            const contentBody = slideCanvas.querySelector('.content-body, .slide-body, [data-field]');
            if (contentBody) {
                contentBody.innerHTML += content;
                
                if (window.editor) {
                    window.editor.isDirty = true;
                }

                if (typeof showToast === 'function') {
                    showToast(`Inserted: ${snippet.title}`, 'success');
                }

                this.closeModal();
            } else {
                alert('Unable to insert content. Please ensure you have a content area selected.');
            }
        }
    }

    /**
     * Get a specific snippet by category and title
     * @param {string} categoryKey - Category key
     * @param {string} title - Snippet title
     * @returns {Object|null} The snippet or null
     */
    getSnippet(categoryKey, title) {
        const category = this.categories[categoryKey];
        if (!category) return null;
        return category.snippets.find(s => s.title === title) || null;
    }
}

// Create global instance
const medicalSnippets = new MedicalSnippetsLibrary();

// Make globally available
if (typeof window !== 'undefined') {
    window.medicalSnippets = medicalSnippets;
}

// Add keyboard shortcut (Ctrl+M for medical snippets)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'm' && !e.shiftKey) {
        const isEditing = e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
        if (!isEditing) {
            e.preventDefault();
            medicalSnippets.openModal();
        }
    }
});
