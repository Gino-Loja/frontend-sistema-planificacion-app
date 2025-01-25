import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { BookOpen, Users, Layout } from "lucide-react"; // Import icons
import TablaDocentesActivos from "./tabla-docentes-activos/tabla";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import { AxiosInstance, getfetcher } from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import SelectForm from "./select-form";
import { useCustomQueryStates } from "@/app/hooks/useSearchParams";
import ProfesorPlanificacionAtrasadasAccordion from "./dashboardAdmin/PlanificacionesAtrasadas";
import PlanificacionesAreaTotalBarChart from "./dashboardAdmin/GraficoAreasTotalPlanificaciones";
import ProfesoresPlanificacionesAtrasadasChart from "./dashboardAdmin/ProfesoresPlanificacionesAtrasadasChart";
import PlanificacionesEstadoAreaChart from "./dashboardAdmin/PlanificacionesEstadoAreaChart";
import { PlanificacionesTablaAdmin } from "./dashboardAdmin/PlanificacionesTablaAdmin";
import { Button } from "@/components/ui/button"

import { useState } from "react";

const DashboardAdmin = () => {

    const { periodo } = useCustomQueryStates()
    const [loadingPlanificaciones, setLoadingPlanificaciones] = useState(false);

    const { data: totalAreas, error, isLoading: totalAreasIsLoading, mutate } = useSWR<
        {
            total_areas: number
        }
    >('/dashboard/areas/count', getfetcher);


    const { data: totalProfesores, isLoading: totalProfesoresLoading } = useSWR<
        {
            total: number
        }
    >('/dashboard/profesores/count', getfetcher);

    const { data: totalAsignaturas, isLoading: totalAsignaturasIsLoading } = useSWR<
        {
            total_asignaturas: number
        }
    >('/dashboard/asignaturas/count', getfetcher);

    const { data: totalPlanificacionesAsignadas, isLoading: IsloadingtotalPlanificacionesAsignadas } = useSWR<{
        total_planificaciones_asignadas: number;

    }>(`/dashboard/metricas/total-planificaciones-asignadas/?periodo_id=${periodo}`, getfetcher);


    const downloadPlanificacionesExcel = (periodo_id: number) => {
        setLoadingPlanificaciones(true); // Activar el estado de carga

        AxiosInstance.get(`/dashboard/download-planificaciones-excel/?periodo_id=${periodo_id}`, {
            responseType: 'blob', // Indicar que la respuesta es un archivo binario (blob)
        })
            .then((response) => {
                // Crear una URL para el archivo descargado
                const url = window.URL.createObjectURL(new Blob([response.data]));

                // Crear un enlace temporal para la descarga
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `planificaciones_periodo_${periodo_id}.xlsx`); // Nombre del archivo
                document.body.appendChild(link);

                // Simular un clic en el enlace para iniciar la descarga
                link.click();

                // Eliminar el enlace temporal
                document.body.removeChild(link);

                // Desactivar el estado de carga
                setLoadingPlanificaciones(false);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
                setLoadingPlanificaciones(false); // Desactivar el estado de carga en caso de error
            });
    };





    // Static data as provided






    // Transform data for pie chart





    // Updated colors according to requirements



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

            {/* Stats Cards with improved design */}


            <div className="flex flex-row justify-between items-center">
                <SelectForm />
                <Button
                    className=""
                    onClick={() => downloadPlanificacionesExcel(Number(periodo))}
                    type="submit"
                    disabled={loadingPlanificaciones}
                >
                    {loadingPlanificaciones ? 'Descargando...' : 'Descargar Reporte'}
                </Button>
            </div>



            <div className="grid gap-6 md:grid-cols-4">


                {
                    totalAreasIsLoading ? (
                        <LoadingCard />
                    ) : (
                        totalAreas && totalAreas.total_areas !== undefined ? (
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Áreas</CardTitle>
                                    <Layout className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalAreas.total_areas}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Áreas académicas activas
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div>Error al cargar los datos</div>
                        )
                    )
                }


                {
                    totalProfesoresLoading ? (
                        <LoadingCard />
                    ) : (
                        totalProfesores && totalProfesores.total !== undefined ? (
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Profesores</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalProfesores.total}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Profesores registrados
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div>Error al cargar los datos</div>
                        )
                    )
                }


                {
                    totalAsignaturasIsLoading ? (
                        <LoadingCard />
                    ) : (
                        totalAsignaturas && totalAsignaturas.total_asignaturas !== undefined ? (
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Asignaturas</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalAsignaturas.total_asignaturas}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Asignaturas activas
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div>Error al cargar los datos</div>
                        )
                    )
                }
                {
                    IsloadingtotalPlanificacionesAsignadas ? (
                        <LoadingCard />
                    ) : (
                        totalPlanificacionesAsignadas && totalPlanificacionesAsignadas.total_planificaciones_asignadas !== undefined ? (
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Planificaciones Asignadas</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalPlanificacionesAsignadas.total_planificaciones_asignadas}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Total de planificaciones asignadas en el periodo actual
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div>Error al cargar los datos</div>
                        )
                    )
                }
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Estado de Planificaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px] ">

                        <GraficoEstadoPlanificaciones />

                    </CardContent>
                </Card>

                {/* Space for future table implementation */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle> Docentes Activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[320px] flex items-center  text-muted-foreground w-full">
                            <ScrollArea className="scroll-container min-w-0">
                                <TablaDocentesActivos />
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>



                {/* <DataFeching /> */}
            </div>
            <div className="grid gap-4 md:grid-cols-5">

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle> Total de Planificaciones por Área</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center  w-full h-max-[320px]">
                            <PlanificacionesAreaTotalBarChart periodo={Number(periodo)} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle> Docentes con Planificaciones Atrasadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-max-[320px] flex items-center  w-full">
                            <ProfesorPlanificacionAtrasadasAccordion id_periodo={Number(periodo)} />
                        </div>
                    </CardContent>
                </Card>

            </div>
            <div className="grid gap-4 md:grid-cols-4">

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Profesores con Más Planificaciones Atrasadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex  w-full ">
                            <ProfesoresPlanificacionesAtrasadasChart periodo={Number(periodo)} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Planificaciones por Estado y Área</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex  w-full ">
                            <PlanificacionesEstadoAreaChart periodo={Number(periodo)} />
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div className="grid gap-4 md:grid-cols-1">

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Listado de Planificaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex  w-full ">
                            <PlanificacionesTablaAdmin perido_id={Number(periodo)} />
                        </div>
                    </CardContent>
                </Card>


            </div>

        </div>
    );
};


const GraficoEstadoPlanificaciones = () => {
    const { periodo } = useCustomQueryStates()


    const statusColorMap = {
        'entregado': '#22c55e',//naranja
        'pendiente': '#eab308',
        'atrasado': '#ef4444',
        'aprobado': '#3b82f6',
        'revisado': '#a855f7'
    };
    const { data: planificacionesPorEstado, isLoading: planificacionesPorEstadoIsloading } = useSWR<
        {

            aprobado: number,
            atrasado: number,
            pendiente: number
            entregado: number,
            revisado: number

        }
    >('/dashboard/planificaciones/count-by-estado/?periodo_id=' + Number(periodo), getfetcher);


    if (planificacionesPorEstadoIsloading) {
        return <Skeleton className="h-[300px]" />;
    }
    if (!planificacionesPorEstado) {
        return <div>Error al cargar los datos</div>;
    }

    const pieData = [
        { name: "Atrasado", value: planificacionesPorEstado.atrasado, fill: statusColorMap['atrasado'] },
        { name: "Aprobado", value: planificacionesPorEstado.aprobado, fill: statusColorMap['aprobado'] },
        { name: "Pendiente", value: planificacionesPorEstado.pendiente, fill: statusColorMap['pendiente'] },
        { name: "Entregado", value: planificacionesPorEstado.entregado, fill: statusColorMap['entregado'] },
        { name: "Revisado", value: planificacionesPorEstado.revisado, fill: statusColorMap['revisado'] },
    ];


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
            className="mx-auto aspect-square max-h-[300px] w-full pb-0 [&_.recharts-pie-label-text]:fill-foreground p-3 text-xs"
            config={chartConfig}
        >
            {/* <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={chartData} dataKey="visitors" label nameKey="browser" />

                </PieChart> */}

            <PieChart>
                <Pie label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    data={pieData} dataKey="value" nameKey="name" >


                </Pie>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Legend />
            </PieChart>
        </ChartContainer>

    );


}

export default DashboardAdmin;