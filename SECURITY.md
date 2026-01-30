# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our E-Commerce Platform seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Where to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@shophub.com** (or create a private security advisory on GitHub)

You can also report vulnerabilities through GitHub's Security Advisory feature:

1. Go to the repository's Security tab
2. Click "Report a vulnerability"
3. Fill out the form with details

### What to Include

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours of submission
- **Status Update**: Within 7 days with expected timeline for a fix
- **Fix Release**: Depends on severity and complexity

### Security Update Process

1. The security report is received and assigned to a primary handler
2. The problem is confirmed and a list of affected versions is determined
3. Code is audited to find any similar problems
4. Fixes are prepared for all supported versions
5. Fixes are released and a security advisory is published

## Security Best Practices

### For Users

1. **Environment Variables**: Never commit `.env` files to version control
2. **Supabase Configuration**: Keep your Supabase keys secure and use Row Level Security
3. **Authentication**: Use strong passwords and enable 2FA where possible
4. **Updates**: Keep your dependencies up to date
5. **HTTPS**: Always use HTTPS in production

### For Developers

1. **Input Validation**: Always validate and sanitize user inputs
2. **Authentication**: Use Supabase Auth properly and never bypass security
3. **Authorization**: Implement proper role-based access control
4. **Dependencies**: Regularly update dependencies and audit for vulnerabilities
5. **Code Review**: All code changes should be reviewed before merging
6. **Secrets**: Use environment variables for all secrets and API keys
7. **RLS Policies**: Implement strict Row Level Security policies

## Known Security Considerations

### Row Level Security (RLS)

Our Supabase RLS policies are designed to:

- Restrict product management to admin users only
- Ensure users can only access their own cart and orders
- Validate data structure and authentication
- Prevent unauthorized access to sensitive data

### Data Privacy

- User data is stored in Supabase PostgreSQL
- Personal information is only accessible by the user who owns it
- Admin users can view orders for management purposes
- No payment information is stored (simulated checkout only)

## Security Features

- ✅ Supabase Authentication with email/password and Google OAuth
- ✅ Protected routes for authenticated users
- ✅ Admin-only routes with role verification
- ✅ Row Level Security (RLS) for data protection
- ✅ Storage policies for image uploads
- ✅ TypeScript for type safety
- ✅ Input validation on forms
- ✅ Environment variable configuration

## Disclosure Policy

When we receive a security vulnerability report, we will:

1. Confirm the receipt of your report within 48 hours
2. Provide an estimated timeline for a fix
3. Notify you when the vulnerability is fixed
4. Credit you in our security advisory (if you wish)

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue.

## Contact

- Email: security@shophub.com
- GitHub: [@ellin72](https://github.com/ellin72)

---

**Last Updated**: January 28, 2026
