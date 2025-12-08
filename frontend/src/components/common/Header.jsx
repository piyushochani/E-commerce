import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const { user, isAuthenticated, isCustomer, isSeller, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (isCustomer) navigate('/customer/login');
    else if (isSeller) navigate('/seller/login');
    else if (isAdmin) navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isCustomer ? '/customer/home' : isSeller ? '/seller/dashboard' : '/admin/dashboard'} className="text-2xl font-bold text-blue-600">
            ECommerce
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {isCustomer && (
              <>
                <Link to="/customer/home" className="hover:text-blue-600 transition">Home</Link>
                <Link to="/customer/products" className="hover:text-blue-600 transition">Products</Link>
                <Link to="/customer/orders" className="hover:text-blue-600 transition">Orders</Link>
              </>
            )}
            {isSeller && (
              <>
                <Link to="/seller/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                <Link to="/seller/products" className="hover:text-blue-600 transition">My Products</Link>
                <Link to="/seller/add-product" className="hover:text-blue-600 transition">Add Product</Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                <Link to="/admin/customers" className="hover:text-blue-600 transition">Customers</Link>
                <Link to="/admin/sellers" className="hover:text-blue-600 transition">Sellers</Link>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isCustomer && (
              <Link to="/customer/cart" className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && (
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-blue-600 transition">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link to={`/${isCustomer ? 'customer' : isSeller ? 'seller' : 'admin'}/profile`} className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;