import { supabase } from '../lib/supabaseClient';
import { Cart, CartItem } from '../types';
import { getProduct } from './productService';

/**
 * Get all cart items for a user
 */
export const getCart = async (userId: string): Promise<Cart> => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, product_id, quantity, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Get cart failed: ${error.message}`);
  }

  const items: CartItem[] = (data || []).map((item) => ({
    productId: item.product_id,
    quantity: item.quantity,
  }));

  return {
    userId,
    items,
    updatedAt: new Date(),
  };
};

/**
 * Add item to cart (or update quantity if already exists)
 */
export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1
): Promise<void> => {
  // Check if item already exists
  const { data: existingItem, error: selectError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    throw new Error(`Add to cart failed: ${selectError.message}`);
  }

  if (existingItem) {
    // Update existing item
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);

    if (updateError) {
      throw new Error(`Update cart item failed: ${updateError.message}`);
    }
  } else {
    // Insert new item
    const { error: insertError } = await supabase.from('cart_items').insert([
      {
        user_id: userId,
        product_id: productId,
        quantity,
      },
    ]);

    if (insertError) {
      throw new Error(`Insert cart item failed: ${insertError.message}`);
    }
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (userId: string, productId: string): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    throw new Error(`Remove from cart failed: ${error.message}`);
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<void> => {
  if (quantity <= 0) {
    await removeFromCart(userId, productId);
    return;
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    throw new Error(`Update cart quantity failed: ${error.message}`);
  }
};

/**
 * Clear all items from cart
 */
export const clearCart = async (userId: string): Promise<void> => {
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);

  if (error) {
    throw new Error(`Clear cart failed: ${error.message}`);
  }
};

/**
 * Get cart with product details
 */
export const getCartWithProducts = async (userId: string): Promise<Cart> => {
  const cart = await getCart(userId);

  // Fetch product details for each item
  const itemsWithProducts = await Promise.all(
    cart.items.map(async (item) => {
      const product = await getProduct(item.productId);
      return {
        ...item,
        product: product || undefined,
      };
    })
  );

  return {
    ...cart,
    items: itemsWithProducts,
  };
};
