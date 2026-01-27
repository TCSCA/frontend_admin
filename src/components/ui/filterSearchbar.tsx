import React, { useState, useCallback } from "react";
import { Search, ChevronDown } from "lucide-react";

interface AvailableItem {
  id: number;
  name: string;
  key: string;
  label: string;
}

// Propiedades del componente de la barra de filtro.
interface FilterBarProps {
  /** Un array de objetos que definen las columnas disponibles para filtrar. */
  columns: AvailableItem[];

  onSearchClick: (filterValue: string) => void;
  /** Un retraso en milisegundos para aplicar el filtro de texto (debouncing). */
  debounceTime?: number;
}

const FilterSearchbar: React.FC<FilterBarProps> = ({
  columns,
  onSearchClick,
  debounceTime = 300,
}) => {

  const [filterValue, setFilterValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(columns[0]?.key || "");
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedCloseDate, setSelectedCloseDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectSecondDate, setSelectSecondDate] = useState(false);

  // Función para manejar el cambio en el selector de columna.
  const handleColumnChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newColumn = e.target.value;
      setSelectedColumn(newColumn);
      console.log("Column changed:", newColumn);
    },
    [filterValue]
  );

  // Función para manejar el cambio en el input de texto.
  const handleFilterValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      console.log("Filter value changed:", newValue);
      setFilterValue(newValue);
      onSearchClick(newValue); // Notify parent on input change
    },
    [onSearchClick, selectedColumn]
  );

  if (columns.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        No hay columnas definidas para el filtro.
      </div>
    );
  }

  return (
    <div className="w-1/2 bg-white flex flex-col sm:flex-row ml-4 gap-4 items-center">   

      {/* 2. Input de Búsqueda (Ahora usa el espacio restante) */}
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          maxLength={250}
          value={filterValue}
          onChange={handleFilterValueChange}
          className="h-10 pl-10 w-full border border-gray-300 rounded"
        />
      </div>

    </div>
  );
};

export default FilterSearchbar;
