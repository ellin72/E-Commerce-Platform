# 🚀 Quick Start Guide - Supabase Setup

**Time to complete**: ~15 minutes

---

## Step 1: Create Supabase Account (5 min)

1. Go to https://supabase.com
2. Click "Sign Up"
3. Use GitHub, Google, or email
4. Create a new project
5. Choose a region (nearest to your users)
6. Wait for project to initialize

---

## Step 2: Get Connection Details (2 min)

1. Click on your project in Supabase dashboard
2. Go to **Settings** → **API**
3. Copy these values:
   ```
   Project URL: https://xxxx.supabase.co
   Anon Public Key: eyJhbGc... (long string)
   ```
4. Save them somewhere safe

---

## Step 3: Create Environment File (2 min)

Create `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with actual values from Step 2.

**Security**: `.env.local` is in `.gitignore` - never commit it!

---

## Step 4: Initialize Database (3 min)

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open file `SUPABASE_SCHEMA.sql` from your project
4. Copy **entire contents**
5. Paste into Supabase SQL editor
6. Click **Run** button
7. Wait for success message

**What this does**:

- Creates 4 tables (profiles, products, cart_items, orders)
- Creates indexes for performance
- Creates RLS security policies
- Creates triggers for auto-timestamps
- Creates auth user → profile link

---

## Step 5: Create Storage Bucket (2 min)

1. In Supabase dashboard, click **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Name: `product-images` (exactly this name)
4. **UNCHECK** "Private bucket" (make it public)
5. Click **Create**

**What this does**:

- Creates public storage for product images
- Everyone can download images
- Only authenticated users can upload (enforced by app code)

---

## Step 6: Install Dependencies (2 min)

```bash
npm install
```

This installs:

- `@supabase/supabase-js` - Required for Supabase
- Other existing dependencies

---

## Step 7: Test Local Setup (1 min)

```bash
npm run dev
```

Open http://localhost:5173 in browser

**Test these features**:

- ✅ Sign up with email
- ✅ See products page
- ✅ Log in
- ✅ Add to cart
- ✅ Create account works

---

## Step 8: Deploy to Vercel (5-10 min)

1. Push code to GitHub:

   ```bash
   git add .
   git commit -m "Update e-commerce platform"
   git push origin main
   ```

2. Go to https://vercel.com
3. Click **Add New** → **Project**
4. Select your GitHub repository
5. Click **Import**
6. Go to **Environment Variables**
7. Add these:
   ```
   VITE_SUPABASE_URL = your-project-url
   VITE_SUPABASE_ANON_KEY = your-anon-key
   ```
8. Click **Deploy**

**That's it!** Your app is now live.

---

## Common Issues & Quick Fixes

### "Environment variables missing" error

**Fix**: Make sure `.env.local` exists with correct values

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### "Table profiles does not exist"

**Fix**: Run SQL schema in Supabase:

1. Copy entire `SUPABASE_SCHEMA.sql`
2. Go to Supabase → SQL Editor → New Query
3. Paste and Run

### "Upload image fails"

**Fix**:

1. Check bucket exists: Supabase → Storage
2. Bucket name must be `product-images` (exact)
3. Bucket must be public (not private)

### "Can't sign up / Sign up fails"

**Fix**:

1. Check Supabase project is initialized
2. Check environment variables are correct
3. Check browser console for error message
4. Try signing up with different email

### "Admin can't create products"

**Fix**:

1. Check user has `role = 'admin'` in profiles table
2. In Supabase, go to Table Editor → profiles
3. Find your user row
4. Change role from 'user' to 'admin'

### "Products don't show images"

**Fix**:

1. Check `product-images` bucket exists
2. Check bucket is public
3. Check image URL is valid in products table

---

## What's Next?

After successful local and deployed setup:

1. **Add More Features**
   - Search functionality
   - Product filtering
   - User reviews/ratings
   - Wishlist

2. **Improve Performance**
   - Add Full-Text Search
   - Implement caching
   - Optimize queries

3. **Enhanced Security**
   - Add email verification
   - Add password reset
   - Add 2FA

4. **Operations**
   - Setup database backups
   - Configure email notifications
   - Monitor usage

---

## Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Check for TypeScript errors
npm run type-check

# Format code
npm run format

# Lint code
npm run lint
```

---

## File Structure After Migration

```
project/
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts ✨ NEW
│   ├── types/
│   │   └── database.types.ts ✨ NEW
│   ├── services/
│   │   ├── authService.ts ✏️ UPDATED
│   │   ├── productService.ts ✏️ UPDATED
│   │   ├── cartService.ts ✏️ UPDATED
│   │   └── orderService.ts ✏️ UPDATED
│   └── contexts/
│       └── AuthContext.tsx ✏️ UPDATED
├── SUPABASE_SCHEMA.sql ✨ NEW
├── SUPABASE_STORAGE_SETUP.md ✨ NEW
├── MIGRATION_GUIDE.md ✨ NEW
├── .env.example ✏️ UPDATED
└── package.json ✏️ UPDATED
```

---

## Getting Help

### Documentation

- **Setup Issues**: See `MIGRATION_GUIDE.md`
- **Task Tracking**: See `MIGRATION_CHECKLIST.md`
- **Code Changes**: See `CODE_REFERENCE.md`
- **Complete Summary**: See `MIGRATION_COMPLETE.md`

### Official Resources

- [Supabase Docs](https://supabase.com/docs)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)

### Support

- Check browser console for errors: F12 → Console
- Check Supabase dashboard for database errors
- Review `.env.local` for correct values

---

## Success Checklist

- [ ] Supabase account created
- [ ] Project initialized
- [ ] Database schema imported (SQL ran successfully)
- [ ] Storage bucket created (product-images)
- [ ] .env.local created with correct values
- [ ] `npm install` completed
- [ ] `npm run dev` starts successfully
- [ ] Can sign up in browser
- [ ] Can see products
- [ ] Can add to cart
- [ ] Build succeeds: `npm run build`
- [ ] Deployed to Vercel/Netlify
- [ ] Live site works

---

## 🎉 You're Done!

Your e-commerce platform is now running on Supabase!

**Next**: Start building new features or customizing the existing ones.

---

**Questions?** Check the documentation files or visit [Supabase Docs](https://supabase.com/docs)
