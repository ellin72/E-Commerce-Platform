import {
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, Cart } from '../types';
import { clearCart } from './cartService';

const ORDERS_COLLECTION = 'orders';

const convertTimestamp = (timestamp: Timestamp | Date): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    return timestamp;
};

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

    const orderData = {
        userId,
        items: orderItems,
        total,
        status: 'pending' as const,
        shippingAddress,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);

    // Clear the cart after order is created
    await clearCart(userId);

    return docRef.id;
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
    const orderDoc = await getDoc(doc(db, ORDERS_COLLECTION, orderId));

    if (!orderDoc.exists()) {
        return null;
    }

    const data = orderDoc.data();
    return {
        id: orderDoc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
    } as Order;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
    const q = query(
        collection(db, ORDERS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: convertTimestamp(data.createdAt),
        } as Order;
    });
};

export const getAllOrders = async (): Promise<Order[]> => {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: convertTimestamp(data.createdAt),
        } as Order;
    });
};
