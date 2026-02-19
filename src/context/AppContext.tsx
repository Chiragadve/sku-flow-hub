import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { AppState, AppAction, Toast } from '@/types';
import { LOCATIONS, PRODUCTS, INVENTORY, ORDERS, CURRENT_USER } from '@/data/mockData';

const initialState: AppState = {
  inventory: INVENTORY,
  orders: ORDERS,
  products: PRODUCTS,
  locations: LOCATIONS,
  isAuthenticated: false,
  currentUser: CURRENT_USER,
  toasts: [],
  settings: {
    notifications: { lowStock: true, orderConfirmations: true, dailySummary: false, aiActions: true },
    defaultThreshold: 20,
    accentColor: 'amber',
    density: 'comfortable',
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'UPDATE_INVENTORY':
      return {
        ...state,
        inventory: state.inventory.map((item) =>
          item.productId === action.productId && item.locationId === action.locationId
            ? { ...item, quantity: action.quantity, lastUpdated: new Date() }
            : item
        ),
      };
    case 'ADD_INVENTORY':
      return { ...state, inventory: [...state.inventory, action.item] };
    case 'CREATE_ORDER':
      return { ...state, orders: [action.order, ...state.orders] };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.product] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.product.id ? action.product : p)),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.productId),
        inventory: state.inventory.filter((i) => i.productId !== action.productId),
      };
    case 'ADD_LOCATION':
      return { ...state, locations: [...state.locations, action.location] };
    case 'UPDATE_LOCATION':
      return {
        ...state,
        locations: state.locations.map((l) => (l.id === action.location.id ? action.location : l)),
      };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addToast: (type: Toast['type'], message: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToast = useCallback(
    (type: Toast['type'], message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      dispatch({ type: 'ADD_TOAST', toast: { id, type, message } });
      setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3000);
    },
    [dispatch]
  );

  const value = useMemo(() => ({ state, dispatch, addToast }), [state, dispatch, addToast]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function useDerivedData() {
  const { state } = useApp();

  return useMemo(() => {
    const lowStockItems = state.inventory.filter((i) => i.quantity <= i.threshold);
    const totalStock = state.inventory.reduce((sum, i) => sum + i.quantity, 0);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todaysOrders = state.orders.filter((o) => o.timestamp >= todayStart);

    return {
      lowStockItems,
      totalStock,
      todaysOrders,
      totalSKUs: state.products.length,
      lowStockCount: lowStockItems.length,
      todaysOrderCount: todaysOrders.length,
      salesToday: todaysOrders.filter((o) => o.type === 'sale').length,
      restocksToday: todaysOrders.filter((o) => o.type === 'restock').length,
    };
  }, [state.inventory, state.orders, state.products]);
}
