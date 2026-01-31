import { supabase, uploadFile, deleteFile } from '../lib/supabaseClient';
import { Product, CreateProductDto, UpdateProductDto } from '../types';
import type { Database } from '../types/database.types';

type ProductRow = Database['public']['Tables']['products']['Row'];

const PRODUCT_BUCKET = 'product-images';

const withTimeout = async <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out. Please try again.`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

/**
 * Create a new product with image upload
 */
export const createProduct = async (productData: CreateProductDto): Promise<string> => {
  let imageUrl = '';

  // Upload image if provided
  if (productData.image) {
    const fileName = `${Date.now()}_${productData.image.name}`;
    imageUrl = await withTimeout(
      uploadFile(PRODUCT_BUCKET, fileName, productData.image),
      60000,
      'Image upload'
    );
  }

  const { data, error } = await withTimeout(
    supabase
      .from('products')
      .insert([
        {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          image_url: imageUrl,
        },
      ])
      .select('id')
      .single(),
    20000,
    'Product save'
  );

  if (error) {
    // Delete uploaded image if insert fails
    if (imageUrl) {
      try {
        const imagePath = imageUrl.split('/').pop();
        if (imagePath) {
          await deleteFile(PRODUCT_BUCKET, imagePath);
        }
      } catch {
        // Ignore cleanup errors
      }
    }
    throw new Error(`Create product failed: ${error.message}`);
  }

  return data.id;
};

/**
 * Update an existing product
 */
export const updateProduct = async (productData: UpdateProductDto): Promise<void> => {
  const { id, image, ...updateData } = productData;

  let imageUrl: string | undefined;

  // Upload new image if provided
  if (image) {
    const fileName = `${Date.now()}_${image.name}`;
    imageUrl = await withTimeout(
      uploadFile(PRODUCT_BUCKET, fileName, image),
      60000,
      'Image upload'
    );
  }

  const { error } = await supabase
    .from('products')
    .update({
      ...updateData,
      ...(imageUrl && { image_url: imageUrl }),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Update product failed: ${error.message}`);
  }
};

/**
 * Delete a product and its image
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  // Get product to retrieve image URL
  const { data: productData, error: fetchError } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', productId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`Delete product failed: ${fetchError.message}`);
  }

  // Delete image from storage if exists
  if (productData?.image_url) {
    try {
      const imagePath = productData.image_url.split('/').pop();
      if (imagePath) {
        await deleteFile(PRODUCT_BUCKET, imagePath);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  // Delete product from database
  const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);

  if (deleteError) {
    throw new Error(`Delete product failed: ${deleteError.message}`);
  }
};

/**
 * Get a single product by ID
 */
export const getProduct = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Get product failed: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const productData = data as ProductRow;
  return {
    id: productData.id,
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    imageUrl: productData.image_url,
    stock: productData.stock,
    createdAt: new Date(productData.created_at),
    updatedAt: new Date(productData.updated_at),
  };
};

/**
 * Get all products ordered by creation date
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Get all products failed: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map((product) => {
    const productData = product as ProductRow;
    return {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      imageUrl: productData.image_url,
      stock: productData.stock,
      createdAt: new Date(productData.created_at),
      updatedAt: new Date(productData.updated_at),
    };
  });
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Get products by category failed: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map((product) => {
    const productData = product as ProductRow;
    return {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      imageUrl: productData.image_url,
      stock: productData.stock,
      createdAt: new Date(productData.created_at),
      updatedAt: new Date(productData.updated_at),
    };
  });
};

/**
 * Search products by name or description (client-side)
 * For production, consider using Supabase Full Text Search
 */
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  const products = await getAllProducts();

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
