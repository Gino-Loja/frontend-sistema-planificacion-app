import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getfetcher } from "@/api/axios";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { FiltrosAccordion } from "../FiltrosAccordion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

// Definimos el tipo para la estructura de datos
type ProfesorPlanificacion = {
    id_profesor: number;
    nombre_profesor: string;
    titulo_planificacion: string;
    area_nombre: string;
    fecha_subida: string;
    asignatura_nombre: string;
};

// Propiedades para nuestro componente
interface ProfesorPlanificacionAccordionProps {
    id_periodo: number;
}

export default function ProfesorPlanificacionAtrasadasAccordion({ id_periodo }: ProfesorPlanificacionAccordionProps) {
    const { data, isLoading } = useSWR<ProfesorPlanificacion[]>('/dashboard/docentes/atrasados?periodo_id=' + Number(id_periodo), getfetcher);
    const [filter, setFilter] = useState("");

    const [areaFilter, setAreaFilter] = useState<string[]>([]);
    const [asignaturaFilter, setAsignaturaFilter] = useState<string[]>([]);
    if (isLoading) return <div>Cargando...</div>;
    if (!data) return <div>No se encontraron profesores atrasados</div>;

    // Filtrar los datos basados en el nombre del profesor
    // const filteredData = data.filter(plan =>
    //     plan.nombre_profesor.toLowerCase().includes(filter.toLowerCase())
    // );



    const areas = Array.from(new Set(data.map((plan) => plan.area_nombre))).map((area) => ({
        label: area,
        value: area,
    }));

    const asignaturas = Array.from(new Set(data.map((plan) => plan.asignatura_nombre))).map((asignatura) => ({
        label: asignatura,
        value: asignatura,
    }));

    const filteredData = data.filter((plan) => {
        const matchesNombre = plan.nombre_profesor.toLowerCase().includes(filter.toLowerCase());
        const matchesArea = areaFilter.length === 0 || areaFilter.includes(plan.area_nombre);
        const matchesAsignatura = asignaturaFilter.length === 0 || asignaturaFilter.includes(plan.asignatura_nombre);

        return matchesNombre && matchesArea && matchesAsignatura;
    });

    return (
        <div className="h-full w-full ">
            {/* Campo de búsqueda */}
            {/* <Input
                type="text"
                placeholder="Buscar por nombre del profesor"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            /> */}
            <FiltrosAccordion
                filter={filter}
                onFilterChange={setFilter}
                onAreaFilterChange={setAreaFilter}
                onAsignaturaFilterChange={setAsignaturaFilter}
                areas={areas}
                asignaturas={asignaturas}
            />

            {
                filteredData.length === 0 ? (
                    <div className="text-center items-center justify-center self-center">No se encontraron profesores atrasados</div>
                ) : (

                    <ScrollArea className="h-[300px] min-w-0 w-full">

                        <Accordion type="single" collapsible className="w-full">
                            {filteredData.map((plan) => (
                                <AccordionItem
                                    key={`${plan.id_profesor}-${plan.titulo_planificacion}`}
                                    value={`item-${plan.id_profesor}-${plan.titulo_planificacion}`}
                                >
                                    <AccordionTrigger className="text-left">
                                        <div>
                                            <div className="font-bold ">{plan.titulo_planificacion}</div>
                                            <div className="text-sm ">{plan.nombre_profesor}</div>
                                            <div className="text-sm ">{plan.asignatura_nombre} - {plan.area_nombre}</div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">ID Profesor:</span> {plan.id_profesor}
                                            </p>
                                            <p>
                                                <span className="font-medium">Fecha de subida: </span>
                                                {format(new Date(plan.fecha_subida), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}                                  </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </ScrollArea>

                )
            }


        </div>
    );
}