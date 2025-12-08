import api from './api';

export const adminService = {
  // Login
  login: (credentials) => {
    return api.post('/admin/login', credentials);
  },

  // Dashboard
  getDashboardStats: () => {
    return api.get('/admin/dashboard');
  },

  // Customers
  getAllCustomers: (includeBlocked = false) => {
    return api.get(`/admin/customers?includeBlocked=${includeBlocked}`);
  },

  blacklistCustomer: (customerId, reason) => {
    return api.put(`/admin/blacklist-customer/${customerId}`, { reason });
  },

  unblockCustomer: (customerId) => {
    return api.put(`/admin/unblock-customer/${customerId}`);
  },

  // Sellers
  getAllSellers: (includeBlocked = false) => {
    return api.get(`/admin/sellers?includeBlocked=${includeBlocked}`);
  },

  blacklistSeller: (sellerId, reason) => {
    return api.put(`/admin/blacklist-seller/${sellerId}`, { reason });
  },

  unblockSeller: (sellerId) => {
    return api.put(`/admin/unblock-seller/${sellerId}`);
  },

  // Blocked Users
  getBlockedUsers: () => {
    return api.get('/admin/blocked-users');
  }
};