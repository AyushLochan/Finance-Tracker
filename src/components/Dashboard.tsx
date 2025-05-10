import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, TrendingUp } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { calculateBalance, calculateTotalByType, formatCurrency } from '../utils/helpers';
import { StatCard } from '../types/finance';

const Dashboard: React.FC = () => {
  const { transactions } = useFinance();
  
  const balance = calculateBalance(transactions);
  const totalIncome = calculateTotalByType(transactions, 'income');
  const totalExpenses = calculateTotalByType(transactions, 'expense');

  const savingsRate = totalIncome > 0 
    ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
    : 0;

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  
  const thisMonthTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });
  
  const thisMonthIncome = calculateTotalByType(thisMonthTransactions, 'income');
  const thisMonthExpenses = calculateTotalByType(thisMonthTransactions, 'expense');
  const thisMonthBalance = thisMonthIncome - thisMonthExpenses;
  
  const statCards: StatCard[] = [
    {
      title: 'Total Balance',
      value: formatCurrency(balance),
      icon: <Wallet size={24} />,
      color: balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
    },
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: <ArrowUpCircle size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: <ArrowDownCircle size={24} />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      icon: <TrendingUp size={24} />,
      color: savingsRate >= 20 ? 'text-emerald-600' : 'text-amber-600',
      bgColor: savingsRate >= 20 ? 'bg-emerald-50' : 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor} ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">This Month Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-sm text-gray-600">Income</p>
            <p className="text-xl font-bold text-blue-600 mt-1">
              {formatCurrency(thisMonthIncome)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-red-50">
            <p className="text-sm text-gray-600">Expenses</p>
            <p className="text-xl font-bold text-red-600 mt-1">
              {formatCurrency(thisMonthExpenses)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600">Net</p>
            <p className={`text-xl font-bold mt-1 ${
              thisMonthBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(thisMonthBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;