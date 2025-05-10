import React from 'react';
import { CircleDollarSign } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { calculateTotalByType, formatCurrency } from '../utils/helpers';

const BudgetManager: React.FC = () => {
  const { categories, budgets, setBudget, transactions } = useFinance();

  const expenseCategories = categories.filter(category => 
    !['Salary', 'Investments', 'Gifts'].includes(category.name)
  );
  
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  const thisMonthTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getMonth() === thisMonth && 
           date.getFullYear() === thisYear &&
           transaction.type === 'expense';
  });
  
  // Calculate current spending for each category
  const categorySpending = expenseCategories.map(category => {
    const spending = thisMonthTransactions
      .filter(t => t.categoryId === category.id)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const budget = budgets.find(b => b.categoryId === category.id)?.amount || 0;
    
    return {
      category,
      spending,
      budget,
      percentage: budget > 0 ? (spending / budget) * 100 : 0,
    };
  });

  const handleBudgetChange = (categoryId: string, value: string) => {
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= 0) {
      setBudget(categoryId, amount);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Budgets</h2>
      
      <div className="space-y-6">
        {categorySpending.map(({ category, spending, budget, percentage }) => (
          <div key={category.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full block"
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="text-gray-800 font-medium">{category.name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">
                  {formatCurrency(spending)} of {formatCurrency(budget || 0)}
                </span>
                
                <div className="relative w-20">
                  <CircleDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={budget || ''}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    className="pl-10 pr-2 py-1 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  percentage > 100 
                    ? 'bg-red-600' 
                    : percentage > 75 
                      ? 'bg-amber-500' 
                      : 'bg-green-600'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        {categorySpending.length === 0 && (
          <p className="text-gray-500 text-center py-4">No expense categories yet.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;