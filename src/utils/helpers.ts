import { Transaction, TransactionType, Category, CategoryTotal, DateRange } from '../types/finance';
import { format, isWithinInterval, startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy');
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    const amount = transaction.amount;
    return transaction.type === 'income'
      ? total + amount
      : total - amount;
  }, 0);
};

export const calculateTotalByType = (
  transactions: Transaction[],
  type: TransactionType,
  dateRange?: DateRange
): number => {
  let filteredTransactions = transactions.filter((t) => t.type === type);

  if (dateRange) {
    filteredTransactions = filteredTransactions.filter((t) =>
      isWithinInterval(new Date(t.date), {
        start: new Date(dateRange.startDate),
        end: new Date(dateRange.endDate),
      })
    );
  }

  return filteredTransactions.reduce((total, t) => total + t.amount, 0);
};

export const getTotalsByCategory = (
  transactions: Transaction[],
  categories: Category[],
  type: TransactionType = 'expense',
  dateRange?: DateRange
): CategoryTotal[] => {
  let filteredTransactions = transactions.filter((t) => t.type === type);

  if (dateRange) {
    filteredTransactions = filteredTransactions.filter((t) =>
      isWithinInterval(new Date(t.date), {
        start: new Date(dateRange.startDate),
        end: new Date(dateRange.endDate),
      })
    );
  }

  const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = categories.map((category) => {
    const amount = filteredTransactions
      .filter((t) => t.categoryId === category.id)
      .reduce((sum, t) => sum + t.amount, 0);

    const prevMonthStart = startOfMonth(subMonths(new Date(), 1));
    const prevMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const prevAmount = transactions
      .filter((t) =>
        t.type === type &&
        t.categoryId === category.id &&
        isWithinInterval(new Date(t.date), {
          start: prevMonthStart,
          end: prevMonthEnd,
        })
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const trend = prevAmount > 0 ? ((amount - prevAmount) / prevAmount) * 100 : 0;

    return {
      categoryName: category.name,
      amount,
      color: category.color,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      trend,
    };
  });

  return categoryTotals.filter((category) => category.amount > 0);
};

export const getDefaultCategories = (): Category[] => {
  return [
    {
      id: generateId(),
      name: 'Food & Dining',
      color: '#3B82F6',
      description: 'Restaurants, groceries, and food delivery'
    },
    {
      id: generateId(),
      name: 'Transportation',
      color: '#10B981',
      description: 'Public transport, fuel, and vehicle maintenance'
    },
    {
      id: generateId(),
      name: 'Entertainment',
      color: '#F59E0B',
      description: 'Movies, events, and recreational activities'
    },
    {
      id: generateId(),
      name: 'Housing',
      color: '#EF4444',
      description: 'Rent, mortgage, and home maintenance'
    },
    {
      id: generateId(),
      name: 'Utilities',
      color: '#8B5CF6',
      description: 'Electricity, water, and internet bills'
    },
    {
      id: generateId(),
      name: 'Healthcare',
      color: '#EC4899',
      description: 'Medical expenses and insurance'
    },
    {
      id: generateId(),
      name: 'Shopping',
      color: '#06B6D4',
      description: 'Clothing, electronics, and personal items'
    },
    {
      id: generateId(),
      name: 'Education',
      color: '#F97316',
      description: 'Tuition, books, and courses'
    },
    {
      id: generateId(),
      name: 'Investments',
      color: '#10B981',
      description: 'Stocks, mutual funds, and savings'
    },
    {
      id: generateId(),
      name: 'Salary',
      color: '#3B82F6',
      description: 'Regular income from employment'
    },
    {
      id: generateId(),
      name: 'Freelance',
      color: '#8B5CF6',
      description: 'Income from freelance work'
    },
    {
      id: generateId(),
      name: 'Gifts',
      color: '#F59E0B',
      description: 'Received gifts and bonuses'
    },
  ];
};

export const calculateTrends = (
  transactions: Transaction[],
  months: number = 3
): { labels: string[]; data: number[] } => {
  const labels: string[] = [];
  const data: number[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const start = startOfMonth(subMonths(new Date(), i));
    const end = endOfMonth(subMonths(new Date(), i));

    const monthlyExpenses = transactions
      .filter((t) =>
        t.type === 'expense' &&
        isWithinInterval(new Date(t.date), { start, end })
      )
      .reduce((sum, t) => sum + t.amount, 0);

    labels.push(format(start, 'MMM yyyy'));
    data.push(monthlyExpenses);
  }

  return { labels, data };
};