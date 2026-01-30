import { supabase, uploadFile, deleteFile, getPublicUrl } from '../lib/supabaseClient';
import { Product, CreateProductDto, UpdateProductDto } from '../types';

const PRODUCT_BUCKET = 'product-images';

/**
 * Create a new product with image upload
 */
export const createProduct = async (productData: CreateProductDto): Promise<string> => {
  let imageUrl = '';

  // Upload image if provided
  if (productData.image) {
    const fileName = `${Date.now()}_${productData.image.name}`;
    imageUrl = await uploadFile(PRODUCT_BUCKET, fileName, productData.image);
  }

  const { data, error } = await supabase
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
    .single();

  if (error) {
    // Delete uploaded image if insert fails
    if (imageUrl) {
      try {
        const imagePath = imageUrl.split('/').pop();
        if (imagePath) {
          await deleteFile(PRODUCT_BUCKET, imagePath);
        }
      } catch (deleteError) {
        console.error('Error deleting image:', deleteError);
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
    imageUrl = await uploadFile(PRODUCT_BUCKET, fileName, image);
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
    } catch (deleteError) {
      console.error('Error deleting image:', deleteError);
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

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    imageUrl: data.image_url,
    stock: data.stock,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
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

  return data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    imageUrl: product.image_url,
    stock: product.stock,
    createdAt: new Date(product.created_at),
    updatedAt: new Date(product.updated_at),
  }));
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

  return data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    imageUrl: product.image_url,
    stock: product.stock,
    createdAt: new Date(product.created_at),
    updatedAt: new Date(product.updated_at),
  }));
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
