import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { customer, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setActionMessage({ text: message, type });
    setTimeout(() => {
      setActionMessage(null);
    }, 3500);
  };

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setSubtotal(0);
      setTotalUnits(0);
      return;
    }
    try {
      setLoadingCart(true);
      const res = await api.get('/cart');
      if (res.data.success) {
        setCartItems(res.data.items || []);
        setSubtotal(res.data.subtotal || 0);
        setTotalUnits(res.data.totalUnits || 0);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoadingCart(false);
    }
  };

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      setLoadingWishlist(true);
      const res = await api.get('/wishlist');
      if (res.data.success) {
        setWishlist(res.data.wishlist || []);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    } else {
      setCartItems([]);
      setSubtotal(0);
      setTotalUnits(0);
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please log in to add items to your cart', 'warning');
      return { success: false, requireAuth: true };
    }
    try {
      const res = await api.post(`/cart/${productId}`, { quantity });
      if (res.data.success) {
        setCartItems(res.data.items);
        setSubtotal(res.data.subtotal);
        setTotalUnits(res.data.totalUnits);
        showToast('Added to cart successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const res = await api.patch(`/cart/${productId}`, { quantity: newQuantity });
      if (res.data.success) {
        setCartItems(res.data.items);
        setSubtotal(res.data.subtotal);
        setTotalUnits(res.data.totalUnits);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update quantity';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      if (res.data.success) {
        setCartItems(res.data.items);
        setSubtotal(res.data.subtotal);
        setTotalUnits(res.data.totalUnits);
        showToast('Item removed from cart', 'info');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      showToast(msg, 'error');
      return { success: false };
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      showToast('Please log in to save items to your wishlist', 'warning');
      return { success: false, requireAuth: true };
    }
    try {
      const res = await api.patch(`/wishlist/${productId}/toggle`);
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        showToast(res.data.message, 'success');
        return { success: true, inWishlist: res.data.inWishlist };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update wishlist';
      showToast(msg, 'error');
      return { success: false };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => {
      const id = item._id || item;
      return id.toString() === productId?.toString();
    });
  };

  const clearCartState = () => {
    setCartItems([]);
    setSubtotal(0);
    setTotalUnits(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        totalUnits,
        wishlist,
        loadingCart,
        loadingWishlist,
        actionMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        isInWishlist,
        fetchCart,
        fetchWishlist,
        clearCartState,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
