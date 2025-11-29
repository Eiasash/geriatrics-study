// SZMC Geriatrics Presentation Maker - Text-to-Presentation Generator

class PresentationGenerator {
    constructor() {
        this.sections = {};
        this.detectedType = null;
    }

    // Parse pasted text and detect structure
    parseText(text) {
        this.sections = {};

        // Detect if it's a case or journal club
        this.detectedType = this.detectPresentationType(text);

        // Parse sections based on type
        if (this.detectedType === 'case') {
            this.parseCasePresentation(text);
        } else {
            this.parseJournalClub(text);
        }

        return {
            type: this.detectedType,
            sections: this.sections
        };
    }

    detectPresentationType(text) {
        const textLower = text.toLowerCase();

        // Journal club indicators
        const journalIndicators = [
            'abstract', 'methods', 'results', 'conclusion', 'study design',
            'randomized', 'cohort', 'meta-analysis', 'systematic review',
            'p-value', 'confidence interval', 'odds ratio', 'hazard ratio',
            'primary outcome', 'secondary outcome', 'inclusion criteria',
            'exclusion criteria', 'intention to treat', 'per protocol'
        ];

        // Case presentation indicators
        const caseIndicators = [
            'chief complaint', 'history of present illness', 'hpi',
            'past medical history', 'pmh', 'physical exam', 'vitals',
            'blood pressure', 'heart rate', 'medications', 'allergies',
            'social history', 'family history', 'differential diagnosis',
            'assessment and plan', 'year old', 'y/o', 'presents with',
            'admitted for', 'admission'
        ];

        let journalScore = 0;
        let caseScore = 0;

        journalIndicators.forEach(ind => {
            if (textLower.includes(ind)) journalScore++;
        });

        caseIndicators.forEach(ind => {
            if (textLower.includes(ind)) caseScore++;
        });

        return caseScore >= journalScore ? 'case' : 'journal';
    }

    parseCasePresentation(text) {
        // Extract patient demographics
        // Match various age formats: "75 year old", "75 years old", "75-year-old", "75 yo", "75 y/o", "75 yrs", etc.
        const ageMatch = text.match(/(\d+)[\s-]*(years?|yrs?|y\.?o\.?|y\/o)(?:[\s-]*old)?/i);
        const genderMatch = text.match(/\b(male|female|man|woman|m|f)\b/i);

        this.sections.demographics = {
            age: ageMatch ? ageMatch[1] : '',
            gender: genderMatch ? this.normalizeGender(genderMatch[1]) : ''
        };

        // Common section patterns for case presentations
        const sectionPatterns = {
            chiefComplaint: [
                /chief\s*complaint[:\s]*([^\.]+\.?)/i,
                /presents?\s*with[:\s]*([^\.]+\.)/i,
                /cc[:\s]*([^\.]+\.)/i
            ],
            hpi: [
                /history\s*of\s*present\s*illness[:\s]*([\s\S]*?)(?=past\s*medical|pmh|medications|social|physical|$)/i,
                /hpi[:\s]*([\s\S]*?)(?=past\s*medical|pmh|medications|social|physical|$)/i
            ],
            pmh: [
                /past\s*medical\s*history[:\s]*([\s\S]*?)(?=medications|social|physical|surgical|family|$)/i,
                /pmh[:\s]*([\s\S]*?)(?=medications|social|physical|surgical|family|$)/i
            ],
            medications: [
                /medications?[:\s]*([\s\S]*?)(?=allergies|social|physical|family|review|$)/i,
                /current\s*medications?[:\s]*([\s\S]*?)(?=allergies|social|physical|family|$)/i
            ],
            allergies: [
                /allergies[:\s]*([^\n]+)/i,
                /nkda/i
            ],
            socialHistory: [
                /social\s*history[:\s]*([\s\S]*?)(?=family|physical|review|$)/i
            ],
            familyHistory: [
                /family\s*history[:\s]*([\s\S]*?)(?=social|physical|review|$)/i
            ],
            physicalExam: [
                /physical\s*exam(?:ination)?[:\s]*([\s\S]*?)(?=labs|laboratory|imaging|assessment|differential|$)/i,
                /pe[:\s]*([\s\S]*?)(?=labs|laboratory|imaging|assessment|differential|$)/i
            ],
            vitals: [
                /vitals?[:\s]*([^\n]+(?:\n[^\n]+)*?)(?=general|heent|cardiac|pulmonary|$)/i,
                /bp[:\s]*(\d+\/\d+)/i
            ],
            labs: [
                /lab(?:oratory)?\s*(?:results|values)?[:\s]*([\s\S]*?)(?=imaging|radiology|assessment|differential|$)/i
            ],
            imaging: [
                /imaging[:\s]*([\s\S]*?)(?=assessment|differential|diagnosis|$)/i,
                /radiology[:\s]*([\s\S]*?)(?=assessment|differential|diagnosis|$)/i
            ],
            differential: [
                /differential\s*diagnosis[:\s]*([\s\S]*?)(?=assessment|plan|final|diagnosis|$)/i
            ],
            assessment: [
                /assessment(?:\s*and\s*plan)?[:\s]*([\s\S]*?)(?=plan|$)/i
            ],
            diagnosis: [
                /(?:final\s*)?diagnosis[:\s]*([^\n]+)/i
            ],
            plan: [
                /(?:treatment\s*)?plan[:\s]*([\s\S]*?)$/i
            ]
        };

        // Extract sections
        for (const [section, patterns] of Object.entries(sectionPatterns)) {
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    this.sections[section] = match[1].trim();
                    break;
                }
            }
        }

        // Extract vital signs specifically
        this.extractVitals(text);

        // Parse lab values
        this.extractLabs(text);

        // Parse medications into structured format
        this.parseMedications();
    }

    extractVitals(text) {
        const vitals = {};

        const patterns = {
            bp: /bp[:\s]*(\d+\/\d+)/i,
            hr: /(?:hr|heart\s*rate|pulse)[:\s]*(\d+)/i,
            rr: /(?:rr|resp(?:iratory)?\s*rate)[:\s]*(\d+)/i,
            temp: /(?:temp|temperature)[:\s]*([\d\.]+)/i,
            spo2: /(?:spo2|o2\s*sat|oxygen)[:\s]*(\d+)/i,
            weight: /(?:weight|wt)[:\s]*([\d\.]+)/i,
            height: /(?:height|ht)[:\s]*([\d\.]+)/i
        };

        for (const [vital, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                vitals[vital] = match[1];
            }
        }

        this.sections.vitals = vitals;
    }

    extractLabs(text) {
        const labs = {};

        const labPatterns = {
            wbc: /wbc[:\s]*([\d\.]+)/i,
            hgb: /(?:hgb|hemoglobin)[:\s]*([\d\.]+)/i,
            plt: /(?:plt|platelets?)[:\s]*([\d\.]+)/i,
            na: /na[:\s]*(\d+)/i,
            k: /k[:\s]*([\d\.]+)/i,
            cl: /cl[:\s]*(\d+)/i,
            hco3: /(?:hco3|bicarb)[:\s]*(\d+)/i,
            bun: /bun[:\s]*(\d+)/i,
            cr: /(?:cr|creatinine)[:\s]*([\d\.]+)/i,
            glucose: /(?:glucose|glu)[:\s]*(\d+)/i,
            egfr: /egfr[:\s]*([\d\.]+)/i,
            inr: /inr[:\s]*([\d\.]+)/i,
            lactate: /lactate[:\s]*([\d\.]+)/i,
            trop: /(?:troponin|trop)[:\s]*([\d\.]+)/i,
            bnp: /bnp[:\s]*(\d+)/i
        };

        for (const [lab, pattern] of Object.entries(labPatterns)) {
            const match = text.match(pattern);
            if (match) {
                labs[lab] = match[1];
            }
        }

        this.sections.labValues = labs;
    }

    parseMedications() {
        if (!this.sections.medications) return;

        const medText = this.sections.medications;
        const medLines = medText.split(/[\n,;]/).map(m => m.trim()).filter(m => m.length > 0);

        this.sections.medicationList = medLines.map(med => {
            // Try to parse "Drug 50mg daily" format
            const match = med.match(/^(.+?)\s+([\d\.]+\s*(?:mg|mcg|g|ml|units?|iu)?)\s*(.*)$/i);
            if (match) {
                return {
                    name: match[1].trim(),
                    dose: match[2].trim(),
                    frequency: match[3].trim() || 'daily'
                };
            }
            return { name: med, dose: '', frequency: '' };
        });
    }

    parseJournalClub(text) {
        const sectionPatterns = {
            title: [
                /^(.+?)(?:\n|abstract)/i
            ],
            authors: [
                /(?:authors?|by)[:\s]*([^\n]+)/i
            ],
            journal: [
                /(?:journal|published\s*in)[:\s]*([^\n]+)/i
            ],
            abstract: [
                /abstract[:\s]*([\s\S]*?)(?=background|introduction|methods|$)/i
            ],
            background: [
                /background[:\s]*([\s\S]*?)(?=methods|objective|aim|$)/i,
                /introduction[:\s]*([\s\S]*?)(?=methods|objective|aim|$)/i
            ],
            objective: [
                /objective[:\s]*([\s\S]*?)(?=methods|$)/i,
                /aim[:\s]*([\s\S]*?)(?=methods|$)/i
            ],
            methods: [
                /methods?[:\s]*([\s\S]*?)(?=results|$)/i,
                /study\s*design[:\s]*([\s\S]*?)(?=results|$)/i
            ],
            population: [
                /(?:population|participants?|subjects?)[:\s]*([^\n]+(?:\n[^\n]+)?)/i,
                /inclusion\s*criteria[:\s]*([\s\S]*?)(?=exclusion|results|$)/i
            ],
            intervention: [
                /intervention[:\s]*([\s\S]*?)(?=comparison|control|outcome|results|$)/i
            ],
            comparison: [
                /(?:comparison|control)[:\s]*([\s\S]*?)(?=outcome|results|$)/i
            ],
            outcomes: [
                /(?:primary\s*)?outcomes?[:\s]*([\s\S]*?)(?=results|$)/i
            ],
            results: [
                /results?[:\s]*([\s\S]*?)(?=discussion|conclusion|$)/i
            ],
            statistics: [
                /(?:statistical\s*analysis|statistics)[:\s]*([\s\S]*?)(?=results|discussion|$)/i
            ],
            discussion: [
                /discussion[:\s]*([\s\S]*?)(?=conclusion|limitation|$)/i
            ],
            limitations: [
                /limitations?[:\s]*([\s\S]*?)(?=conclusion|$)/i
            ],
            conclusion: [
                /conclusions?[:\s]*([\s\S]*?)$/i
            ]
        };

        for (const [section, patterns] of Object.entries(sectionPatterns)) {
            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    this.sections[section] = match[1].trim();
                    break;
                }
            }
        }

        // Extract statistics
        this.extractStatistics(text);

        // Extract PICO elements
        this.extractPICO(text);
    }

    extractStatistics(text) {
        const stats = {};

        // Look for common statistical measures
        const pValueMatch = text.match(/p[\s-]*(?:value)?[\s=<>]*([\d\.]+)/gi);
        if (pValueMatch) {
            stats.pValues = pValueMatch.map(p => p.replace(/p[\s-]*(?:value)?[\s]*/i, ''));
        }

        const ciMatch = text.match(/(?:95%?\s*)?ci[:\s]*\[?([\d\.-]+)[,\s]*([\d\.-]+)\]?/gi);
        if (ciMatch) {
            stats.confidenceIntervals = ciMatch;
        }

        const rrMatch = text.match(/(?:rr|relative\s*risk)[:\s]*([\d\.]+)/gi);
        if (rrMatch) {
            stats.relativeRisk = rrMatch[0];
        }

        const orMatch = text.match(/(?:or|odds\s*ratio)[:\s]*([\d\.]+)/gi);
        if (orMatch) {
            stats.oddsRatio = orMatch[0];
        }

        const hrMatch = text.match(/(?:hr|hazard\s*ratio)[:\s]*([\d\.]+)/gi);
        if (hrMatch) {
            stats.hazardRatio = hrMatch[0];
        }

        const nntMatch = text.match(/nnt[:\s]*(\d+)/gi);
        if (nntMatch) {
            stats.nnt = nntMatch[0];
        }

        const sampleMatch = text.match(/n[\s=]*(\d+)/i);
        if (sampleMatch) {
            stats.sampleSize = sampleMatch[1];
        }

        this.sections.statistics = stats;
    }

    extractPICO(text) {
        const pico = {};

        const patterns = {
            population: /(?:population|patients?|participants?|subjects?)[:\s]*([^\.]+)/i,
            intervention: /intervention[:\s]*([^\.]+)/i,
            comparison: /(?:comparison|comparator|control)[:\s]*([^\.]+)/i,
            outcome: /(?:primary\s*)?outcome[:\s]*([^\.]+)/i
        };

        for (const [element, pattern] of Object.entries(patterns)) {
            const match = text.match(pattern);
            if (match) {
                pico[element] = match[1].trim();
            }
        }

        this.sections.pico = pico;
    }

    normalizeGender(gender) {
        const g = gender.toLowerCase();
        if (['male', 'man', 'm'].includes(g)) return 'Male';
        if (['female', 'woman', 'f'].includes(g)) return 'Female';
        return gender;
    }

    // Generate slides from parsed sections
    generateSlides(options = {}) {
        const slides = [];
        const { type, sections } = { type: this.detectedType, sections: this.sections };

        if (type === 'case') {
            slides.push(...this.generateCaseSlides(sections, options));
        } else {
            slides.push(...this.generateJournalSlides(sections, options));
        }

        return slides;
    }

    generateCaseSlides(sections, options) {
        const slides = [];
        const title = options.title || 'Case Presentation';

        // 1. Title slide
        slides.push({
            type: 'title',
            data: {
                title: title,
                subtitle: sections.demographics ?
                    `${sections.demographics.age} year old ${sections.demographics.gender}` :
                    'Patient Case',
                presenter: options.presenter || '',
                date: new Date().toLocaleDateString()
            }
        });

        // 2. Table of Contents
        slides.push({
            type: 'toc',
            data: {
                title: 'Case Overview',
                sections: [
                    { name: 'Patient Presentation', slides: '2-4' },
                    { name: 'History & Examination', slides: '5-8' },
                    { name: 'Investigations', slides: '9-11' },
                    { name: 'Assessment', slides: '12-14' },
                    { name: 'Management', slides: '15-18' },
                    { name: 'Discussion', slides: '19-22' }
                ]
            }
        });

        // 3. Patient Information
        if (sections.demographics || sections.chiefComplaint) {
            slides.push({
                type: 'patient-info',
                data: {
                    age: sections.demographics?.age || '',
                    gender: sections.demographics?.gender || '',
                    chiefComplaint: sections.chiefComplaint || 'Click to enter chief complaint',
                    dateOfAdmission: options.admissionDate || ''
                }
            });
        }

        // 4. HPI
        if (sections.hpi) {
            slides.push({
                type: 'hpi',
                data: {
                    content: this.formatAsPoints(sections.hpi)
                }
            });
        }

        // 5. PMH
        if (sections.pmh) {
            slides.push({
                type: 'pmh',
                data: {
                    conditions: this.formatAsPoints(sections.pmh)
                }
            });
        }

        // 6. Medications
        if (sections.medicationList || sections.medications) {
            slides.push({
                type: 'medications',
                data: {
                    medications: sections.medicationList || this.formatAsPoints(sections.medications)
                }
            });
        }

        // 7. Social History
        if (sections.socialHistory) {
            slides.push({
                type: 'social-history',
                data: {
                    content: this.formatAsPoints(sections.socialHistory)
                }
            });
        }

        // 8. Physical Exam
        if (sections.physicalExam || sections.vitals) {
            slides.push({
                type: 'physical-exam',
                data: {
                    vitals: sections.vitals || {},
                    findings: sections.physicalExam ? this.formatAsPoints(sections.physicalExam) : []
                }
            });
        }

        // 9. Labs
        if (sections.labs || sections.labValues) {
            slides.push({
                type: 'labs',
                data: {
                    values: sections.labValues || {},
                    narrative: sections.labs || ''
                }
            });
        }

        // 10. Imaging
        if (sections.imaging) {
            slides.push({
                type: 'imaging',
                data: {
                    findings: this.formatAsPoints(sections.imaging)
                }
            });
        }

        // 11. Geriatric Assessment (placeholder)
        slides.push({
            type: 'geriatric-assessment',
            data: {
                mmse: '',
                moca: '',
                gds: '',
                tug: '',
                mna: ''
            }
        });

        // 12. Differential Diagnosis
        if (sections.differential) {
            slides.push({
                type: 'differential',
                data: {
                    differentials: this.formatAsPoints(sections.differential).map((d, i) => ({
                        diagnosis: d,
                        likelihood: i === 0 ? 'high' : i < 3 ? 'medium' : 'low'
                    }))
                }
            });
        }

        // 13. Final Diagnosis
        if (sections.diagnosis) {
            slides.push({
                type: 'diagnosis',
                data: {
                    diagnosis: sections.diagnosis,
                    icdCode: ''
                }
            });
        }

        // 14. Disease Overview
        slides.push({
            type: 'disease-overview',
            data: {
                title: sections.diagnosis || 'Disease Overview',
                content: 'Click to add disease overview content'
            }
        });

        // 15. Pathophysiology
        slides.push({
            type: 'pathophysiology',
            data: {
                title: 'Pathophysiology',
                content: 'Click to add pathophysiology content'
            }
        });

        // 16. Risk Factors
        slides.push({
            type: 'risk-factors',
            data: {
                title: 'Risk Factors',
                modifiable: [],
                nonModifiable: []
            }
        });

        // 17. Treatment Plan
        if (sections.plan || sections.assessment) {
            slides.push({
                type: 'treatment',
                data: {
                    pharmacologic: this.formatAsPoints(sections.plan || sections.assessment),
                    nonPharmacologic: []
                }
            });
        }

        // 18. Algorithm
        slides.push({
            type: 'algorithm',
            data: {
                title: 'Treatment Algorithm',
                steps: []
            }
        });

        // 19. Prognosis
        slides.push({
            type: 'prognosis',
            data: {
                title: 'Prognosis & Follow-up',
                content: 'Click to add prognosis content'
            }
        });

        // 20. Teaching Points
        slides.push({
            type: 'teaching-points',
            data: {
                points: [
                    'Key learning point 1',
                    'Key learning point 2',
                    'Key learning point 3'
                ]
            }
        });

        // 21. Take-Home Messages
        slides.push({
            type: 'take-home',
            data: {
                messages: [
                    { icon: 'lightbulb', text: 'Main takeaway message' },
                    { icon: 'check-circle', text: 'Clinical pearl' },
                    { icon: 'exclamation-triangle', text: 'Important caveat' }
                ]
            }
        });

        // 22. References
        slides.push({
            type: 'references',
            data: {
                references: []
            }
        });

        // 23. Questions
        slides.push({
            type: 'questions',
            data: {}
        });

        return slides;
    }

    generateJournalSlides(sections, options) {
        const slides = [];
        const title = sections.title || options.title || 'Journal Club';

        // 1. Title
        slides.push({
            type: 'jc-title',
            data: {
                title: title,
                authors: sections.authors || '',
                journal: sections.journal || '',
                presenter: options.presenter || '',
                date: new Date().toLocaleDateString()
            }
        });

        // 2. TOC
        slides.push({
            type: 'toc',
            data: {
                title: 'Presentation Overview',
                sections: [
                    { name: 'Background', slides: '3-4' },
                    { name: 'Study Design', slides: '5-7' },
                    { name: 'Results', slides: '8-11' },
                    { name: 'Analysis', slides: '12-15' },
                    { name: 'Clinical Application', slides: '16-18' }
                ]
            }
        });

        // 3. Background
        if (sections.background) {
            slides.push({
                type: 'jc-background',
                data: {
                    content: this.formatAsPoints(sections.background)
                }
            });
        }

        // 4. Objective
        if (sections.objective) {
            slides.push({
                type: 'content',
                data: {
                    title: 'Study Objective',
                    content: sections.objective
                }
            });
        }

        // 5. PICO
        if (sections.pico) {
            slides.push({
                type: 'jc-pico',
                data: sections.pico
            });
        }

        // 6. Methods
        if (sections.methods) {
            slides.push({
                type: 'jc-methods',
                data: {
                    content: this.formatAsPoints(sections.methods)
                }
            });
        }

        // 7. Population
        if (sections.population) {
            slides.push({
                type: 'content',
                data: {
                    title: 'Study Population',
                    content: sections.population
                }
            });
        }

        // 8-10. Results
        if (sections.results) {
            slides.push({
                type: 'jc-results',
                data: {
                    content: this.formatAsPoints(sections.results)
                }
            });
        }

        // 11. Statistics
        if (sections.statistics) {
            slides.push({
                type: 'jc-statistics',
                data: sections.statistics
            });
        }

        // 12. Statistics Visual
        slides.push({
            type: 'statistics-visual',
            data: {
                stats: [
                    { label: 'Sample Size', value: sections.statistics?.sampleSize || 'N/A', color: '#4F46E5' },
                    { label: 'P-Value', value: sections.statistics?.pValues?.[0] || 'N/A', color: '#059669' },
                    { label: 'Effect Size', value: 'Calculate', color: '#DC2626' }
                ]
            }
        });

        // 13. Discussion
        if (sections.discussion) {
            slides.push({
                type: 'jc-discussion',
                data: {
                    content: this.formatAsPoints(sections.discussion)
                }
            });
        }

        // 14. Limitations
        if (sections.limitations) {
            slides.push({
                type: 'jc-limitations',
                data: {
                    content: this.formatAsPoints(sections.limitations)
                }
            });
        }

        // 15. Applicability
        slides.push({
            type: 'jc-applicability',
            data: {
                content: 'Click to add clinical applicability content'
            }
        });

        // 16. Geriatric Considerations
        slides.push({
            type: 'content',
            data: {
                title: 'Geriatric Considerations',
                content: 'How do these findings apply to elderly patients?'
            }
        });

        // 17. Conclusions
        if (sections.conclusion) {
            slides.push({
                type: 'jc-conclusion',
                data: {
                    content: this.formatAsPoints(sections.conclusion)
                }
            });
        }

        // 18. Take-Home
        slides.push({
            type: 'take-home',
            data: {
                messages: [
                    { icon: 'lightbulb', text: 'Key finding from this study' },
                    { icon: 'check-circle', text: 'Clinical implication' },
                    { icon: 'exclamation-triangle', text: 'Limitation to consider' }
                ]
            }
        });

        // 19. References
        slides.push({
            type: 'references',
            data: {
                references: []
            }
        });

        // 20. Questions
        slides.push({
            type: 'questions',
            data: {}
        });

        return slides;
    }

    formatAsPoints(text) {
        if (!text) return [];
        if (Array.isArray(text)) return text;

        // Split by newlines, bullets, or numbered lists
        return text
            .split(/[\n•\-\d+\.\)]+/)
            .map(item => item.trim())
            .filter(item => item.length > 3);
    }
}

// Style/Theme Manager
const PresentationThemes = {
    'szmc-blue': {
        name: 'SZMC Blue (Default)',
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        accentColor: '#60a5fa',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        headerFont: 'Merriweather, serif',
        bodyFont: 'Inter, sans-serif'
    },
    'clinical-green': {
        name: 'Clinical Green',
        primaryColor: '#047857',
        secondaryColor: '#059669',
        accentColor: '#34d399',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        headerFont: 'Merriweather, serif',
        bodyFont: 'Inter, sans-serif'
    },
    'modern-purple': {
        name: 'Modern Purple',
        primaryColor: '#5b21b6',
        secondaryColor: '#7c3aed',
        accentColor: '#a78bfa',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        headerFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif'
    },
    'warm-orange': {
        name: 'Warm Orange',
        primaryColor: '#c2410c',
        secondaryColor: '#ea580c',
        accentColor: '#fb923c',
        backgroundColor: '#fffbeb',
        textColor: '#1f2937',
        headerFont: 'Merriweather, serif',
        bodyFont: 'Inter, sans-serif'
    },
    'dark-professional': {
        name: 'Dark Professional',
        primaryColor: '#1f2937',
        secondaryColor: '#374151',
        accentColor: '#60a5fa',
        backgroundColor: '#111827',
        textColor: '#f9fafb',
        headerFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif'
    },
    'medical-red': {
        name: 'Medical Red',
        primaryColor: '#b91c1c',
        secondaryColor: '#dc2626',
        accentColor: '#f87171',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        headerFont: 'Merriweather, serif',
        bodyFont: 'Inter, sans-serif'
    },
    'minimal-gray': {
        name: 'Minimal Gray',
        primaryColor: '#374151',
        secondaryColor: '#6b7280',
        accentColor: '#9ca3af',
        backgroundColor: '#f9fafb',
        textColor: '#1f2937',
        headerFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif'
    },
    'navy-gold': {
        name: 'Navy & Gold',
        primaryColor: '#1e3a5f',
        secondaryColor: '#2563eb',
        accentColor: '#fbbf24',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        headerFont: 'Merriweather, serif',
        bodyFont: 'Inter, sans-serif'
    }
};

// Apply theme to presentation
function applyTheme(themeName) {
    const theme = PresentationThemes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--primary-light', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--header-font', theme.headerFont);
    root.style.setProperty('--body-font', theme.bodyFont);

    // Store current theme
    localStorage.setItem('szmc_current_theme', themeName);
}

// Create global generator instance
const presentationGenerator = new PresentationGenerator();

// Function to show generator modal
function showGeneratorModal() {
    const modal = document.getElementById('generator-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function hideGeneratorModal() {
    const modal = document.getElementById('generator-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Generate presentation from pasted text
function generateFromText() {
    const textInput = document.getElementById('paste-text-input');
    const titleInput = document.getElementById('gen-title-input');
    const presenterInput = document.getElementById('gen-presenter-input');
    const themeSelect = document.getElementById('gen-theme-select');

    if (!textInput || !textInput.value.trim()) {
        alert('Please paste some text to generate a presentation.');
        return;
    }

    const text = textInput.value;
    const options = {
        title: titleInput?.value || '',
        presenter: presenterInput?.value || '',
        theme: themeSelect?.value || 'szmc-blue'
    };

    // Parse the text
    const parsed = presentationGenerator.parseText(text);

    // Generate slides
    const slides = presentationGenerator.generateSlides(options);

    // Apply theme
    applyTheme(options.theme);

    // Initialize editor with generated slides
    if (typeof editor !== 'undefined') {
        editor.initializeWithSlides(parsed.type, slides, options.title || 'Generated Presentation');
    }

    // Hide modal and show editor
    hideGeneratorModal();
    showPage('editor-page');

    // Update title
    const titleEl = document.getElementById('presentation-title');
    if (titleEl) {
        titleEl.value = options.title || (parsed.type === 'case' ? 'Case Presentation' : 'Journal Club');
    }
}

// Initialize theme selector options
function initializeThemeSelector(selectElement) {
    if (!selectElement) return;

    selectElement.innerHTML = '';
    for (const [key, theme] of Object.entries(PresentationThemes)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = theme.name;
        selectElement.appendChild(option);
    }
}
