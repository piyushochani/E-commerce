export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const PRODUCT_TYPES = [
  'electronics',
  'clothing',
  'basic_needs',
  'furniture',
  'books',
  'toys',
  'sports',
  'beauty',
  'other'
];

export const PRODUCT_SEX = ['male', 'female', 'both'];

export const GENDERS = ['male', 'female', 'other'];

export const ORDER_STATUS = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
];

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800'
};