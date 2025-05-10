import React, { useState } from 'react';
import { PieChart, BarChart3, LayoutDashboard, List, Settings } from 'lucide-react';
import { FinanceProvider } from './contexts/FinanceContext';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExpenseChart from './components/ExpenseChart';
import CategoryManager from './components/CategoryManager';
import BudgetManager from './components/BudgetManager';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'categories'>('dashboard');

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <PieChart className="text-blue-600" />
                Finance Tracker
              </h1>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main content area */}
            <div className="md:flex-1 space-y-8">
              {/* Navigation tabs */}
              <div className="bg-white rounded-lg shadow-md p-1 flex">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span className="font-medium">Dashboard</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                    activeTab === 'transactions'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <List size={18} />
                  <span className="font-medium">Transactions</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('budgets')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                    activeTab === 'budgets'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 size={18} />
                  <span className="font-medium">Budgets</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                    activeTab === 'categories'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Settings size={18} />
                  <span className="font-medium">Categories</span>
                </button>
              </div>
              
              {/* Active content */}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'transactions' && <TransactionList />}
              {activeTab === 'budgets' && <BudgetManager />}
              {activeTab === 'categories' && <CategoryManager />}
            </div>
            
            {/* Sidebar */}
            <div className="md:w-80 space-y-8">
              <TransactionForm />
              
              {activeTab === 'dashboard' && <ExpenseChart />}
            </div>
          </div>
        </main>
        
        <footer className="bg-white border-t border-gray-200 py-4 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              Personal Finance Tracker &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </FinanceProvider>
  );
}

export default App;