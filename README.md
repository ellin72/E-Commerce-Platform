# E-Commerce Platform

[![CI/CD](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/ci.yml/badge.svg)](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/ci.yml)
[![Security](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/security.yml/badge.svg)](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/security.yml)
[![CodeQL](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/codeql.yml/badge.svg)](https://github.com/ellin72/E-Commerce-Platform/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.38-green.svg)](https://supabase.com/)

A modern, full-featured e-commerce platform built with React, TypeScript, Tailwind CSS, and Supabase.

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
- **Image Upload**: Upload product images to Supabase Storage
- **Dashboard**: View product statistics and manage inventory
- **Role-Based Access**: Secure admin routes with Row Level Security (RLS)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase
  - Authentication (Email/Password + Google OAuth)
  - PostgreSQL Database
  - Storage (Product Images)
  - Row Level Security (RLS)
- **Build Tool**: Vite
- **Hosting**: Vercel / Netlify

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
│   ├── lib/                # Supabase client
│   │   └── supabaseClient.ts
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/              # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── Checkout.tsx
│   │   ├── Login.tsx
│   │   ├── Orders.tsx
│   │   ├── ProductForm.tsx
│   │   └── SignUp.tsx
│   ├── services/           # Supabase service functions
│   │   ├── authService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   └── productService.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vercel.json            # Vercel configuration
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Git

### Step 1: Clone and Install Dependencies

```bash
# Navigate to the project directory
cd E-Commerce-Platform

# Install dependencies
npm install
```

### Step 2: Supabase Setup

1. **Create a Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Click "New Project" and follow the setup wizard
   - Note your project URL and anon key

2. **Set Up Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `SUPABASE_SCHEMA.sql`
   - Execute the SQL to create tables and set up Row Level Security

3. **Enable Authentication**
   - Go to Authentication > Providers
   - Email provider is enabled by default
   - Configure Google OAuth if desired

4. **Set Up Storage**
   - Go to Storage
   - Create a bucket named `product-images`
   - Set it to public access for product images

### Step 3: Environment Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

1. Edit `.env` and add your Supabase configuration:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Create an Admin User

After deploying, you need to create an admin user:

1. Run the app and create a regular user account
2. Go to Supabase Dashboard > Table Editor > profiles
3. Find your user record
4. Edit the `role` field and set it to `admin`

### Step 6: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚢 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Option 2: Netlify

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
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## 🔒 Security

### Row Level Security (RLS)

The project includes comprehensive RLS policies that:

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
2. **Admin User**: Create user, then manually set `role: admin` in Supabase
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

**1. Supabase connection errors**

- Check that `.env` file exists and contains correct values
- Verify Supabase project URL and anon key are correct
- Ensure authentication methods are enabled in Supabase dashboard

**2. Admin panel not accessible**

- Verify user has `role: admin` in Supabase profiles table
- Check RLS policies are active
- Clear browser cache and re-login

**3. Image upload fails**

- Check Storage bucket exists and is set to public
- Verify storage policies are configured
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

For questions or issues, please open an issue on GitHub or contact shitunaelin@gmail.com.

## 🎉 Credits

Built with:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Vite](https://vitejs.dev/)

---

**Happy Shopping! 🛍️**
