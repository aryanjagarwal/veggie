import { create } from 'zustand';
import type { Product, CartItem, User } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  lastAddedItem: Product | null;
  setLastAddedItem: (product: Product | null) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  lastAddedItem: null,
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      toast({ title: `${product.name} added to cart!`, description: `Quantity: ${quantity}` });
      return { items: newItems, lastAddedItem: product };
    });
  },
  removeItem: (productId) => {
    set((state) => {
      const itemToRemove = state.items.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast({ title: `${itemToRemove.product.name} removed from cart.` });
      }
      return {
        items: state.items.filter(item => item.product.id !== productId),
      };
    });
  },
  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item
        const itemToRemove = state.items.find(item => item.product.id === productId);
        if (itemToRemove) {
          toast({ title: `${itemToRemove.product.name} removed from cart.` });
        }
        return {
           items: state.items.filter(item => item.product.id !== productId),
        };
      }
      const itemToUpdate = state.items.find(item => item.product.id === productId);
      if (itemToUpdate) {
         toast({ title: `Updated ${itemToUpdate.product.name} quantity.`, description: `New quantity: ${quantity}` });
      }
      return {
        items: state.items.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    });
  },
  clearCart: () => {
    set({ items: [], lastAddedItem: null });
    toast({ title: "Cart cleared." });
  },
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
  setLastAddedItem: (product) => set({ lastAddedItem: product }),
}));

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  signup: (userData: User) => void; // Simplified signup
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => {
    set({ user: userData, isAuthenticated: true });
    toast({ title: `Welcome back, ${userData.name || userData.email}!`});
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    toast({ title: "You have been logged out."});
  },
  signup: (userData) => {
    // In a real app, this would involve an API call
    set({ user: userData, isAuthenticated: true });
    toast({ title: `Account created for ${userData.email}! Welcome!`});
  }
}));
