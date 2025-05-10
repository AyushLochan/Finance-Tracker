export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  parentId?: string;
  isSubcategory?: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  date: string;
  createdAt: string;
  tags?: string[];
  recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  attachments?: string[];
  notes?: string;
  location?: string;
  paymentMethod?: string;
}

export interface Budget {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate?: string;
  endDate?: string;
  rollover?: boolean;
  notifications?: boolean;
  warningThreshold?: number;
}

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  settings: FinanceSettings;
}

export interface FinanceSettings {
  currency: string;
  locale: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  categories: {
    showInactive: boolean;
    defaultView: 'list' | 'grid';
  };
  budgets: {
    rolloverDefault: boolean;
    warningThreshold: number;
  };
}

export interface CategoryTotal {
  categoryName: string;
  amount: number;
  color: string;
  percentage?: number;
  trend?: number;
}

export interface FilterOptions {
  type: TransactionType | 'all';
  categoryId: string;
  searchQuery: string;
  dateRange?: DateRange;
  tags?: string[];
  minAmount?: number;
  maxAmount?: number;
  paymentMethods?: string[];
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: number;
  subtext?: string;
}