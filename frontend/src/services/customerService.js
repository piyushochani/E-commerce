import api from './api';

export const customerService = {
  // Registration
  requestRegistrationOTP: (data) => {
    return api.post('/customers/request-registration-otp', data);
  },

  verifyOTPAndRegister: (data) => {
    return api.post('/customers/verify-otp-register', data);
  },

  // Login
  login: (credentials) => {
    return api.post('/customers/login', credentials);
  },

  // Forgot Password
  requestForgotPasswordOTP: (email) => {
    return api.post('/customers/forgot-password', { customer_email: email });
  },

  resetPassword: (data) => {
    return api.post('/customers/reset-password', data);
  },

  // Profile
  getProfile: () => {
    return api.get('/customers/profile');
  },

  updateProfile: (data) => {
    return api.put('/customers/profile', data);
  },

  deleteAccount: () => {
    return api.delete('/customers/profile');
  }
};