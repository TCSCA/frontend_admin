export interface HistoricoRecipe {
    id_recipe: number;
    id: number;
    Codigo_de_Orden: string;
    Nombre_Paciente: string;
    Cedula_del_Paciente: string;
    Direccion_Estado_del_Paciente: string;
    Estado_actual_de_la_orden: string;
    fechaEnTramite: string;
    horaEnTramite: string;
    fechaEnProceso: string | null;
    horaEnProceso: string | null;
    fechaEntregado: string | null;
    horaEntregado: string | null;
    Nota_entrega: string | null;
}
