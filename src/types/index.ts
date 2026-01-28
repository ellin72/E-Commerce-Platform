export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'user' | 'admin';
    createdAt: Date;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItem {
    productId: string;
    quantity: number;
    product?: Product;
}

export interface Cart {
    userId: string;
    items: CartItem[];
    updatedAt: Date;
}

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image?: File;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
    id: string;
}
