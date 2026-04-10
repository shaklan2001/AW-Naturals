import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  benefit?: string;
  category?: string;
  description: string;
  price: number;
  image: string;
  /** Optional — key benefit pointers on product detail. */
  keyBenefitsPoints?: string[];
  ingredientsPoints?: string[];
  clinicalNote?: string | null;
  showClinicalNote?: boolean;
  /** When `upcoming`, storefront must not treat as purchasable. */
  status?: "active" | "upcoming";
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'aw-cart-items-v1';

function readCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== 'object') return false;
      const row = item as Partial<CartItem>;
      return (
        typeof row.id === 'string' &&
        typeof row.name === 'string' &&
        typeof row.price === 'number' &&
        typeof row.image === 'string' &&
        typeof row.quantity === 'number'
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readCartFromStorage());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    if (product.status === "upcoming") return;
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string) =>
    items.find((item) => item.id === productId)?.quantity ?? 0;

  const isInCart = (productId: string) => getItemQuantity(productId) > 0;

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        isInCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
