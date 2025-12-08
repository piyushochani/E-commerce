import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Customer Pages
import Home from '../pages/customer/Home';
import ProductListing from '../pages/customer/ProductListing';
import ProductDetails from '../pages/customer/ProductDetails';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import UserProfile from '../pages/customer/UserProfile';
import Orders from '../pages/customer/Orders';
import OrderDetails from '../pages/customer/OrderDetails';

const CustomerRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          
          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute requiredRole="customer">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute requiredRole="customer">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="customer">
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="customer">
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute requiredRole="customer">
                <OrderDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerRoutes;