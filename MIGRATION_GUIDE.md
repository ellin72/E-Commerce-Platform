# Firebase to Supabase Migration Guide

This document outlines the complete migration of the E-Commerce Platform from Firebase to Supabase.

## 📋 Pre-Migration Checklist

- [ ] Backup your Firebase data
- [ ] Create a Supabase account at https://supabase.com
- [ ] Create a new Supabase project
- [ ] Have your Supabase Project URL and anon key ready

## 🔄 Migration Steps

### 1. Supabase Project Setup

1. Create a new Supabase project at https://app.supabase.com
2. Go to **Settings → API** and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon key → `VITE_SUPABASE_ANON_KEY`
3. Create `.env.local` file with these values (see `.env.example`)

### 2. Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Create a new query
3. Copy and paste the entire contents of `SUPABASE_SCHEMA.sql`
4. Click **Run** to execute all SQL

This creates:

- `profiles` table (linked to auth.users)
- `products` table with UUID primary keys
- `cart_items` table with foreign keys
- `orders` table
- All necessary indexes and triggers
- Row Level Security (RLS) policies

### 3. Storage Configuration

1. Go to Supabase Dashboard → **Storage**
2. Click **Create a new bucket**
3. Name it `product-images`
4. Uncheck "Private bucket" (make it public)
5. Click **Create**

See `SUPABASE_STORAGE_SETUP.md` for detailed instructions.

### 4. Update Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Install Dependencies

```bash
npm install
```

This installs:

- `@supabase/supabase-js` - Supabase JavaScript client
- Removes Firebase SDK

### 6. Data Migration (If you have existing Firebase data)

#### Option A: Using Supabase Data Import (Recommended)

1. Export data from Firebase
2. Format as CSV
3. Use Supabase Dashboard → Import data to load it

#### Option B: Manual Migration Script

Create a script to migrate data from Firebase to Supabase:

```typescript
import firebase from 'firebase/app';
import 'firebase/firestore';
import { supabase } from './src/lib/supabaseClient';

async function migrateProducts() {
  const db = firebase.firestore();
  const products = await db.collection('products').get();

  for (const doc of products.docs) {
    await supabase.from('products').insert([
      {
        id: doc.id,
        ...doc.data(),
      },
    ]);
  }
}
```

### 7. Test the Migration

```bash
npm run build
npm run dev
```

Check for:

- [ ] No Firebase imports in build
- [ ] Auth signup works
- [ ] Auth login works
- [ ] Can view products
- [ ] Can add to cart
- [ ] Can create order
- [ ] Admin can create products
- [ ] Admin can delete products
- [ ] Images upload correctly

## 🛠️ Architecture Changes

### Authentication

- **Firebase**: `onAuthStateChanged` from `firebase/auth`
- **Supabase**: `supabase.auth.onAuthStateChange()`

### Database

- **Firebase**: Firestore collections
- **Supabase**: PostgreSQL tables with UUID primary keys

### Storage

- **Firebase**: `ref(storage, path)`
- **Supabase**: `supabase.storage.from(bucket).upload(path, file)`

## 📊 Database Schema Mapping

| Firebase            | Supabase Table   | Notes                          |
| ------------------- | ---------------- | ------------------------------ |
| users collection    | profiles table   | Linked to auth.users via UUID  |
| products collection | products table   | UUID primary keys, public read |
| carts collection    | cart_items table | Individual items with quantity |
| orders collection   | orders table     | Items stored as JSONB          |

## 🔒 Security

All tables have **Row Level Security (RLS)** enabled with policies:

- **Products**: Public read, admin-only write/delete
- **Profiles**: Users read/write own, admins read all
- **Cart Items**: Users read/write/delete own items
- **Orders**: Users read own, create own, admins read all and update

## 🚀 Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Go to https://vercel.com and import repository
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Netlify (Alternative)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

## 📝 File Changes

### New Files

- `src/lib/supabaseClient.ts` - Supabase client initialization
- `src/types/database.types.ts` - TypeScript types for database
- `SUPABASE_SCHEMA.sql` - Database schema
- `SUPABASE_STORAGE_SETUP.md` - Storage configuration guide
- `.env.example` - Environment variables template

### Modified Files

- `src/services/authService.ts` - Supabase auth
- `src/services/productService.ts` - Supabase database queries
- `src/services/cartService.ts` - Supabase cart operations
- `src/services/orderService.ts` - Supabase order operations
- `src/contexts/AuthContext.tsx` - Supabase session listener
- `package.json` - Dependencies updated
- `.env.example` - Updated for Supabase

### Deleted Files

- `src/config/firebase.ts` - No longer needed

## ❌ Removed Features

### Firebase-Specific

- Google authentication (OAuth) - can be re-enabled if needed
- Firestore transactions
- Firebase emulator

These can be re-added if needed, but the email/password auth is fully functional.

## ✅ Supported Features

All core e-commerce features are supported:

- ✅ Email/password authentication
- ✅ User profiles
- ✅ Product catalog
- ✅ Cart management
- ✅ Order creation and tracking
- ✅ Admin product management
- ✅ Image uploads to storage
- ✅ Role-based access control
- ✅ Row-level security

## 🐛 Troubleshooting

### Issue: CORS errors when uploading images

- **Solution**: Check Supabase Storage bucket is public
- Verify bucket name in `src/lib/supabaseClient.ts`

### Issue: "User not found" after signup

- **Solution**: Wait a moment, the auth trigger creates profiles automatically
- Check `profiles` table exists and has RLS disabled for inserts

### Issue: Admin can't create products

- **Solution**: Verify admin role is set in `profiles` table
- Check RLS policy allows admin inserts

### Issue: Build fails with "Cannot find module"

- **Solution**: Run `npm install` to install dependencies
- Check all Firebase imports have been removed

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Need Help?

If you encounter issues:

1. Check Supabase dashboard for errors
2. Review browser console for JavaScript errors
3. Check RLS policies are correctly configured
4. Verify environment variables are set
5. Review the SQL schema for table creation

---

**Migration Completed**: All Firebase references have been removed and replaced with Supabase equivalents.
