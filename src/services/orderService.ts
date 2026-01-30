import { supabase } from '../lib/supabaseClient';
import { Order, Cart, OrderItem } from '../types';
import type { Database } from '../types/database.types';
import { clearCart } from './cartService';

type ShippingAddress = Order['shippingAddress'];
type OrderRow = Database['public']['Tables']['orders']['Row'];

/**
 * Create a new order
 */
export const createOrder = async (
  userId: string,
  cart: Cart,
  shippingAddress: Order['shippingAddress']
): Promise<string> => {
  // Calculate total
  const total = cart.items.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity;
    }
    return sum;
  }, 0);

  // Prepare order items
  const orderItems = cart.items
    .filter((item) => item.product)
    .map((item) => ({
      productId: item.productId,
      productName: item.product!.name,
      price: item.product!.price,
      quantity: item.quantity,
      imageUrl: item.product!.imageUrl,
    }));

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: userId,
        items: orderItems,
        total,
        status: 'pending',
        shipping_address: shippingAddress,
      },
    ])
    .select('id')
    .single();

  if (error) {
    throw new Error(`Create order failed: ${error.message}`);
  }

  // Clear the cart after order is created
  await clearCart(userId);

  return data.id;
};

/**
 * Get a single order by ID
 */
export const getOrder = async (orderId: string): Promise<Order | null> => {
  const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Get order failed: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const orderData = data as OrderRow;
  return {
    id: orderData.id,
    userId: orderData.user_id,
    items: orderData.items as unknown as OrderItem[],
    total: orderData.total,
    status: orderData.status,
    createdAt: new Date(orderData.created_at),
    shippingAddress: orderData.shipping_address as unknown as ShippingAddress,
  };
};

/**
 * Get all orders for a specific user
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Get user orders failed: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map((order) => {
    const orderData = order as OrderRow;
    return {
      id: orderData.id,
      userId: orderData.user_id,
      items: orderData.items as unknown as OrderItem[],
      total: orderData.total,
      status: orderData.status,
      createdAt: new Date(orderData.created_at),
      shippingAddress: orderData.shipping_address as unknown as ShippingAddress,
    };
  });
};

/**
 * Get all orders (admin only - RLS will restrict)
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Get all orders failed: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map((order) => {
    const orderData = order as OrderRow;
    return {
      id: orderData.id,
      userId: orderData.user_id,
      items: orderData.items as unknown as OrderItem[],
      total: orderData.total,
      status: orderData.status,
      createdAt: new Date(orderData.created_at),
      shippingAddress: orderData.shipping_address as unknown as ShippingAddress,
    };
  });
};

/**
 * Update order status (admin only - RLS will restrict)
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<void> => {
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);

  if (error) {
    throw new Error(`Update order status failed: ${error.message}`);
  }
};
