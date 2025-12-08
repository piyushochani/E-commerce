import axios from 'axios';

// Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cartService = {
  // Get user's cart
  getCart: async () => {
    return await api.get('/cart');
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    return await api.post('/cart/add', {
      product_id: productId,  // Try snake_case
      quantity: quantity
    });
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity) => {
    return await api.put(`/cart/update/${cartItemId}`, {
      quantity
    });
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    return await api.delete(`/cart/remove/${cartItemId}`);
  },

  // Clear entire cart
  clearCart: async () => {
    return await api.delete('/cart/clear');
  }
};