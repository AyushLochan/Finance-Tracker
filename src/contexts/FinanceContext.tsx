import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  FinanceState, 
  Transaction, 
  Category, 
  Budget,
  TransactionType 
} from '../types/finance';
import { generateId, getDefaultCategories } from '../utils/helpers';
import { getRandomColor } from '../utils/colors';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  updateCategory: (category: Category) => void;
  setBudget: (categoryId: string, amount: number) => void;
  resetData: () => void;
}

const initialState: FinanceState = {
  transactions: [],
  categories: getDefaultCategories(),
  budgets: [],
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useLocalStorage<FinanceState>('finance-tracker-data', initialState);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setState((prevState) => ({
      ...prevState,
      transactions: [newTransaction, ...prevState.transactions],
    }));
  };

  const deleteTransaction = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      transactions: prevState.transactions.filter((t) => t.id !== id),
    }));
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: generateId(),
      name,
      color: getRandomColor(),
    };

    setState((prevState) => ({
      ...prevState,
      categories: [...prevState.categories, newCategory],
    }));
  };

  const deleteCategory = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      categories: prevState.categories.filter((c) => c.id !== id),
      // Remove budgets for this category
      budgets: prevState.budgets.filter((b) => b.categoryId !== id),
    }));
  };

  const updateCategory = (category: Category) => {
    setState((prevState) => ({
      ...prevState,
      categories: prevState.categories.map((c) => 
        c.id === category.id ? category : c
      ),
    }));
  };

  const setBudget = (categoryId: string, amount: number) => {
    setState((prevState) => {
      const existingBudgetIndex = prevState.budgets.findIndex(
        (b) => b.categoryId === categoryId
      );

      let newBudgets = [...prevState.budgets];

      if (existingBudgetIndex >= 0) {
        // Update existing budget
        newBudgets[existingBudgetIndex] = { categoryId, amount };
      } else {
        // Add new budget
        newBudgets = [...newBudgets, { categoryId, amount }];
      }

      return {
        ...prevState,
        budgets: newBudgets,
      };
    });
  };

  const resetData = () => {
    setState(initialState);
  };

  return (
    <FinanceContext.Provider
      value={{
        ...state,
        addTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        updateCategory,
        setBudget,
        resetData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};