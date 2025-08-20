# Artifacts Retention Policy

## Storage Optimization Strategy

### CI Pipeline Artifacts
- **Audit Reports**: 3 days (quick review cycle)
- **Test Coverage**: 3 days (immediate feedback)
- **Build Artifacts**: 7 days (PR review period)
- **Lint Reports**: 3 days (immediate fixes)

### Release Artifacts
- **Release Packages**: 90 days (quarterly retention)
- **SHA256 Checksums**: 90 days (match releases)

### Rationale
- Audit/test reports are ephemeral - reviewed immediately
- Build artifacts kept for PR review cycle
- Release artifacts kept longer for distribution

### Storage Savings
- Reduced from 30 days to 7 days for builds: **~75% storage reduction**
- Short retention for reports: **~90% storage reduction**
- Estimated monthly savings: **~10GB** with active development

## Implementation
All workflows use parameterized retention:
```yaml
retention-days: ${{ github.event_name == 'pull_request' && 7 || 3 }}
```

This gives longer retention for PRs while keeping push artifacts minimal.