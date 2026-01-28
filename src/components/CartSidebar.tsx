import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCartWithProducts, updateCartItemQuantity, removeFromCart } from '../services/cartService';
import { Cart } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && currentUser) {
            loadCart();
        }
    }, [isOpen, currentUser]);

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

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        if (!currentUser) return;

        try {
            await updateCartItemQuantity(currentUser.uid, productId, quantity);
            await loadCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveItem = async (productId: string) => {
        if (!currentUser) return;

        try {
            await removeFromCart(currentUser.uid, productId);
            await loadCart();
        } catch (error) {
            console.error('Error removing item:', error);
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

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Shopping Cart</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : !cart || cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                item.product && (
                                    <div key={item.productId} className="flex gap-4 border-b pb-4">
                                        <img
                                            src={item.product.imageUrl || 'https://via.placeholder.com/100'}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                                            <p className="text-primary-600 font-semibold">
                                                ${item.product.price.toFixed(2)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center border rounded"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center border rounded"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                    className="ml-auto text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart && cart.items.length > 0 && (
                    <div className="border-t p-4 space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-medium"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
