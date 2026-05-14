import React, { useState } from 'react';
import { PRODUCT_TYPES, PRODUCT_SEX, AVAILABLE_SIZES, AVAILABLE_COLORS } from '../../utils/constants';
import ErrorMessage from '../common/ErrorMessage';

const ProductForm = ({ initialData = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    product_name: initialData.product_name || '',
    product_price: initialData.product_price || '',
    product_description: initialData.product_description || '',
    product_img: Array.isArray(initialData.product_img) ? initialData.product_img : (initialData.product_img ? [initialData.product_img] : ['']),
    product_sex: initialData.product_sex || 'both',
    product_size: initialData.product_size || '',
    product_quantity: initialData.product_quantity || '',
    product_brand: initialData.product_brand || '',
    product_type: initialData.product_type || 'other',
    variants: initialData.variants || []
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.product_img];
    newImages[index] = value;
    setFormData({ ...formData, product_img: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, product_img: [...formData.product_img, ''] });
  };

  const removeImageField = (index) => {
    if (formData.product_img.length > 1) {
      const newImages = formData.product_img.filter((_, i) => i !== index);
      setFormData({ ...formData, product_img: newImages });
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: 'M', color: 'Black', quantity: 0, price: '' }]
    });
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.product_name || !formData.product_price || !formData.product_description) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.product_img.some(img => !img.trim())) {
      setError('Please provide valid URLs for all image fields');
      return;
    }

    if (formData.product_price < 0) {
      setError('Base price cannot be negative');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Basic Information</h3>
        </div>

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
            Base Price * (₹)
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
            Total Base Quantity *
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="product_description"
            value={formData.product_description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Images Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-4">Product Images</h3>
          <div className="space-y-3">
            {formData.product_img.map((img, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              + Add Another Image
            </button>
          </div>
        </div>

        {/* Variants Section */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center border-b pb-2 mb-4 mt-4">
            <h3 className="text-lg font-semibold">Product Variants (Optional)</h3>
            <button
              type="button"
              onClick={addVariant}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
            >
              + Add Variant
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg relative">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Size</label>
                  <select
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {AVAILABLE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                  <select
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {AVAILABLE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                  <input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price Override (₹)</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    placeholder="Optional"
                    min="0"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="w-full py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold"
        >
          {loading ? 'Submitting...' : (initialData._id ? 'Update Product' : 'Submit Product')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
