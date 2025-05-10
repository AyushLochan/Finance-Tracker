import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { TransactionType } from '../types/finance';

const TransactionForm: React.FC = () => {
  const { categories, addTransaction } = useFinance();
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<TransactionType>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    
    if (!description) {
      setError('Please enter a description');
      return;
    }
    
    // Create transaction
    addTransaction({
      amount: parseFloat(amount),
      type,
      categoryId,
      description,
      date: new Date(date).toISOString(),
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    setError('');
    
    // Show success animation
    const form = document.getElementById('transaction-form');
    if (form) {
      form.classList.add('animate-success');
      setTimeout(() => {
        form.classList.remove('animate-success');
      }, 1000);
    }
  };
  
  // Filter categories based on transaction type
  const filteredCategories = categories.filter(category => {
    if (type === 'income') {
      return ['Salary', 'Investments', 'Gifts'].includes(category.name);
    }
    return !['Salary', 'Investments', 'Gifts'].includes(category.name);
  });

  return (
    <div className="bg-white rounded-lg shadow-md transition-all duration-300" id="transaction-form">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Transaction</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <div className="flex rounded-md overflow-hidden border border-gray-300">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    type === 'expense'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setType('expense')}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    type === 'income'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setType('income')}
                >
                  Income
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select a category</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle size={20} />
            <span>Add Transaction</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;