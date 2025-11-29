// SZMC Geriatrics Presentation Maker - Citation System

class CitationManager {
    constructor() {
        this.citations = [];
        this.citationMap = new Map(); // Maps citation key to number
    }

    // Add a new citation and return its number
    addCitation(citation) {
        const key = this.generateKey(citation);

        if (this.citationMap.has(key)) {
            return this.citationMap.get(key);
        }

        const number = this.citations.length + 1;
        this.citations.push({
            number,
            ...citation
        });
        this.citationMap.set(key, number);
        return number;
    }

    generateKey(citation) {
        return `${citation.authors}-${citation.year}-${citation.title}`.toLowerCase().replace(/\s+/g, '');
    }

    // Format citation for reference list
    formatCitation(citation, style = 'vancouver') {
        switch (style) {
            case 'vancouver':
                return this.formatVancouver(citation);
            case 'apa':
                return this.formatAPA(citation);
            case 'harvard':
                return this.formatHarvard(citation);
            default:
                return this.formatVancouver(citation);
        }
    }

    formatVancouver(c) {
        let ref = `${c.number}. `;
        if (c.authors) {
            const authorList = c.authors.split(',').slice(0, 6).join(', ');
            ref += authorList;
            if (c.authors.split(',').length > 6) ref += ', et al';
            ref += '. ';
        }
        if (c.title) ref += `${c.title}. `;
        if (c.journal) ref += `${c.journal}. `;
        if (c.year) ref += `${c.year}`;
        if (c.volume) ref += `;${c.volume}`;
        if (c.issue) ref += `(${c.issue})`;
        if (c.pages) ref += `:${c.pages}`;
        ref += '.';
        if (c.doi) ref += ` doi: ${c.doi}`;
        if (c.pmid) ref += ` PMID: ${c.pmid}`;
        return ref;
    }

    formatAPA(c) {
        let ref = '';
        if (c.authors) {
            ref += `${c.authors} `;
        }
        if (c.year) ref += `(${c.year}). `;
        if (c.title) ref += `${c.title}. `;
        if (c.journal) ref += `<em>${c.journal}</em>`;
        if (c.volume) ref += `, ${c.volume}`;
        if (c.issue) ref += `(${c.issue})`;
        if (c.pages) ref += `, ${c.pages}`;
        ref += '.';
        if (c.doi) ref += ` https://doi.org/${c.doi}`;
        return ref;
    }

    formatHarvard(c) {
        let ref = '';
        if (c.authors) ref += `${c.authors} `;
        if (c.year) ref += `(${c.year}) `;
        if (c.title) ref += `'${c.title}', `;
        if (c.journal) ref += `<em>${c.journal}</em>`;
        if (c.volume) ref += `, vol. ${c.volume}`;
        if (c.issue) ref += `, no. ${c.issue}`;
        if (c.pages) ref += `, pp. ${c.pages}`;
        ref += '.';
        return ref;
    }

    // Get all citations formatted
    getAllCitations(style = 'vancouver') {
        return this.citations.map(c => this.formatCitation(c, style));
    }

    // Clear all citations
    clear() {
        this.citations = [];
        this.citationMap.clear();
    }

    // Import citations from JSON
    importCitations(citationsArray) {
        citationsArray.forEach(c => this.addCitation(c));
    }

    // Export citations to JSON
    exportCitations() {
        return JSON.parse(JSON.stringify(this.citations));
    }

    // Parse inline citation markers and replace with numbers
    parseInlineCitations(html) {
        // Match patterns like [Author 2023] or [1] or [@key]
        const pattern = /\[([^\]]+)\]/g;
        return html.replace(pattern, (match, content) => {
            // If already a number, keep it
            if (/^\d+$/.test(content.trim())) {
                return `<sup class="citation-ref">[${content}]</sup>`;
            }
            // If it's a citation key, look it up
            const num = this.citationMap.get(content.toLowerCase().replace(/\s+/g, ''));
            if (num) {
                return `<sup class="citation-ref">[${num}]</sup>`;
            }
            return match;
        });
    }
}

// Common geriatric medicine citations database
const CommonCitations = {
    // Delirium
    'inouye-delirium': {
        authors: 'Inouye SK, Westendorp RG, Saczynski JS',
        title: 'Delirium in elderly people',
        journal: 'Lancet',
        year: '2014',
        volume: '383',
        issue: '9920',
        pages: '911-922',
        doi: '10.1016/S0140-6736(13)60688-1',
        pmid: '23992774'
    },
    'marcantonio-delirium': {
        authors: 'Marcantonio ER',
        title: 'Delirium in Hospitalized Older Adults',
        journal: 'N Engl J Med',
        year: '2017',
        volume: '377',
        issue: '15',
        pages: '1456-1466',
        doi: '10.1056/NEJMcp1605501',
        pmid: '29020579'
    },

    // Falls
    'tinetti-falls': {
        authors: 'Tinetti ME, Kumar C',
        title: 'The patient who falls: "It\'s always a trade-off"',
        journal: 'JAMA',
        year: '2010',
        volume: '303',
        issue: '3',
        pages: '258-266',
        doi: '10.1001/jama.2009.2024',
        pmid: '20085954'
    },
    'montero-falls': {
        authors: 'Montero-Odasso M, van der Velde N, Martin FC, et al',
        title: 'World guidelines for falls prevention and management for older adults',
        journal: 'Age Ageing',
        year: '2022',
        volume: '51',
        issue: '9',
        pages: 'afac205',
        doi: '10.1093/ageing/afac205',
        pmid: '36178003'
    },

    // Dementia
    'livingston-dementia': {
        authors: 'Livingston G, Huntley J, Sommerlad A, et al',
        title: 'Dementia prevention, intervention, and care: 2020 report of the Lancet Commission',
        journal: 'Lancet',
        year: '2020',
        volume: '396',
        issue: '10248',
        pages: '413-446',
        doi: '10.1016/S0140-6736(20)30367-6',
        pmid: '32738937'
    },

    // Frailty
    'fried-frailty': {
        authors: 'Fried LP, Tangen CM, Walston J, et al',
        title: 'Frailty in older adults: evidence for a phenotype',
        journal: 'J Gerontol A Biol Sci Med Sci',
        year: '2001',
        volume: '56',
        issue: '3',
        pages: 'M146-156',
        doi: '10.1093/gerona/56.3.m146',
        pmid: '11253156'
    },
    'rockwood-frailty': {
        authors: 'Rockwood K, Song X, MacKnight C, et al',
        title: 'A global clinical measure of fitness and frailty in elderly people',
        journal: 'CMAJ',
        year: '2005',
        volume: '173',
        issue: '5',
        pages: '489-495',
        doi: '10.1503/cmaj.050051',
        pmid: '16129869'
    },

    // Polypharmacy
    'beers-criteria': {
        authors: 'American Geriatrics Society Beers Criteria Update Expert Panel',
        title: '2023 American Geriatrics Society Beers Criteria for Potentially Inappropriate Medication Use in Older Adults',
        journal: 'J Am Geriatr Soc',
        year: '2023',
        volume: '71',
        issue: '7',
        pages: '2052-2081',
        doi: '10.1111/jgs.18372',
        pmid: '37139824'
    },
    'stopp-start': {
        authors: "O'Mahony D, Cherubini A, Guiteras AR, et al",
        title: 'STOPP/START criteria for potentially inappropriate prescribing in older people: version 3',
        journal: 'Eur Geriatr Med',
        year: '2023',
        volume: '14',
        issue: '4',
        pages: '625-632',
        doi: '10.1007/s41999-023-00777-y',
        pmid: '37256475'
    },

    // Geriatric Assessment
    'cga-review': {
        authors: 'Ellis G, Gardner M, Tsiachristas A, et al',
        title: 'Comprehensive geriatric assessment for older adults admitted to hospital',
        journal: 'Cochrane Database Syst Rev',
        year: '2017',
        volume: '9',
        issue: '9',
        pages: 'CD006211',
        doi: '10.1002/14651858.CD006211.pub3',
        pmid: '28898390'
    },

    // UTI in elderly
    'uti-elderly': {
        authors: 'Nicolle LE, Gupta K, Bradley SF, et al',
        title: 'Clinical Practice Guideline for the Management of Asymptomatic Bacteriuria: 2019 Update',
        journal: 'Clin Infect Dis',
        year: '2019',
        volume: '68',
        issue: '10',
        pages: 'e83-e110',
        doi: '10.1093/cid/ciz021',
        pmid: '30895288'
    },

    // Heart Failure
    'hf-elderly': {
        authors: 'Heidenreich PA, Bozkurt B, Aguilar D, et al',
        title: '2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure',
        journal: 'Circulation',
        year: '2022',
        volume: '145',
        issue: '18',
        pages: 'e895-e1032',
        doi: '10.1161/CIR.0000000000001063',
        pmid: '35363499'
    },

    // Pressure Injuries
    'pressure-injuries': {
        authors: 'European Pressure Ulcer Advisory Panel, National Pressure Injury Advisory Panel',
        title: 'Prevention and Treatment of Pressure Ulcers/Injuries: Clinical Practice Guideline',
        journal: 'EPUAP/NPIAP/PPPIA',
        year: '2019',
        pages: 'Third Edition'
    }
};

// Create global citation manager
const citationManager = new CitationManager();

// Helper function to add citation and get reference
function cite(key) {
    if (CommonCitations[key]) {
        return citationManager.addCitation(CommonCitations[key]);
    }
    return null;
}

// Helper to create inline citation HTML
function inlineCite(...keys) {
    const nums = keys.map(k => cite(k)).filter(n => n !== null);
    if (nums.length === 0) return '';
    return `<sup class="citation-ref">[${nums.join(',')}]</sup>`;
}
