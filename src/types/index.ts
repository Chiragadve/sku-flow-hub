export interface Location {
  id: string;
  name: string;
  type: 'warehouse' | 'store' | 'online';
  city: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
}

export interface InventoryItem {
  productId: string;
  locationId: string;
  quantity: number;
  threshold: number;
  lastUpdated: Date;
}

export interface Order {
  id: string;
  productId: string;
  locationId: string;
  type: 'sale' | 'restock' | 'transfer';
  quantity: number;
  source: 'manual' | 'ai';
  note: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AppState {
  inventory: InventoryItem[];
  orders: Order[];
  products: Product[];
  locations: Location[];
  isAuthenticated: boolean;
  currentUser: User;
  toasts: Toast[];
  settings: {
    notifications: {
      lowStock: boolean;
      orderConfirmations: boolean;
      dailySummary: boolean;
      aiActions: boolean;
    };
    defaultThreshold: number;
    accentColor: string;
    density: 'comfortable' | 'compact';
  };
}

export type AppAction =
  | { type: 'UPDATE_INVENTORY'; productId: string; locationId: string; quantity: number }
  | { type: 'ADD_INVENTORY'; item: InventoryItem }
  | { type: 'CREATE_ORDER'; order: Order }
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; product: Product }
  | { type: 'DELETE_PRODUCT'; productId: string }
  | { type: 'ADD_LOCATION'; location: Location }
  | { type: 'UPDATE_LOCATION'; location: Location }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<AppState['settings']> };
