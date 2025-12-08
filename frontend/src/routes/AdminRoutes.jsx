import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from '../components/common/Header';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import SellerManagement from '../pages/admin/SellerManagement';
import ProductManagement from '../pages/admin/ProductManagement';
import OrderManagement from '../pages/admin/OrderManagement';

const AdminRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sellers"
            element={
              <ProtectedRoute requiredRole="admin">
                <SellerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute requiredRole="admin">
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <OrderManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminRoutes;