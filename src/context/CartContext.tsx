import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, DeliveryArea, Voucher } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  removeOrderedItems: (orderedItemIds: string[]) => void;
  subtotal: number;
  deliveryArea: DeliveryArea;
  setDeliveryArea: (area: DeliveryArea) => void;
  deliveryCharge: number;
  appliedVouchers: Voucher[];
  applyVoucher: (voucher: Voucher) => { success: boolean; message: string };
  removeVoucher: (voucherId: string) => void;
  voucherDiscount: number;
  grandTotal: number;
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'samias_closet_cart_v1';
const DELIVERY_AREA_KEY = 'samias_closet_delivery_area';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>(() => {
    try {
      const saved = localStorage.getItem(DELIVERY_AREA_KEY);
      return (saved as DeliveryArea) || 'Moulvibazar';
    } catch {
      return 'Moulvibazar';
    }
  });

  const [appliedVouchers, setAppliedVouchers] = useState<Voucher[]>([]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [items]);

  // Persist delivery area
  useEffect(() => {
    try {
      localStorage.setItem(DELIVERY_AREA_KEY, deliveryArea);
    } catch (e) {
      console.warn('Could not save delivery area:', e);
    }
  }, [deliveryArea]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.productId}-${newItem.size}-${newItem.color}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        const newQty = Math.min(existing.quantity + newItem.quantity, newItem.maxStock || 99);
        return prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
      }
      return [...prev, { ...newItem, id }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const clamped = Math.min(quantity, i.maxStock || 99);
          return { ...i, quantity: clamped };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedVouchers([]);
  };

  // Only remove items that were actually ordered in this checkout
  const removeOrderedItems = (orderedItemIds: string[]) => {
    setItems((prev) => prev.filter((item) => !orderedItemIds.includes(item.id)));
    setAppliedVouchers([]);
  };

  // Voucher validation rule:
  // - Max 3 vouchers can be used in one order.
  // - ৳20–৳80 voucher: Maximum one use.
  // - ৳1–৳19 voucher: Maximum three uses.
  const applyVoucher = (voucher: Voucher): { success: boolean; message: string } => {
    if (appliedVouchers.some((v) => v.id === voucher.id)) {
      return { success: false, message: 'This voucher is already applied.' };
    }

    if (appliedVouchers.length >= 3) {
      return { success: false, message: 'Maximum 3 vouchers can be applied in one order.' };
    }

    const isHighValue = voucher.amount >= 20 && voucher.amount <= 80;
    const hasHighValueAlready = appliedVouchers.some((v) => v.amount >= 20 && v.amount <= 80);

    if (isHighValue && hasHighValueAlready) {
      return { success: false, message: 'Only one high-value voucher (৳20–৳80) can be used per order.' };
    }

    setAppliedVouchers((prev) => [...prev, voucher]);
    return { success: true, message: `৳${voucher.amount} voucher applied successfully!` };
  };

  const removeVoucher = (voucherId: string) => {
    setAppliedVouchers((prev) => prev.filter((v) => v.id !== voucherId));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deliveryCharge = deliveryArea === 'Moulvibazar' ? 50 : 150;

  const rawVoucherDiscount = appliedVouchers.reduce((sum, v) => sum + v.amount, 0);
  const voucherDiscount = Math.min(rawVoucherDiscount, subtotal);

  const grandTotal = Math.max(0, subtotal - voucherDiscount) + deliveryCharge;

  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        removeOrderedItems,
        subtotal,
        deliveryArea,
        setDeliveryArea,
        deliveryCharge,
        appliedVouchers,
        applyVoucher,
        removeVoucher,
        voucherDiscount,
        grandTotal,
        totalItemCount,
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
