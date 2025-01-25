
import React from "react"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import useSWR from "swr"
import { getfetcher } from "@/api/axios"
import { Skeleton } from "@/components/ui/skeleton"

// Definimos el tipo para la estructura de datos
type PlanificacionAtrasadaData = {
    nombre: string
    total_atrasadas: number
}

// Propiedades para nuestro componente
interface ProfesoresPlanificacionesAtrasadasChartProps {
    periodo: number
}

export default function ProfesoresPlanificacionesAtrasadasChart({
    periodo,
}: ProfesoresPlanificacionesAtrasadasChartProps) {
    // Ordenamos los datos de mayor a menor cantidad de planificaciones atrasadas
    const { data, isLoading } = useSWR<{
        total_atrasadas: number;
        nombre: string;

    }[]>(`/dashboard/metricas/profesores-con-mas-planificaciones-atrasadas/?periodo_id=${periodo}`, getfetcher);

    if (isLoading) return <Skeleton className="h-[310px] w-full" />
    if (!data) return <div>No se encontraron datos</div>

    const sortedData = [...data].sort((a, b) => b.total_atrasadas - a.total_atrasadas)

    return (
        <div className="h-full w-full ">
            <ChartContainer
                config={{
                    total_atrasadas: {
                        label: "Planificaciones Atrasadas: ",
                        color: "hsl(var(--chart-4))",
                    },
                }}
            >

                <BarChart data={sortedData} layout="vertical" margin={{ top: 10, bottom: 5, right: 10}}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nombre" type="category" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total_atrasadas" fill="var(--color-total_atrasadas)" radius={8} />
                </BarChart>
            </ChartContainer>
        </div>



    )
}

