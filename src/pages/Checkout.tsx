import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCartWithProducts } from '../services/cartService';
import { createOrder } from '../services/orderService';
import { Cart, Order } from '../types';

export const Checkout: React.FC = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState<Order['shippingAddress']>({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            const cartData = await getCartWithProducts(currentUser.uid);
            setCart(cartData);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => {
            if (item.product) {
                return total + item.product.price * item.quantity;
            }
            return total;
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser || !cart || cart.items.length === 0) return;

        try {
            setSubmitting(true);
            const orderId = await createOrder(currentUser.uid, cart, shippingInfo);
            alert('Order placed successfully!');
            navigate(`/orders`);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/')}
                    className="text-primary-600 hover:text-primary-700"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={shippingInfo.fullName}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={shippingInfo.address}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, address: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={shippingInfo.city}
                                        onChange={(e) =>
                                            setShippingInfo({ ...shippingInfo, city: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={shippingInfo.postalCode}
                                        onChange={(e) =>
                                            setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={shippingInfo.country}
                                    onChange={(e) =>
                                        setShippingInfo({ ...shippingInfo, country: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 font-medium"
                            >
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                item.product && (
                                    <div key={item.productId} className="flex gap-3">
                                        <img
                                            src={item.product.imageUrl || 'https://via.placeholder.com/60'}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium">{item.product.name}</h3>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-primary-600">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        <div className="border-t mt-4 pt-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold mt-4">
                                <span>Total</span>
                                <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
