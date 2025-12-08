import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !isCustomer) {
      navigate('/customer/login');
      return;
    }

    setLoading(true);
    const result = await addToCart(product._id, 1);
    setLoading(false);

    if (result.success) {
      alert('Added to cart!');
    } else {
      alert('Failed to add to cart');
    }
  };

  return (
    <Link to={`/customer/products/${product._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
        {/* Product Image */}
        <div className="relative h-64 bg-gray-200 overflow-hidden">
          <img
            src={product.product_img || '/assets/images/default-product.png'}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
          {product.product_quantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{product.product_name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.product_description}</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-600 font-bold text-xl">
              {formatPrice(product.product_price)}
            </span>
            <span className="text-gray-500 text-sm">
              {product.product_brand}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Stock: {product.product_quantity}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.product_quantity === 0 || loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                product.product_quantity === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;