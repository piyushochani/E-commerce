import React from 'react';
import { Home, Users, Store, Package, ShoppingBag, DollarSign, Settings, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userType = 'admin', isOpen, onClose }) => {
  const navigate = useNavigate();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Seller Management', path: '/admin/sellers', icon: Store },
    { name: 'Product Management', path: '/admin/products', icon: Package },
    { name: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Payments', path: '/admin/payments', icon: DollarSign },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: Home },
    { name: 'Products', path: '/seller/products', icon: Package },
    { name: 'Add Product', path: '/seller/add-product', icon: ShoppingBag },
    { name: 'Orders', path: '/seller/orders', icon: ShoppingBag },
    { name: 'Profile', path: '/seller/profile', icon: Settings },
  ];

  const links = userType === 'admin' ? adminLinks : sellerLinks;

  const handleLogout = () => {
    localStorage.removeItem(`${userType}Token`);
    navigate(`/${userType}/login`);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">
            {userType.charAt(0).toUpperCase() + userType.slice(1)} Panel
          </h2>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    navigate(link.path);
                    onClose();
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-red-900 transition text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;