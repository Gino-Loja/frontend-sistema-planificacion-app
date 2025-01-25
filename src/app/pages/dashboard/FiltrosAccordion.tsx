import React from "react";
import { Input } from "@/components/ui/input";
import { DynamicFilter } from "./DynamicFilter"; // Usamos el componente DynamicFilter que creamos anteriormente

interface FiltrosAccordionProps {
    filter?: string;
    onFilterChange?: (value: string) => void;
    onAreaFilterChange?: (values: string[]) => void;
    onAsignaturaFilterChange?: (values: string[]) => void;
    onCursoFilterChange?: (values: string[]) => void;
    onEstadoFilterChange?: (values: string[]) => void;
    areas?: { label: string; value: string }[];
    asignaturas?: { label: string; value: string }[];
    cursos?: { label: string; value: string }[];
    estados?: { label: string; value: string }[];
}

export function FiltrosAccordion({
    filter,
    onFilterChange,
    onAreaFilterChange,
    onAsignaturaFilterChange,
    onCursoFilterChange,
    onEstadoFilterChange,
    areas,
    asignaturas,
    cursos,
    estados,
}: FiltrosAccordionProps) {
    return (
        <div className="flex gap-2 items-center align-middle w-full">
            {/* Filtro por nombre */}

            {(filter && onFilterChange) && <Input
                type="text"

                placeholder="Buscar por nombre del profesor"
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-full h-8"
            />
            }

            {/* Filtro por área */}
            {(areas && onAreaFilterChange) && <DynamicFilter
                title="Área"
                options={areas}
                onFilterChange={onAreaFilterChange}
            />
            }

            {/* Filtro por asignatura */}
            {(asignaturas && onAsignaturaFilterChange) && <DynamicFilter
                title="Asignatura"
                options={asignaturas}
                onFilterChange={onAsignaturaFilterChange}
            />}
            {/* Filtro por curso */}
            {(cursos && onCursoFilterChange) && <DynamicFilter
                title="Curso"
                options={cursos}
                onFilterChange={onCursoFilterChange}
            />}
            {/* Filtro por estado */}
            {(estados && onEstadoFilterChange) && <DynamicFilter
                title="Estado"
                options={estados}
                onFilterChange={onEstadoFilterChange}
            />}
        </div>
    );
}