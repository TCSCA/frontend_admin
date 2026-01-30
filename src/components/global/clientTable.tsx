"use client";
import { useState, useEffect, useMemo } from "react";
import CommonHeroTable from "../ui/commonHeroTable";
import { Button } from "@/components/ui/button";
import FilterSearchbar from "../ui/filterSearchbar";
import { Eye } from "lucide-react";
import ClientDetailModal from "../modals/clientDetailModal";

export interface Client {
  id: number;
  name: string;
  email: string;
  status: 'entregado' | 'pendiente';
  createdAt?: string;
  updatedAt?: string;
}

interface AvailableItem {
  id: number;
  name: string;
  key: string;
  label: string;
}

const availableItems: AvailableItem[] = [
  { id: 0, name: "Fecha de Creación de la Orden", key: "createdAt", label: "Fecha de Creación" },
  { id: 1, name: "Nombre Completo del Paciente", key: "patientName", label: "Nombre Completo del Paciente" },
  { id: 2, name: "Cedula del Paciente", key: "patientId", label: "Cedula del Paciente"},
  { id: 3, name: "Estado Ubicación del Paciente", key: "patientLocation", label: "Estado Ubicación del Paciente" },
  { id: 4, name: "Estatus de la Orden", key: "orderStatus", label: "Estatus de la Orden" },
  { id: 5, name: "Fecha de Actualización", key: "updatedAt", label: "Fecha de Actualización" },
  { id: 6, name: "Tiempo de Entrega", key: "deliveryTime", label: "Tiempo de Entrega" },
  { id: 7, name: "Acciones", key: "action", label: "Acciones" },
];

interface ClientTableProps {
  data: Client[];
  totalPages: number;
  totalItems: number;
}

// Función para calcular la diferencia de tiempo en formato legible
const calculateTimeDifference = (startDate: string | Date, endDate: string | Date = new Date()): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffMs = Math.abs(end.getTime() - start.getTime());
  
  // Calcular días, horas y minutos
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Función para formatear fecha
const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function ClientTable({
  data = [],
  totalPages = 1,
  totalItems: initialTotalItems = 0,
}: ClientTableProps) {
  const [collectedRows, setCollectedRows] = useState<Client[]>([]);
  const [totalItemsCount, setTotalItemsCount] = useState(initialTotalItems);
  const [currentFilter, setCurrentFilter] = useState<{searchTerm: string}>({ searchTerm: '' });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const processedData = data.map(client => ({
      ...client,
      createdAt: client.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: client.updatedAt || (client.status === 'entregado' 
        ? new Date().toISOString() 
        : new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()),
    }));
    
    setCollectedRows(processedData);
    setTotalItemsCount(initialTotalItems);
  }, [data, initialTotalItems]);

  const searchByFilter = async (text: string) => {
    setCurrentFilter({ searchTerm: text });
  };

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
  };

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const filteredData = useMemo(() => {
    const term = currentFilter.searchTerm.toLowerCase().trim();
    
    if (!term) {
      return collectedRows;
    }

    return collectedRows.filter(item => {
      return Object.values(item).some(value => 
        String(value || '').toLowerCase().includes(term)
      );
    });
  }, [currentFilter.searchTerm, collectedRows]);

  const rowsWithActions = useMemo(() => {
    return collectedRows.map(row => {
      let deliveryTimeText = 'N/A';
      let deliveryTimeClass = 'bg-gray-100 text-gray-800';
      
      if (row.createdAt) {
        if (row.status === 'entregado' && row.updatedAt) {
          // Entregado: fecha actualización - fecha creación (color verde)
          deliveryTimeText = calculateTimeDifference(row.createdAt, row.updatedAt);
          deliveryTimeClass = 'bg-green-100 text-green-800 border border-green-200';
        } else if (row.status === 'pendiente') {
          // Pendiente: fecha actual - fecha creación (color rojo)
          deliveryTimeText = calculateTimeDifference(row.createdAt, new Date());
          deliveryTimeClass = 'bg-red-100 text-red-800 border border-red-200';
        }
      }
      
      return {
        id: row.id,
        createdAt: formatDate(row.createdAt),
        patientName: row.name,
        patientId: row.id,
        patientLocation: 'No especificada',
        orderStatus: (
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            row.status === 'entregado' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        ),
        updatedAt: formatDate(row.updatedAt),
        deliveryTime: (
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${deliveryTimeClass}`}>
            {deliveryTimeText}
          </span>
        ),
        action: (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleView(row)}
            className="h-8 px-3 flex items-center gap-2 w-full justify-center hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver</span>
          </Button>
        )
      };
    });
  }, [collectedRows]);

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 max-w-md">
          <FilterSearchbar
            onSearchClick={searchByFilter}
            columns={availableItems}
          />
        </div>
      </div>
      
      <CommonHeroTable
        columns={availableItems}
        rows={rowsWithActions}
        onPageChange={handlePageChange}
        totalRows={totalPages}
        totalItems={totalItemsCount}
        onView={handleView}
      />
      
      {selectedClient && (
        <ClientDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          recipes={[]}
        />
      )}
    </div>
  );
}