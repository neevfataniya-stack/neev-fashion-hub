import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { trackEvent } from '../utils/analytics';

const CART_STORAGE_KEY = 'nfh_cart_items_v1';
export const DEMO_SHIPPING_FLAT_FEE = 49;
export const FREE_SHIPPING_THRESHOLD = 999;

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity: number) => { success: boolean; message: string };
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  notification: string | null;
  dismissNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const dismissNotification = () => setNotification(null);

  const addToCart = (product: Product, size: string, color: string, quantity: number) => {
    if (!size || !color) {
      return { success: false, message: 'Please select both size and color before adding to cart.' };
    }

    const cartItemId = `${product.id}-${size}-${color}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
          unitPrice: product.price,
        };
        return [...prevCart, newItem];
      }
    });

    // Track add_to_cart event for the campaign dashboard
    trackEvent('add_to_cart', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      gender: product.gender,
      price: product.price,
      size,
      color,
      quantity,
      value: product.price * quantity,
    });

    setNotification(`Added "${product.name}" (${size}, ${color}) to cart!`);
    setTimeout(() => {
      setNotification((curr) => (curr ? null : curr));
    }, 3500);

    return { success: true, message: `Added to cart successfully!` };
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : DEMO_SHIPPING_FLAT_FEE;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingFee,
        isFreeShipping,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        notification,
        dismissNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
