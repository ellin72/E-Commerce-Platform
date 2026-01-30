# Firebase → Supabase Migration Checklist

## ✅ Completed Tasks

### Core Migration

- [x] Created Supabase client (`src/lib/supabaseClient.ts`)
- [x] Created database types (`src/types/database.types.ts`)
- [x] Removed all Firebase imports from services
- [x] Removed Firebase from package.json
- [x] Updated environment variables

### Database Schema

- [x] Created SQL schema (`SUPABASE_SCHEMA.sql`) with:
  - [x] profiles table (linked to auth.users)
  - [x] products table (UUID PKs)
  - [x] cart_items table (with foreign keys)
  - [x] orders table (with JSONB for items)
  - [x] All indexes for performance
  - [x] All triggers for timestamps
  - [x] Row Level Security (RLS) policies

### Services Rewritten

- [x] **authService.ts**
  - [x] signUpWithEmail (Supabase auth)
  - [x] signInWithEmail (Supabase auth)
  - [x] signInWithGoogle (OAuth via Supabase)
  - [x] signOut
  - [x] getCurrentUser
  - [x] getUserData
  - [x] getSession
  - [x] onAuthStateChanged (Supabase listener)

- [x] **productService.ts**
  - [x] createProduct (with storage upload)
  - [x] updateProduct
  - [x] deleteProduct (with image cleanup)
  - [x] getProduct
  - [x] getAllProducts
  - [x] getProductsByCategory
  - [x] searchProducts

- [x] **cartService.ts**
  - [x] getCart
  - [x] addToCart
  - [x] removeFromCart
  - [x] updateCartItemQuantity
  - [x] clearCart
  - [x] getCartWithProducts

- [x] **orderService.ts**
  - [x] createOrder
  - [x] getOrder
  - [x] getUserOrders
  - [x] getAllOrders
  - [x] updateOrderStatus

### Context & Configuration

- [x] Updated AuthContext to use Supabase session listener
- [x] Cleaned up firebase.ts (backward compatibility stub)
- [x] Updated vite-env.d.ts for Supabase env vars
- [x] Updated .env.example

### Documentation

- [x] Created MIGRATION_GUIDE.md
- [x] Created SUPABASE_STORAGE_SETUP.md
- [x] Created SUPABASE_SCHEMA.sql

## 🔄 Next Steps (For You to Complete)

### 1. Setup Supabase Project

- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project
- [ ] Copy Project URL and anon key
- [ ] Create `.env.local` with Supabase credentials

### 2. Initialize Database

- [ ] Log into Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Create new query
- [ ] Copy entire SUPABASE_SCHEMA.sql
- [ ] Run query to create schema

### 3. Setup Storage

- [ ] Go to Storage in Supabase dashboard
- [ ] Create bucket named `product-images`
- [ ] Uncheck "Private bucket" (make public)
- [ ] Confirm bucket is created

### 4. Install & Test

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### 5. Test Features

- [ ] Sign up with email/password
- [ ] Log in
- [ ] Log out
- [ ] View products
- [ ] Add to cart
- [ ] Remove from cart
- [ ] Update cart quantity
- [ ] Create order
- [ ] View orders
- [ ] Admin: Create product
- [ ] Admin: Upload image
- [ ] Admin: Update product
- [ ] Admin: Delete product

### 6. Migrate Existing Data (If Applicable)

- [ ] Export data from Firebase (if exists)
- [ ] Format as CSV for import
- [ ] Import to Supabase using dashboard

### 7. Deploy

- [ ] Test build: `npm run build`
- [ ] Verify no Firebase references: `grep -r "firebase" src/`
- [ ] Push to GitHub
- [ ] Deploy to Vercel/Netlify
- [ ] Set environment variables in deployment platform

## 📝 Environment Variables

### Required (in `.env.local` and deployment platform)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Get These From

- Login to https://app.supabase.com
- Go to Settings → API
- Copy "Project URL" and "anon" key

## 🔒 Security Checklist

- [x] RLS policies created for all tables
- [x] Admin role implemented
- [x] User isolation (can only access own data)
- [x] Storage bucket public for reads only
- [x] Auth required for sensitive operations
- [ ] **TO-DO**: Test RLS policies in production
- [ ] **TO-DO**: Review and audit security rules

## 📊 Architecture Overview

```
Frontend (React 18 + TypeScript)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
┌─────────────────────────────────┐
│   Supabase (Backend)            │
├─────────────────────────────────┤
│ Auth (Built-in via auth.users)  │
│ PostgreSQL Database (Tables)    │
│ Storage (product-images bucket) │
│ RLS Policies (Security)         │
└─────────────────────────────────┘
```

## 🚀 Deployment Options

### Vercel (Recommended)

- Supports environment variables
- Zero-config deployment
- Automatic HTTPS
- Cost: Free tier available

### Netlify

- Similar to Vercel
- Good build optimization
- Cost: Free tier available

## 📚 File Structure

```
src/
  ├── config/
  │   └── firebase.ts (deprecated, backward compat only)
  ├── lib/
  │   └── supabaseClient.ts ✨ (NEW)
  ├── types/
  │   ├── index.ts (existing types)
  │   └── database.types.ts ✨ (NEW)
  ├── services/
  │   ├── authService.ts (updated)
  │   ├── productService.ts (updated)
  │   ├── cartService.ts (updated)
  │   └── orderService.ts (updated)
  └── contexts/
      └── AuthContext.tsx (updated)

SUPABASE_SCHEMA.sql ✨ (NEW)
SUPABASE_STORAGE_SETUP.md ✨ (NEW)
MIGRATION_GUIDE.md ✨ (NEW)
.env.example (updated)
```

## ✨ Key Improvements

1. **Type Safety**: Database types for better autocomplete
2. **Security**: Built-in RLS for row-level security
3. **Performance**: PostgreSQL indexes on frequently queried columns
4. **Scalability**: Auto-scaling with Supabase
5. **Cost**: Free tier generous for small projects

## 🆘 Support Resources

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Queries](https://supabase.com/docs/guides/database)
- [Storage Uploads](https://supabase.com/docs/guides/storage)

## ⚠️ Important Notes

1. **Environment Variables**: Must be set before running app
2. **Database Schema**: Must be executed before using app
3. **Storage Bucket**: Must exist for image uploads
4. **RLS Policies**: Automatically created by schema script
5. **Auth Users**: Service role can insert, regular auth can't

## 📞 Troubleshooting

See `MIGRATION_GUIDE.md` for detailed troubleshooting steps.

---

**Status**: Migration Complete ✅

All Firebase references have been replaced with Supabase equivalents. Ready for database setup and testing.
