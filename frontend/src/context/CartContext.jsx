import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!token) {
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data.cart);
      return data.cart;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCart(data.cart);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setLoading(true);
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data.cart);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
    } catch (error) {
      throw error;
    }
  };

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
