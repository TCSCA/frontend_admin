// components/MultiSelectDropdown.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
// Importamos los iconos necesarios de Lucide React
import { ChevronDown } from "lucide-react";
// No necesitamos 'Check' de Lucide, usaremos un input checkbox.

// Definición de tipos

interface MultiSelectProps {
  options: any[];
  label: string;
  onChange: (selected: any[]) => void;
  initialSelected?: any[];
}

/**
 * Componente de selección múltiple con Checkbox en cada opción.
 */
export function MultiSelectDropdown({
  options,
  label,
  onChange,
  initialSelected = [],
}: MultiSelectProps) {
  const initialSelection = options.filter((option) => option.isSelected);
  const optionInitial = options;
  console.log("Initial Selection:", initialSelection);
  const [selectedOptions, setSelectedOptions] =
    useState<any[]>(initialSelection);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Obtenemos el nuevo estado inicial basado en la prop 'options' actual.
    const newSelection = getInitialSelection();

    // 2. Comparamos los IDs para ver si el conjunto de opciones seleccionadas ha cambiado.
    // Esto es más robusto que comparar objetos o arrays directamente.
    const currentIds = selectedOptions
      .map((o) => o.id)
      .sort()
      .join(",");
    const newIds = newSelection
      .map((o) => o.id)
      .sort()
      .join(",");

    if (currentIds !== newIds) {
      // 3. Si hay cambios en los IDs seleccionados, forzamos la actualización del estado.
      setSelectedOptions(newSelection);

      // 4. Notificamos al componente padre sobre el nuevo estado (el "limpiado").
      // Esto es opcional, pero ayuda a mantener la consistencia en el padre.
      onChange(newSelection);
    }
    // 👇 Dependencia CLAVE: Ejecuta el efecto cada vez que la referencia del array 'options' cambie.
    // Esto ocurre cuando se re-renderiza con un nuevo array de props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const getInitialSelection = useCallback(() => {
    return options.filter((option) => option.isSelected);
  }, [options]);

  // 1. Manejar la selección y deselección de opciones
  const toggleOption = (option: any) => {
    const isSelected = selectedOptions.some((item) => item.id === option.id);
    let newSelection: any[];

    if (isSelected) {
      // Si ya está seleccionado, lo eliminamos
      newSelection = selectedOptions.filter((item) => item.id !== option.id);
    } else {
      // Si no está seleccionado, lo agregamos
      newSelection = [...selectedOptions, option];
    }

    setSelectedOptions(newSelection);

    // Comparar con la lista inicial y retornar los cambios
    const changedOptions = optionInitial.filter((initialOption) => {
      const currentlySelected = newSelection.some(
        (item) => item.id === initialOption.id
      );
      return initialOption.isSelected !== currentlySelected;
    });

    console.log("Changed Options:", changedOptions);

    onChange(changedOptions);
  };

  // 2. Manejar clics fuera del componente para cerrar el menú
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // 3. Renderizar el texto del botón
  const renderButtonText = () => {
    if (selectedOptions.length === 0) {
      return `Seleccionar ${label.toLowerCase()}`;
    }
    const maxDisplay = 2;
    const displayedNames = selectedOptions
      .slice(0, maxDisplay)
      .map((o) => o.name)
      .join(", ");

    if (selectedOptions.length > maxDisplay) {
      return `${displayedNames} y ${selectedOptions.length - maxDisplay} más`;
    }
    return displayedNames;
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Botón Principal (Toggle) */}
      <button
        type="button"
        className="custom-select flex justify-between items-center w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-4 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-lightblue sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate">{renderButtonText()}</span>
      </button>

      {/* Menú Desplegable (Condicional) */}
      {isOpen && (
        <ul
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((option) => {
            const isSelected = selectedOptions.some(
              (item) => item.id === option.id
            );

            return (
              <li
                key={option.id}
                // Usamos un padding estándar y Flexbox para alinear el checkbox y el texto
                className={`flex items-center cursor-default select-none py-2 px-3 ${
                  isSelected
                    ? "bg-indigo-100 text-indigo-900"
                    : "text-gray-900 hover:bg-gray-100"
                }`}
                // El clic en el <li> completo activa la selección
                onClick={() => toggleOption(option)}
                role="option"
                aria-selected={isSelected}
              >
                {/* 👈 NUEVO: Checkbox visible */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly // Para que el clic en el <li> maneje el estado
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-lightblue mr-3 pointer-events-none"
                  // 'pointer-events-none' evita problemas de doble clic
                />

                {/* Nombre de la Opción */}
                <span
                  className={`block truncate ${
                    isSelected ? "font-semibold" : "font-normal"
                  }`}
                >
                  {option.name}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
