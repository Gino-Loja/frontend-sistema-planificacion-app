

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// "id_usuario": 5,
// "nombre_usuario": "Josbel Aguilar",
// "email": "ginoarkaniano@gmail.com",
// "estado": "activo"
export type DocentesActivos = {
    id_usuario: number,
    nombre: string,
    email: string,
    estado_docente: string
};

export const columns: ColumnDef<DocentesActivos>[] = [
    { accessorKey: "id_usuario", header: "Id" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
    {
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        accessorKey: "estado_docente", header: "Estado", cell: ({ getValue }) => {
            const value = getValue() as string;
            return value == "activo" ? <Badge variant="default">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>;
        },

    }

]