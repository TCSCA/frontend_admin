// components/ordenes/DetalleRecipesModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { HistoricoRecipe } from '@/types/historicoRecipe';
import { Recipe } from '@/types/recipe';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  FileText,
  User,
  Calendar,
  Stethoscope,
  Pill,
  Package,
  FileCheck,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponseApi } from '@/types/response';
import callApi from '@/lib/callApi';
import MedicamentosTable from '../global/medicamentosTable';

// Tipos de datos
type Medicamento = {
  id: number;
  nombre: string;
  principioActivo: string;
  concentracion: string;
  laboratorio: string;
  presentacion: string;
  cantidad: number;
  lote?: string;
  vencimiento?: string;
  tipoMedicamento?: string;
  categoria?: string;
};

type Recipe = {
  id: number;
  numero: string;
  medico: string;
  fechaPrescripcion: string;
  diagnostico?: string;
  medicamentos: Medicamento[];
  pacienteNombre?: string;
  pacienteCedula?: string;
};

interface ClientDetailModalProps {
  recipes: Recipe[];
  isOpen: boolean;
  onClose: () => void;
  orderHistory?: HistoricoRecipe;
}

export interface RecipeDetail {
  nombre_comercial: string;
  cantidad: number;
  id: number;
}

export interface EstadoOrden {
  descripcion: string;
  fecha_cambio: string | null;
  medicamentos: RecipeDetail[];
  color: string;
  completado: boolean;
}

export default function ClientDetailModal({
  recipes,
  isOpen,
  onClose,
  orderHistory,
}: ClientDetailModalProps) {
  const totalRecipes = recipes.length;
  const totalMedicamentos = recipes.reduce((sum, recipe) => sum + recipe.medicamentos.length, 0);
  const totalUnidades = recipes.reduce((sum, recipe) =>
    sum + recipe.medicamentos.reduce((sumMed, med) => sumMed + med.cantidad, 0), 0);

  const [medicamentos, setMedicamentos] = useState<RecipeDetail[]>();
  const [estadosOrden, setEstadosOrden] = useState<EstadoOrden[]>();

  // Función para asignar color según el estado
  const getColorByEstado = (descripcion: string): string => {
    switch (descripcion) {
      case 'Pendiente':
        return '#FF6B6B'; // Rojo
      case 'En Tramite':
        return '#4ECDC4'; // Turquesa
      case 'Procesado':
        return '#FFD166'; // Amarillo
      case 'Entregado':
        return '#06D6A0'; // Verde
      default:
        return '#6C757D'; // Gris por defecto
    }
  };

  const getHistoricoRecipeDetalle = async () => {
    try {
      const responseApi: ResponseApi = await callApi.get(`/api/historico-recipe/detalle/${orderHistory?.id}`, {});

      if (responseApi.status && responseApi.data) {
        if (Array.isArray(responseApi.data)) {
          // Lista de todos los estados posibles en orden
          const todosEstados = ['Pendiente', 'En Tramite', 'Procesado', 'Entregado'];

          // Crear mapa de estados recibidos
          const estadosRecibidos = new Map();
          responseApi.data.forEach(estado => {
            estadosRecibidos.set(estado.descripcion, estado);
          });

          // Crear array con los 4 estados
          const estadosCompletos: EstadoOrden[] = todosEstados.map(descripcion => {
            const estadoRecibido = estadosRecibidos.get(descripcion);

            if (estadoRecibido) {
              return {
                descripcion: estadoRecibido.descripcion,
                fecha_cambio: estadoRecibido.fecha_cambio,
                medicamentos: estadoRecibido.medicamentos || [],
                color: getColorByEstado(descripcion),
                completado: true
              };
            } else {
              // Estado no recibido - marcamos como pendiente
              return {
                descripcion: descripcion,
                fecha_cambio: null,
                medicamentos: [],
                color: getColorByEstado(descripcion) + '80', // Agregamos transparencia
                completado: false
              };
            }
          });

          setEstadosOrden(estadosCompletos);

          // Extraer solo los medicamentos del último estado COMPLETADO
          const estadosCompletados = responseApi.data.filter(estado =>
            estado.descripcion && estado.medicamentos
          );

          if (estadosCompletados.length > 0) {
            const ultimoEstado = estadosCompletados[estadosCompletados.length - 1];

            if (ultimoEstado.medicamentos && Array.isArray(ultimoEstado.medicamentos)) {
              const medicamentosUltimoEstado = ultimoEstado.medicamentos.map((item: any, index: number) => ({
                ...item,
                id: index + 1,
              }));

              setMedicamentos(medicamentosUltimoEstado);
            } else {
              console.log("El último estado no tiene medicamentos");
              setMedicamentos([]);
            }
          } else {
            console.log("No hay estados completados en la respuesta");
            setMedicamentos([]);
          }
        } else {
          console.error("La data no es un array:", responseApi.data);
          setEstadosOrden([]);
          setMedicamentos([]);
        }
      } else {
        console.log("No hay data o status false");
        setEstadosOrden([]);
        setMedicamentos([]);
      }
    } catch (error) {
      console.error("Error fetching getHistoricoRecipeDetalle:", error);
      setEstadosOrden([]);
      setMedicamentos([]);
    }
  };

  useEffect(() => {
    if (isOpen) getHistoricoRecipeDetalle();
  }, [isOpen])

  const onOpenChange = () => {
    setMedicamentos([]);
    setEstadosOrden([]);
    onClose();
  }

  // Función para formatear fecha
  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'Pendiente';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-white p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Detalle de Recipes</h2>
                {totalRecipes > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {totalRecipes} recipe{totalRecipes !== 1 ? 's' : ''} encontrado{totalRecipes !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6 mx-6 mb-4">
          {orderHistory && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">
                  Información del Paciente
                </h3>
                {orderHistory && (
                  <div className="flex items-center">
                    <h3 className="text-md font-bold text-gray-800">
                      Estado de la orden:
                    </h3>
                    <Badge className="pr-0">
                      {orderHistory.Estado_actual_de_la_orden}
                    </Badge>
                  </div>
                )}
              </div>
              <Card className="border shadow-md overflow-hidden py-0">
                <CardContent className="px-6 py-4">
                  <div className="space-y-4">
                    {/* Grid principal de 3 columnas */}
                    <div className="grid grid-cols-3 gap-6">

                      {/* Columna 1 */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Nombre Completo</p>
                          <p className="font-medium text-xs">{orderHistory.Nombre_Paciente}</p>
                        </div>
                      </div>

                      {/* Columna 2 */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Documento de Identidad</p>
                          <p className="font-medium text-xs">{orderHistory.Cedula_del_Paciente}</p>
                        </div>
                      </div>

                      {/* Columna 3 */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Estado/Provincia</p>
                          <p className="font-medium text-xs">{orderHistory.Direccion_Estado_del_Paciente}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {
            medicamentos && medicamentos.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    Detalle de Medicamentos ({medicamentos.length})
                  </h3>
                </div>
                <MedicamentosTable
                  data={medicamentos}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <FileCheck className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Detalles Médicos no disponibles
                </h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  Esta orden contiene el historial de estados pero los detalles de los medicamentos no están disponibles en la vista histórica.
                </p>
                <Button onClick={onClose} variant="outline" className="px-8 leading-none h-10">
                  Volver al Listado
                </Button>
              </div>
            )
          }
          <div className='space-y-3'>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Línea de Tiempo
              </h3>
            </div>
            <Card className="border shadow-md overflow-hidden py-0">
              <CardContent className="px-6 py-4">
                <div className="grid grid-cols-4 gap-2">
                  {estadosOrden && estadosOrden.map((estado, index) => (
                    <div
                      key={index}
                      className={`text-center p-2 rounded-md ${!estado.completado ? 'opacity-50' : ''}`}
                      style={{
                        backgroundColor: estado.completado ? `${estado.color}10` : '#f9fafb',
                        border: `1px solid ${estado.completado ? `${estado.color}30` : '#e5e7eb'}`
                      }}
                    >
                      {/* Indicador circular pequeño */}
                      <div
                        className="w-2 h-2 rounded-full mx-auto mb-1"
                        style={{
                          backgroundColor: estado.completado ? estado.color : `${estado.color}60`
                        }}
                      />

                      {/* Estado */}
                      <p
                        className="text-xs font-bold mb-0.5"
                        style={{ color: estado.completado ? estado.color : '#6b7280' }}
                      >
                        {estado.descripcion}
                      </p>

                      {/* Fecha/Hora */}
                      <p className="text-xs text-gray-500 leading-tight">
                        {estado.completado ? (
                          <>
                            {new Date(estado.fecha_cambio!).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short'
                            })}
                          </>
                        ) : (
                          'Pendiente'
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}