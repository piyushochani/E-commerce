import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_COLORS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.data.order);
      setOrderItems(response.data.orderItems);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCanceling(true);
    try {
      await orderService.cancelOrder(id);
      alert('Order cancelled successfully');
      fetchOrderDetails();
    } catch (err) {
      alert('Failed to cancel order: ' + (err.response?.data?.message || err.message));
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  const canCancel = order.order_status === 'pending' || order.order_status === 'confirmed';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Order Details</h1>
              <p className="text-gray-600">Order ID: {order._id}</p>
              <p className="text-gray-600">Placed on: {formatDate(order.order_date)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-medium ${ORDER_STATUS_COLORS[order.order_status]}`}>
              {order.order_status.toUpperCase()}
            </span>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
            <p className="text-gray-700">{order.shipping_address}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Order Items</h2>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div key={item._id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <img
                  src={item.product_id?.product_img || '/assets/images/default-product.png'}
                  alt={item.product_id?.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product_id?.product_name}</h3>
                  <p className="text-sm text-gray-600">{item.product_id?.product_brand}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price_at_purchase)}</p>
                  <p className="text-sm text-gray-600">
                    Total: {formatPrice(item.price_at_purchase * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.order_total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold text-blue-600">{formatPrice(order.order_total_amount)}</span>
            </div>
          </div>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={canceling}
              className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {canceling ? 'Canceling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;