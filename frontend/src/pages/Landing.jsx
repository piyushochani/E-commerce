import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
              Welcome to ECommerce
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Choose how you want to continue.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full max-w-xs">
    <div className="text-lg font-semibold text-gray-900">Customer</div>
    <div className="mt-1 text-sm text-gray-600">Shop products and place orders</div>
    <div className="mt-5 flex gap-2">
      <Link
        to="/customer/login"
        className="flex-1 px-4 py-2 rounded-md text-sm font-medium border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition text-center"
      >
        Login
      </Link>
      <Link
        to="/customer/signup"
        className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition text-center"
      >
        Signup
      </Link>
    </div>
  </div>
</div>

          <div className="mt-10 text-center">
            <Link
              to="/customer/home"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
