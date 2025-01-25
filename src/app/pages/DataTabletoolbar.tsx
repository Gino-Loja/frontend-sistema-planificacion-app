import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { DataTableFacetedFilter } from "./DataTableFacetedFilter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useSWR from "swr"
import { getfetcher } from "@/api/axios"
import FiltrosDeFecha from "./planificaciones/tabla/filterDate"
import { FiltrosTabla } from "./FiltrosTabla"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const priorities = [


  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
]

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { data: periodos, error: periodosError, isLoading: isLoadingPeriodos } = useSWR<{ id: number, nombre: string }[]>('/periodo/periodo/', getfetcher);
  const { data: asignaturasData, isLoading: isLoadingAsignaturasData} = useSWR<{ id: number, nombre: string }[]>('/asignatura', getfetcher);



  const transformedPeriodos = periodos?.map(({ id, nombre }) => ({
    value: id.toString(),
    label: nombre,
  }))
  const transformedAsignauras = asignaturasData?.map(({ id, nombre }) => ({
    value: nombre,
    label: nombre,
  }))



  const estadorDocentes = [

    {
      label: "Inactivo",
      value: "inactivo",
    },
    {
      label: "Activo",
      value: "activo",
    },
  ]

  const areas = [

    {
      label: "EDUCACIÓN CULTURAL Y ARTÍSTICA",
      value: "EDUCACIÓN CULTURAL Y ARTÍSTICA",
    },
    {
      label: "EDUCACIÓN FÍSICA",
      value: "EDUCACIÓN FÍSICA",
    },
    {
      label: "CIENCIAS NATURALES",
      value: "CIENCIAS NATURALES",
    },
    {
      label: "CIENCIAS SOCIALES",
      value: "CIENCIAS SOCIALES",
    },
    {
      label: "LENGUA Y LITERATURA",
      value: "LENGUA Y LITERATURA",
    },
    {
      label: "MATEMÁTICA",
      value: "MATEMÁTICA",
    },
    {
      label: "LENGUA EXTRANJERA",
      value: "LENGUA EXTRANJERA",
    },
    {
      label: "TÉCNICA TIC - INFORMÁTICA",
      value: "TÉCNICA TIC - INFORMÁTICA",
    },
    {
      label: "INTERDISCIPLINAR",
      value: "INTERDISCIPLINAR",
    }

  ];

  const cursos = [
    {
      label: "Primero Bachillerato",
      value: "Primero Bachillerato",

    },
    {
      label: "Segundo Bachillerato",
      value: "Segundo Bachillerato",
    },
    {
      label: "Tercero Bachillerato",
      value: "Tercero Bachillerato",
    },
   
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="filtro..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* {table.getColumn("estado") && (
          <DataTableFacetedFilter
            column={table.getColumn("estado")}
            title="Priority"
            options={priorities}
          />
        )} */}

        {table.getColumn("periodo_id") && (
          <DataTableFacetedFilter
            title="Periodo"
            options={transformedPeriodos || []}
          />
        )}

        {table.getColumn("area_nombre") && (
          <FiltrosTabla
            column={table.getColumn("area_nombre")}
            title="Area"
            options={areas}
          />
        )}
        {
          table.getColumn("asignatura_nombre") && (
            <FiltrosTabla
              column={table.getColumn("asignatura_nombre")}
              title="Asignatura"
              options={transformedAsignauras || []}
            />
          )
        }
        {
          table.getColumn("curso_nombre") && (
            <FiltrosTabla
              column={table.getColumn("curso_nombre")}
              title="Curso"
              options={cursos}
            />
          )
        }
        

        {table.getColumn("estado_docente") && (
          <FiltrosTabla
            column={table.getColumn("estado_docente")}

            title="Estado"
            options={estadorDocentes}
          />
        )}



        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}

        {/* <FiltrosDeFecha /> */}


        {table.getColumn("fecha_subida") && (
          <FiltrosDeFecha />
        )}



      </div>

    </div>
  )
}