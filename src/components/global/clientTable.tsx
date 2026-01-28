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
  status: 'active' | 'inactive' | 'pending';
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
  { id: 6, name: "Acciones", key: "action", label: "Acciones" },
];

// const defaultSelectedItems = availableItems.slice(0, 4);

interface ClientTableProps {
  data: Client[];
  totalPages: number;
  totalItems: number;
}

export default function ClientTable({
  data = [],
  totalPages = 1,
  totalItems: initialTotalItems = 0,
}: ClientTableProps) {
  const [collectedRows, setCollectedRows] = useState<any[]>([]);
  const [totalItemsCount, setTotalItemsCount] = useState(initialTotalItems);
  const [selectedColumns, setSelectedColumns] = useState<AvailableItem[]>();
  const [currentFilter, setCurrentFilter] = useState<{searchTerm: string}>({ searchTerm: '' });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setCollectedRows(data);
    setTotalItemsCount(initialTotalItems);
  }, [data, initialTotalItems]);

  const searchByFilter = async (text: string) => {
    setCurrentFilter({ searchTerm: text });
  };

  const handlePageChange = (page: number) => {
    // Handle page changes
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
    return collectedRows.map(row => ({
      // Map the data to match the column keys in availableItems
      id: row.id,
      createdAt: new Date().toLocaleDateString(),
      patientName: row.name,
      patientId: row.id,
      patientLocation: 'No especificada',
      orderStatus: (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.status === 'active' ? 'bg-green-100 text-green-800' :
          row.status === 'inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      ),
      updatedAt: new Date().toLocaleDateString(),
      action: (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleView(row)}
          className="h-8 px-3 flex items-center gap-2 w-full justify-center"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Ver</span>
        </Button>
      )
    }));
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
          recipes={[]} // Add your recipes data here if available
        />
      )}
    </div>
  );
}