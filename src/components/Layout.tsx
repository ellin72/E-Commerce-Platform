import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
            <footer className="bg-gray-800 text-white mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">ShopHub</h3>
                            <p className="text-gray-400 text-sm">
                                Your one-stop shop for all your needs. Quality products, great prices.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="/" className="text-gray-400 hover:text-white">
                                        Products
                                    </a>
                                </li>
                                <li>
                                    <a href="/orders" className="text-gray-400 hover:text-white">
                                        Orders
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <p className="text-gray-400 text-sm">Email: support@shophub.com</p>
                            <p className="text-gray-400 text-sm">Phone: (555) 123-4567</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; 2026 ShopHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
