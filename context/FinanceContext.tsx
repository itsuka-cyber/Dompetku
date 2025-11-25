import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, Category, Transaction, Goal } from '../types';
import { 
  Home, ShoppingCart, Coffee, Utensils, Car, Zap, HeartPulse, Gamepad2, 
  Gift, Briefcase, GraduationCap, Smartphone, Plane, Wrench, Shirt, Music, 
  Book, Landmark, Smile, Circle, HelpCircle, Check
} from 'lucide-react';

// --- Icon Mapping ---

export const iconMap: Record<string, React.ElementType> = {
  Home, ShoppingCart, Coffee, Utensils, Car, Zap, HeartPulse, Gamepad2,
  Gift, Briefcase, GraduationCap, Smartphone, Plane, Wrench, Shirt, Music,
  Book, Landmark, Smile, Circle, Check
};

export const getCategoryIcon = (name: string): React.ElementType => {
  return iconMap[name] || HelpCircle;
};

// --- Initial Data ---

const defaultCategories: Category[] = [
  { id: 'cat_1', name: 'Makan & Minum', icon: 'Utensils', color: '#ef4444', type: 'expense' },
  { id: 'cat_2', name: 'Transportasi', icon: 'Car', color: '#3b82f6', type: 'expense' },
  { id: 'cat_3', name: 'Belanja', icon: 'ShoppingCart', color: '#f59e0b', type: 'expense' },
  { id: 'cat_4', name: 'Hiburan', icon: 'Gamepad2', color: '#8b5cf6', type: 'expense' },
  { id: 'cat_5', name: 'Tagihan', icon: 'Zap', color: '#eab308', type: 'expense' },
  { id: 'cat_6', name: 'Kesehatan', icon: 'HeartPulse', color: '#ec4899', type: 'expense' },
  { id: 'cat_7', name: 'Gaji', icon: 'Home', color: '#10b981', type: 'income' },
  { id: 'cat_8', name: 'Investasi', icon: 'Coffee', color: '#6366f1', type: 'income' },
];

const initialState: AppState = {
  balance: 0,
  savings: 0,
  transactions: [],
  categories: defaultCategories,
  goals: [],
  budget: { limit: 300000, enabled: true },
  isOnboarded: false,
  darkMode: false,
  userName: '',
};

// --- Reducer ---

const financeReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const t = action.payload;
      let newBalance = state.balance;
      let newSavings = state.savings;

      if (t.type === 'income') newBalance += t.amount;
      else if (t.type === 'expense') newBalance -= t.amount;

      return {
        ...state,
        balance: newBalance,
        savings: newSavings,
        transactions: [t, ...state.transactions],
      };
    }
    case 'DELETE_TRANSACTION': {
      const t = state.transactions.find(tx => tx.id === action.payload);
      if (!t) return state;

      let newBalance = state.balance;
      if (t.type === 'income') newBalance -= t.amount;
      else if (t.type === 'expense') newBalance += t.amount;

      return {
        ...state,
        balance: newBalance,
        transactions: state.transactions.filter(tx => tx.id !== action.payload),
      };
    }
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => (g.id === action.payload.id ? action.payload : g)),
      };
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
    case 'SET_ONBOARDING':
      return { ...state, isOnboarded: action.payload.done, userName: action.payload.name };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'RESTORE_DATA':
      return action.payload;
    case 'TRANSFER_TO_SAVINGS': {
        const amount = action.payload;
        return {
            ...state,
            balance: state.balance - amount,
            savings: state.savings + amount
        }
    }
    case 'SET_BUDGET':
        return { ...state, budget: action.payload };
    case 'ADD_CATEGORY':
        return { ...state, categories: [...state.categories, action.payload] };
    default:
      return state;
  }
};

// --- Context ---

interface FinanceContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  formatRupiah: (amount: number) => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'dompetku_offline_data_v1';

export const FinanceProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize from localStorage if available
  const init = (_?: any): AppState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return initialState;
  };

  // Pass undefined as second argument so init is called with undefined
  const [state, dispatch] = useReducer(financeReducer, undefined, init);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <FinanceContext.Provider value={{ state, dispatch, formatRupiah }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};