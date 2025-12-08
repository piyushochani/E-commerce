import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProductById(id);
      setProduct(response.data.product);
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/customer/login');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);
    setAddingToCart(false);

    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert('Failed to add to cart');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <img
                src={product.product_img || '/assets/images/default-product.png'}
                alt={product.product_name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(product.product_price)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.product_quantity > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.product_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="border-t border-b py-4 mb-4 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Brand:</span> {product.product_brand}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Category:</span> {product.product_type?.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Gender:</span> {product.product_sex?.toUpperCase()}
                </p>
                {product.product_size && product.product_size !== '-1' && (
                  <p className="text-gray-600">
                    <span className="font-medium">Size:</span> {product.product_size}
                  </p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Available:</span> {product.product_quantity} units
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product.product_description}</p>
              </div>

              {product.seller_id && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Seller Information</h3>
                  <p className="text-gray-700">{product.seller_id.seller_name}</p>
                  <p className="text-gray-600 text-sm">{product.seller_id.seller_company}</p>
                </div>
              )}

              {/* Quantity Selector */}
              {product.product_quantity > 0 && (
                <div className="mb-6">
                  <label className="block font-medium mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.product_quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.product_quantity, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.product_quantity, quantity + 1))}
                      className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.product_quantity === 0 || addingToCart}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  product.product_quantity === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {addingToCart ? 'Adding...' : product.product_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;