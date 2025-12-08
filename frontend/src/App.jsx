import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Customer Routes
import CustomerRoutes from './routes/CustomerRoutes';
import SellerRoutes from './routes/SellerRoutes';
import AdminRoutes from './routes/AdminRoutes';

// Auth Pages
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerSignup from './pages/customer/CustomerSignup';
import SellerLogin from './pages/seller/SellerLogin';
import SellerSignup from './pages/seller/SellerSignup';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Landing/Home */}
            <Route path="/" element={<Navigate to="/customer/home" />} />

            {/* Customer Auth */}
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/signup" element={<CustomerSignup />} />

            {/* Seller Auth */}
            <Route path="/seller/login" element={<SellerLogin />} />
            <Route path="/seller/signup" element={<SellerSignup />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Customer Routes */}
            <Route path="/customer/*" element={<CustomerRoutes />} />

            {/* Seller Routes */}
            <Route path="/seller/*" element={<SellerRoutes />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* 404 */}
            <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">404 - Not Found</h1></div>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;