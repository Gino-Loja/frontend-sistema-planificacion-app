

import { ColumnDef } from "@tanstack/react-table"
import AccionesAreasProfesor from "./AccionesAreasProfesor";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AreaProfesor = {
    id: number;
    profesor_id: number;
    area_id: number;
    profesor_nombre: string;
    area_nombre: string;
    fecha_de_ingreso: Date;
 
};

export const columns: ColumnDef<AreaProfesor>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    { accessorKey: "profesor_nombre", header: "Nombre Profesor" },
    { accessorKey: "area_nombre", header: "Nombre Area" },
    { accessorKey: "profesor_id", header: "Id Profesor" },
    { accessorKey: "area_id", header: "Id Area" },
    { accessorKey: "fecha_de_ingreso", header: "Fecha de Ingreso" },
    {
        id: "Acciones",
        enableHiding: true,
        cell: ({ row }) => {
            return (
              
                <AccionesAreasProfesor data={row.original} />
            )

        },
    }
]