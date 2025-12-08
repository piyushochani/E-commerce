import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductForm from '../../components/seller/ProductForm';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getErrorMessage } from '../../utils/helpers';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [productData, setProductData] = useState(null);

  const handleRequestOTP = async (formData) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await productService.requestProductCreationOTP(formData);
      setProductData(formData);
      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await productService.verifyOTPAndCreateProduct(otp);
      alert('Product created successfully!');
      navigate('/seller/products');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

        {step === 1 ? (
          <>
            <ErrorMessage message={error} onClose={() => setError('')} />
            <ProductForm onSubmit={handleRequestOTP} loading={loading} />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ErrorMessage message={error} onClose={() => setError('')} />
            {message && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
                {message}
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
            <p className="text-gray-600 mb-6">
              An OTP has been sent to the admin. Please contact the admin to get the OTP.
            </p>

            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP *
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;