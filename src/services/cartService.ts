import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Cart } from '../types';
import { getProduct } from './productService';

const CARTS_COLLECTION = 'carts';

const convertTimestamp = (timestamp: Timestamp | Date): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    return timestamp;
};

export const getCart = async (userId: string): Promise<Cart> => {
    const cartDoc = await getDoc(doc(db, CARTS_COLLECTION, userId));

    if (!cartDoc.exists()) {
        // Create empty cart if doesn't exist
        const emptyCart: Omit<Cart, 'updatedAt'> = {
            userId,
            items: [],
        };

        await setDoc(doc(db, CARTS_COLLECTION, userId), {
            ...emptyCart,
            updatedAt: serverTimestamp(),
        });

        return {
            ...emptyCart,
            updatedAt: new Date(),
        };
    }

    const data = cartDoc.data();
    return {
        ...data,
        updatedAt: convertTimestamp(data.updatedAt),
    } as Cart;
};

export const addToCart = async (
    userId: string,
    productId: string,
    quantity: number = 1
): Promise<void> => {
    const cart = await getCart(userId);
    const existingItemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (existingItemIndex >= 0) {
        // Update quantity if item already in cart
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({ productId, quantity });
    }

    await updateDoc(doc(db, CARTS_COLLECTION, userId), {
        items: cart.items,
        updatedAt: serverTimestamp(),
    });
};

export const removeFromCart = async (userId: string, productId: string): Promise<void> => {
    const cart = await getCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);

    await updateDoc(doc(db, CARTS_COLLECTION, userId), {
        items: cart.items,
        updatedAt: serverTimestamp(),
    });
};

export const updateCartItemQuantity = async (
    userId: string,
    productId: string,
    quantity: number
): Promise<void> => {
    if (quantity <= 0) {
        await removeFromCart(userId, productId);
        return;
    }

    const cart = await getCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;

        await updateDoc(doc(db, CARTS_COLLECTION, userId), {
            items: cart.items,
            updatedAt: serverTimestamp(),
        });
    }
};

export const clearCart = async (userId: string): Promise<void> => {
    await updateDoc(doc(db, CARTS_COLLECTION, userId), {
        items: [],
        updatedAt: serverTimestamp(),
    });
};

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
