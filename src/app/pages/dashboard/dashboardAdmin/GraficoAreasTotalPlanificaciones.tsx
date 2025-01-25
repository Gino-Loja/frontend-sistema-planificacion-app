
import React from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getfetcher } from "@/api/axios"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"

// Definimos el tipo para la estructura de datos
type PlanificacionData = {
    nombre: string
    total_planificaciones: number
}

// Propiedades para nuestro componente
interface PlanificacionesBarChartProps {
    periodo: number
}

export default function PlanificacionesAreaTotalBarChart({ periodo }: PlanificacionesBarChartProps) {

    const { data, isLoading:loadingDataPlanificacionesAreaTotalBarChart } = useSWR<PlanificacionData[]>('/dashboard/metricas/planificaciones-por-area?periodo_id=' + Number(periodo), getfetcher);



    if (loadingDataPlanificacionesAreaTotalBarChart) {return <Skeleton className="h-[310px] w-full" />}
    
    
    if (!data) return <div>No se encontraron datos</div>;

    return (

        <div className="h-full w-full ">
            <ChartContainer

                config={{
                    total_planificaciones: {
                        label: "Total de Planificaciones: ",
                        color: "hsl(var(--chart-2))",
                    },
                }}
            >
                <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre"
                        tickLine={false}
                        tickMargin={10}

                    />
                    <YAxis />

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                    />

                    <Bar dataKey="total_planificaciones" fill="var(--color-total_planificaciones)" radius={8} />
                </BarChart>
            </ChartContainer>
        </div>



    )
}


