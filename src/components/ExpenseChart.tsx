import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFinance } from '../contexts/FinanceContext';
import { getTotalsByCategory } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart: React.FC = () => {
  const { transactions, categories } = useFinance();
  
  const categoryData = getTotalsByCategory(transactions, categories);
  
  if (categoryData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No expense data to display yet.</p>
      </div>
    );
  }
  
  const data = {
    labels: categoryData.map((item) => item.categoryName),
    datasets: [
      {
        data: categoryData.map((item) => item.amount),
        backgroundColor: categoryData.map((item) => item.color),
        borderColor: categoryData.map((item) => item.color),
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ₹${value.toFixed(2)}`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Expense Breakdown</h2>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default ExpenseChart;