# Supabase Storage Configuration

## Setting up the Product Images Bucket

### Steps to Create and Configure the Bucket:

1. **Create the Bucket**
   - Go to Supabase Dashboard → Storage
   - Click "Create a new bucket"
   - Name: `product-images`
   - Uncheck "Private bucket" (to make it public for reading)
   - Click Create

2. **Configure Bucket Policies** (Optional - already managed by code with RLS)
   - By default, the bucket is public for read access
   - Write access is controlled by RLS policies

3. **Image Upload**
   - Images are stored as: `/product-images/{timestamp}_{filename}`
   - Maximum file size: Check Supabase limits (usually 50MB per file)
   - Supported formats: JPG, PNG, WebP, GIF, etc.

## Environment Variables Required

Add these to your `.env.local` file:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:

- Supabase Dashboard → Settings → API
- Look for "Project URL" and "anon" key under "API keys"

## Using the Storage Functions

```typescript
import { uploadFile, deleteFile, getPublicUrl } from '../lib/supabaseClient';

// Upload an image
const imageUrl = await uploadFile('product-images', 'filename.jpg', file);

// Delete an image
await deleteFile('product-images', 'filename.jpg');

// Get public URL
const url = getPublicUrl('product-images', 'filename.jpg');
```

## Important Notes

- All images are stored with a timestamp prefix to avoid conflicts
- Public bucket allows anyone to read images
- Only authenticated admins can upload/delete (enforced by RLS in product service)
- Images are automatically deleted when products are deleted
