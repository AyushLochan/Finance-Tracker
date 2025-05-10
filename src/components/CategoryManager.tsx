import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { Category } from '../types/finance';
import { categoryColors } from '../utils/colors';

const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingCategory({ ...category });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSaveEdit = () => {
    if (editingCategory && editingCategory.name.trim()) {
      updateCategory(editingCategory);
      setEditingCategory(null);
    }
  };

  const handleChangeColor = (color: string) => {
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, color });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? All associated transactions will remain but will show "Unknown" for category.')) {
      deleteCategory(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Categories</h2>
      
      <form onSubmit={handleAddCategory} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-1 transition-colors"
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </form>
      
      <div className="divide-y divide-gray-200">
        {categories.map((category) => (
          <div key={category.id} className="py-3 flex items-center justify-between">
            {editingCategory && editingCategory.id === category.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChangeColor(color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        editingCategory.color === color ? 'border-gray-800' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    ></button>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full block"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span className="text-gray-800">{category.name}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEdit(category)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      {categories.length === 0 && (
        <p className="text-gray-500 text-center py-4">No categories yet. Add one to get started!</p>
      )}
    </div>
  );
};

export default CategoryManager;