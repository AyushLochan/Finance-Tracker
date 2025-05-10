import React, { useState } from 'react';
import { Trash2, Filter } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { TransactionType, FilterOptions } from '../types/finance';

const TransactionList: React.FC = () => {
  const { transactions, categories, deleteTransaction } = useFinance();
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    categoryId: '',
    searchQuery: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  if (!transactions.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  const handleDeleteTransaction = (id: string): void => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }

    if (filters.categoryId && transaction.categoryId !== filters.categoryId) {
      return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const description = transaction.description.toLowerCase();
      const category = categories.find((c) => c.id === transaction.categoryId)?.name.toLowerCase() || '';
      
      if (!description.includes(query) && !category.includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm"
        >
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as TransactionType | 'all' })}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => {
              const category = categories.find((c) => c.id === transaction.categoryId);
              
              return (
                <tr 
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${category?.color}20`, // 20% opacity
                        color: category?.color,
                      }}
                    >
                      {category?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className={`py-3 px-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredTransactions.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-gray-500">No matching transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;