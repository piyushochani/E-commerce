import React from 'react';
import { Home, Package, ShoppingBag, Users, Store, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userType = 'customer' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(`${userType}Token`);
    navigate(`/${userType}/login`);
  };

  const customerLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'Orders', path: '/orders', icon: Package },
    { name: 'Profile', path: '/profile', icon: Users },
  ];

  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: Home },
    { name: 'Products', path: '/seller/products', icon: Package },
    { name: 'Add Product', path: '/seller/add-product', icon: ShoppingBag },
    { name: 'Profile', path: '/seller/profile', icon: Users },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Sellers', path: '/admin/sellers', icon: Store },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  const links = 
    userType === 'admin' ? adminLinks : 
    userType === 'seller' ? sellerLinks : 
    customerLinks;

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <ul className="flex items-center space-x-8 py-3">
          {links.map((link, index) => (
            <li key={index}>
              <button
                onClick={() => navigate(link.path)}
                className="flex items-center space-x-2 hover:text-indigo-200 transition"
              >
                <link.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.name}</span>
              </button>
            </li>
          ))}
          <li className="ml-auto">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:text-red-300 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;