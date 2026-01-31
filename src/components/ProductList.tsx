import React, { useCallback, useEffect, useState } from 'react';
import { getAllProducts, searchProducts, getProductsByCategory } from '../services/productService';
import { addToCart } from '../services/cartService';
import { Product } from '../types';
import { useAuth } from '../contexts/useAuthHook';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const categories = ['all', 'electronics', 'clothing', 'books', 'home', 'sports'];

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      let loadedProducts: Product[];

      if (selectedCategory === 'all') {
        loadedProducts = await getAllProducts();
      } else {
        loadedProducts = await getProductsByCategory(selectedCategory);
      }

      setProducts(loadedProducts);
    } catch {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      try {
        const results = await searchProducts(searchTerm);
        setProducts(results);
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    } else {
      loadProducts();
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!currentUser) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      setAddingToCart(productId);
      await addToCart(currentUser.uid, productId, 1);
      alert('Product added to cart!');
    } catch {
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Search
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSearchTerm('');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock === 0 || addingToCart === product.id}
                  className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {addingToCart === product.id
                    ? 'Adding...'
                    : product.stock === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
