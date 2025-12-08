import React, { useState } from 'react';
import { PRODUCT_TYPES, PRODUCT_SEX } from '../../utils/constants';
import ErrorMessage from '../common/ErrorMessage';

const ProductForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    product_name: initialData.product_name || '',
    product_price: initialData.product_price || '',
    product_description: initialData.product_description || '',
    product_img: initialData.product_img || '',
    product_sex: initialData.product_sex || 'both',
    product_size: initialData.product_size || '',
    product_quantity: initialData.product_quantity || '',
    product_brand: initialData.product_brand || '',
    product_type: initialData.product_type || 'other'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.product_name || !formData.product_price || !formData.product_description) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.product_price < 0) {
      setError('Price cannot be negative');
      return;
    }

    if (formData.product_quantity < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            name="product_price"
            value={formData.product_price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand *
          </label>
          <input
            type="text"
            name="product_brand"
            value={formData.product_brand}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            name="product_quantity"
            value={formData.product_quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {PRODUCT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            name="product_sex"
            value={formData.product_sex}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {PRODUCT_SEX.map((sex) => (
              <option key={sex} value={sex}>
                {sex.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size (Optional)
          </label>
          <input
            type="text"
            name="product_size"
            value={formData.product_size}
            onChange={handleChange}
            placeholder="e.g., S, M, L, XL"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL *
          </label>
          <input
            type="url"
            name="product_img"
            value={formData.product_img}
            onChange={handleChange}
            required
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="product_description"
            value={formData.product_description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
