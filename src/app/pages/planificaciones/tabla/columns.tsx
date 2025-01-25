

import { ColumnDef } from "@tanstack/react-table"
import Acciones from "./Acciones";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// "titulo": "string",
//     "profesor_id": 7,
//     "descripcion": "string",
//     "periodo_id": 7,
//     "id": 1,
//     "fecha_subida": "2024-11-22T00:00:00Z",
//     "asignaturas_id": 1
export type Planificaciones = {
    id_planificacion: number;
    id: number;
    titulo: string;
    descripcion: string;
    fecha_subida: Date;
    profesor_id: number;
    asignaturas_id: number;
    periodo_id: number;
    profesor_nombre: string;
    periodo_nombre: string;
    asignatura_nombre: string;
    curso_nombre: string;
    area_id: number;
    area_nombre: string;
    area_codigo: string;
    profesor_aprobador_id: number;
    profesor_aprobador_nombre: string;
    profesor_revisor_id: number;
    profesor_revisor_nombre: string;
    fecha_de_actualizacion: Date;
    estado: string | null;
    archivo: string | null;
};

export const statusColorMap: { [key: string]: string } = {
    'entregado': '#22c55e', // verde
    'pendiente': '#eab308', // amarillo
    'atrasado': '#ef4444', // rojo
    'aprobado': '#3b82f6', // azul
    'revisado': '#a855f7'  // morado
};


export const columns: ColumnDef<Planificaciones>[] = [
    {
        accessorKey: "id",
        header: "Id",

    },
    {

        accessorKey: "periodo_id",
        accessorFn: (row) => row.periodo_id.toString(),

    },
    {
        accessorKey: "profesor_nombre",
        header: "Profesor",
        enableHiding: true,
    },
    {
        accessorKey: "asignatura_nombre",
        header: "Asignatura",
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "curso_nombre",
        header: "Curso",
        enableHiding: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },

    {
        accessorKey: "fecha_subida",
        header: "Fecha de Entrega",
        enableHiding: true,
        cell: ({ getValue }) => {
            return getValue() ? format(getValue(), "dd/MM/yyyy") : "";
        },
    },
    {
        accessorKey: "periodo_nombre",
        header: "Periodo",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "area_nombre",
        header: "Area",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    
    {
        accessorKey: "titulo",
        header: "Titulo",
        enableHiding: true,
    },
    {
        accessorKey: "estado",
        header: "Estado",
        enableHiding: true,
        cell: ({ getValue }) => {
            const estado = getValue() as string;
            const color = statusColorMap[estado as keyof typeof statusColorMap] || '#000000'; // Color por defecto si el estado no está en el mapa

            return (
                <Badge style={{ backgroundColor: color, color: '#ffffff' }}>
                    {estado}
                </Badge>
            );
        },
    },
    {
        id: "Acciones",
        enableHiding: true,
        cell: ({ row }) => {
            return (
                <Acciones data={row.original} />
            )

        },
    }
]