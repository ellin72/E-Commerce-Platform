import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ProductList } from './components/ProductList';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProductForm } from './pages/ProductForm';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route
                            path="/checkout"
                            element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <Orders />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products/new"
                            element={
                                <AdminRoute>
                                    <ProductForm />
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="/admin/products/edit/:id"
                            element={
                                <AdminRoute>
                                    <ProductForm />
                                </AdminRoute>
                            }
                        />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
