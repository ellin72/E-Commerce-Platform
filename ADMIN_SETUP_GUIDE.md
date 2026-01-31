# How to Create an Admin Account

There are multiple ways to create an admin account in your E-Commerce platform. Choose the method that fits your needs.

## Quick Summary

**Admin Role** is stored in the `profiles` table with values:

- `'user'` - Regular user (default)
- `'admin'` - Administrator

---

## Method 1: Direct Database Update (Recommended for Quick Setup)

### Step 1: Create a Regular Account

1. Sign up using the signup form with your email
2. Log in with your account

### Step 2: Update Role via Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Run this query:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with your actual email.

### Step 3: Verify

Run this query to confirm:

```sql
SELECT id, email, role, created_at
FROM public.profiles
WHERE email = 'your-email@example.com';
```

You should see `role: admin`.

---

## Method 2: Using the Admin Setup Page (GUI)

### Step 1: Access the Admin Setup Page

1. Add this route to your `App.tsx` (temporarily):

```tsx
import { AdminSetup } from './pages/AdminSetup';

// In your router setup:
<Route path="/admin-setup" element={<AdminSetup />} />;
```

### Step 2: Navigate to the Page

1. Go to: `http://localhost:5173/admin-setup`
2. Enter your email
3. Select "Promote to Admin"
4. Click "Execute"

### Step 3: Verify

- Success message confirms promotion
- Log out and back in to see admin privileges

---

## Method 3: Manual Database Insert (For Multiple Admins)

If you need to create multiple admins at once:

```sql
-- Create multiple admins
UPDATE public.profiles
SET role = 'admin'
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);
```

---

## Method 4: Using Console Commands (Development)

Open your browser console (F12) and run:

```javascript
// This only works if you implement the functions in your components
import { promoteToAdmin } from './services/authService';

// Promote a user
await promoteToAdmin('your-email@example.com');
```

---

## Verifying Admin Status

### In Supabase Dashboard

1. Navigate to **SQL Editor**
2. Run: `SELECT email, role FROM public.profiles WHERE role = 'admin';`

### In Your App

1. Log in as the admin user
2. Check browser console (F12)
3. Look for auth logs showing your role

---

## What Admins Can Do

With admin role, users get access to:

- ✅ Create, read, update, delete products
- ✅ View all orders
- ✅ Update order status
- ✅ View all user profiles

These permissions are enforced by RLS (Row Level Security) policies in your database.

---

## Best Practices

### For Development

- Use Method 1 (Direct DB update) for quick testing
- Use Method 2 (Admin Setup page) if building frequently
- Keep admin setup simple and accessible

### For Production

1. **Remove** the admin setup page or restrict access
2. **Use proper authentication** - require admin to already be logged in
3. **Add logging** - track who promotes/demotes users
4. **Implement approval workflow** - don't allow self-promotion
5. **Use environment checks** - only allow on development

Example for restricting to development only:

```tsx
// Only show admin setup in development
{
  process.env.NODE_ENV === 'development' && <Route path="/admin-setup" element={<AdminSetup />} />;
}
```

---

## Removing Admin Status

To demote an admin back to regular user:

### Via Database

```sql
UPDATE public.profiles
SET role = 'user'
WHERE email = 'admin-email@example.com';
```

### Via Admin Setup Page

1. Navigate to `/admin-setup`
2. Enter admin's email
3. Select "Demote to User"
4. Click "Execute"

---

## Troubleshooting

### Admin permissions not working

1. **Log out completely** - Close browser and clear cookies
2. **Log back in** - Session cache might have old role
3. **Verify in database** - Check profiles table directly

### Can't access protected pages

1. Verify `role = 'admin'` in profiles table
2. Check RLS policies are enabled
3. Check browser console for auth errors

### Admin Setup Page Not Found

1. Make sure you added the route to your router
2. Navigate to correct URL: `http://localhost:5173/admin-setup`

---

## Next Steps

Once you have an admin account:

1. **Create an Admin Dashboard** to:
   - Manage products
   - View orders
   - Manage users

2. **Implement protected routes** for admin pages

3. **Add role-based UI** - Show/hide features based on role

4. **Audit logging** - Track admin actions

---

## Database Schema Reference

Admin status is stored in this table:

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

The `role` column determines admin status:

- `'user'` = Regular user (default)
- `'admin'` = Administrator

---

## Support

If you encounter issues:

1. Check this document first
2. Verify your email exists in the database
3. Check Supabase auth logs for errors
4. Review the RLS policies in your schema
