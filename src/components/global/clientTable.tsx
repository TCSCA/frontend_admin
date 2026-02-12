"use client";
import { useState, useMemo } from "react";
import CommonHeroTable from "../ui/commonHeroTable";
import { Button } from "@/components/ui/button";
import FilterSearchbar from "../ui/filterSearchbar";
import { Eye, Image as ImageIcon } from "lucide-react";
import ClientDetailModal from "../modals/clientDetailModal";
import { HistoricoRecipe } from "@/types/historicoRecipe";
import ClientRecipePreviewModal from "../modals/clientRecipePreviewModal";

interface AvailableItem {
  id: number;
  name: string;
  key: string;
  label: string;
}

const availableItems: AvailableItem[] = [
  { id: 0, name: "Fecha de Creación", key: "fechaEnTramite", label: "Fecha de Creación" },
  { id: 1, name: "Nombre Completo del Paciente", key: "Nombre_Paciente", label: "Nombre Completo del Paciente" },
  { id: 2, name: "Cédula del Paciente", key: "Cedula_del_Paciente", label: "Cédula del Paciente" },
  { id: 3, name: "Estado Ubicación del Paciente", key: "Direccion_Estado_del_Paciente", label: "Estado Ubicación del Paciente" },
  { id: 4, name: "Estatus de la Orden", key: "Estado_actual_de_la_orden", label: "Estatus de la Orden" },
  { id: 5, name: "Fecha de Actualización", key: "fechaActualizacion", label: "Fecha de Actualización" },
  { id: 6, name: "Tiempo de Entrega", key: "tiempoEntrega", label: "Tiempo de Entrega" },
  { id: 7, name: "Acciones", key: "action", label: "Acciones" },
];

interface ClientTableProps {
  data: HistoricoRecipe[];
}

// Función para combinar fecha y hora en un objeto Date
const combineDateTime = (fecha: string | null, hora: string | null): Date | null => {
  if (!fecha || !hora) return null;

  // Si la hora viene en formato HH:MM:SS, la convertimos
  const [hours, minutes, seconds] = hora.split(':').map(Number);
  const date = new Date(fecha);

  if (isNaN(date.getTime())) return null;

  date.setHours(hours, minutes, seconds || 0, 0);
  return date;
};

// Función para calcular la diferencia de tiempo en formato legible
const calculateTimeDifference = (startDate: Date | null, endDate: Date | null): string => {
  if (!startDate || !endDate) return 'N/A';

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'N/A';

  const diffMs = Math.abs(endDate.getTime() - startDate.getTime());

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

// Función para calcular tiempo de entrega según las reglas específicas
const calculateDeliveryTime = (row: HistoricoRecipe): string => {
  const status = row.Estado_actual_de_la_orden?.toLowerCase();
  const now = new Date(); // Fecha y hora actual

  // Si es Cancelado, mostrar N/A o no mostrar
  if (status === 'cancelado') {
    return 'N/A';
  }

  // Fecha y hora de inicio (en trámite)
  const startDateTime = combineDateTime(row.fechaEnTramite, row.horaEnTramite);
  if (!startDateTime) return 'N/A';

  // Calcular según el estado
  if (status.includes('entregado')) {
    // Entregado: fechaEntregado + horaEntregado - fechaEnTramite + horaEnTramite
    const endDateTime = combineDateTime(row.fechaEntregado, row.horaEntregado);
    if (!endDateTime) return 'N/A';
    return calculateTimeDifference(startDateTime, endDateTime);

  } else if (status.includes('proceso') || status.includes('procesado') || status.includes('tramite')) {
    // Proceso/Procesado/Trámite: fechaHoy + horaHoy - fechaEnTramite + horaEnTramite
    return calculateTimeDifference(startDateTime, now);

  } else {
    // Para otros estados
    return calculateTimeDifference(startDateTime, now);
  }
};

// Función para formatear fecha (solo fecha, no hora)
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Función para obtener la última fecha de actualización según el estado
const getLastUpdateDate = (row: HistoricoRecipe): string | null => {
  const status = row.Estado_actual_de_la_orden?.toLowerCase();

  if (status.includes('entregado')) {
    return row.fechaEntregado;
  } else if (status.includes('proceso') || status.includes('procesado')) {
    return row.fechaEnProceso;
  } else if (status.includes('tramite')) {
    return row.fechaEnTramite;
  }
  return row.fechaEnTramite;
};

export default function ClientTable({
  data = [],
}: ClientTableProps) {
  const [currentFilter, setCurrentFilter] = useState<{ searchTerm: string }>({ searchTerm: '' });
  const [selectedClient, setSelectedClient] = useState<HistoricoRecipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPreviewClient, setSelectedPreviewClient] = useState<HistoricoRecipe | null>(null);

  const searchByFilter = async (text: string) => {
    setCurrentFilter({ searchTerm: text });
  };

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
  };

  const handleView = (client: HistoricoRecipe) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handlePreview = (client: HistoricoRecipe) => {
    setSelectedPreviewClient(client);
    setIsPreviewModalOpen(true);
  };

  const filteredData = useMemo(() => {
    // Defensive check
    if (!Array.isArray(data)) return [];

    // Filter out canceled orders first
    const activeRows = data.filter(row =>
      row.Estado_actual_de_la_orden?.toLowerCase() !== 'cancelado'
    );

    const term = currentFilter.searchTerm.toLowerCase().trim();

    if (!term) {
      return activeRows;
    }

    return activeRows.filter(item => {
      return Object.values(item).some(value =>
        String(value || '').toLowerCase().includes(term)
      );
    });
  }, [currentFilter.searchTerm, data]);

  const rowsWithActions = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];

    return filteredData.map(row => {
      let statusClass = 'bg-gray-100 text-gray-800 border-gray-200';
      const status = row.Estado_actual_de_la_orden.toLowerCase();

      if (status.includes('entregado')) {
        statusClass = 'bg-green-100 text-green-800 border-green-200';
      } else if (status.includes('proceso') || status.includes('procesado')) {
        statusClass = 'bg-blue-100 text-blue-800 border-blue-200';
      } else if (status.includes('tramite')) {
        statusClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      } else if (status.includes('cancelado')) {
        statusClass = 'bg-red-100 text-red-800 border-red-200';
      }

      // Última fecha de actualización según el estado
      const lastUpdate = getLastUpdateDate(row);

      // Calcular tiempo de entrega
      const tiempoEntrega = calculateDeliveryTime(row);

      return {
        id: row.id_recipe,
        Nota_entrega: row.Nota_entrega,
        fechaEnTramite: formatDate(row.fechaEnTramite),
        Nombre_Paciente: row.Nombre_Paciente,
        Cedula_del_Paciente: row.Cedula_del_Paciente,
        Direccion_Estado_del_Paciente: row.Direccion_Estado_del_Paciente,
        Estado_actual_de_la_orden: (
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${statusClass}`}>
            {row.Estado_actual_de_la_orden}
          </span>
        ),
        fechaActualizacion: formatDate(lastUpdate),
        tiempoEntrega: (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{tiempoEntrega}</span>
            {status.includes('entregado') && (
              <span className="text-xs text-green-600">Tiempo total</span>
            )}
            {!status.includes('entregado') && (
              <span className="text-xs text-amber-600">En progreso</span>
            )}
          </div>
        ),
        action: (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleView(row)}
              className="h-8 px-3 flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePreview(row)}
              className="h-8 px-3 flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Button>
          </div>
        )
      };
    });
  }, [filteredData]);

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
        totalRows={rowsWithActions.length}
        totalItems={rowsWithActions.length}
        onView={handleView}
        onPreview={handlePreview}
      />

      {/* Modal de Detalle del Cliente */}
      {selectedClient && (
        <ClientDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderHistory={selectedClient}
          recipes={[]}
        />
      )}

      {/* Modal de Vista Previa de Imagen */}
      {selectedPreviewClient && (
        <ClientRecipePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          // imageUrl={`/${process.env.NEXT_PUBLIC_API_BASE_URL_ASSETS}/assets/login.jpg`}
          imageUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}${selectedPreviewClient?.Nota_entrega?.slice(1) ?? null}`}
        />
      )}
    </div>
  );
}