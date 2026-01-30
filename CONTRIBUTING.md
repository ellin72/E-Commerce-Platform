# Contributing to E-Commerce Platform

First off, thank you for considering contributing to E-Commerce Platform! It's people like you that make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what behavior you expected to see
- **Include screenshots** if relevant
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Provide specific examples** to demonstrate the idea
- **Explain why this enhancement would be useful**

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- `good-first-issue` - Issues that should only require a few lines of code
- `help-wanted` - Issues that might be more involved

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/E-Commerce-Platform.git
   cd E-Commerce-Platform
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment**:
   ```bash
   cp .env.example .env
   # Fill in your Supabase credentials
   ```
5. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

1. **Make your changes** in your feature branch
2. **Test your changes**:
   ```bash
   npm run dev
   ```
3. **Build to ensure no errors**:
   ```bash
   npm run build
   ```
4. **Lint your code**:
   ```bash
   npm run lint
   ```
5. **Commit your changes** (see commit message guidelines below)

## Pull Request Process

1. **Update documentation** if needed (README.md, comments, etc.)
2. **Ensure all tests pass** and the app builds successfully
3. **Update the CHANGELOG.md** with details of your changes (if applicable)
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request** from your fork to the main repository
6. **Fill out the PR template** completely
7. **Link any related issues** in the PR description
8. **Wait for review** - maintainers will review your PR and may request changes

### PR Requirements

- ✅ Code follows the style guidelines
- ✅ Commits follow the commit message guidelines
- ✅ All tests pass
- ✅ No console errors or warnings
- ✅ TypeScript compilation succeeds
- ✅ Documentation is updated
- ✅ No merge conflicts

## Style Guidelines

### TypeScript Style Guide

- Use **TypeScript** for all new code
- Follow the existing code style
- Use **meaningful variable and function names**
- Add **JSDoc comments** for public functions
- Use **interfaces and types** appropriately
- Avoid using `any` type when possible

### React Style Guide

- Use **functional components** with hooks
- Use **TypeScript** for prop types
- Keep components **small and focused**
- Extract reusable logic into **custom hooks**
- Use **destructuring** for props
- Follow React naming conventions

### CSS/Tailwind Style Guide

- Use **Tailwind CSS utility classes**
- Follow **mobile-first** approach
- Keep custom CSS minimal
- Use semantic class names if custom CSS is needed

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without adding features or fixing bugs
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates, etc.
- **ci**: CI/CD pipeline changes

### Examples

```
feat(auth): add Google OAuth login

Add Google sign-in functionality using Supabase Auth.
Users can now sign in with their Google account.

Closes #123
```

```
fix(cart): resolve cart item quantity update issue

Fixed bug where cart item quantities were not updating correctly
when user clicked increment/decrement buttons.

Fixes #456
```

```
docs(readme): update installation instructions

Added more detailed Supabase setup instructions.
```

## Project Structure

```
E-Commerce-Platform/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # Supabase service functions
│   ├── contexts/       # React contexts
│   ├── types/          # TypeScript types
│   ├── lib/            # Supabase client
│   └── hooks/          # Custom React hooks
├── public/             # Static assets
└── .github/            # GitHub configurations
```

## Testing

Currently, the project doesn't have automated tests, but contributions to add testing are welcome!

If you're adding tests:

- Use **Jest** for unit tests
- Use **React Testing Library** for component tests
- Aim for good coverage on critical functionality

## Questions?

Feel free to:

- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in the project's README.md file.

---

**Thank you for contributing! 🎉**
