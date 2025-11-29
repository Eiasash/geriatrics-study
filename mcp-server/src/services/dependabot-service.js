/**
 * Dependabot Service
 * 
 * Provides logic for analyzing and auto-approving Dependabot PRs
 */

export class DependabotService {
    constructor() {
        // Auto-merge rules configuration
        this.rules = {
            // Allow auto-merge for these ecosystems
            allowedEcosystems: ['npm', 'pip', 'github-actions'],
            
            // Allow auto-merge for these update types
            allowedUpdateTypes: ['patch', 'minor'],
            
            // Block auto-merge for these package patterns
            blockedPackages: [
                /^@types\/node$/,  // Node type updates may require code changes
                /^typescript$/,    // TypeScript upgrades may break builds
                /^eslint-config-/, // ESLint config changes need review
            ],
            
            // Labels that block auto-merge
            blockingLabels: ['do-not-merge', 'hold', 'needs-review', 'breaking-change'],
            
            // Labels that indicate security updates (always allow)
            securityLabels: ['security', 'vulnerability', 'CVE'],
            
            // Maximum number of files changed for auto-merge
            maxFilesChanged: 5,
        };
    }

    /**
     * Analyze a Dependabot PR and determine if it should be auto-approved
     */
    analyzePR(prData) {
        const { prTitle, labels, files, oldVersion, newVersion } = prData;
        const analysis = {
            shouldApprove: false,
            confidence: 0,
            reason: '',
            updateType: null,
            ecosystem: null,
            packageName: null,
            risks: [],
            recommendations: []
        };

        // Parse PR title to extract package info
        const titleInfo = this.parseTitle(prTitle);
        analysis.ecosystem = titleInfo.ecosystem;
        analysis.packageName = titleInfo.packageName;
        analysis.updateType = titleInfo.updateType || this.determineUpdateType(oldVersion, newVersion);

        // Check for security update
        if (this.isSecurityUpdate(prTitle, labels)) {
            analysis.shouldApprove = true;
            analysis.confidence = 95;
            analysis.reason = 'Security update - auto-approve recommended';
            analysis.recommendations.push('Review changelog for breaking changes');
            return analysis;
        }

        // Check for blocking labels
        const blockingLabel = this.hasBlockingLabel(labels);
        if (blockingLabel) {
            analysis.shouldApprove = false;
            analysis.confidence = 100;
            analysis.reason = `Blocked by label: ${blockingLabel}`;
            return analysis;
        }

        // Check for blocked packages
        if (this.isBlockedPackage(analysis.packageName)) {
            analysis.shouldApprove = false;
            analysis.confidence = 90;
            analysis.reason = `Package ${analysis.packageName} requires manual review`;
            analysis.recommendations.push('Review package changelog');
            analysis.recommendations.push('Run full test suite');
            return analysis;
        }

        // Check update type
        if (!this.rules.allowedUpdateTypes.includes(analysis.updateType)) {
            analysis.shouldApprove = false;
            analysis.confidence = 85;
            analysis.reason = `Major update detected - manual review required`;
            analysis.risks.push('Major version changes may include breaking changes');
            analysis.recommendations.push('Review migration guide');
            analysis.recommendations.push('Test thoroughly before merging');
            return analysis;
        }

        // Check files changed
        if (files && files.length > this.rules.maxFilesChanged) {
            analysis.shouldApprove = false;
            analysis.confidence = 70;
            analysis.reason = `Too many files changed (${files.length} > ${this.rules.maxFilesChanged})`;
            analysis.risks.push('Extensive changes may indicate breaking changes');
            return analysis;
        }

        // All checks passed
        analysis.shouldApprove = true;
        analysis.confidence = 85;
        analysis.reason = `${analysis.updateType} update - safe to auto-merge`;
        analysis.recommendations.push('CI checks will verify compatibility');

        return analysis;
    }

    /**
     * Parse PR title to extract package information
     */
    parseTitle(title) {
        const result = {
            ecosystem: null,
            packageName: null,
            oldVersion: null,
            newVersion: null,
            updateType: null
        };

        if (!title) return result;

        // Pattern: "Bump package from X to Y in /directory"
        const bumpMatch = title.match(/(?:bump|update)\s+([^\s]+)\s+from\s+([\d.]+)\s+to\s+([\d.]+)/i);
        if (bumpMatch) {
            result.packageName = bumpMatch[1];
            result.oldVersion = bumpMatch[2];
            result.newVersion = bumpMatch[3];
            result.updateType = this.determineUpdateType(bumpMatch[2], bumpMatch[3]);
        }

        // Determine ecosystem from directory or package name
        if (title.includes('/h5p') || title.includes('/npm')) {
            result.ecosystem = 'npm';
        } else if (title.includes('/anki') || title.includes('/pip')) {
            result.ecosystem = 'pip';
        } else if (title.includes('actions/')) {
            result.ecosystem = 'github-actions';
        }

        return result;
    }

    /**
     * Determine update type (major, minor, patch) from versions
     */
    determineUpdateType(oldVersion, newVersion) {
        if (!oldVersion || !newVersion) return 'unknown';

        const oldParts = oldVersion.split('.').map(Number);
        const newParts = newVersion.split('.').map(Number);

        if (newParts[0] > oldParts[0]) return 'major';
        if (newParts[1] > oldParts[1]) return 'minor';
        return 'patch';
    }

    /**
     * Check if this is a security update
     */
    isSecurityUpdate(title, labels) {
        const titleLower = (title || '').toLowerCase();
        const hasSecurityInTitle = titleLower.includes('security') || 
                                   titleLower.includes('vulnerability') ||
                                   titleLower.includes('cve-');
        
        const hasSecurityLabel = this.rules.securityLabels.some(label => 
            (labels || []).some(l => l.toLowerCase().includes(label.toLowerCase()))
        );

        return hasSecurityInTitle || hasSecurityLabel;
    }

    /**
     * Check if PR has a blocking label
     */
    hasBlockingLabel(labels) {
        if (!labels || !Array.isArray(labels)) return null;
        
        for (const label of labels) {
            const labelName = typeof label === 'string' ? label : label.name;
            if (this.rules.blockingLabels.some(bl => 
                labelName.toLowerCase().includes(bl.toLowerCase())
            )) {
                return labelName;
            }
        }
        return null;
    }

    /**
     * Check if package is in blocked list
     */
    isBlockedPackage(packageName) {
        if (!packageName) return false;
        return this.rules.blockedPackages.some(pattern => pattern.test(packageName));
    }

    /**
     * Get current auto-merge rules
     */
    getRules() {
        return {
            ...this.rules,
            blockedPackages: this.rules.blockedPackages.map(p => p.source || String(p))
        };
    }
}
