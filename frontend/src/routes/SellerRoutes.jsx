import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from '../components/common/Header';

// Seller Pages
import SellerDashboard from '../pages/seller/SellerDashboard';
import AddProduct from '../pages/seller/AddProduct';
import ProductList from '../pages/seller/ProductList';
import EditProduct from '../pages/seller/EditProduct';
import SellerProfile from '../pages/seller/SellerProfile';

const SellerRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute requiredRole="seller">
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute requiredRole="seller">
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute requiredRole="seller">
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="seller">
                <SellerProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default SellerRoutes;