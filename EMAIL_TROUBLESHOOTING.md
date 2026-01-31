# Email Confirmation Troubleshooting Guide

## Issue: Users not receiving confirmation emails

### ✅ Diagnostic Steps

1. **Check Browser Console (F12)**
   - After signup or clicking "Resend Email", check the console
   - Look for log messages starting with "⚠️ Email sent by Supabase"
   - This will show diagnostic information

2. **Verify Supabase Email Settings**

   Go to your Supabase Dashboard and check:

   ### Authentication Settings
   - Navigate to: **Authentication → Settings**
   - Under **Email Auth**, verify:
     - ✅ "Enable email confirmations" toggle
     - If OFF: Users can login immediately (no email needed)
     - If ON: Email must be confirmed before login

   ### SMTP Configuration
   - Navigate to: **Project Settings → Auth**
   - Check **SMTP Settings**:
     - If using **Supabase Default**: Limited to 4 emails/hour per user
     - If using **Custom SMTP**: Configure your own provider (recommended for production)

   ### Email Templates
   - Navigate to: **Authentication → Email Templates**
   - Check **Confirm signup** template exists
   - Verify the template is properly configured

3. **Check Email in Spam/Junk Folder**
   - Supabase default emails often go to spam
   - Add `noreply@mail.app.supabase.io` to contacts

4. **Verify Email Rate Limits**
   - Supabase free tier: 4 emails/hour per recipient
   - Check if you've hit the limit
   - Wait 1 hour and try again

## 🔧 Solutions

### Option 1: Disable Email Confirmation (Development/Testing)

**Best for local development:**

1. Go to Supabase Dashboard
2. Navigate to **Authentication → Settings**
3. Scroll to **Email Auth**
4. Toggle **OFF** "Enable email confirmations"
5. Save changes
6. Users can now login immediately after signup

### Option 2: Configure Custom SMTP (Production)

**Best for production:**

1. Choose an email provider:
   - SendGrid (99 emails/day free)
   - Mailgun (5,000 emails/month free)
   - Amazon SES (62,000 emails/month free)
   - Resend (3,000 emails/month free)

2. Get SMTP credentials from provider

3. In Supabase Dashboard:
   - Go to **Project Settings → Auth**
   - Scroll to **SMTP Settings**
   - Toggle **Enable Custom SMTP**
   - Enter your credentials:
     - Host
     - Port
     - Username
     - Password
     - Sender email
     - Sender name

4. Test by sending a confirmation email

### Option 3: Auto-Confirm Users (API)

**Alternative approach:**

If you control the signup flow, you can auto-confirm users via Supabase Admin API (not recommended for production).

## 📊 Current Behavior

With the updated code:

1. **Signup:**
   - Shows message: "Account created! Check your email or try logging in if confirmation is disabled"
   - Console logs show if email confirmation is required

2. **Login (unconfirmed email):**
   - Error: "Email not confirmed"
   - Button to resend confirmation email appears
   - Cooldown timer prevents spam (60s normal, 120s after rate limit)

3. **Resend Email:**
   - Console shows diagnostic information
   - Success message guides user to check spam folder
   - Mentions checking console for more info

## 🧪 Testing Email Flow

1. Open browser console (F12)
2. Sign up with a new email
3. Check console logs:
   - "Email confirmation required: true/false"
   - "User session: Active/None"
4. If "None", email confirmation is enabled
5. Check your email (and spam folder)
6. If no email after 5 minutes, check Supabase Auth logs

## 📝 Supabase Auth Logs

Check actual email sending status:

1. Go to Supabase Dashboard
2. Navigate to **Authentication → Logs**
3. Look for:
   - "Email sent" events
   - Any error messages
   - Rate limit warnings

## ⚡ Quick Fix for Testing

Run this in your Supabase SQL Editor to disable email confirmation:

```sql
-- Disable email confirmation requirement
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

⚠️ **Warning:** Only use this in development! Never in production.

## 🎯 Recommended Setup

**Development:**

- Disable email confirmations in Supabase
- Focus on building features

**Production:**

- Enable email confirmations
- Use custom SMTP provider
- Monitor Auth logs regularly
- Set up proper email templates with branding

## 📞 Still Having Issues?

Check the console logs after signup/resend. Share the logs if you need help debugging.
