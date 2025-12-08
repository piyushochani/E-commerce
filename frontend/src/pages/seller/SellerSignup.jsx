import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sellerService } from '../../services/sellerService';
import { useAuth } from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getErrorMessage } from '../../utils/helpers';

const SellerSignup = () => {
  const [step, setStep] = useState(1); // 1: Email OTP, 2: Admin OTP, 3: Complete Registration
  const [formData, setFormData] = useState({
    seller_name: '',
    seller_address: '',
    seller_company: '',
    seller_email: '',
    seller_phone: '',
    seller_password: '',
    confirmPassword: '',
    email_otp: '',
    admin_otp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestEmailOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await sellerService.requestEmailOTP({
        seller_name: formData.seller_name,
        seller_email: formData.seller_email,
        seller_phone: formData.seller_phone
      });
      
      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await sellerService.verifyEmailOTP({
        seller_name: formData.seller_name,
        seller_email: formData.seller_email,
        otp: formData.email_otp
      });
      
      setMessage(response.data.message);
      setStep(3);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.seller_password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.seller_password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await sellerService.verifyAdminOTPAndRegister({
        seller_name: formData.seller_name,
        seller_address: formData.seller_address,
        seller_company: formData.seller_company,
        seller_email: formData.seller_email,
        seller_phone: formData.seller_phone,
        seller_password: formData.seller_password,
        admin_otp: formData.admin_otp
      });
      
      const { token, seller } = response.data;
      login(seller, token, 'seller');
      navigate('/seller/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Seller Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {step} of 3
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/seller/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        {/* Step 1: Request Email OTP */}
        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={handleRequestEmailOTP}>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seller Name *</label>
                <input
                  type="text"
                  name="seller_name"
                  required
                  value={formData.seller_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="seller_email"
                  required
                  value={formData.seller_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="seller_phone"
                  required
                  value={formData.seller_phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Request Email OTP'}
            </button>
          </form>
        )}

        {/* Step 2: Verify Email OTP */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyEmailOTP}>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {message && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Email OTP *</label>
              <input
                type="text"
                name="email_otp"
                required
                maxLength="6"
                value={formData.email_otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
              />
              <p className="mt-2 text-sm text-gray-500">Check your email for the OTP</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Verify Email'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Complete Registration with Admin OTP */}
        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleCompleteRegistration}>
            <ErrorMessage message={error} onClose={() => setError('')} />
            {message && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="seller_company"
                  required
                  value={formData.seller_company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  name="seller_address"
                  required
                  value={formData.seller_address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="seller_password"
                  required
                  minLength="6"
                  value={formData.seller_password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength="6"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin OTP *</label>
                <input
                  type="text"
                  name="admin_otp"
                  required
                  maxLength="6"
                  value={formData.admin_otp}
                  onChange={handleChange}
                  placeholder="Enter admin OTP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                />
                <p className="mt-2 text-sm text-gray-500">Contact admin to get the OTP</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Complete Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerSignup;