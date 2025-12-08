import api from './api';

export const sellerService = {
  // Registration (3-step)
  requestEmailOTP: (data) => {
    return api.post('/sellers/request-email-otp', data);
  },

  verifyEmailOTP: (data) => {
    return api.post('/sellers/verify-email-otp', data);
  },

  verifyAdminOTPAndRegister: (data) => {
    return api.post('/sellers/verify-admin-otp-register', data);
  },

  // Login
  login: (credentials) => {
    return api.post('/sellers/login', credentials);
  },

  // Forgot Password
  requestForgotPasswordOTP: (email) => {
    return api.post('/sellers/forgot-password', { seller_email: email });
  },

  resetPassword: (data) => {
    return api.post('/sellers/reset-password', data);
  },

  // Profile
  getProfile: () => {
    return api.get('/sellers/profile');
  },

  updateProfile: (data) => {
    return api.put('/sellers/profile', data);
  },

  deleteAccount: () => {
    return api.delete('/sellers/profile');
  },

  // Public
  getAllSellers: () => {
    return api.get('/sellers');
  }
};