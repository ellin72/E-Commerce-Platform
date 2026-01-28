# Quick Start Guide

This is a simplified guide to get the E-Commerce Platform up and running quickly.

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd E-Commerce-Platform
npm install
```

### 2. Firebase Setup

**Create Firebase Project:**

1. Go to <https://console.firebase.google.com/>
2. Click "Add Project"
3. Name it (e.g., "my-shop")
4. Disable Google Analytics (optional)
5. Click "Create Project"

**Enable Services:**

1. **Authentication:**
   - Go to Authentication → Get Started
   - Enable "Email/Password"
   - Enable "Google"

2. **Firestore:**
   - Go to Firestore Database → Create database
   - Start in **production mode**
   - Choose a location

3. **Storage:**
   - Go to Storage → Get Started
   - Start in **production mode**

**Get Config:**

1. Go to Project Settings (⚙️ icon)
2. Scroll to "Your apps" → Click web icon (</>)
3. Register app
4. Copy the config values

### 3. Configure Environment

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=my-shop.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-shop
VITE_FIREBASE_STORAGE_BUCKET=my-shop.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Deploy Firebase Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select your project)
firebase init

# Select: Firestore, Storage, Hosting
# Use existing files when prompted

# Deploy rules
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

### 5. Run the App

```bash
npm run dev
```

Open <http://localhost:5173>

### 6. Create Admin User

1. Sign up for an account in the app
2. Go to Firebase Console → Firestore
3. Open `users` collection
4. Find your user document
5. Add field: `role` = `admin`
6. Logout and login again

## 🎯 What to Try

1. ✅ Browse products (homepage)
2. ✅ Sign up / Login
3. ✅ Add items to cart
4. ✅ Checkout (place an order)
5. ✅ View orders
6. ✅ Admin: Add/edit/delete products

## 🚢 Deploy to Production

### Firebase Hosting (Free)

```bash
npm run build
firebase deploy
```

### Vercel (Free)

```bash
npm install -g vercel
vercel --prod
```

### Netlify (Free)

```bash
npm run build
# Upload 'dist' folder to Netlify
```

## 📞 Need Help?

Check the full [README.md](README.md) for detailed documentation.

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
firebase deploy

# Deploy to Vercel
vercel --prod
```

---

That's it! You now have a fully functional e-commerce platform. 🎉
