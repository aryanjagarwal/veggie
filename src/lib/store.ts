
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
  signup: (userData: User) => void;
  updateUserProfile: (updatedData: Partial<User>) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => {
    set({ user: { ...userData, wishlist: userData.wishlist || [] }, isAuthenticated: true });
    toast({ title: `Welcome back, ${userData.name || userData.email}!`});
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    toast({ title: "You have been logged out."});
  },
  signup: (userData) => {
    set({ user: { ...userData, wishlist: userData.wishlist || [] }, isAuthenticated: true });
    toast({ title: `Account created for ${userData.email}! Welcome!`});
  },
  updateUserProfile: (updatedData: Partial<User>) => {
    set((state) => {
      if (!state.user) return {};
      const newUser = { ...state.user, ...updatedData };
      let detailChanged = false;
      if (updatedData.name !== undefined && updatedData.name !== state.user.name) detailChanged = true;
      if (detailChanged) {
        toast({ title: "Profile updated successfully!" });
      }
      return { user: newUser };
    });
  },
  addToWishlist: (productId: string) => {
    set((state) => {
      if (!state.isAuthenticated || !state.user) {
        // This should ideally be handled by UI first
        return {}; 
      }
      const currentWishlist = state.user.wishlist || [];
      if (currentWishlist.includes(productId)) {
        return {}; // Already in wishlist
      }
      const updatedWishlist = [...currentWishlist, productId];
      return { user: { ...state.user, wishlist: updatedWishlist } };
    });
  },
  removeFromWishlist: (productId: string) => {
    set((state) => {
      if (!state.isAuthenticated || !state.user || !state.user.wishlist) {
        return {};
      }
      const updatedWishlist = state.user.wishlist.filter(id => id !== productId);
      return { user: { ...state.user, wishlist: updatedWishlist } };
    });
  },
}));
