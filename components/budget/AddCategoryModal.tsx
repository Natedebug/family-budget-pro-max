import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useAppContext } from '../../hooks/useAppContext';
import { COLOR_PALETTES, ICON_CATEGORIES } from '../../constants';
import { ColorPalette, BudgetCategory } from '../../types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: BudgetCategory | null;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, categoryToEdit }) => {
  const { addCategory, updateCategory, categoryGroups } = useAppContext();
  const isEditMode = !!categoryToEdit;

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState<ColorPalette | null>(null);
  const [allocated, setAllocated] = useState('');
  const [groupId, setGroupId] = useState('');
  const [selectedIconCategory, setSelectedIconCategory] = useState(ICON_CATEGORIES[0].name);

  useEffect(() => {
    if (isEditMode && categoryToEdit) {
      setName(categoryToEdit.name);
      setIcon(categoryToEdit.icon);
      setAllocated(String(categoryToEdit.allocated));
      const currentColor = COLOR_PALETTES.find(p => p.gradient === categoryToEdit.gradient) || COLOR_PALETTES[0];
      setSelectedColor(currentColor);
      const categoryOfIcon = ICON_CATEGORIES.find(c => c.icons.includes(categoryToEdit.icon));
      setSelectedIconCategory(categoryOfIcon ? categoryOfIcon.name : ICON_CATEGORIES[0].name);
      setGroupId(''); // Not editable for now
    } else {
      // Reset for create mode
      setName('');
      setIcon('🛒');
      setAllocated('');
      setGroupId('');
      setSelectedColor(COLOR_PALETTES[0]);
      setSelectedIconCategory(ICON_CATEGORIES[0].name);
    }
  }, [categoryToEdit, isEditMode, isOpen]);


  const handleSubmit = () => {
    if (!name || !icon || !selectedColor) {
      alert('Please fill out all fields and select a color.');
      return;
    }
    
    const allocatedAmount = parseFloat(allocated);
    if (allocated !== '' && (isNaN(allocatedAmount) || allocatedAmount < 0)) {
        alert('Please enter a valid, non-negative number for the budget.');
        return;
    }
    
    if(isEditMode && categoryToEdit) {
      updateCategory(categoryToEdit.id, name, icon, selectedColor, allocatedAmount);
    } else {
      addCategory(name, icon, selectedColor, groupId || undefined);
    }

    onClose();
  };
  
  const commonInputClasses = "w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Category" : "Create New Category"}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Category Name</label>
          <input 
            type="text"
            placeholder="e.g. Hobbies"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={commonInputClasses}
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                    {icon}
                </div>
                <div className="w-full bg-slate-900/50 p-2 rounded-lg">
                    <div className="flex flex-wrap gap-1 mb-2 text-xs">
                        {ICON_CATEGORIES.map(category => (
                            <button
                                key={category.name}
                                onClick={() => setSelectedIconCategory(category.name)}
                                className={`px-2 py-1 font-semibold rounded-md transition-colors ${
                                    selectedIconCategory === category.name
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 max-h-28 overflow-y-auto">
                        {ICON_CATEGORIES.find(cat => cat.name === selectedIconCategory)?.icons.map(ico => (
                            <button
                                key={ico}
                                onClick={() => setIcon(ico)}
                                className={`flex items-center justify-center text-2xl w-9 h-9 rounded-lg transition-all ${
                                    icon === ico
                                        ? 'bg-purple-600 ring-2 ring-purple-400'
                                        : 'bg-slate-700 hover:bg-slate-600'
                                }`}
                            >
                                {ico}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Budgeted Amount</label>
            <input
                type="number"
                placeholder="0.00"
                value={allocated}
                onChange={(e) => setAllocated(e.target.value)}
                className={commonInputClasses}
                disabled={!isEditMode}
                title={isEditMode ? "Set budget amount" : "Budget can be set after creation"}
            />
        </div>
        
        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Group In</label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className={commonInputClasses}
            >
              <option value="">None (Other Category)</option>
              {categoryGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
          <div className="grid grid-cols-5 gap-3">
            {COLOR_PALETTES.map(palette => (
              <button
                key={palette.name}
                onClick={() => setSelectedColor(palette)}
                className={`w-full h-10 rounded-lg bg-gradient-to-br ${palette.gradient} ${selectedColor?.name === palette.name ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                aria-label={`Select ${palette.name} color`}
              />
            ))}
          </div>
        </div>
        <div className="pt-4">
            <Button onClick={handleSubmit} className="w-full">
                {isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;