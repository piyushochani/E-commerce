import api from './api';

export const productService = {
  // Public
  getAllProducts: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.product_type) params.append('product_type', filters.product_type);
    if (filters.product_sex) params.append('product_sex', filters.product_sex);
    if (filters.product_brand) params.append('product_brand', filters.product_brand);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    return api.get(`/products?${params.toString()}`);
  },

  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },

  // Seller Protected
  requestProductCreationOTP: (productData) => {
    return api.post('/products/request-creation-otp', productData);
  },

  verifyOTPAndCreateProduct: (otp) => {
    return api.post('/products/verify-otp-create', { otp });
  },

  updateProduct: (id, data) => {
    return api.put(`/products/${id}`, data);
  },

  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },

  getSellerProducts: () => {
    return api.get('/products/seller/my-products');
  }
};