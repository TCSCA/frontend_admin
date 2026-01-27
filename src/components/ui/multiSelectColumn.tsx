"use client";
import { useRef, useCallback, useEffect } from "react";

interface Item {
  id: number;
  name: string;
  key: string;
  label: string;
}

interface MultiSelectProps {
  items: Item[];
  defaultItems: Item[];
  selectedItems: Item[];
  onSelectionChange: (selectedItems: Item[]) => void;
  onClose?: () => void;
  minSelectedItems?: number;
}

const MultiSelectColumn = ({
  items,
  onSelectionChange,
  defaultItems,
  selectedItems,
  onClose,
  minSelectedItems = 3,
}: MultiSelectProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const button = document.getElementById('column-toggle-button');
    if (button?.contains(event.target as Node)) {
      return;
    }
    
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      onClose?.();
    }
  }, [onClose]);

  useEffect(() => {
    if (!onClose) return;
    
    document.addEventListener('click', handleClickOutside, true);
    return () => document.removeEventListener('click', handleClickOutside, true);
  }, [handleClickOutside, onClose]);

  const handleItemClick = (item: Item) => {
    const isSelected = selectedItems.some((selected: Item) => selected.id === item.id);
    let newSelection: Item[];
    
    if (isSelected) {
      if (selectedItems.length > minSelectedItems) {
        newSelection = selectedItems.filter((selected: Item) => selected.id !== item.id);
      } else {
        return;
      }
    } else {
      newSelection = [...selectedItems, item];
    }
    
    onSelectionChange(newSelection);
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-10 p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Seleccionar Columnas</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Cerrar"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items
          .filter((item) => item.key !== 'action')
          .map((item) => {
            const isSelected = selectedItems.some((s) => s.id === item.id);
            const isDisabled = isSelected && selectedItems.length <= minSelectedItems;
            
            return (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`column-${item.id}`}
                  checked={isSelected}
                  onChange={() => !isDisabled && handleItemClick(item)}
                  disabled={isDisabled}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  title={isDisabled ? `Debe haber al menos ${minSelectedItems + 1} columnas seleccionadas` : ''}
                />
                <label 
                  htmlFor={`column-${item.id}`} 
                  className={`text-sm ${isDisabled ? 'opacity-50' : 'cursor-pointer'}`}
                >
                  {item.name}
                </label>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default MultiSelectColumn;
