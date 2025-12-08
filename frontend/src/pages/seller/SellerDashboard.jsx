import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import StatsCard from '../../components/seller/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    lowStock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getSellerProducts();
      const productList = response.data.products;
      setProducts(productList);

      const inStock = productList.filter(p => p.product_quantity > 10).length;
      const outOfStock = productList.filter(p => p.product_quantity === 0).length;
      const lowStock = productList.filter(p => p.product_quantity > 0 && p.product_quantity <= 10).length;

      setStats({
        totalProducts: productList.length,
        inStock,
        outOfStock,
        lowStock
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            color="blue"
          />
          <StatsCard
            title="In Stock"
            value={stats.inStock}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="green"
          />
          <StatsCard
            title="Low Stock"
            value={stats.lowStock}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            color="yellow"
          />
          <StatsCard
            title="Out of Stock"
            value={stats.outOfStock}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/seller/add-product"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition text-center"
          >
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Add New Product</h3>
            <p className="text-gray-600 text-sm mt-2">Add products to your inventory</p>
          </Link>

          <Link
            to="/seller/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition text-center"
          >
            <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Manage Products</h3>
            <p className="text-gray-600 text-sm mt-2">View and edit your products</p>
          </Link>

          <Link
            to="/seller/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition text-center"
          >
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">My Profile</h3>
            <p className="text-gray-600 text-sm mt-2">Update your seller information</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Products</h2>
            <Link to="/seller/products" className="text-blue-600 hover:text-blue-700">View All →</Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No products yet. Start by adding your first product!</p>
              <Link
                to="/seller/add-product"
                className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <div key={product._id} className="border rounded-lg p-4">
                  <img
                    src={product.product_img || '/assets/images/default-product.png'}
                    alt={product.product_name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h3 className="font-medium truncate">{product.product_name}</h3>
                  <p className="text-sm text-gray-600">{product.product_brand}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-blue-600">₹{product.product_price}</span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        product.product_quantity > 10
                          ? 'bg-green-100 text-green-800'
                          : product.product_quantity > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      Stock: {product.product_quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
