import { Skeleton } from "@/components/ui/skeleton";

const PlanningSkeleton = () => {
    return (
        <div className="space-y-3 p-4 border rounded">
            {/* Primera línea: Nombre de la asignatura */}
            <div className="flex items-center space-x-2 text-sm">
                <Skeleton className="h-4 w-[120px]" /> {/* Simula el nombre de la asignatura */}
            </div>

            {/* Segunda línea: Área */}
            <div className="flex items-center space-x-2 text-sm">
                <Skeleton className="h-4 w-[100px]" /> {/* Simula el nombre del área */}
            </div>

            {/* Tercera línea: Fecha de subida */}
            <div className="flex items-center space-x-2 text-sm">
                <Skeleton className="h-4 w-[140px]" /> {/* Simula la fecha de subida */}
            </div>

            {/* Descripción */}
            <div className="space-y-2 mt-2">
                <Skeleton className="h-3 w-full" /> {/* Simula la primera línea de la descripción */}
                <Skeleton className="h-3 w-[80%]" /> {/* Simula la segunda línea de la descripción */}
            </div>
            <div className="flex items-center space-x-2 text-sm">
                <Skeleton className="h-4 w-[120px]" /> {/* Simula el nombre de la asignatura */}
            </div>

            {/* Segunda línea: Área */}
            <div className="flex items-center space-x-2 text-sm">
                <Skeleton className="h-4 w-[100px]" /> {/* Simula el nombre del área */}
            </div>

            {/* Tercera línea: Fecha de subida */}
            <div className="flex items-center space-x-2 text-sm">
                <Skeleton className="h-4 w-[140px]" /> {/* Simula la fecha de subida */}
            </div>

            {/* Descripción */}
            <div className="space-y-2 mt-2">
                <Skeleton className="h-3 w-full" /> {/* Simula la primera línea de la descripción */}
                <Skeleton className="h-3 w-[80%]" /> {/* Simula la segunda línea de la descripción */}
            </div>
        </div>
    );
};

export default PlanningSkeleton;