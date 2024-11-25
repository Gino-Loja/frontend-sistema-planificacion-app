

import { ColumnDef } from "@tanstack/react-table"
import Acciones from "./Acciones";
import { format } from "date-fns";

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
    profesor_nombre: string;
    descripcion: string;
    fecha_subida: Date;
    asignatura_nombre: string;
    periodo_id: number;
    profesor_id: number;
    asignaturas_id: number;
    periodo_nombre: string;
};




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
        accessorKey: "descripcion",
        header: "Descripcion",
        enableHiding: true,
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