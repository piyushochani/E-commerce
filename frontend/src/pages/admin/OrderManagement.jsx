import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import OrderTable from '../../components/admin/OrderTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ORDER_STATUS } from '../../utils/constants';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Since we don't have a specific admin endpoint for all orders,
      // we'll use the customer orders endpoint
      // In a real application, you would create an admin-specific endpoint
      const response = await orderService.getCustomerOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.order_status === filter);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <div className="text-gray-600">
            Total: {filteredOrders.length} orders
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Orders ({orders.length})
            </button>
            {ORDER_STATUS.map((status) => {
              const count = orders.filter(o => o.order_status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-3 font-medium capitalize whitespace-nowrap ${
                    filter === status
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Orders will appear here once customers place them' 
                : `No ${filter} orders found`}
            </p>
          </div>
        ) : (
          <OrderTable orders={filteredOrders} />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;