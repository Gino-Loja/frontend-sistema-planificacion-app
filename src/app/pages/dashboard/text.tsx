import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import useSWR from "swr";
import { getfetcher } from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";


const colorPalette = [

  "hsl(180, 70%, 50%)",  // Cyan
  "hsl(240, 70%, 50%)",  // Azul
  "hsl(270, 70%, 50%)",  // Morado
  "hsl(300, 70%, 50%)",  // Rosa
  "hsl(330, 70%, 50%)",  // Magenta
  "hsl(210, 70%, 50%)",  // Azul claro
  "hsl(90, 70%, 50%)",   // Verde claro
  "hsl(150, 70%, 50%)",  // Verde azulado
  "hsl(200, 70%, 50%)",  // Azul verdoso
  "hsl(250, 70%, 50%)",  // Azul oscuro
  "hsl(280, 70%, 50%)",  // Morado oscuro,
  "hsl(0, 70%, 50%)",    // Rojo
  "hsl(30, 70%, 50%)",   // Naranja
  "hsl(60, 70%, 50%)",   // Amarillo
  "hsl(120, 70%, 50%)",  // Verde
];





export default function GraficoAsignaturas({ profesorId, periodoId }: { profesorId: number; periodoId: number }) {

  const { data: asignaturas, error, isLoading } = useSWR<
    Array<{
      id_asignatura: number;
      nombre_asignatura: string;
      codigo_asignatura: string;
      total_planificaciones: number;
    }>
  >(`/dashboard/asignaturas-con-planificaciones/${profesorId}/${periodoId}`, getfetcher);


  if (isLoading) return (

    <div className="p-7">
      <Skeleton className="h-[300px]" />
    </div>
  );

  if (!asignaturas) return <div>Error...</div>;


  const config: { [key: string]: { label: string; color: string } } = asignaturas.reduce((acc, item, index) => {
    acc[item.nombre_asignatura] = {
      label: item.nombre_asignatura.charAt(0).toUpperCase() + item.nombre_asignatura.slice(1),
      color: colorPalette[index % colorPalette.length] || 'hsl(var(--chart-5))'
    }
    return acc
  },
    {} as { [key: string]: { label: string; color: string } });

  const Bardata = asignaturas.map((item) => {
    return {
      nombre_asignatura: item.nombre_asignatura,
      total_planificaciones: item.total_planificaciones,
      fill: config[item.nombre_asignatura].color
    }
  })




  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Total de Planificaciones por Asignatura</CardTitle>
        <CardDescription>Comparación del número de planificaciones entre asignaturas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}

        >
          <BarChart data={Bardata} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre_asignatura" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value} Planificaciones`} />} />
            <Bar
              dataKey="total_planificaciones"

            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />




            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}