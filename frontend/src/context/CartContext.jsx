import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Get auth context with safety check
  const authContext = useContext(AuthContext);
  const { isCustomer, isAuthenticated, loading: authLoading } = authContext || {};

  const fetchCart = useCallback(async () => {
    // Wait for auth to finish loading
    if (authLoading) return;
    
    // Only fetch cart if user is authenticated and is a customer
    if (!isCustomer || !isAuthenticated) {
      setCart(null);
      setCartItems([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data.cart);
      setCartItems(response.data.cartItems || []);
    } catch (error) {
      // Only log error if it's not authentication related
      if (error.response?.status !== 401 && error.response?.status !== 404) {
        console.error('Error fetching cart:', error.message);
      }
      // Set empty cart on error
      setCart(null);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isCustomer, isAuthenticated, authLoading]);

  useEffect(() => {
    // Don't fetch until auth is done loading
    if (!authLoading) {
      if (isCustomer && isAuthenticated) {
        fetchCart();
      } else {
        // Clear cart if not a customer
        setCart(null);
        setCartItems([]);
      }
    }
  }, [isCustomer, isAuthenticated, authLoading, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isCustomer || !isAuthenticated) {
      return { success: false, error: 'Please login as customer' };
    }

    try {
      console.log('Adding to cart:', { productId, quantity }); // Debug log
      await cartService.addToCart(productId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Add to cart error:', error);
      console.error('Error response:', error.response?.data); // More detailed error
      return { success: false, error: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await cartService.updateCartItem(cartItemId, quantity);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Update cart error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update cart' };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to remove from cart' };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to clear cart' };
    }
  };

  const getCartCount = () => {
    return cart?.cart_quantity || 0;
  };

  const getCartTotal = () => {
    return cart?.cart_total_amount || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};