// components/ordenes/DetalleRecipesModal.tsx
'use client';

import React, { useEffect, useState } from 'react';
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


  const getHistoricoRecipeDetalle = async () => {
    try {
      const responseApi: ResponseApi = await callApi.get(`/api/historico-recipe/detalle/${orderHistory?.id}`, {});

      if (responseApi.status && responseApi.data) {
        // Verificar si es array
        if (Array.isArray(responseApi.data)) {
          // Primero procesar los datos originales
          const datosOriginales = responseApi.data.map((item: any, index: number) => ({
            ...item,
            id: item.id || index + 1,
          }));

          console.log("Datos originales:", datosOriginales);

          // Crear array multiplicado x20
          let medicamentosMultiplicados: any[] = [];
          const multiplicador = 20;

          for (let i = 0; i < multiplicador; i++) {
            const duplicados = datosOriginales.map(item => ({
              ...item,
              id: `${item.id}-${i}`, // Hacer ID único para cada duplicado
            }));
            medicamentosMultiplicados = medicamentosMultiplicados.concat(duplicados);
          }

          console.log(`Medicamentos multiplicados x${multiplicador}:`, medicamentosMultiplicados);
          console.log("Total de items:", medicamentosMultiplicados.length);

          setMedicamentos(medicamentosMultiplicados);
        } else {
          console.error("La data no es un array:", responseApi.data);
          setMedicamentos([]);
        }
      } else {
        console.log("No hay data o status false");
        setMedicamentos([]);
      }
    } catch (error) {
      console.error("Error fetching getHistoricoRecipeDetalle:", error);
      setMedicamentos([]);
    }
  };

  useEffect(() => {
    if (isOpen) getHistoricoRecipeDetalle();
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-white p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-4">
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
          </div>
        </DialogHeader>

        <div className="space-y-6 mx-6 mb-4">
          {orderHistory && (
            <Card className="border shadow-md overflow-hidden py-0">
              <CardHeader className="pb-2 pt-4 px-6 bg-gradient-to-r from-blue-50 to-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Resumen de la Orden: {orderHistory.Codigo_de_Orden}
                  </CardTitle>
                  <Badge>
                    {orderHistory.Estado_actual_de_la_orden}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-700 border-b pb-2">Información del Paciente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Nombre Completo</p>
                        <p className="font-medium text-base">{orderHistory.Nombre_Paciente}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Documento de Identidad</p>
                        <p className="font-medium text-base">{orderHistory.Cedula_del_Paciente}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estado/Provincia</p>
                        <p className="font-medium text-base">{orderHistory.Direccion_Estado_del_Paciente}</p>
                      </div>
                      {/* <div>
                        <p className="text-xs text-gray-500 mb-1">Código de Orden</p>
                        <p className="font-medium text-base">{orderHistory.Codigo_de_Orden}</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {
            medicamentos ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    Detalle de Medicamentos ({medicamentos.length})
                  </h3>
                </div>
                <MedicamentosTable
                  data={medicamentos}
                // className="border rounded-lg shadow-sm"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}