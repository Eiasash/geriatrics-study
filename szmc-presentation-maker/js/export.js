// SZMC Geriatrics Presentation Maker - Export Module

class PresentationExporter {
    constructor() {
        this.pptxLoaded = false;
    }

    async loadPptxGenJS() {
        if (this.pptxLoaded) return true;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js';
            script.onload = () => {
                this.pptxLoaded = true;
                resolve(true);
            };
            script.onerror = () => reject(new Error('Failed to load PptxGenJS'));
            document.head.appendChild(script);
        });
    }

    async exportToPPTX(presentation) {
        try {
            await this.loadPptxGenJS();
        } catch (error) {
            alert('Failed to load PowerPoint export library. Please check your internet connection.');
            return;
        }

        const pptx = new PptxGenJS();

        // Set presentation properties
        pptx.author = 'SZMC Geriatrics';
        pptx.title = presentation.title || 'Untitled Presentation';
        pptx.subject = presentation.type === 'journal' ? 'Journal Club' : 'Case Presentation';
        pptx.company = 'Shaare Zedek Medical Center';

        // Define master slide layouts
        pptx.defineSlideMaster({
            title: 'SZMC_MASTER',
            background: { color: 'FFFFFF' },
            objects: [
                // Top gradient bar
                { rect: { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: '1e3a5f' } } },
                // Footer
                { text: { text: 'SZMC Geriatrics', options: { x: 0.5, y: 5.3, w: 3, h: 0.3, fontSize: 9, color: '94a3b8' } } }
            ]
        });

        pptx.defineSlideMaster({
            title: 'SZMC_TITLE',
            background: { color: '1e3a5f' }
        });

        // Process each slide
        for (const slideData of presentation.slides) {
            this.addSlideToPptx(pptx, slideData);
        }

        // Generate and download
        const fileName = `${presentation.title.replace(/[^a-z0-9]/gi, '_')}.pptx`;
        await pptx.writeFile({ fileName });
    }

    addSlideToPptx(pptx, slideData) {
        const template = SlideTemplates[slideData.type];
        if (!template) return;

        const slide = pptx.addSlide();

        // Get clean text from HTML
        const getText = (html) => {
            if (!html) return '';
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        // Get bullet points from HTML
        const getBullets = (html) => {
            if (!html) return [];
            const div = document.createElement('div');
            div.innerHTML = html;
            const text = div.textContent || div.innerText || '';
            return text.split('\n').filter(line => line.trim()).map(line => ({
                text: line.replace(/^[•\-\*]\s*/, '').trim(),
                options: { bullet: true }
            }));
        };

        const data = slideData.data;

        switch (slideData.type) {
            case 'title':
            case 'jc-title':
                slide.background = { color: '1e3a5f' };
                slide.addText(getText(data.title) || 'Presentation Title', {
                    x: 0.5, y: 2, w: 9, h: 1,
                    fontSize: 36, bold: true, color: 'FFFFFF',
                    align: 'center', valign: 'middle'
                });
                slide.addText(getText(data.subtitle) || '', {
                    x: 0.5, y: 3.2, w: 9, h: 0.5,
                    fontSize: 18, color: 'E0E0E0',
                    align: 'center'
                });
                slide.addText(getText(data.presenter) || '', {
                    x: 0.5, y: 4, w: 9, h: 0.4,
                    fontSize: 14, color: 'CCCCCC',
                    align: 'center'
                });
                slide.addText(getText(data.date) || '', {
                    x: 0.5, y: 4.5, w: 9, h: 0.3,
                    fontSize: 12, color: 'AAAAAA',
                    align: 'center'
                });
                slide.addText('Shaare Zedek Medical Center - Geriatrics Department', {
                    x: 0.5, y: 5, w: 9, h: 0.3,
                    fontSize: 12, color: '27ae60',
                    align: 'center'
                });
                break;

            case 'section-header':
                slide.background = { color: '1e3a5f' };
                slide.addText(getText(data.sectionTitle) || 'Section', {
                    x: 0.5, y: 2.3, w: 9, h: 1,
                    fontSize: 40, bold: true, color: 'FFFFFF',
                    align: 'center', valign: 'middle'
                });
                if (data.sectionNumber) {
                    slide.addText(getText(data.sectionNumber), {
                        x: 8.2, y: 0.5, w: 1, h: 0.8,
                        fontSize: 24, bold: true, color: 'FFFFFF',
                        align: 'center', valign: 'middle'
                    });
                }
                break;

            case 'toc':
                slide.addText('Table of Contents', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                break;

            case 'two-column':
                slide.addText(getText(data.title) || '', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 22, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.leftColumn) || '', {
                    x: 0.5, y: 1, w: 4.3, h: 4,
                    fontSize: 10, color: '334155', valign: 'top'
                });
                slide.addText(getText(data.rightColumn) || '', {
                    x: 5.2, y: 1, w: 4.3, h: 4,
                    fontSize: 10, color: '334155', valign: 'top'
                });
                break;

            case 'statistics-visual':
                const stats = [
                    { value: data.stat1Value, label: data.stat1Label, sub: data.stat1Sub },
                    { value: data.stat2Value, label: data.stat2Label, sub: data.stat2Sub },
                    { value: data.stat3Value, label: data.stat3Label, sub: data.stat3Sub },
                    { value: data.stat4Value, label: data.stat4Label, sub: data.stat4Sub }
                ];
                stats.forEach((stat, i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    const x = 0.5 + col * 4.7;
                    const y = 0.5 + row * 2.3;
                    slide.addShape(pptx.ShapeType.rect, {
                        x: x, y: y, w: 4.5, h: 2.1,
                        fill: { color: i === 0 ? '1e3a5f' : 'F8FAFC' },
                        line: { color: 'E2E8F0', pt: 1 }
                    });
                    slide.addText(getText(stat.value) || '', {
                        x: x, y: y + 0.3, w: 4.5, h: 0.8,
                        fontSize: 32, bold: true, color: i === 0 ? 'FFFFFF' : '1e3a5f',
                        align: 'center'
                    });
                    slide.addText(getText(stat.label) || '', {
                        x: x, y: y + 1.1, w: 4.5, h: 0.4,
                        fontSize: 12, color: i === 0 ? 'E0E0E0' : '475569',
                        align: 'center'
                    });
                    slide.addText(getText(stat.sub) || '', {
                        x: x, y: y + 1.5, w: 4.5, h: 0.4,
                        fontSize: 10, color: i === 0 ? 'AAAAAA' : '6B7280',
                        align: 'center'
                    });
                });
                if (data.statsCitations) {
                    slide.addText(getText(data.statsCitations), {
                        x: 0.5, y: 5.2, w: 9, h: 0.3,
                        fontSize: 8, color: '94a3b8'
                    });
                }
                break;

            case 'key-points-visual':
                slide.addText(getText(data.kpTitle) || 'Key Points', {
                    x: 0.5, y: 0.2, w: 9, h: 0.4,
                    fontSize: 20, bold: true, color: '1e3a5f'
                });
                const keyPoints = [data.kp1, data.kp2, data.kp3, data.kp4, data.kp5, data.kp6];
                keyPoints.forEach((kp, i) => {
                    if (!kp) return;
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    const x = 0.5 + col * 4.7;
                    const y = 0.7 + row * 1.5;
                    slide.addShape(pptx.ShapeType.rect, {
                        x: x, y: y, w: 4.5, h: 1.4,
                        fill: { color: 'F0F9FF' },
                        line: { color: '3498db', pt: 1 }
                    });
                    slide.addText(getText(kp), {
                        x: x + 0.1, y: y + 0.1, w: 4.3, h: 1.2,
                        fontSize: 9, color: '334155', valign: 'top'
                    });
                });
                break;

            case 'timeline-visual':
                slide.addText(getText(data.timelineTitle) || 'Timeline', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 22, bold: true, color: '1e3a5f'
                });
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5, y: 2.5, w: 9, h: 0.08,
                    fill: { color: '1e3a5f' }
                });
                const events = [
                    { time: data.time1, title: data.event1Title, desc: data.event1Desc },
                    { time: data.time2, title: data.event2Title, desc: data.event2Desc },
                    { time: data.time3, title: data.event3Title, desc: data.event3Desc },
                    { time: data.time4, title: data.event4Title, desc: data.event4Desc }
                ];
                events.forEach((evt, i) => {
                    const x = 0.7 + i * 2.3;
                    slide.addText(getText(evt.time) || '', {
                        x: x, y: 1.8, w: 2.1, h: 0.5,
                        fontSize: 11, bold: true, color: '1e3a5f', align: 'center'
                    });
                    slide.addText(getText(evt.title) || '', {
                        x: x, y: 2.7, w: 2.1, h: 0.4,
                        fontSize: 10, bold: true, color: '334155', align: 'center'
                    });
                    slide.addText(getText(evt.desc) || '', {
                        x: x, y: 3.2, w: 2.1, h: 1.8,
                        fontSize: 8, color: '475569', align: 'center', valign: 'top'
                    });
                });
                break;

            case 'algorithm':
                slide.addText(getText(data.algoTitle) || 'Algorithm', {
                    x: 0.5, y: 0.2, w: 9, h: 0.4,
                    fontSize: 20, bold: true, color: '1e3a5f'
                });
                slide.addShape(pptx.ShapeType.rect, {
                    x: 2.5, y: 0.7, w: 5, h: 0.8,
                    fill: { color: '1e3a5f' }
                });
                slide.addText(getText(data.algoStart) || '', {
                    x: 2.5, y: 0.7, w: 5, h: 0.8,
                    fontSize: 10, color: 'FFFFFF', align: 'center', valign: 'middle'
                });
                slide.addShape(pptx.ShapeType.rect, {
                    x: 2.5, y: 1.7, w: 5, h: 0.7,
                    fill: { color: 'FEF3C7' }, line: { color: 'F59E0B', pt: 2 }
                });
                slide.addText(getText(data.algoDecision) || '', {
                    x: 2.5, y: 1.7, w: 5, h: 0.7,
                    fontSize: 9, color: '92400E', align: 'center', valign: 'middle'
                });
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5, y: 2.6, w: 4.3, h: 1.5,
                    fill: { color: 'D1FAE5' }, line: { color: '27ae60', pt: 1 }
                });
                slide.addText(getText(data.algoYes) || '', {
                    x: 0.6, y: 2.7, w: 4.1, h: 1.3,
                    fontSize: 8, color: '065F46', valign: 'top'
                });
                slide.addShape(pptx.ShapeType.rect, {
                    x: 5.2, y: 2.6, w: 4.3, h: 1.5,
                    fill: { color: 'FEE2E2' }, line: { color: 'DC2626', pt: 1 }
                });
                slide.addText(getText(data.algoNo) || '', {
                    x: 5.3, y: 2.7, w: 4.1, h: 1.3,
                    fontSize: 8, color: '991B1B', valign: 'top'
                });
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5, y: 4.3, w: 9, h: 0.9,
                    fill: { color: '3498db' }
                });
                slide.addText(getText(data.algoEnd) || '', {
                    x: 0.6, y: 4.4, w: 8.8, h: 0.7,
                    fontSize: 9, color: 'FFFFFF', align: 'center', valign: 'middle'
                });
                break;

            case 'pathophysiology':
                slide.addText(getText(data.pathTitle) || 'Pathophysiology', {
                    x: 0.5, y: 0.2, w: 9, h: 0.4,
                    fontSize: 20, bold: true, color: '1e3a5f'
                });
                slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.7, w: 2.9, h: 1.4, fill: { color: 'FEE2E2' } });
                slide.addText('TRIGGER\n' + getText(data.trigger), { x: 0.6, y: 0.8, w: 2.7, h: 1.2, fontSize: 8, color: '991B1B', valign: 'top' });
                slide.addShape(pptx.ShapeType.rect, { x: 3.55, y: 0.7, w: 2.9, h: 1.4, fill: { color: 'FEF3C7' } });
                slide.addText('MECHANISM\n' + getText(data.mechanism), { x: 3.65, y: 0.8, w: 2.7, h: 1.2, fontSize: 8, color: '92400E', valign: 'top' });
                slide.addShape(pptx.ShapeType.rect, { x: 6.6, y: 0.7, w: 2.9, h: 1.4, fill: { color: 'DBEAFE' } });
                slide.addText('EFFECTS\n' + getText(data.effects), { x: 6.7, y: 0.8, w: 2.7, h: 1.2, fontSize: 8, color: '1E40AF', valign: 'top' });
                slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.3, w: 4.3, h: 1.4, fill: { color: 'D1FAE5' } });
                slide.addText('CLINICAL\n' + getText(data.clinical), { x: 0.6, y: 2.4, w: 4.1, h: 1.2, fontSize: 8, color: '166534', valign: 'top' });
                slide.addShape(pptx.ShapeType.rect, { x: 5.2, y: 2.3, w: 4.3, h: 1.4, fill: { color: 'F5F3FF' } });
                slide.addText(getText(data.geriatricFactors) || '', { x: 5.3, y: 2.4, w: 4.1, h: 1.2, fontSize: 8, color: '6D28D9', valign: 'top' });
                break;

            case 'risk-factors':
                slide.addText('Risk Factors', { x: 0.5, y: 0.2, w: 9, h: 0.4, fontSize: 20, bold: true, color: '1e3a5f' });
                slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.7, w: 2.9, h: 2.2, fill: { color: 'D1FAE5' } });
                slide.addText('Modifiable\n' + getText(data.modifiable), { x: 0.6, y: 0.8, w: 2.7, h: 2, fontSize: 8, color: '166534', valign: 'top' });
                slide.addShape(pptx.ShapeType.rect, { x: 3.55, y: 0.7, w: 2.9, h: 2.2, fill: { color: 'FEE2E2' } });
                slide.addText('Non-Modifiable\n' + getText(data.nonModifiable), { x: 3.65, y: 0.8, w: 2.7, h: 2, fontSize: 8, color: '991B1B', valign: 'top' });
                slide.addShape(pptx.ShapeType.rect, { x: 6.6, y: 0.7, w: 2.9, h: 2.2, fill: { color: 'FEF3C7' } });
                slide.addText('Geriatric\n' + getText(data.geriatricRisk), { x: 6.7, y: 0.8, w: 2.7, h: 2, fontSize: 8, color: '92400E', valign: 'top' });
                if (data.riskStat1) {
                    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.1, w: 2.9, h: 0.9, fill: { color: '1e3a5f' } });
                    slide.addText(getText(data.riskStat1) + '\n' + getText(data.riskLabel1), { x: 0.5, y: 3.2, w: 2.9, h: 0.7, fontSize: 10, color: 'FFFFFF', align: 'center' });
                }
                if (data.riskStat2) {
                    slide.addShape(pptx.ShapeType.rect, { x: 3.55, y: 3.1, w: 2.9, h: 0.9, fill: { color: '1e3a5f' } });
                    slide.addText(getText(data.riskStat2) + '\n' + getText(data.riskLabel2), { x: 3.55, y: 3.2, w: 2.9, h: 0.7, fontSize: 10, color: 'FFFFFF', align: 'center' });
                }
                if (data.riskStat3) {
                    slide.addShape(pptx.ShapeType.rect, { x: 6.6, y: 3.1, w: 2.9, h: 0.9, fill: { color: '1e3a5f' } });
                    slide.addText(getText(data.riskStat3) + '\n' + getText(data.riskLabel3), { x: 6.6, y: 3.2, w: 2.9, h: 0.7, fontSize: 10, color: 'FFFFFF', align: 'center' });
                }
                break;

            case 'questions':
                slide.background = { color: '1e3a5f' };
                slide.addText('Questions?', {
                    x: 0.5, y: 2, w: 9, h: 1,
                    fontSize: 48, bold: true, color: 'FFFFFF',
                    align: 'center'
                });
                slide.addText(getText(data.subtitle) || 'Thank you for your attention', {
                    x: 0.5, y: 3.2, w: 9, h: 0.5,
                    fontSize: 20, color: 'E0E0E0',
                    align: 'center'
                });
                break;

            case 'patient-info':
                slide.addText('Patient Information', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.patientId) || 'Patient ID', {
                    x: 0.5, y: 1, w: 9, h: 0.4,
                    fontSize: 18, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.demographics) || '', {
                    x: 0.5, y: 1.4, w: 9, h: 0.3,
                    fontSize: 14, color: '475569'
                });
                // Add detail cards as table
                const patientDetails = [
                    ['Chief Complaint', getText(data.chiefComplaint) || ''],
                    ['Source', getText(data.source) || ''],
                    ['Setting', getText(data.setting) || ''],
                    ['Living Situation', getText(data.living) || ''],
                    ['Baseline Function', getText(data.baseline) || ''],
                    ['Code Status', getText(data.codeStatus) || '']
                ];
                slide.addTable(patientDetails, {
                    x: 0.5, y: 2, w: 9, h: 3,
                    fontSize: 11,
                    color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' },
                    fill: { color: 'F8FAFC' }
                });
                break;

            case 'hpi':
                slide.addText('History of Present Illness', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                // Chief complaint box
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5, y: 1, w: 9, h: 0.8,
                    fill: { color: '1e3a5f' }
                });
                slide.addText('Chief Complaint: ' + (getText(data.chiefComplaint) || ''), {
                    x: 0.7, y: 1.1, w: 8.6, h: 0.6,
                    fontSize: 14, color: 'FFFFFF'
                });
                // HPI content
                slide.addText(getText(data.hpiContent) || '', {
                    x: 0.5, y: 2, w: 9, h: 3,
                    fontSize: 12, color: '334155',
                    valign: 'top'
                });
                break;

            case 'differential':
                slide.addText('Differential Diagnosis', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.differentials) || 'Add differential diagnoses...', {
                    x: 0.5, y: 1, w: 9, h: 4,
                    fontSize: 12, color: '334155',
                    valign: 'top'
                });
                break;

            case 'treatment':
                slide.addText('Treatment Plan', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                // Three columns
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5, y: 1, w: 2.8, h: 0.4,
                    fill: { color: '1e3a5f' }
                });
                slide.addText('Pharmacologic', {
                    x: 0.5, y: 1, w: 2.8, h: 0.4,
                    fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'
                });
                slide.addText(getText(data.pharmacologic) || '', {
                    x: 0.5, y: 1.5, w: 2.8, h: 3.5,
                    fontSize: 10, color: '334155', valign: 'top'
                });

                slide.addShape(pptx.ShapeType.rect, {
                    x: 3.5, y: 1, w: 2.8, h: 0.4,
                    fill: { color: '27ae60' }
                });
                slide.addText('Non-Pharmacologic', {
                    x: 3.5, y: 1, w: 2.8, h: 0.4,
                    fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'
                });
                slide.addText(getText(data.nonPharmacologic) || '', {
                    x: 3.5, y: 1.5, w: 2.8, h: 3.5,
                    fontSize: 10, color: '334155', valign: 'top'
                });

                slide.addShape(pptx.ShapeType.rect, {
                    x: 6.5, y: 1, w: 2.8, h: 0.4,
                    fill: { color: '3498db' }
                });
                slide.addText('Monitoring', {
                    x: 6.5, y: 1, w: 2.8, h: 0.4,
                    fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'
                });
                slide.addText(getText(data.monitoring) || '', {
                    x: 6.5, y: 1.5, w: 2.8, h: 3.5,
                    fontSize: 10, color: '334155', valign: 'top'
                });
                break;

            case 'jc-pico':
                slide.addText('PICO Framework', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                // PICO boxes
                const picoData = [
                    { label: 'P - Population', content: data.population, color: '3498db' },
                    { label: 'I - Intervention', content: data.intervention, color: '27ae60' },
                    { label: 'C - Comparison', content: data.comparison, color: 'f39c12' },
                    { label: 'O - Outcome', content: data.outcome, color: 'e74c3c' }
                ];
                picoData.forEach((pico, i) => {
                    const row = Math.floor(i / 2);
                    const col = i % 2;
                    const x = 0.5 + col * 4.7;
                    const y = 1 + row * 2;

                    slide.addShape(pptx.ShapeType.rect, {
                        x: x, y: y, w: 4.5, h: 1.8,
                        fill: { color: 'F8FAFC' },
                        line: { color: pico.color, pt: 2, dashType: 'solid' }
                    });
                    slide.addText(pico.label, {
                        x: x + 0.1, y: y + 0.1, w: 4.3, h: 0.3,
                        fontSize: 12, bold: true, color: '1e3a5f'
                    });
                    slide.addText(getText(pico.content) || '', {
                        x: x + 0.1, y: y + 0.5, w: 4.3, h: 1.2,
                        fontSize: 10, color: '475569', valign: 'top'
                    });
                });
                break;

            case 'jc-results':
                slide.addText('Results', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                // Result cards
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5, y: 1, w: 2.8, h: 1.5,
                    fill: { color: '1e3a5f' }
                });
                slide.addText(getText(data.primaryResult) || '', {
                    x: 0.5, y: 1.2, w: 2.8, h: 0.6,
                    fontSize: 28, bold: true, color: 'FFFFFF', align: 'center'
                });
                slide.addText(getText(data.primaryLabel) || 'Primary Outcome', {
                    x: 0.5, y: 1.9, w: 2.8, h: 0.3,
                    fontSize: 10, color: 'E0E0E0', align: 'center'
                });

                slide.addText(getText(data.additionalResults) || '', {
                    x: 0.5, y: 3, w: 9, h: 2,
                    fontSize: 12, color: '334155', valign: 'top'
                });
                break;

            case 'geriatric-assessment':
                slide.addText('Comprehensive Geriatric Assessment', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                const assessments = [
                    ['Cognition (MMSE/MoCA)', getText(data.cogScore) + '/30', getText(data.cogInterp)],
                    ['Mobility (TUG)', getText(data.tugScore) + ' sec', getText(data.tugInterp)],
                    ['Nutrition (MNA-SF)', getText(data.mnaScore) + '/14', getText(data.mnaInterp)],
                    ['Depression (GDS-15)', getText(data.gdsScore) + '/15', getText(data.gdsInterp)],
                    ['ADLs (Barthel)', getText(data.adlScore) + '/100', getText(data.adlInterp)],
                    ['IADLs (Lawton)', getText(data.iadlScore) + '/8', getText(data.iadlInterp)]
                ];
                slide.addTable(assessments, {
                    x: 0.5, y: 1, w: 9, h: 4,
                    fontSize: 11,
                    color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' },
                    fill: { color: 'F8FAFC' }
                });
                break;

            case 'pmh':
                slide.addText('Past Medical History', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText('Medical Conditions', {
                    x: 0.5, y: 1, w: 4.3, h: 0.4,
                    fontSize: 14, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.medicalHistory) || '', {
                    x: 0.5, y: 1.5, w: 4.3, h: 2.5,
                    fontSize: 11, color: '334155', valign: 'top'
                });
                slide.addText('Surgical History', {
                    x: 5.2, y: 1, w: 4.3, h: 0.4,
                    fontSize: 14, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.surgicalHistory) || '', {
                    x: 5.2, y: 1.5, w: 4.3, h: 1.5,
                    fontSize: 11, color: '334155', valign: 'top'
                });
                slide.addText('Allergies', {
                    x: 5.2, y: 3.2, w: 4.3, h: 0.4,
                    fontSize: 14, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.allergies) || '', {
                    x: 5.2, y: 3.7, w: 4.3, h: 1.3,
                    fontSize: 11, color: '334155', valign: 'top'
                });
                break;

            case 'medications':
            case 'medications-detailed':
                slide.addText('Current Medications', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.medications) || '', {
                    x: 0.5, y: 1, w: 9, h: 3,
                    fontSize: 11, color: '334155', valign: 'top'
                });
                if (data.medNotes) {
                    slide.addShape(pptx.ShapeType.rect, {
                        x: 0.5, y: 4.2, w: 9, h: 0.9,
                        fill: { color: 'FEF3C7' }
                    });
                    slide.addText('Geriatric Considerations: ' + getText(data.medNotes), {
                        x: 0.6, y: 4.3, w: 8.8, h: 0.7,
                        fontSize: 10, color: '92400E', valign: 'top'
                    });
                }
                break;

            case 'physical-exam':
                slide.addText('Physical Examination', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                // Vitals row
                const vitals = [
                    ['BP', getText(data.bp) || '-'],
                    ['HR', getText(data.hr) || '-'],
                    ['RR', getText(data.rr) || '-'],
                    ['Temp', getText(data.temp) || '-'],
                    ['SpO2', getText(data.sat) || '-']
                ];
                slide.addTable([vitals.map(v => v[0]), vitals.map(v => v[1])], {
                    x: 0.5, y: 1, w: 9, h: 0.8,
                    fontSize: 12, align: 'center',
                    color: 'FFFFFF',
                    fill: { color: '1e3a5f' }
                });
                // Exam findings
                const examRows = [
                    ['Neurological', getText(data.neuro) || ''],
                    ['Cardio/Resp', getText(data.cardioResp) || ''],
                    ['Abdominal', getText(data.abdominal) || ''],
                    ['MSK/Skin', getText(data.mskSkin) || '']
                ];
                slide.addTable(examRows, {
                    x: 0.5, y: 2, w: 9, h: 3,
                    fontSize: 10, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' }
                });
                break;

            case 'labs':
                slide.addText('Laboratory Results', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText('CBC', { x: 0.5, y: 1, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.cbc) || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.2, fontSize: 10, color: '334155' });
                slide.addText('BMP', { x: 0.5, y: 2.7, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.bmp) || '', { x: 0.5, y: 3.1, w: 4.3, h: 1.2, fontSize: 10, color: '334155' });
                slide.addText('Other Labs', { x: 5.2, y: 1, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.otherLabs) || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.8, fontSize: 10, color: '334155' });
                if (data.abnormals) {
                    slide.addShape(pptx.ShapeType.rect, { x: 5.2, y: 3.4, w: 4.3, h: 1.1, fill: { color: 'FEE2E2' } });
                    slide.addText('Key Abnormalities: ' + getText(data.abnormals), { x: 5.3, y: 3.5, w: 4.1, h: 0.9, fontSize: 10, color: '991B1B' });
                }
                break;

            case 'diagnosis':
                slide.addText('Final Diagnosis', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 1.2, fill: { color: 'D1FAE5' } });
                slide.addText('Primary Diagnosis: ' + (getText(data.primaryDx) || ''), {
                    x: 0.6, y: 1.1, w: 8.8, h: 1, fontSize: 16, bold: true, color: '065F46', valign: 'middle'
                });
                slide.addText('Supporting Evidence', { x: 0.5, y: 2.4, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.evidence) || '', { x: 0.5, y: 2.8, w: 4.3, h: 2, fontSize: 10, color: '334155' });
                slide.addText('Secondary Diagnoses', { x: 5.2, y: 2.4, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.secondaryDx) || '', { x: 5.2, y: 2.8, w: 4.3, h: 2, fontSize: 10, color: '334155' });
                break;

            case 'prognosis':
                slide.addText('Prognosis & Follow-up', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText('Prognosis', { x: 0.5, y: 1, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.prognosis) || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.5, fontSize: 10, color: '334155' });
                slide.addText('Complications', { x: 0.5, y: 3, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.complications) || '', { x: 0.5, y: 3.4, w: 4.3, h: 1.3, fontSize: 10, color: '334155' });
                slide.addText('Follow-up Plan', { x: 5.2, y: 1, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.followup) || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.5, fontSize: 10, color: '334155' });
                slide.addText('Patient Education', { x: 5.2, y: 3, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.education) || '', { x: 5.2, y: 3.4, w: 4.3, h: 1.3, fontSize: 10, color: '334155' });
                break;

            case 'teaching-points':
                slide.addText('Key Teaching Points', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.teachingPoints) || '', {
                    x: 0.5, y: 1, w: 9, h: 4,
                    fontSize: 12, color: '334155', valign: 'top'
                });
                break;

            case 'references':
            case 'references-formatted':
                slide.addText('References', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.references) || '', {
                    x: 0.5, y: 1, w: 9, h: 4,
                    fontSize: 9, color: '475569', valign: 'top'
                });
                break;

            case 'jc-background':
                slide.addText('Background & Rationale', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText('Current Knowledge', { x: 0.5, y: 1, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.currentKnowledge) || '', { x: 0.5, y: 1.4, w: 4.3, h: 1.8, fontSize: 10, color: '334155' });
                slide.addText('Knowledge Gap', { x: 5.2, y: 1, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: '1e3a5f' });
                slide.addText(getText(data.knowledgeGap) || '', { x: 5.2, y: 1.4, w: 4.3, h: 1.8, fontSize: 10, color: '334155' });
                if (data.objective) {
                    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.5, w: 9, h: 1.3, fill: { color: 'DBEAFE' } });
                    slide.addText('Study Objective: ' + getText(data.objective), {
                        x: 0.6, y: 3.6, w: 8.8, h: 1.1, fontSize: 11, color: '1E40AF', valign: 'top'
                    });
                }
                break;

            case 'jc-methods':
                slide.addText('Study Methods', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                const methodsRows = [
                    ['Study Design', getText(data.studyDesign) || ''],
                    ['Population', getText(data.studyPop) || ''],
                    ['Randomization', getText(data.randomization) || ''],
                    ['Protocol', getText(data.protocol) || ''],
                    ['Statistics', getText(data.stats) || '']
                ];
                slide.addTable(methodsRows, {
                    x: 0.5, y: 1, w: 9, h: 4,
                    fontSize: 10, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' }
                });
                break;

            case 'jc-limitations':
                slide.addText('Study Limitations', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.limitations) || '', {
                    x: 0.5, y: 1, w: 9, h: 4,
                    fontSize: 11, color: '334155', valign: 'top'
                });
                break;

            case 'jc-applicability':
                slide.addText('Clinical Applicability', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 2.9, h: 2.5, fill: { color: 'D1FAE5' } });
                slide.addText('Reasons to Apply', { x: 0.6, y: 1.1, w: 2.7, h: 0.3, fontSize: 11, bold: true, color: '065F46' });
                slide.addText(getText(data.pros) || '', { x: 0.6, y: 1.5, w: 2.7, h: 1.9, fontSize: 9, color: '065F46' });

                slide.addShape(pptx.ShapeType.rect, { x: 3.55, y: 1, w: 2.9, h: 2.5, fill: { color: 'FEE2E2' } });
                slide.addText('Reasons for Caution', { x: 3.65, y: 1.1, w: 2.7, h: 0.3, fontSize: 11, bold: true, color: '991B1B' });
                slide.addText(getText(data.cons) || '', { x: 3.65, y: 1.5, w: 2.7, h: 1.9, fontSize: 9, color: '991B1B' });

                slide.addShape(pptx.ShapeType.rect, { x: 6.6, y: 1, w: 2.9, h: 2.5, fill: { color: 'FEF3C7' } });
                slide.addText('Geriatric Considerations', { x: 6.7, y: 1.1, w: 2.7, h: 0.3, fontSize: 11, bold: true, color: '92400E' });
                slide.addText(getText(data.geriatricConsiderations) || '', { x: 6.7, y: 1.5, w: 2.7, h: 1.9, fontSize: 9, color: '92400E' });
                break;

            case 'jc-conclusion':
                slide.addText('Conclusions & Take-Home Points', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 1.2, fill: { color: 'D1FAE5' } });
                slide.addText('Bottom Line: ' + (getText(data.bottomLine) || ''), {
                    x: 0.6, y: 1.1, w: 8.8, h: 1, fontSize: 14, color: '065F46', valign: 'middle'
                });
                slide.addText(getText(data.takeaways) || '', {
                    x: 0.5, y: 2.5, w: 9, h: 2.5,
                    fontSize: 11, color: '334155', valign: 'top'
                });
                break;

            case 'take-home':
                slide.background = { color: '1e3a5f' };
                slide.addText('Take-Home Messages', {
                    x: 0.5, y: 0.5, w: 9, h: 0.6,
                    fontSize: 28, bold: true, color: 'FFFFFF'
                });
                slide.addText(getText(data.message1) || '', { x: 0.5, y: 1.3, w: 9, h: 0.8, fontSize: 14, color: 'FFFFFF' });
                slide.addText(getText(data.message2) || '', { x: 0.5, y: 2.3, w: 9, h: 0.8, fontSize: 14, color: 'FFFFFF' });
                slide.addText(getText(data.message3) || '', { x: 0.5, y: 3.3, w: 9, h: 0.8, fontSize: 14, color: 'FFFFFF' });
                if (data.bottomLine) {
                    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.3, w: 9, h: 0.8, fill: { color: '27ae60' } });
                    slide.addText(getText(data.bottomLine), { x: 0.6, y: 4.4, w: 8.8, h: 0.6, fontSize: 12, color: 'FFFFFF', align: 'center' });
                }
                break;

            case 'quiz':
                slide.addText('Question ' + (getText(data.qNum) || '#1'), {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText(getText(data.question) || '', {
                    x: 0.5, y: 1, w: 9, h: 1.2,
                    fontSize: 16, color: '334155'
                });
                const options = [
                    ['A', getText(data.optionA) || ''],
                    ['B', getText(data.optionB) || ''],
                    ['C', getText(data.optionC) || ''],
                    ['D', getText(data.optionD) || '']
                ];
                options.forEach((opt, i) => {
                    const y = 2.4 + i * 0.7;
                    const isCorrect = data.correct === opt[0];
                    slide.addShape(pptx.ShapeType.rect, {
                        x: 0.5, y: y, w: 9, h: 0.6,
                        fill: { color: isCorrect ? 'D1FAE5' : 'F8FAFC' },
                        line: { color: isCorrect ? '27ae60' : 'E2E8F0', pt: 1 }
                    });
                    slide.addText(opt[0] + '. ' + opt[1], {
                        x: 0.7, y: y + 0.1, w: 8.6, h: 0.4,
                        fontSize: 12, color: isCorrect ? '065F46' : '334155'
                    });
                });
                break;

            case 'case-summary':
                slide.addText('Case Summary', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                const summaryData = [
                    ['Patient', getText(data.patient) || ''],
                    ['Presentation', getText(data.presentation) || ''],
                    ['Diagnosis', getText(data.diagnosis) || ''],
                    ['Management', getText(data.management) || ''],
                    ['Outcome', getText(data.outcome) || ''],
                    ['Key Learning', getText(data.learning) || '']
                ];
                slide.addTable(summaryData, {
                    x: 0.5, y: 1, w: 9, h: 4,
                    fontSize: 11, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' },
                    fill: { color: 'F8FAFC' }
                });
                break;

            case 'diagnostic-workup':
                slide.addText('Diagnostic Workup', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                const workupRows = [
                    ['Urgent/STAT', getText(data.urgent) || ''],
                    ['Routine Labs', getText(data.routine) || ''],
                    ['Imaging', getText(data.imaging) || ''],
                    ['Special Tests', getText(data.special) || '']
                ];
                slide.addTable(workupRows, {
                    x: 0.5, y: 1, w: 9, h: 2.8,
                    fontSize: 11, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' }
                });
                if (data.rationale) {
                    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4, w: 9, h: 1, fill: { color: 'FEF3C7' } });
                    slide.addText('Rationale: ' + getText(data.rationale), {
                        x: 0.6, y: 4.1, w: 8.8, h: 0.8, fontSize: 10, color: '92400E'
                    });
                }
                break;

            case 'pros-cons':
                slide.addText(getText(data.title) || 'Pros & Cons', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 4.3, h: 2.5, fill: { color: 'D1FAE5' } });
                slide.addText('Advantages', { x: 0.6, y: 1.1, w: 4.1, h: 0.3, fontSize: 14, bold: true, color: '065F46' });
                slide.addText(getText(data.pros) || '', { x: 0.6, y: 1.5, w: 4.1, h: 1.9, fontSize: 10, color: '065F46' });
                slide.addShape(pptx.ShapeType.rect, { x: 5.2, y: 1, w: 4.3, h: 2.5, fill: { color: 'FEE2E2' } });
                slide.addText('Disadvantages', { x: 5.3, y: 1.1, w: 4.1, h: 0.3, fontSize: 14, bold: true, color: '991B1B' });
                slide.addText(getText(data.cons) || '', { x: 5.3, y: 1.5, w: 4.1, h: 1.9, fontSize: 10, color: '991B1B' });
                if (data.verdict) {
                    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.7, w: 9, h: 1, fill: { color: '1e3a5f' } });
                    slide.addText(getText(data.verdict), { x: 0.6, y: 3.8, w: 8.8, h: 0.8, fontSize: 12, color: 'FFFFFF', align: 'center' });
                }
                break;

            case 'evidence-summary':
                slide.addText('Evidence Summary', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                const evidenceRows = [
                    ['High ⊕⊕⊕⊕', getText(data.highEvidence) || ''],
                    ['Moderate ⊕⊕⊕○', getText(data.modEvidence) || ''],
                    ['Low ⊕⊕○○', getText(data.lowEvidence) || ''],
                    ['Very Low ⊕○○○', getText(data.veryLowEvidence) || '']
                ];
                slide.addTable(evidenceRows, {
                    x: 0.5, y: 1, w: 9, h: 3.5,
                    fontSize: 10, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' }
                });
                break;

            case 'geriatric-syndromes':
                slide.addText('Geriatric Syndromes Assessment', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                const syndromeRows = [
                    ['Delirium', getText(data.delirium) || '-'],
                    ['Dementia', getText(data.dementia) || '-'],
                    ['Depression', getText(data.depression) || '-'],
                    ['Falls', getText(data.falls) || '-'],
                    ['Incontinence', getText(data.incontinence) || '-'],
                    ['Malnutrition', getText(data.malnutrition) || '-'],
                    ['Polypharmacy', getText(data.polypharmacy) || '-'],
                    ['Frailty', getText(data.frailty) || '-']
                ];
                slide.addTable(syndromeRows, {
                    x: 0.5, y: 1, w: 9, h: 4,
                    fontSize: 11, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' },
                    fill: { color: 'F8FAFC' }
                });
                break;

            case 'goals-of-care':
                slide.addText('Goals of Care', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                if (data.values) {
                    slide.addText('Patient Values: ' + getText(data.values), {
                        x: 0.5, y: 1, w: 9, h: 0.8, fontSize: 11, color: '334155'
                    });
                }
                const goalOption = data.goal || 'functional';
                slide.addText('Selected Goal: ' + goalOption.charAt(0).toUpperCase() + goalOption.slice(1), {
                    x: 0.5, y: 2, w: 9, h: 0.4, fontSize: 14, bold: true, color: '1e3a5f'
                });
                const directiveRows = [
                    ['Code Status', getText(data.codeStatus) || ''],
                    ['Intubation', getText(data.intubation) || ''],
                    ['Feeding Tube', getText(data.feeding) || ''],
                    ['Healthcare Proxy', getText(data.proxy) || '']
                ];
                slide.addTable(directiveRows, {
                    x: 0.5, y: 2.6, w: 9, h: 2,
                    fontSize: 11, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' }
                });
                break;

            case 'forest-plot':
                slide.addText(getText(data.plotTitle) || 'Forest Plot', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                slide.addText('Overall Effect: ' + (getText(data.overallEffect) || ''), {
                    x: 0.5, y: 1.2, w: 9, h: 0.4, fontSize: 14, bold: true, color: '1e3a5f'
                });
                if (data.interpretation) {
                    slide.addText(getText(data.interpretation), {
                        x: 0.5, y: 2, w: 9, h: 2.5, fontSize: 11, color: '334155'
                    });
                }
                break;

            case 'drug-comparison':
                slide.addText('Medication Comparison', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                const drugHeader = [['Feature', getText(data.drug1Name) || 'Drug A', getText(data.drug2Name) || 'Drug B', getText(data.drug3Name) || 'Drug C']];
                const drugRows = [
                    ['Mechanism', getText(data.drug1Mech) || '', getText(data.drug2Mech) || '', getText(data.drug3Mech) || ''],
                    ['Dosing', getText(data.drug1Dose) || '', getText(data.drug2Dose) || '', getText(data.drug3Dose) || ''],
                    ['Renal Adj.', getText(data.drug1Renal) || '', getText(data.drug2Renal) || '', getText(data.drug3Renal) || ''],
                    ['Side Effects', getText(data.drug1SE) || '', getText(data.drug2SE) || '', getText(data.drug3SE) || ''],
                    ['Geri Concerns', getText(data.drug1Geri) || '', getText(data.drug2Geri) || '', getText(data.drug3Geri) || '']
                ];
                slide.addTable([...drugHeader, ...drugRows], {
                    x: 0.5, y: 1, w: 9, h: 3.2,
                    fontSize: 9, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' }
                });
                if (data.drugRecommendation) {
                    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 4.4, w: 9, h: 0.7, fill: { color: '27ae60' } });
                    slide.addText(getText(data.drugRecommendation), { x: 0.6, y: 4.5, w: 8.8, h: 0.5, fontSize: 11, color: 'FFFFFF' });
                }
                break;

            case 'qr-resources':
                slide.addText('Additional Resources', {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });
                const qrResources = [
                    [getText(data.qr1Label) || 'Resource 1', getText(data.qr1Url) || ''],
                    [getText(data.qr2Label) || 'Resource 2', getText(data.qr2Url) || ''],
                    [getText(data.qr3Label) || 'Resource 3', getText(data.qr3Url) || '']
                ];
                slide.addTable(qrResources, {
                    x: 0.5, y: 1.5, w: 9, h: 2,
                    fontSize: 12, color: '334155',
                    border: { pt: 0.5, color: 'E2E8F0' }
                });
                slide.addText('Scan QR codes or visit URLs for more information', {
                    x: 0.5, y: 4, w: 9, h: 0.3, fontSize: 10, color: '6b7280', align: 'center'
                });
                break;

            default:
                // Generic content slide
                const title = data.title || data.sectionTitle || data.diseaseName ||
                    template.name || 'Slide';
                slide.addText(getText(title), {
                    x: 0.5, y: 0.3, w: 9, h: 0.5,
                    fontSize: 24, bold: true, color: '1e3a5f'
                });

                // Try to find main content
                const contentFields = ['content', 'hpiContent', 'definition', 'findings',
                    'prognosis', 'teachingPoints', 'references', 'currentKnowledge',
                    'keyFindings', 'bottomLine'];
                let mainContent = '';
                for (const field of contentFields) {
                    if (data[field]) {
                        mainContent = getText(data[field]);
                        break;
                    }
                }

                if (mainContent) {
                    slide.addText(mainContent, {
                        x: 0.5, y: 1, w: 9, h: 4,
                        fontSize: 12, color: '334155',
                        valign: 'top'
                    });
                }
                break;
        }

        // Add footer to non-title slides
        if (!['title', 'jc-title', 'section-header', 'questions'].includes(slideData.type)) {
            slide.addText('SZMC Geriatrics', {
                x: 0.5, y: 5.3, w: 3, h: 0.2,
                fontSize: 8, color: '94a3b8'
            });
        }
    }

    async exportToHTML(presentation) {
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${presentation.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        ${await this.getStyles()}
        body { background: #1e293b; margin: 0; padding: 20px; }
        .slide-container { max-width: 960px; margin: 20px auto; }
        .slide { margin-bottom: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        @media print {
            body { background: white; padding: 0; }
            .slide { page-break-after: always; margin: 0; box-shadow: none; }
        }
    </style>
</head>
<body>
`;

        for (const slideData of presentation.slides) {
            const template = SlideTemplates[slideData.type];
            if (template) {
                html += `<div class="slide-container">${template.render(slideData.data)}</div>\n`;
            }
        }

        html += `</body></html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${presentation.title.replace(/[^a-z0-9]/gi, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    async getStyles() {
        // Fetch CSS files content
        const cssFiles = ['css/main.css', 'css/presentation.css'];
        let styles = '';

        for (const file of cssFiles) {
            try {
                const response = await fetch(file);
                styles += await response.text() + '\n';
            } catch (e) {
                console.warn('Could not load', file);
            }
        }

        return styles;
    }

    exportToPDF() {
        // Use browser print with PDF destination
        window.print();
    }

    // Enhanced JSON export with metadata
    exportToJSON(presentation) {
        const exportData = {
            ...presentation,
            exportedAt: new Date().toISOString(),
            version: '2.0',
            language: window.i18n ? i18n.getLanguage() : 'en',
            metadata: {
                slideCount: presentation.slides.length,
                presentationType: presentation.type,
                estimatedDuration: Math.round(presentation.slides.length * 1.5) + ' minutes'
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${presentation.title.replace(/[^a-z0-9\u0590-\u05FF]/gi, '_')}.json`;
        a.click();

        URL.revokeObjectURL(url);

        if (typeof showToast === 'function') {
            const msg = window.i18n ? i18n.t('presentationSaved') : 'Presentation saved successfully!';
            showToast(msg);
        }
    }

    // Import JSON presentation
    importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    // Validate required fields
                    if (!data.slides || !Array.isArray(data.slides)) {
                        reject(new Error('Invalid presentation file: missing slides array'));
                        return;
                    }

                    // Ensure all slides have required properties
                    data.slides = data.slides.map((slide, index) => ({
                        id: slide.id || `slide-${Date.now()}-${index}`,
                        type: slide.type || 'content',
                        data: slide.data || {},
                        order: typeof slide.order === 'number' ? slide.order : index
                    }));

                    resolve(data);
                } catch (error) {
                    reject(new Error('Failed to parse presentation file: ' + error.message));
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Export to RTL-aware HTML
    async exportToHTMLWithRTL(presentation) {
        const isRTL = window.i18n && i18n.isRTL();
        const lang = window.i18n ? i18n.getLanguage() : 'en';

        let html = `<!DOCTYPE html>
<html lang="${lang}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(presentation.title)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Heebo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        ${await this.getStyles()}
        ${isRTL ? await this.getRTLStyles() : ''}
        body {
            background: #1e293b;
            margin: 0;
            padding: 20px;
            direction: ${isRTL ? 'rtl' : 'ltr'};
            font-family: ${isRTL ? "'Heebo', 'Inter', sans-serif" : "'Inter', sans-serif"};
        }
        .slide-container { max-width: 960px; margin: 20px auto; }
        .slide { margin-bottom: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
        @media print {
            body { background: white; padding: 0; }
            .slide { page-break-after: always; margin: 0; box-shadow: none; }
        }
    </style>
</head>
<body class="${isRTL ? 'rtl' : 'ltr'}">
`;

        for (const slideData of presentation.slides) {
            const template = SlideTemplates[slideData.type];
            if (template) {
                html += `<div class="slide-container">${template.render(slideData.data)}</div>\n`;
            }
        }

        html += `</body></html>`;

        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${presentation.title.replace(/[^a-z0-9\u0590-\u05FF]/gi, '_')}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    async getRTLStyles() {
        try {
            const response = await fetch('css/rtl.css');
            return await response.text();
        } catch (e) {
            console.warn('Could not load RTL styles');
            return '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Convert JSON to formatted HTML report
    jsonToHTMLReport(jsonData) {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        const isRTL = window.i18n && i18n.isRTL();

        let html = `<!DOCTYPE html>
<html lang="${isRTL ? 'he' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(data.title || 'Presentation Report')}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: ${isRTL ? "'Heebo', Arial, sans-serif" : "'Inter', Arial, sans-serif"};
            line-height: 1.6;
            color: #1f2937;
            background: #f8fafc;
            padding: 40px 20px;
            direction: ${isRTL ? 'rtl' : 'ltr'};
        }
        .report-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .report-header {
            text-align: center;
            padding-bottom: 24px;
            border-bottom: 2px solid #1e3a5f;
            margin-bottom: 32px;
        }
        .report-title {
            font-size: 28px;
            font-weight: 700;
            color: #1e3a5f;
            margin-bottom: 8px;
        }
        .report-meta {
            font-size: 14px;
            color: #64748b;
        }
        .slide-section {
            margin-bottom: 24px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border-${isRTL ? 'right' : 'left'}: 4px solid #3498db;
        }
        .slide-number {
            display: inline-block;
            background: #1e3a5f;
            color: white;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 4px;
            margin-bottom: 8px;
        }
        .slide-type {
            font-size: 18px;
            font-weight: 600;
            color: #1e3a5f;
            margin-bottom: 12px;
        }
        .slide-content {
            font-size: 14px;
            color: #475569;
        }
        .slide-content p { margin-bottom: 8px; }
        .field-group {
            margin-bottom: 8px;
        }
        .field-label {
            font-weight: 600;
            color: #1e3a5f;
            font-size: 13px;
        }
        .field-value {
            color: #334155;
        }
        @media print {
            body { background: white; padding: 0; }
            .report-container { box-shadow: none; }
            .slide-section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="report-header">
            <h1 class="report-title">${this.escapeHtml(data.title || 'Untitled Presentation')}</h1>
            <p class="report-meta">
                ${data.type === 'journal' ? 'Journal Club' : 'Case Presentation'} |
                ${data.slides ? data.slides.length : 0} slides |
                Generated: ${new Date().toLocaleDateString()}
            </p>
        </div>
`;

        if (data.slides && Array.isArray(data.slides)) {
            data.slides.forEach((slide, index) => {
                const template = SlideTemplates && SlideTemplates[slide.type];
                const typeName = template ? template.name : slide.type;

                html += `
        <div class="slide-section">
            <span class="slide-number">Slide ${index + 1}</span>
            <h2 class="slide-type">${this.escapeHtml(typeName)}</h2>
            <div class="slide-content">
`;
                // Extract and display slide data
                if (slide.data) {
                    Object.entries(slide.data).forEach(([key, value]) => {
                        if (value && typeof value === 'string' && value.trim()) {
                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            const cleanValue = value.replace(/<[^>]*>/g, '').trim();
                            if (cleanValue) {
                                html += `
                <div class="field-group">
                    <span class="field-label">${this.escapeHtml(label)}:</span>
                    <span class="field-value">${this.escapeHtml(cleanValue)}</span>
                </div>
`;
                            }
                        }
                    });
                }

                html += `
            </div>
        </div>
`;
            });
        }

        html += `
    </div>
</body>
</html>`;

        return html;
    }

    // Download JSON as HTML report
    downloadJSONAsHTMLReport(jsonData, filename = 'presentation-report.html') {
        const html = this.jsonToHTMLReport(jsonData);
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Create global exporter instance
const exporter = new PresentationExporter();

// Global export functions
async function exportToPPTX() {
    const presentation = editor.getPresentation();
    await exporter.exportToPPTX(presentation);
    if (typeof showToast === 'function') {
        showToast('PowerPoint exported successfully!');
    }
}

async function exportToHTML() {
    const presentation = editor.getPresentation();
    // Use RTL-aware export
    await exporter.exportToHTMLWithRTL(presentation);
    if (typeof showToast === 'function') {
        showToast('HTML exported successfully!');
    }
}

function exportToPDF() {
    startPresentation();
    setTimeout(() => {
        window.print();
    }, 500);
}

// Save presentation (JSON export)
function savePresentation() {
    const presentation = editor.getPresentation();
    exporter.exportToJSON(presentation);
}

// Load presentation from file
function loadPresentation() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = await exporter.importFromJSON(file);
            editor.loadPresentation(data);

            if (typeof showToast === 'function') {
                showToast('Presentation loaded successfully!');
            }

            // Switch to editor page if not already there
            document.getElementById('landing-page').classList.remove('active');
            document.getElementById('editor-page').classList.add('active');
        } catch (error) {
            const errorMsg = window.i18n ? i18n.t('errorLoadingPresentation') : 'Error loading presentation: ';
            alert(errorMsg + error.message);
        }
    };

    input.click();
}

// Convert JSON file to HTML report
function convertJSONToHTML() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = await exporter.importFromJSON(file);
            const filename = file.name.replace('.json', '-report.html');
            exporter.downloadJSONAsHTMLReport(data, filename);

            if (typeof showToast === 'function') {
                showToast('HTML report generated!');
            }
        } catch (error) {
            alert('Error converting file: ' + error.message);
        }
    };

    input.click();
}
