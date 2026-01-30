# GitHub Actions Documentation

This directory contains GitHub Actions workflows for automated testing, deployment, and security scanning.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Trigger:** Push to `main`/`develop` branches, Pull Requests

**Jobs:**

- **Build and Test**: Tests the application build on Node.js 18.x and 20.x
- **Security Audit**: Runs npm audit to check for vulnerabilities
- **Dependency Review**: Reviews dependencies in pull requests
- **Code Quality**: Checks TypeScript types and code formatting

### 2. Vercel Deployment (`deploy-vercel.yml`)

**Trigger:** Push to `main` branch, Pull Requests

**Purpose:** Automatically deploys the application to Vercel

**Requirements:**

- Set up GitHub Secret: `VERCEL_TOKEN`
- Supabase environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### 3. Security Scanning (`security.yml`)

**Trigger:**

- Push to `main`/`develop` branches
- Pull Requests
- Daily at 2 AM UTC (scheduled)

**Jobs:**

- **CodeQL Analysis**: Advanced code scanning for security issues
- **NPM Security Audit**: Checks for npm package vulnerabilities
- **Trivy Scan**: Comprehensive vulnerability scanning

### 4. CodeQL Advanced (`codeql.yml`)

**Trigger:**

- Push to `main`/`develop` branches
- Pull Requests
- Weekly on Sundays (scheduled)

**Purpose:** Advanced security analysis using GitHub's CodeQL

## Setting Up GitHub Secrets

Navigate to your repository on GitHub:

1. Go to Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add the following secrets:

### Supabase Secrets

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Vercel Secrets

```
VERCEL_TOKEN=your_vercel_token
```

## Disabling Workflows

If you don't need a specific workflow:

1. Rename the `.yml` file to `.yml.disabled`, or
2. Delete the workflow file, or
3. Comment out the workflow content

## Manual Workflow Triggers

Some workflows support manual triggers. To run them:

1. Go to Actions tab in your repository
2. Select the workflow
3. Click "Run workflow"

## Workflow Badges

Add these badges to your README.md to show workflow status:

```markdown
![CI/CD](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/security.yml/badge.svg)
![CodeQL](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/codeql.yml/badge.svg)
```

## Troubleshooting

### Build Failures

- Check Node.js version compatibility
- Ensure all dependencies are correctly listed in package.json
- Verify environment variables are set correctly

### Deployment Failures

- Verify all required secrets are set
- Check Vercel service credentials
- Ensure build completes successfully

### Security Scan Failures

- Review the security advisory
- Update vulnerable dependencies
- Check for false positives

## Customization

To modify workflows:

1. Edit the respective `.yml` file
2. Test changes in a feature branch first
3. Review the workflow run before merging to main

## Support

For issues with workflows, open an issue in the repository with:

- Workflow name
- Error message
- Link to failed workflow run
