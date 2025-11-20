export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  type: TransactionType;
  date: string; // ISO String
  note: string;
  imageUrl?: string; // Base64 string for offline storage
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string; // ISO String
  color: string;
}

export interface Budget {
  limit: number;
  enabled: boolean;
}

export interface AppState {
  balance: number;
  savings: number;
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  budget: Budget;
  isOnboarded: boolean;
  darkMode: boolean;
  userName: string;
}

export type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_ONBOARDING'; payload: { done: boolean; name: string } }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'RESTORE_DATA'; payload: AppState }
  | { type: 'TRANSFER_TO_SAVINGS'; payload: number } // Positive to savings, negative from savings
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'ADD_CATEGORY'; payload: Category };
