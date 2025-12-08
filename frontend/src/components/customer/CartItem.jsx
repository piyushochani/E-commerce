import React, { useState } from 'react';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;
    setLoading(true);
    setQuantity(newQuantity);
    await updateCartItem(item._id, newQuantity);
    setLoading(false);
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this item from cart?')) {
      setLoading(true);
      await removeFromCart(item._id);
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md">
      {/* Product Image */}
      <img
        src={item.product_id?.product_img || '/assets/images/default-product.png'}
        alt={item.product_id?.product_name}
        className="w-24 h-24 object-cover rounded"
      />

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-1">{item.product_id?.product_name}</h3>
        <p className="text-gray-600 text-sm mb-2">{item.product_id?.product_brand}</p>
        <p className="text-blue-600 font-bold">{formatPrice(item.price_at_addition)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          disabled={loading}
          className="text-red-600 hover:text-red-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleUpdateQuantity(quantity - 1)}
            disabled={loading || quantity <= 1}
            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => handleUpdateQuantity(quantity + 1)}
            disabled={loading}
            className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            +
          </button>
        </div>

        <p className="font-bold text-lg">{formatPrice(item.price_at_addition * quantity)}</p>
      </div>
    </div>
  );
};

export default CartItem;