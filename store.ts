import { create } from 'zustand';
import { Product, ViewState } from './types';

export interface Notification {
  id: string;
  message: string;
  type?: 'info' | 'success';
}

interface State {
  viewState: ViewState;
  activeProduct: Product | null;
  cart: Product[];
  isVaultOpen: boolean;
  
  // Checkout State
  checkoutState: 'idle' | 'active' | 'processing' | 'success';
  setCheckoutState: (state: 'idle' | 'active' | 'processing' | 'success') => void;

  // Auth State
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  
  // Notification State
  notifications: Notification[];
  addNotification: (message: string, type?: 'info' | 'success') => void;
  removeNotification: (id: string) => void;
  
  // Actions
  setViewState: (viewState: ViewState) => void;
  setActiveProduct: (product: Product | null) => void;
  addToVault: (product: Product) => void;
  removeFromVault: (productId: string) => void;
  toggleVault: (isOpen?: boolean) => void;
  
  // Auth Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  authenticate: () => void;
  logout: () => void;
}

export const useStore = create<State>((set) => ({
  viewState: ViewState.COLLECTION,
  activeProduct: null,
  cart: [],
  isVaultOpen: false,
  isAuthenticated: false,
  isAuthModalOpen: false,
  checkoutState: 'idle',
  notifications: [],

  setViewState: (viewState) => set({ viewState }),
  
  setActiveProduct: (product) => set({ 
    activeProduct: product, 
    viewState: product ? ViewState.PRODUCT : ViewState.COLLECTION 
  }),
  
  setCheckoutState: (state) => set({ checkoutState: state }),

  addToVault: (product) => set((state) => {
    // Prevent duplicates for this luxury demo
    if (state.cart.find(p => p.id === product.id)) {
        // Trigger "Already in Vault" notification logic here if needed
        return {};
    }
    const newNotification = { id: Date.now().toString(), message: `Secured in Vault: ${product.name}`, type: 'success' as const };
    return { 
      cart: [...state.cart, product], 
      isVaultOpen: true,
      notifications: [...state.notifications, newNotification]
    };
  }),
  
  removeFromVault: (id) => set((state) => ({ 
    cart: state.cart.filter(p => p.id !== id) 
  })),
  
  toggleVault: (isOpen) => set((state) => ({ 
    isVaultOpen: isOpen ?? !state.isVaultOpen 
  })),

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  authenticate: () => set({ isAuthenticated: true, isAuthModalOpen: false }),
  logout: () => set({ isAuthenticated: false }),

  addNotification: (message, type = 'info') => set((state) => ({
    notifications: [...state.notifications, { id: Date.now().toString(), message, type }]
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));