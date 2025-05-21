
import { create } from 'zustand';
import type { Product, CartItem } from '@/lib/types';
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

// Note: useAuthStore has been removed as Clerk will handle authentication.
// Wishlist and Address management would typically be handled by your own backend
// when using Clerk, linking data to the Clerk user ID.
