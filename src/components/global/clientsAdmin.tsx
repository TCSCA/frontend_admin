"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import ClientTableWrapper from "../wrappers/ClientsTableWrapper";
import callApi from '@/lib/callApi';
import { ResponseApi } from '@/types/response';

interface HeroTableClientProps {
  dataRequests: any[];
}

// Interfaz para los datos de estadísticas
interface EstadisticaEstado {
  id_estado_recipe: number;
  descripcion: string;
  cantidad: number;
  color: string;
  medicamentos: number;
}

interface EstadisticasRecipes {
  total: number;
  por_estado: EstadisticaEstado[];
  totalMedicamentos: number;
}

export default function ClientsAdmin({
  dataRequests,
}: HeroTableClientProps) {
  const [estadisticas, setEstadisticas] = useState<EstadisticasRecipes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // IDs de los estados que queremos mostrar
  const ESTADOS_MOSTRAR = [2, 3, 4]; // En Tramite (2), Procesado (3), Entregado (4)

  // Función para asignar color según el estado con mejor contraste
  const getColorByEstado = (descripcion: string): string => {
    switch (descripcion) {
      case 'En Tramite':
        return '#fcc800';
      case 'Procesado':
        return '#2b7fff';
      case 'Entregado':
        return '#05df72';
      default:
        return '#6B7280'; // Gris
    }
  };

  // Función para determinar el tamaño del texto basado en la longitud
  const getTextSize = (num: number): string => {
    const length = num.toString().length;
    if (length >= 4) return 'text-xs';
    if (length === 3) return 'text-sm';
    return 'text-base';
  };

  // Función para obtener las estadísticas
  const getEstadisticasRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const responseApi: ResponseApi = await callApi.get(`/api/recipe/medicamentos_por_estatus`, {});

      if (responseApi.status && responseApi.data) {
        // Filtrar solo los estados que queremos mostrar (En Tramite, Procesado, Entregado)
        const estadosFiltrados = responseApi.data.por_estado.filter(
          (estado: any) => ESTADOS_MOSTRAR.includes(estado.id_estado_recipe)
        );

        // Calcular total solo con los estados filtrados
        const totalFiltrado = estadosFiltrados.reduce(
          (sum: number, estado: any) => sum + estado.cantidad,
          0
        );

        const totalMedicamentosFiltrado = estadosFiltrados.reduce(
          (sum: number, estado: any) => sum + estado.medicamentos,
          0
        )

        // Agregar colores a cada estado
        const dataConColores = {
          total: totalFiltrado,
          totalMedicamentos: totalMedicamentosFiltrado,
          por_estado: estadosFiltrados.map((estado: any) => ({
            ...estado,
            color: getColorByEstado(estado.descripcion)
          }))
        };

        setEstadisticas(dataConColores);
      } else {
        setError("No se pudieron cargar las estadísticas");
        console.log("No hay data o status false");
      }
    } catch (error) {
      console.error("Error fetching estadísticas de recipes:", error);
      setError("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    getEstadisticasRecipes();
  }, []);

  const calcularPorcentaje = (cantidad: number, total: number) => {
    if (total <= 0) return "0.0";
    const porcentaje = (cantidad / total) * 100;
    return Math.floor(porcentaje * 10) / 10 + "";
  };

  // Estado de carga
  if (loading) {
    return (
      <>
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="w-10 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="border-b border-gray-200"></div>
          <Card className="w-full rounded-t-none rounded-b-2xl shadow-md bg-white mb-6 border-t-0">
            <CardContent>
              <ClientTableWrapper data={dataRequests} />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Indicadores de estadísticas */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Card del Total - Azul premium */}
          <div
            className="rounded-lg p-3 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(145deg, #2563EB 0%, #1E40AF 100%)',
              border: 'none'
            }}
          >
            {/* Fila superior con icono y texto Total */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span className="text-base font-semibold text-white">
                Total
              </span>
            </div>

            {/* Totales al estilo de los cards de estados - con círculos del mismo tamaño */}
            <div className="flex justify-around items-center mt-5">
              {/* Órdenes */}
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span className={`font-bold ${getTextSize(estadisticas?.total || 0)}`}>
                    {estadisticas?.total || 0}
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Órdenes
                </div>
              </div>

              {/* Medicamentos */}
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span className={`font-bold ${getTextSize(estadisticas?.totalMedicamentos || 0)}`}>
                    {estadisticas?.totalMedicamentos || 0}
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Medicamentos
                </div>
              </div>
            </div>
          </div>

          {/* Cards de estados individuales */}
          {estadisticas && estadisticas.por_estado.map((estado) => (
            <div
              key={estado.id_estado_recipe}
              className="flex flex-col bg-white border rounded-lg p-3 shadow-sm hover:shadow transition-all hover:scale-[1.02]"
            >
              {/* Título del estado centrado con porcentaje */}
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base font-bold" style={{ color: estado.color }}>
                    {estado.descripcion}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${estado.color}15`,
                      color: estado.color,
                    }}>
                    {calcularPorcentaje(estado.cantidad, estadisticas.total)}%
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${calcularPorcentaje(estado.cantidad, estadisticas.total)}%`,
                      backgroundColor: estado.color
                    }}
                  />
                </div>
              </div>

              {/* Métricas en fila - ambas con el color del estado */}
              <div className="flex justify-around items-center">
                {/* Órdenes */}
                <div className="text-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1"
                    style={{
                      backgroundColor: `${estado.color}15`,
                      color: estado.color,
                      border: `2px solid ${estado.color}40`
                    }}
                  >
                    <span className={`font-bold ${getTextSize(estado.cantidad)}`}>
                      {estado.cantidad}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Órdenes
                  </div>
                </div>

                {/* Medicamentos */}
                <div className="text-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1"
                    style={{
                      backgroundColor: `${estado.color}15`,
                      color: estado.color,
                      border: `2px solid ${estado.color}40`
                    }}
                  >
                    <span className={`font-bold ${getTextSize(estado.medicamentos)}`}>
                      {estado.medicamentos}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Medicamentos
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mt-3 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-700">⚠️ {error}</span>
            </div>
            <button
              onClick={getEstadisticasRecipes}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-md transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div>
        <div className="border-b border-gray-200"></div>
        <Card className="w-full rounded-t-none rounded-b-2xl shadow-md bg-white mb-6 border-t-0">
          <CardContent>
            <ClientTableWrapper
              data={dataRequests}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}