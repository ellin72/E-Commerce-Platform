import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Product, CreateProductDto, UpdateProductDto } from '../types';

const PRODUCTS_COLLECTION = 'products';

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: Timestamp | Date): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    return timestamp;
};

export const createProduct = async (productData: CreateProductDto): Promise<string> => {
    let imageUrl = '';

    // Upload image if provided
    if (productData.image) {
        const imageRef = ref(storage, `products/${Date.now()}_${productData.image.name}`);
        await uploadBytes(imageRef, productData.image);
        imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return docRef.id;
};

export const updateProduct = async (productData: UpdateProductDto): Promise<void> => {
    const { id, image, ...updateData } = productData;
    const productRef = doc(db, PRODUCTS_COLLECTION, id);

    let imageUrl: string | undefined;

    // Upload new image if provided
    if (image) {
        const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
    }

    await updateDoc(productRef, {
        ...updateData,
        ...(imageUrl && { imageUrl }),
        updatedAt: serverTimestamp(),
    });
};

export const deleteProduct = async (productId: string): Promise<void> => {
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, productId));

    if (productDoc.exists()) {
        const productData = productDoc.data();

        // Delete image from storage if exists
        if (productData.imageUrl) {
            try {
                const imageRef = ref(storage, productData.imageUrl);
                await deleteObject(imageRef);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }
    }

    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
};

export const getProduct = async (productId: string): Promise<Product | null> => {
    const productDoc = await getDoc(doc(db, PRODUCTS_COLLECTION, productId));

    if (!productDoc.exists()) {
        return null;
    }

    const data = productDoc.data();
    return {
        id: productDoc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
    } as Product;
};

export const getAllProducts = async (): Promise<Product[]> => {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
        } as Product;
    });
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
        } as Product;
    });
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
    const products = await getAllProducts();

    // Client-side filtering (for simple implementation)
    // For production, consider using Algolia or similar service
    return products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
};
