import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useSWR from "swr";
import { getfetcher } from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { FiltrosAccordion } from "../FiltrosAccordion";

// Definimos el tipo para la estructura de datos
type PlanificacionData = {
    nombre_area: string;
    fecha_subida: string; // Cambiado a string para facilitar el manejo
    estado: string;
    total_planificaciones: number;
};

// Propiedades para nuestro componente
interface PlanificacionesEstadoAreaChartProps {
    periodo: number;
}

export default function PlanificacionesEstadoAreaChart({ periodo }: PlanificacionesEstadoAreaChartProps) {
    const { data, isLoading } = useSWR<PlanificacionData[]>(
        `/dashboard/metricas/planificaciones-por-estado-por-area/?periodo_id=${periodo}`,
        getfetcher
    );
    const [areaFilter, setAreaFilter] = useState<string[]>([]);

    if (isLoading) return <Skeleton className="h-[310px] w-full" />;
    if (!data) return <div>No se encontraron datos</div>;

    // Validación de datos
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <p className="text-muted-foreground">No hay datos disponibles</p>;
    }

    // Obtener las áreas únicas para el filtro
    const areas = Array.from(new Set(data.map((plan) => plan.nombre_area))).map((area) => ({
        label: area,
        value: area,
    }));

    // Filtrar los datos por área
    const filteredData = data.filter((plan) => {
        const matchesArea = areaFilter.length === 0 || areaFilter.includes(plan.nombre_area);
        return matchesArea;
    });

    // Procesamos los datos para agruparlos por fecha y estado
    const processedData = filteredData.reduce((acc, curr) => {
        const date = new Date(curr.fecha_subida).toLocaleDateString("es-ES", { weekday: "short" });
        const existingDate = acc.find((item) => item.fecha === date);

        if (existingDate) {
            existingDate[curr.estado] = (existingDate[curr.estado] || 0) + curr.total_planificaciones;
        } else {
            acc.push({
                fecha: date,
                [curr.estado]: curr.total_planificaciones,
            });
        }
        return acc;
    }, [] as any[]);

    const estados = ["aprobado", "revisado", "entregado", "pendiente", "atrasado"];

    return (
        <div className="h-full w-full">
            {/* Filtros */}
            <FiltrosAccordion
                onAreaFilterChange={setAreaFilter}
                areas={areas}
            />

            {/* Gráfico */}
            <ChartContainer
                config={{
                    aprobado: {
                        label: "Aprobado",
                        color: "#3b82f6", // Azul
                    },
                    revisado: {
                        label: "Revisado",
                        color: "#a855f7", // Morado
                    },
                    entregado: {
                        label: "Entregado",
                        color: "#22c55e", // Verde
                    },
                    pendiente: {
                        label: "Pendiente",
                        color: "#eab308", // Amarillo
                    },
                    atrasado: {
                        label: "Atrasado",
                        color: "#ef4444", // Rojo
                    },
                }}
            >
                <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    {estados.map((estado) => (
                        <Bar
                            key={estado}
                            dataKey={estado}
                            stackId="a"
                            fill={`var(--color-${estado})`}
                            radius={[4, 4, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ChartContainer>
        </div>
    );
}