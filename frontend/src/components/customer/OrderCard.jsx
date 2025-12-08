import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_COLORS } from '../../utils/constants';

const OrderCard = ({ order }) => {
  return (
    <Link to={`/customer/orders/${order._id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600">Order ID: {order._id.substring(0, 8)}</p>
            <p className="text-sm text-gray-600">{formatDate(order.order_date)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[order.order_status]}`}>
            {order.order_status.toUpperCase()}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-blue-600">{formatPrice(order.order_total_amount)}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View Details →
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium">Shipping Address:</p>
          <p className="truncate">{order.shipping_address}</p>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;