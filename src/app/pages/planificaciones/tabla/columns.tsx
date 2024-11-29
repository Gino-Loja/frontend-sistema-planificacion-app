

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

const badgeColor = {
    "pendiente": 'destructive',
    "aprobado": 'default',
    "revisado": 'default',
}



export const columns: ColumnDef<Planificaciones>[] = [
    {
        accessorKey: "id",
        header: "Id",

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
    },
    {
        accessorKey: "area_nombre",
        header: "Area",
    },
    {
        accessorKey: "asignatura_nombre",
        header: "Asignatura",
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
            console.log(getValue())
            return <Badge variant={(getValue() == 'pendiente' || getValue() == null) ? 'destructive' : 'default'}>{getValue() == null? 'pendiente' : getValue()}</Badge>

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