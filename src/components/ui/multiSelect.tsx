// components/MultiSelect.tsx

import { useState } from "react";
import { X } from "lucide-react";

// Define el tipo para cada item del array
interface Item {
  id: number;
  name: string;
  key: string;
  label: string;
}

// Define el tipo para las props del componente MultiSelect
interface MultiSelectProps {
  items: Item[];
  initialItems: Item[];
  onSelectionChange: (selectedItems: Item[]) => void;
  onClose?: () => void;
}

const MultiSelect = ({
  items,
  onSelectionChange,
  initialItems,
  onClose,
}: MultiSelectProps) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>(initialItems);
  const [close, setClose] = useState(true);

  const handleItemClick = (item: Item) => {
    const isSelected = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    );

    let newSelection: Item[];
    if (isSelected) {
      // Remove item if already selected
      newSelection = selectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      );
    } else {
      // Add item if not selected
      newSelection = [...selectedItems, item];
    }

    setSelectedItems(newSelection);
    onSelectionChange(newSelection); // Notifica al componente padre del cambio
  };

  return (
    <div
      className={`multi-select-container ${
        close ? "animate-fade-in" : "animate-fade-out"
      }`}
    >
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => {
          setClose(false);
          onClose && onClose();
        }} // Notifica al padre que se cerró
      >
        <X></X>
      </button>
      {items.map((item) => (
        <div
          key={item.id}
          className={`multi-select-item ${
            selectedItems.some((s) => s.id === item.id) ? "selected" : ""
          }`}
          onClick={() => handleItemClick(item)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default MultiSelect;
