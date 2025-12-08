import api from './api';

export const orderService = {
  placeOrder: (shippingAddress) => {
    return api.post('/orders/place', { shipping_address: shippingAddress });
  },

  getCustomerOrders: () => {
    return api.get('/orders');
  },

  getOrderById: (orderId) => {
    return api.get(`/orders/${orderId}`);
  },

  updateOrderStatus: (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, { order_status: status });
  },

  cancelOrder: (orderId) => {
    return api.put(`/orders/${orderId}/cancel`);
  }
};