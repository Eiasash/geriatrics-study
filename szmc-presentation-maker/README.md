# SZMC Geriatrics Presentation Maker

A professional presentation builder for the Geriatrics Department at Shaare Zedek Medical Center (SZMC). Create structured, consistent, and visually appealing presentations for case presentations and journal clubs.

## Professional Medical Standards

This presentation maker follows globally recognized medical presentation standards:

- **AMA (American Medical Association)**: Citation formatting and medical terminology standards
- **NLM (National Library of Medicine)**: Evidence-based structure and reference formatting
- **ICMJE (International Committee of Medical Journal Editors)**: Research reporting standards
- **CONSORT/PRISMA**: Clinical trial and systematic review reporting guidelines
- **CASP/GRADE**: Critical appraisal and evidence quality frameworks

## Features

### Text-to-Presentation Generator
- **Auto-detection**: Automatically identifies case presentations vs. journal club articles
- **Smart parsing**: Extracts key information from pasted text
- **Multiple themes**: 8 professional color schemes
- **Customizable**: Adjust slide density and included sections

### Case Presentation Template
- **Patient Information**: Demographics, chief complaint, code status
- **History**: HPI with timeline, PMH, medications, social history
- **Physical Exam**: Vitals display with abnormal value highlighting
- **Geriatric Assessment**: MMSE, MoCA, GDS, TUG, MNA, ADLs, IADLs
- **Labs & Imaging**: Structured display of results
- **Differential Diagnosis**: Ranked list with probability indicators
- **Disease Overview**: Definition, pathophysiology, clinical features
- **Treatment Plan**: Pharmacologic, non-pharmacologic, monitoring
- **Teaching Points**: Key takeaways and clinical pearls

### Journal Club Template
- **Article Information**: Full citation with DOI/PMID
- **PICO Framework**: Structured research question
- **Methods Analysis**: Study design, randomization, blinding
- **Results Summary**: Primary/secondary outcomes with statistics
- **Critical Appraisal**: Bias assessment, validity evaluation
- **Geriatric Considerations**: Elderly-specific analysis
- **Clinical Applicability**: Practice implications

## Getting Started

### Quick Start
1. Open `index.html` in a web browser
2. Choose a template (Case Presentation or Journal Club)
3. Fill in your content using the editor
4. Present directly or export to PowerPoint

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for fonts and PowerPoint export)

## Usage

### Creating a Presentation

1. **Select Template**: Choose between Case Presentation or Journal Club
2. **Edit Slides**: Click on any text to edit directly
3. **Navigate**: Use the slide thumbnails on the left to navigate
4. **Add Slides**: Click the + button or use Ctrl+N
5. **Change Slide Type**: Use the dropdown in the properties panel
6. **Rearrange**: Drag and drop thumbnails to reorder

### Presentation Mode

- Click "Present" to enter fullscreen presentation mode
- Use arrow keys or click to navigate
- Press Escape to exit

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ← / → | Previous / Next slide |
| Ctrl + S | Save presentation |
| Ctrl + N | Add new slide |
| Space | Next slide (presentation mode) |
| Escape | Exit presentation mode |
| Home / End | First / Last slide |

### Importing Presentations

- **JSON**: Load previously saved presentations
- **PowerPoint (.pptx)**: Import existing PowerPoint files - extracts text and structure
- **HTML**: Import HTML presentations - parses slide structure and content

Click "Import Presentation" on the landing page and select your file.

### Exporting Presentations

- **PowerPoint (.pptx)**: Full-featured export with proper formatting, themes, and layouts
- **JSON**: Editable format for saving and sharing presentations
- **HTML**: Standalone HTML file for web viewing
- **PDF**: Use browser print function (Ctrl+P → Save as PDF)

## Template Structure

### Case Presentation Slides
1. Title
2. Patient Information
3. History of Present Illness
4. Past Medical History
5. Medications
6. Social History
7. Physical Examination
8. Laboratory Results
9. Geriatric Assessment
10. Differential Diagnosis
11. Final Diagnosis
12. Disease Overview
13. Treatment Plan
14. Prognosis & Follow-up
15. Teaching Points
16. References
17. Questions

### Journal Club Slides
1. Article Title
2. Background & Rationale
3. PICO Framework
4. Study Methods
5. Results
6. Statistical Analysis
7. Discussion
8. Limitations
9. Clinical Applicability
10. Conclusions
11. References
12. Questions

## Customization

### Adding Custom Slide Types
Edit `js/templates.js` to add new slide templates following the existing pattern.

### Styling
Modify `css/presentation.css` for slide styles or `css/main.css` for editor styles.

### Branding
Update colors in CSS variables (`:root` section) to match your institution's branding.

## File Structure

```
szmc-presentation-maker/
├── index.html              # Main application
├── css/
│   ├── main.css           # Editor and UI styles
│   └── presentation.css   # Slide styles
├── js/
│   ├── templates.js       # Slide templates
│   ├── editor.js          # Editor functionality
│   ├── presentation.js    # Presentation mode
│   ├── export.js          # Export functionality
│   └── main.js            # Main application logic
├── templates/
│   ├── case-presentation.json   # Case template schema
│   └── journal-club.json        # Journal club schema
├── assets/                # Images and resources
└── README.md
```

## Geriatric Assessment Tools Reference

| Tool | Score Range | Interpretation |
|------|-------------|----------------|
| MMSE | 0-30 | ≥27 Normal, 21-26 Mild, 11-20 Moderate, ≤10 Severe |
| MoCA | 0-30 | ≥26 Normal, 18-25 MCI, 10-17 Moderate, <10 Severe |
| GDS-15 | 0-15 | 0-4 Normal, 5-9 Mild depression, 10-15 Moderate-severe |
| TUG | seconds | <10s Normal, 10-20s Increased risk, >20s High risk |
| MNA-SF | 0-14 | 12-14 Normal, 8-11 At risk, 0-7 Malnourished |
| Barthel | 0-100 | 80-100 Independent, 60-79 Mild, 40-59 Moderate, <40 Severe |
| Lawton | 0-8 | 8 Independent, lower = more dependent |

## Contributing

Suggestions and improvements welcome! Please submit issues or pull requests.

## License

For internal use at Shaare Zedek Medical Center - Geriatrics Department.

## Contact

Geriatrics Department
Shaare Zedek Medical Center
Jerusalem, Israel
