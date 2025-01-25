import { Skeleton } from "@/components/ui/skeleton";

const CardSkeletonItems = () => {
    return (
        <div className="flex flex-col overflow-hidden border rounded-lg hover:shadow-lg transition-shadow duration-300">
            {/* CardHeader */}
            <div className="flex flex-row items-center gap-4 p-4 pb-2">
                {/* Avatar */}
                <Skeleton className="w-16 h-16 rounded-full" /> {/* Simula el Avatar */}

                {/* Nombre y ID del profesor */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-[150px]" /> {/* Simula el nombre del profesor */}
                    <Skeleton className="h-4 w-[80px]" /> {/* Simula el ID del profesor */}
                </div>
            </div>

            {/* CardContent */}
            <div className="p-4 flex-grow">
                {/* Nombre del área */}
                <Skeleton className="h-5 w-[120px] mb-2" /> {/* Simula el nombre del área */}

                {/* ID del área */}
                <Skeleton className="h-4 w-[100px]" /> {/* Simula el ID del área */}

                {/* Fecha de ingreso */}
                <div className="flex items-center mt-4">
                    <Skeleton className="h-4 w-[140px]" /> {/* Simula la fecha de ingreso */}
                </div>
            </div>

            {/* CardFooter */}
            <div className="bg-gray-50 flex justify-between items-center p-4">
                {/* Botón Editar */}
                <Skeleton className="h-9 w-[80px]" /> {/* Simula el botón Editar */}

                {/* Botón Eliminar */}
                <Skeleton className="h-9 w-[90px]" /> {/* Simula el botón Eliminar */}
            </div>
        </div>
    );
};

export default CardSkeletonItems;