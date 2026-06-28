import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem { _id: string; name: string; price: number; quantity: number; unit: string; image?: string; }
interface CartContextType {
  items: CartItem[]; total: number; count: number;
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  const save = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addToCart = (product: any) => {
    const existing = items.find(i => i._id === product._id);
    if (existing) save(items.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i));
    else save([...items, { _id: product._id, name: product.name, price: product.price, quantity: 1, unit: product.unit, image: product.images?.[0] }]);
  };

  const removeFromCart = (id: string) => save(items.filter(i => i._id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    save(items.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => save([]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <CartContext.Provider value={{ items, total, count, addToCart, removeFromCart, updateQuantity, clearCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
