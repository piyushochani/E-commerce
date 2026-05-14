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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({ size: '', color: '' });
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
      const prod = response.data.product;
      setProduct(prod);
      
      // Initialize variant selection if variants exist
      if (prod.variants && prod.variants.length > 0) {
        setSelectedVariant({
          size: prod.variants[0].size,
          color: prod.variants[0].color
        });
      }
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentVariant = () => {
    if (!product?.variants) return null;
    return product.variants.find(
      v => v.size === selectedVariant.size && v.color === selectedVariant.color
    );
  };

  const getDisplayPrice = () => {
    const variant = getCurrentVariant();
    return variant?.price || product.product_price;
  };

  const getAvailableStock = () => {
    const variant = getCurrentVariant();
    return variant ? variant.quantity : product.product_quantity;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !isCustomer) {
      navigate('/customer/login');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, quantity, selectedVariant.size ? selectedVariant : null);
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

  const images = Array.isArray(product.product_img) ? product.product_img : [product.product_img];
  const stock = getAvailableStock();

  // Get unique sizes and colors for selectors
  const uniqueSizes = [...new Set(product.variants?.map(v => v.size) || [])];
  const uniqueColors = [...new Set(product.variants?.filter(v => v.size === selectedVariant.size).map(v => v.color) || [])];

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
            {/* Product Image Gallery */}
            <div>
              <div className="mb-4">
                <img
                  src={images[selectedImage] || '/assets/images/default-product.png'}
                  alt={product.product_name}
                  className="w-full h-96 object-contain bg-gray-100 rounded-lg"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${
                        selectedImage === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(getDisplayPrice())}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="border-t border-b py-4 mb-4 space-y-3">
                <p className="text-gray-600">
                  <span className="font-medium">Brand:</span> {product.product_brand}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Category:</span> {product.product_type?.replace('_', ' ').toUpperCase()}
                </p>

                {/* Variant Selectors */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Size</label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => {
                              const firstAvailableColor = product.variants.find(v => v.size === size).color;
                              setSelectedVariant({ size, color: firstAvailableColor });
                            }}
                            className={`px-4 py-2 border rounded-md text-sm transition ${
                              selectedVariant.size === size
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Color</label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedVariant(prev => ({ ...prev, color }))}
                            className={`px-4 py-2 border rounded-md text-sm transition ${
                              selectedVariant.color === color
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!product.variants?.length && product.product_size && product.product_size !== '-1' && (
                  <p className="text-gray-600">
                    <span className="font-medium">Size:</span> {product.product_size}
                  </p>
                )}
                
                <p className="text-gray-600">
                  <span className="font-medium">Available:</span> {stock} units
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.product_description}</p>
              </div>

              {/* Quantity Selector */}
              {stock > 0 && (
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
                      max={stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center border border-gray-300 rounded px-3 py-2"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
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
                disabled={stock === 0 || addingToCart}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {addingToCart ? 'Adding...' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;