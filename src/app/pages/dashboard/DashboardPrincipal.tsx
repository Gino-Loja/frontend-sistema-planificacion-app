import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { BookOpen, Users, Layout, Clock, AlertCircle, CalendarDays } from "lucide-react"; // Import icons
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import { getfetcher } from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAuth } from "@/context/AuthContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import SelectForm from "./select-form";
import { useCustomQueryStates } from "@/app/hooks/useSearchParams";
import { format } from "date-fns"; // Asegúrate de importar la función format
import GraficoAsignaturas from "./text";
import PlanningSkeleton from "./PlaningSkeleton";

interface PlanningData {
    id_planificacion: string;
    titulo: string;
    descripcion: string;
    fecha_subida: string;
    estado: string;
    nombre_asignatura: string;
    nombre_area: string;
}
const statusColorMap = {
    'entregado': '#22c55e',//naranja
    'pendiente': '#fde047',//amarillo
    'atrasado': '#ef4444',//rojo
    'aprobado': '#3b82f6',//verde
    'revisado': '#a855f7'//azul
};

export default function DashboardPrincipal() {

    const { user } = useAuth()

    const { periodo } = useCustomQueryStates()


    const profesorId = user?.id;

    // Fetch data for "Mis Planificaciones por Estado"
    const { data: planificacionesPorEstado, isLoading: planificacionesPorEstadoLoading } = useSWR<
        { mis_planificaciones_por_estado: { [key: string]: number } }
    >(`dashboard/metricas/mis-planificaciones-por-estado/${profesorId}?periodo_id=${periodo}`, getfetcher);

    // Fetch data for "Mis Planificaciones Atrasadas"
    const { data: planificacionesAtrasadas, isLoading: planificacionesAtrasadasLoading } = useSWR<
        { mis_planificaciones_atrasadas: number }
    >(`dashboard/metricas/mis-planificaciones-atrasadas/${profesorId}?periodo_id=${periodo}`, getfetcher);

    // Fetch data for "Mis Planificaciones Próximas a Vencer"
    const { data: planificacionesProximas, isLoading: planificacionesProximasLoading } = useSWR<
        { mis_planificaciones_proximas_a_vencer: [{ titulo: string; fecha_subida: string, asignatura: string, codigo: string }] }
    >(`dashboard/metricas/mis-planificaciones-proximas-a-vencer/${profesorId}?periodo_id=${periodo}`, getfetcher);

    const { data: planificacionesAsignadas, isLoading: planificacionesAsignadasLoading } = useSWR<PlanningData[]>(`dashboard/planificaciones-asignadas/${profesorId}?periodo_id=${periodo}`, getfetcher);



    // Loading state for cards
    const LoadingCard = () => (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[140px]" />
            </CardContent>
        </Card>
    );

    return (
        <div className="p-8 space-y-8">

            <SelectForm />
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Card: Mis Planificaciones por Estado */}
                {
                    planificacionesPorEstadoLoading ? (
                        <LoadingCard />
                    ) : (
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Planificaciones asignadas para mi</CardTitle>
                                <Layout className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {Object.values(planificacionesPorEstado?.mis_planificaciones_por_estado || {}).length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No hay planificaciones asignadas</div>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">
                                            {Object.values(planificacionesPorEstado?.mis_planificaciones_por_estado || {}).reduce((a, b) => a + b, 0)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Total de planificaciones
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )
                }

                {/* Card: Mis Planificaciones Atrasadas */}
                {
                    planificacionesAtrasadasLoading ? (
                        <LoadingCard />
                    ) : (
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Planificaciones Atrasadas</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {planificacionesAtrasadas?.mis_planificaciones_atrasadas === 0 ? (
                                    <div className="text-sm text-muted-foreground">No hay planificaciones atrasadas</div>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">{planificacionesAtrasadas?.mis_planificaciones_atrasadas || 0}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Planificaciones fuera de plazo
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )
                }

                {/* Card: Mis Planificaciones Próximas a Vencer */}
                {
                    planificacionesProximasLoading ? (
                        <LoadingCard />
                    ) : (
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Próximas a Vencer</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {planificacionesProximas?.mis_planificaciones_proximas_a_vencer?.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">No hay planificaciones próximas a vencer</div>
                                ) : (
                                    <>
                                        <div className="text-2xl font-bold">{planificacionesProximas?.mis_planificaciones_proximas_a_vencer?.length || 0}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Planificaciones con fecha límite próxima
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )
                }
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Pie Chart: Mis Planificaciones por Estado */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estado de Mis Planificaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">

                        {
                            planificacionesPorEstadoLoading ? (
                                <Skeleton className="h-[300px]" />
                            ) : (
                                Object.values(planificacionesPorEstado?.mis_planificaciones_por_estado || {}).length === 0 ? (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        No hay datos para mostrar
                                    </div>
                                ) : (
                                    <GraficoEstadoPlanificaciones data={planificacionesPorEstado?.mis_planificaciones_por_estado} />
                                )
                            )
                        }
                    </CardContent>
                </Card>

                {/* Table: Mis Planificaciones Próximas a Vencer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Planificaciones Próximas a Vencer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px]">
                            {
                                planificacionesProximasLoading ? (
                                    <PlanningSkeleton />
                                ) : (
                                    planificacionesProximas?.mis_planificaciones_proximas_a_vencer?.length === 0 ? (
                                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                            No hay planificaciones con fecha límite próxima
                                        </div>
                                    ) : (
                                        <ul>
                                            {planificacionesProximas?.mis_planificaciones_proximas_a_vencer?.map((planificacion, index) => (
                                                <li key={index} className="py-2 border-b">
                                                    <div className="font-medium">{planificacion.titulo}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Fecha límite: {format(new Date(planificacion.fecha_subida), "dd/MM/yyyy HH:mm")}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                )
                            }
                        </ScrollArea>
                    </CardContent>
                </Card>


                {
                    planificacionesAsignadasLoading ? (
                        <PlanningSkeleton />
                    ) : (

                        <Card>
                            <CardHeader>
                                <CardTitle>Descripcion de Planificaciones Asignadas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    {
                                        planificacionesAsignadasLoading ? (
                                            <PlanningSkeleton />
                                        ) : (
                                            planificacionesAsignadas?.length === 0 ? (
                                                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                                    No hay planificaciones asignadas
                                                </div>
                                            ) : (
                                                <PlanningAccordion data={planificacionesAsignadas} />
                                            )
                                        )
                                    }
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    )
                }


                <GraficoAsignaturas periodoId={Number(periodo)} profesorId={Number(profesorId)} />





            </div>
        </div>
    );
};

// Componente para el gráfico de estado de planificaciones
const GraficoEstadoPlanificaciones = ({ data }: { data?: { [key: string]: number } }) => {
    // Map each status to a specific chart color variable



    if (!data) {
        return <div>Error al cargar los datos</div>;
    }


    const pieData = Object.entries(data).map(([estado, total]) => ({
        name: estado,
        value: total,
        fill: statusColorMap[estado as keyof typeof statusColorMap] || 'hsl(var(--chart-5))'
    }));

    const chartConfig = {
        atrasado: {
            label: "Visitors",
            color: statusColorMap['atrasado'],
        },
        aprobado: {
            label: "Aprobado",
            color: statusColorMap['aprobado'],

        },
        pendiente: {
            label: "Entregado",
            color: statusColorMap['pendiente'],
        },
        entregado: {
            label: "Pendiente",
            color: statusColorMap['entregado'],
        },

    } satisfies ChartConfig

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground p-3 text-xs"
        >
            <PieChart>
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Legend />
            </PieChart>
        </ChartContainer>
    );
};

interface PlanningAccordionProps {
    data?: PlanningData[];
}

const PlanningAccordion = ({ data }: PlanningAccordionProps) => {
    return (
        <Accordion type="single" collapsible className="w-full">
            {data?.map((planning) => (
                <AccordionItem key={planning.id_planificacion} value={planning.id_planificacion}>
                    <AccordionTrigger className="relative">
                        <span>{planning.titulo}</span>
                        <Badge style={{ backgroundColor: statusColorMap[planning.estado as keyof typeof statusColorMap], color: '#ffffff' }}>
                            {planning.estado}
                        </Badge>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3 p-4 border rounded">
                            <div className="flex items-center space-x-2 text-sm">
                                <BookOpen className="w-4 h-4 " />
                                <span className="text-muted-foreground text-bold">
                                    {planning.nombre_asignatura}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                                <Layout className="w-4 h-4 " />
                                <span className="text-muted-foreground">
                                    {planning.nombre_area}
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm">
                                <CalendarDays className="w-4 h-4 " />
                                <span className="text-muted-foreground">
                                    {format(new Date(planning.fecha_subida), "dd/MM/yyyy HH:mm")}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">
                                {planning.descripcion}
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};




