

import { ColumnDef } from "@tanstack/react-table"
import AccionesPeriodo from "./AccionesPeriodo";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Periodo = {
    id: number;
    nombre: string;
    descripcion: string;
    fecha_inicio: Date;
    fecha_creacion: Date;
    fecha_fin: Date;
};

export const columns: ColumnDef<Periodo>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    { accessorKey: "fecha_inicio", header: "Fecha Inicio" },
    { accessorKey: "fecha_fin", header: "Fecha Fin" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripcion" },
    {
        accessorKey: "fecha_creacion",
        header: "Fecha de Creacion",

    },


    {
        id: "Acciones",
        enableHiding: true,
        cell: ({ row }) => {
            return (
                <AccionesPeriodo data={row.original} />
            )

        },
    }
]