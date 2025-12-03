import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getCart, getWishlist } from '../services/backend-service';

const CartWishlistContext = createContext();

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within CartWishlistProvider');
  }
  return context;
};

export const CartWishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    if (user) {
      try {
        const cart = await getCart();
        const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartCount(0);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = localCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    }
  }, [user]);

  const fetchWishlistCount = useCallback(async () => {
    if (user) {
      try {
        const wishlist = await getWishlist();
        const count = wishlist.products?.length || 0;
        setWishlistCount(count);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlistCount(0);
      }
    } else {
      setWishlistCount(0);
    }
  }, [user]);

  const refreshCartCount = () => {
    fetchCartCount();
  };

  const refreshWishlistCount = () => {
    fetchWishlistCount();
  };

  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();
  }, [fetchCartCount, fetchWishlistCount]);

  // Listen for custom events to refresh counts
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    const handleWishlistUpdate = () => {
      fetchWishlistCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [fetchCartCount, fetchWishlistCount]);

  return (
    <CartWishlistContext.Provider
      value={{
        cartCount,
        wishlistCount,
        refreshCartCount,
        refreshWishlistCount,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

