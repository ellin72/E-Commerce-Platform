# E-Commerce Platform

[![CI/CD](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/ci.yml/badge.svg)](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/ci.yml)
[![Security](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/security.yml/badge.svg)](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/security.yml)
[![CodeQL](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/codeql.yml/badge.svg)](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange.svg)](https://firebase.google.com/)

A modern, full-featured e-commerce platform built with React, TypeScript, Tailwind CSS, and Firebase.

## 🚀 Features

### User Features

- **Authentication**: Email/password and Google OAuth sign-in
- **Product Catalog**: Browse, search, and filter products by category
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Simple checkout flow with shipping information
- **Order History**: View past orders and order details
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features

- **Product Management**: Create, read, update, and delete products
- **Image Upload**: Upload product images to Firebase Storage
- **Dashboard**: View product statistics and manage inventory
- **Role-Based Access**: Secure admin routes with Firestore rules

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase
  - Authentication (Email/Password + Google OAuth)
  - Firestore (Database)
  - Storage (Product Images)
- **Build Tool**: Vite
- **Hosting**: Firebase Hosting / Vercel / Netlify

## 📦 Project Structure

```
E-Commerce-Platform/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AdminRoute.tsx
│   │   ├── CartSidebar.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductList.tsx
│   │   └── ProtectedRoute.tsx
│   ├── config/             # Configuration files
│   │   └── firebase.ts
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/              # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── Checkout.tsx
│   │   ├── Login.tsx
│   │   ├── Orders.tsx
│   │   ├── ProductForm.tsx
│   │   └── SignUp.tsx
│   ├── services/           # Firebase service functions
│   │   ├── authService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   └── productService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore indexes
├── storage.rules           # Storage security rules
├── vercel.json            # Vercel configuration
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- Git

### Step 1: Clone and Install Dependencies

```bash
# Navigate to the project directory
cd E-Commerce-Platform

# Install dependencies
npm install
```

### Step 2: Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" sign-in provider

3. **Create Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in **production mode** (we'll deploy security rules later)
   - Choose a location closest to your users

4. **Create Storage Bucket**
   - Go to Storage
   - Click "Get started"
   - Start in **production mode**
   - Use the default storage location

5. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register your app and copy the config

### Step 3: Environment Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

1. Edit `.env` and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 4: Deploy Firebase Rules and Indexes

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select your project)
firebase init

# When prompted, select:
# - Firestore
# - Storage
# - Hosting
# Use existing files (firestore.rules, storage.rules, etc.)

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

### Step 5: Create an Admin User

After deploying, you need to create an admin user manually:

1. Run the app and create a regular user account
2. Go to Firebase Console > Firestore Database
3. Find the `users` collection
4. Open your user document
5. Add/edit a field: `role` with value `admin`

### Step 6: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚢 Deployment

### Option 1: Firebase Hosting (Recommended)

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Option 3: Netlify

```bash
# Build the app
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

Or drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop).

## 📝 Environment Variables for Deployment

When deploying to hosting platforms, make sure to set these environment variables:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## 🔒 Security

### Firestore Security Rules

The project includes comprehensive Firestore rules that:

- Allow users to read/write their own data
- Protect admin routes (only admins can manage products)
- Secure order creation and access
- Validate data structure and authentication

### Storage Rules

Storage rules ensure:

- Anyone can read product images
- Only admins can upload/delete images
- Proper authentication checks

## 🎨 Customization

### Branding

- Update logo and brand name in `src/components/Navbar.tsx`
- Modify colors in `tailwind.config.js`
- Update footer content in `src/components/Layout.tsx`

### Product Categories

- Add/remove categories in `src/components/ProductList.tsx`
- Update category options in `src/pages/ProductForm.tsx`

### Styling

- All styles use Tailwind CSS utility classes
- Global styles in `src/index.css`
- Custom theme colors in `tailwind.config.js`

## 📚 Usage Guide

### For Customers

1. **Browse Products**: Visit the homepage to see all products
2. **Search & Filter**: Use the search bar or category filters
3. **Add to Cart**: Click "Add to Cart" on any product
4. **View Cart**: Click the cart icon in the navbar
5. **Checkout**: Click "Proceed to Checkout" and fill in shipping info
6. **View Orders**: Access your order history from the Orders page

### For Admins

1. **Access Admin Panel**: Login and click "Admin" in the navbar
2. **Add Product**: Click "Add New Product" button
3. **Edit Product**: Click "Edit" on any product in the dashboard
4. **Delete Product**: Click "Delete" on any product (with confirmation)
5. **View Stats**: See product count and stock status on the dashboard

## 🔍 Testing

### Test Accounts

Create test accounts for different scenarios:

1. **Regular User**: Sign up normally
2. **Admin User**: Create user, then manually set `role: admin` in Firestore
3. **Google Auth**: Test Google sign-in flow

### Testing Checklist

- [ ] User registration and login
- [ ] Google OAuth login
- [ ] Product browsing and search
- [ ] Add/remove items from cart
- [ ] Checkout flow
- [ ] Order creation and viewing
- [ ] Admin product management
- [ ] Image upload
- [ ] Mobile responsiveness

## 🐛 Troubleshooting

### Common Issues

**1. Firebase connection errors**

- Check that `.env` file exists and contains correct values
- Verify Firebase project is active in console
- Ensure authentication methods are enabled

**2. Admin panel not accessible**

- Verify user has `role: admin` in Firestore
- Check Firestore rules are deployed
- Clear browser cache and re-login

**3. Image upload fails**

- Check Storage rules are deployed
- Verify storage bucket is created
- Ensure user has admin role

**4. Build errors**

- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version (should be 18+)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

For questions or issues, please open an issue on GitHub or contact <support@shophub.com>.

## 🎉 Credits

Built with:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)

---

**Happy Shopping! 🛍️**
