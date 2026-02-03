import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

/**
 * Interfaces para las propiedades del componente
 */
interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  total: number;
  itemsPerPage: number;
  handleItemsPerPageChange: (num: number) => void;
}

interface PaginationButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

/**
 * Componente de Paginación en TypeScript
 */
const Paginator: React.FC<PaginationProps> = ({
  page,
  setPage,
  totalPages,
  total,
  itemsPerPage,
  handleItemsPerPageChange
}) => {

  // Función para generar el array de páginas a mostrar (con lógica de truncado)
  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push('ellipsis-start');
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('ellipsis-end');
      }

      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  const PaginationButton: React.FC<PaginationButtonProps> = ({
    children,
    onClick,
    disabled,
    active,
    className = ""
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center rounded-lg border-2 px-4 py-2 text-base font-medium transition-colors
        ${active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-blue-600"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-6">
      {/* Selector de Items por Página */}
      <div className="flex items-center space-x-3">
        <span className="text-base text-gray-500 whitespace-nowrap">Mostrar</span>
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="flex h-11 w-24 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
        >
          {[5, 20, 50, 100].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <span className="text-base text-gray-500 whitespace-nowrap">de <span className='font-bold'>{total}</span>  elementos</span>
      </div>

      {/* Controles de Navegación Numérica */}
      <div className="flex items-center space-x-2">
        <PaginationButton
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="hidden sm:flex"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Anterior
        </PaginationButton>

        <div className="flex items-center space-x-1">
          {visiblePages.map((p, index) => {
            if (typeof p === 'string') {
              return (
                <div key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  <MoreHorizontal className="h-5 w-5" />
                </div>
              );
            }

            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`
                  w-11 h-11 flex items-center justify-center rounded-lg border-2 text-base font-semibold transition-all
                  ${page === p
                    ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-600"}
                `}
              >
                {p}
              </button>
            );
          })}
        </div>

        <PaginationButton
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="hidden sm:flex"
        >
          Siguiente
          <ChevronRight className="h-5 w-5 ml-1" />
        </PaginationButton>
      </div>

      {/* Resumen para móvil */}
      <div className="text-sm text-gray-500 font-medium md:hidden">
        Página {page} de {totalPages}
      </div>
    </div>
  );
};

export default Paginator;

