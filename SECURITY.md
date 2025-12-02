# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of the SZMC Geriatrics Hub seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Create a Public Issue

Please **do not** create a public GitHub issue for security vulnerabilities. This could put users at risk.

### 2. Contact Us Privately

Send details about the vulnerability to:
- **GitHub Security Advisory**: Use the [Security tab](https://github.com/Eiasash/geriatrics-study/security/advisories) to create a private security advisory
- **Direct Contact**: Open a private discussion on GitHub

### 3. Include These Details

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: What could an attacker do with this vulnerability?
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Components**: Which parts of the application are affected?
- **Suggested Fix**: If you have ideas on how to fix it (optional)
- **Proof of Concept**: Code or screenshots demonstrating the issue (if applicable)

### Example Report

```markdown
**Title**: XSS vulnerability in presentation title field

**Description**: User-supplied content in the presentation title is not 
properly sanitized, allowing JavaScript injection.

**Impact**: An attacker could inject malicious scripts that execute when 
other users view the presentation.

**Steps to Reproduce**:
1. Navigate to Presentation Maker
2. Create new presentation
3. Enter `<script>alert('XSS')</script>` as title
4. View presentation - script executes

**Affected Component**: szmc-presentation-maker/js/editor.js, line 245

**Suggested Fix**: Use DOMPurify or similar library to sanitize user input
```

## Response Timeline

- **Acknowledgment**: Within 48 hours of report
- **Initial Assessment**: Within 5 business days
- **Status Update**: Weekly updates on progress
- **Resolution**: Depends on severity (see below)

### Severity Levels

- **Critical**: Fixed within 24-48 hours
- **High**: Fixed within 1 week
- **Medium**: Fixed within 2 weeks
- **Low**: Fixed in next regular release

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version from GitHub Pages
2. **No Sensitive Data**: Do not enter real patient data (use de-identified data only)
3. **Secure Exports**: Be careful when sharing exported presentations
4. **Browser Security**: Keep your browser up to date
5. **HTTPS Only**: Access the site via HTTPS

### For Contributors

1. **Input Validation**: Always validate and sanitize user input
2. **No Secrets in Code**: Never commit API keys, passwords, or tokens
3. **Dependencies**: Keep dependencies updated (use Dependabot)
4. **XSS Prevention**: Escape HTML output, use Content Security Policy
5. **CORS**: Configure CORS properly for API endpoints
6. **Authentication**: Use secure authentication methods
7. **Encryption**: Use HTTPS for all data transmission

## Known Security Considerations

### Current Security Measures

- ✅ **Client-Side Only**: No server-side data storage reduces attack surface
- ✅ **CSP Headers**: Content Security Policy implemented
- ✅ **HTTPS**: All production traffic over HTTPS (GitHub Pages)
- ✅ **No Auth**: No authentication system means no credential theft
- ✅ **Dependency Scanning**: Automated via Dependabot and npm audit
- ✅ **CodeQL Analysis**: Automated security scanning on all PRs

### Limitations

- ⚠️ **Client-Side Storage**: Local storage can be accessed by browser extensions
- ⚠️ **No Encryption**: Presentations stored in browser are not encrypted
- ⚠️ **No Access Control**: Anyone with the link can access public deployments
- ⚠️ **Browser Vulnerabilities**: Dependent on browser security

## Security Features by Component

### H5P Content System

- No server-side execution
- Content validation before packaging
- Sanitized filenames
- No arbitrary file inclusion

### Presentation Maker

- XSS protection via DOMPurify (if implemented)
- No eval() or dangerous functions
- Sandboxed iframes for previews
- Local storage with expiration

### Clinical Tools

- Read-only reference data
- No patient data submission
- Client-side calculations only
- No external API calls with sensitive data

## Data Privacy

### What We Collect

- **Nothing**: This is a static site hosted on GitHub Pages
- **Local Storage**: Presentations saved in your browser only
- **No Analytics**: No tracking or analytics by default
- **No Cookies**: No cookies used (except GitHub Pages defaults)

### HIPAA Compliance

**Important**: This tool is NOT HIPAA-compliant for storing protected health information (PHI).

- ❌ Do not enter real patient names
- ❌ Do not enter medical record numbers
- ❌ Do not enter dates of birth or specific dates
- ✅ Use de-identified data only
- ✅ Use for educational purposes only

If you need HIPAA compliance, you must:
1. Deploy to a secure, private server
2. Implement encryption at rest and in transit
3. Add access controls and audit logging
4. Sign a Business Associate Agreement
5. Conduct a security risk assessment

## Third-Party Dependencies

We use automated tools to monitor dependencies:

- **Dependabot**: Automatic PR for security updates
- **npm audit**: Run during CI/CD pipeline
- **CodeQL**: Static analysis for vulnerabilities

### Current Dependencies

Major dependencies are listed in:
- `h5p/package.json` - Node.js dependencies
- CDN resources - Font Awesome, Google Fonts

We regularly review and update dependencies to address security issues.

## Disclosure Policy

When we receive a security report:

1. **Confirm**: We confirm the vulnerability exists
2. **Fix**: We develop and test a fix
3. **Release**: We release the fix in a new version
4. **Notify**: We notify the reporter
5. **Disclose**: After 90 days or when fix is deployed (whichever comes first), we may publicly disclose:
   - Nature of the vulnerability
   - Affected versions
   - Fix applied
   - Credit to reporter (if desired)

## Security Updates

Security patches are released as:
- **Patch version** for minor fixes (e.g., 1.0.1)
- **Minor version** for moderate fixes (e.g., 1.1.0)
- **Major version** for breaking changes (e.g., 2.0.0)

Users are notified via:
- GitHub Security Advisories
- Release notes
- README updates

## Attribution

If you report a valid security vulnerability:
- We'll credit you in the security advisory (unless you prefer anonymity)
- Your name will appear in CHANGELOG.md
- You'll be recognized as a security contributor

## Questions?

For security-related questions (not vulnerabilities):
- Open a [Discussion](https://github.com/Eiasash/geriatrics-study/discussions)
- Tag with "security" label

---

**Thank you for helping keep SZMC Geriatrics Hub safe!** 🔒
