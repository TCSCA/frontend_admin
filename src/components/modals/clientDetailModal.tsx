// components/ordenes/DetalleRecipesModal.tsx
'use client';

import React from 'react';
import { HistoricoRecipe } from '@/types/historicoRecipe';
import { Recipe } from '@/types/recipe';
import {
  Dialog,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-white p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-center">
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
            {/* <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-9 w-9 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button> */}
          </div>

          {/* Resumen general - solo mostrar si hay recipes */}
          {totalRecipes > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Recipes</p>
                    <p className="text-lg font-bold text-blue-700">{totalRecipes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded">
                    <Pill className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Medicamentos</p>
                    <p className="text-lg font-bold text-green-700">{totalMedicamentos}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded">
                    <Package className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Unidades</p>
                    <p className="text-lg font-bold text-purple-700">{totalUnidades}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {totalRecipes === 0 ? (
            <div className="space-y-6">
              {orderHistory && (
                <Card className="border shadow-md overflow-hidden">
                  <CardHeader className="py-4 px-6 bg-gradient-to-r from-blue-50 to-gray-50 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold text-gray-800">
                        Resumen de la Orden: {orderHistory.Codigo_de_Orden}
                      </CardTitle>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {orderHistory.Estado_actual_de_la_orden}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-700 border-b pb-2">Información del Paciente</h4>
                        <div className="space-y-2">
                          <p className="flex justify-between"><span className="text-gray-500">Nombre:</span> <span className="font-medium">{orderHistory.Nombre_Paciente}</span></p>
                          <p className="flex justify-between"><span className="text-gray-500">Cédula:</span> <span className="font-medium">{orderHistory.Cedula_del_Paciente}</span></p>
                          <p className="flex justify-between"><span className="text-gray-500">Estado:</span> <span className="font-medium">{orderHistory.Direccion_Estado_del_Paciente}</span></p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-700 border-b pb-2">Línea de Tiempo</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" />
                            <div>
                              <p className="text-sm font-bold text-gray-800">Tramitado</p>
                              <p className="text-xs text-gray-500">{orderHistory.fechaEnTramite} {orderHistory.horaEnTramite}</p>
                            </div>
                          </div>
                          <div className={`flex items-start gap-3 ${!orderHistory.fechaEnProceso ? 'opacity-40' : ''}`}>
                            <div className={`mt-1 w-2 h-2 rounded-full ${orderHistory.fechaEnProceso ? 'bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'bg-gray-300'}`} />
                            <div>
                              <p className="text-sm font-bold text-gray-800">En Proceso</p>
                              <p className="text-xs text-gray-500">{orderHistory.fechaEnProceso || 'Pendiente'} {orderHistory.horaEnProceso || ''}</p>
                            </div>
                          </div>
                          <div className={`flex items-start gap-3 ${!orderHistory.fechaEntregado ? 'opacity-40' : ''}`}>
                            <div className={`mt-1 w-2 h-2 rounded-full ${orderHistory.fechaEntregado ? 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.1)]' : 'bg-gray-300'}`} />
                            <div>
                              <p className="text-sm font-bold text-gray-800">Entregado</p>
                              <p className="text-xs text-gray-500">{orderHistory.fechaEntregado || 'Pendiente'} {orderHistory.horaEntregado || ''}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
            </div>
          ) : (
            <div className="space-y-6">
              {recipes.map((recipe) => {
                const recipeTotalMedicamentos = recipe.medicamentos.length;
                const recipeTotalUnidades = recipe.medicamentos.reduce((sum, med) => sum + med.cantidad, 0);

                return (
                  <Card key={recipe.id} className="border shadow-md overflow-hidden">
                    <CardHeader className="py-4 px-6 bg-gradient-to-r from-blue-50 to-gray-50 border-b">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-lg shadow-sm">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-lg font-bold text-gray-800">Recipe #{recipe.numero}</span>
                                <div className="flex items-center gap-2 mt-1">
                                  {recipe.pacienteNombre && (
                                    <>
                                      <div className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                                        <User className="w-3.5 h-3.5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">
                                          {recipe.pacienteNombre}
                                        </span>
                                      </div>
                                      {recipe.pacienteCedula && (
                                        <span className="text-sm text-gray-500">
                                          CI: {recipe.pacienteCedula}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardTitle>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-white p-1.5 rounded shadow-sm">
                                <Stethoscope className="w-4 h-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Médico</p>
                                <p className="text-sm font-semibold text-gray-800">{recipe.medico}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="bg-white p-1.5 rounded shadow-sm">
                                <Calendar className="w-4 h-4 text-green-500" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Fecha Prescripción</p>
                                <p className="text-sm font-semibold text-gray-800">
                                  {new Date(recipe.fechaPrescripcion).toLocaleDateString('es-ES', {
                                    weekday: 'short',
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>

                            {recipe.diagnostico && (
                              <div className="flex items-center gap-3">
                                <div className="bg-white p-1.5 rounded shadow-sm">
                                  <Stethoscope className="w-4 h-4 text-red-500" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Diagnóstico</p>
                                  <p className="text-sm font-semibold text-gray-800 truncate">{recipe.diagnostico}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-2">
                          <div className="flex flex-col gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm px-3 py-1.5 font-semibold">
                              <Pill className="w-4 h-4 mr-1.5" />
                              {recipeTotalMedicamentos} medicamento{recipeTotalMedicamentos !== 1 ? 's' : ''}
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-sm px-3 py-1.5 font-semibold">
                              <Package className="w-4 h-4 mr-1.5" />
                              {recipeTotalUnidades} unidad{recipeTotalUnidades !== 1 ? 'es' : ''}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <div className="p-6">
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-3 text-gray-800">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Pill className="w-5 h-5 text-blue-600" />
                          </div>
                          Medicamentos Prescritos
                        </h4>

                        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                          <table className="w-full min-w-max">
                            <thead>
                              <tr className="bg-gray-50 border-b">
                                <th className="p-4 text-left font-semibold text-sm text-gray-700 w-28">Medicamento</th>
                                <th className="p-4 text-left font-semibold text-sm text-gray-700 w-32">Principio Activo</th>
                                <th className="p-4 text-left font-semibold text-sm text-gray-700 w-24">Concentración</th>
                                <th className="p-4 text-left font-semibold text-sm text-gray-700 w-28">Laboratorio</th>
                                <th className="p-4 text-left font-semibold text-sm text-gray-700 w-28">Presentación</th>
                                <th className="p-4 text-left font-semibold text-sm text-gray-700 w-24">Categoría</th>
                                <th className="p-4 text-left font-semibold text-sm text-gray-700 w-20">Lote</th>
                                <th className="p-4 text-left font-semibold text-sm text-gray-700 w-24">Vencimiento</th>
                                <th className="p-4 text-right font-semibold text-sm text-gray-700 w-20">Cantidad</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recipe.medicamentos.map((med, index) => (
                                <tr
                                  key={`${recipe.id}-${med.id}`}
                                  className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                >
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-blue-50 p-1.5 rounded">
                                        <Package className="w-4 h-4 text-blue-500" />
                                      </div>
                                      <span className="font-semibold text-gray-800">{med.nombre}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-gray-700">{med.principioActivo}</td>
                                  <td className="p-4 text-gray-700">{med.concentracion}</td>
                                  <td className="p-4 text-gray-700">{med.laboratorio}</td>
                                  <td className="p-4 text-gray-700">{med.presentacion}</td>
                                  <td className="p-4">
                                    <Badge variant="outline" className={
                                      med.categoria === 'Crónico'
                                        ? 'bg-purple-50 text-purple-700 text-xs px-3 py-1.5 border-purple-300 font-semibold'
                                        : med.categoria === 'Controlado'
                                          ? 'bg-red-50 text-red-700 text-xs px-3 py-1.5 border-red-300 font-semibold'
                                          : med.categoria === 'Especial'
                                            ? 'bg-yellow-50 text-yellow-700 text-xs px-3 py-1.5 border-yellow-300 font-semibold'
                                            : 'bg-blue-50 text-blue-700 text-xs px-3 py-1.5 border-blue-300 font-semibold'
                                    }>
                                      {med.categoria || 'General'}
                                    </Badge>
                                  </td>
                                  <td className="p-4">
                                    {med.lote ? (
                                      <Badge variant="outline" className="bg-gray-100 text-gray-800 text-xs px-3 py-1.5 border-gray-300 font-medium">
                                        {med.lote}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400 italic">No asignado</span>
                                    )}
                                  </td>
                                  <td className="p-4">
                                    {med.vencimiento ? (
                                      <div className="flex items-center gap-2">
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${new Date(med.vencimiento) < new Date()
                                          ? 'bg-red-100 text-red-700'
                                          : new Date(med.vencimiento) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-green-100 text-green-700'
                                          }`}>
                                          {new Date(med.vencimiento).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                          })}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 italic">No disponible</span>
                                    )}
                                  </td>
                                  <td className="p-4 text-right">
                                    <Badge className="bg-green-50 text-green-700 text-sm px-3 py-1.5 border-green-300 font-bold">
                                      {med.cantidad} unid.
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Footer con resumen y acciones */}
              <div className="sticky bottom-0 bg-white border-t pt-4 mt-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="text-gray-700">
                    <p className="font-semibold text-lg">
                      Resumen General
                    </p>
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">{totalRecipes} recipe{totalRecipes !== 1 ? 's' : ''}</span>
                      {' • '}
                      <span className="font-medium">{totalMedicamentos} medicamento{totalMedicamentos !== 1 ? 's' : ''}</span>
                      {' • '}
                      <span className="font-medium">{totalUnidades} unidad{totalUnidades !== 1 ? 'es' : ''}</span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="px-6 py-2.5 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir
                    </Button>
                    <Button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700"
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}