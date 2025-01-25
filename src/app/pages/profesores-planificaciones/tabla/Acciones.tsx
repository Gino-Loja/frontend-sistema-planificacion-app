import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem
    , DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDataStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { NotebookTabs, EllipsisVertical, FilePenLine, FileX2 } from "lucide-react";
import { Planificaciones } from "./columns";
import { CustomDialog } from "../../Dialog";
import { useAuth } from "@/context/AuthContext";
import { isRouteAuthorized } from "@/config/routes.config";
import { useCustomQueryStates } from "@/app/hooks/useSearchParams";


export default function Acciones({ data }: { data: Planificaciones }) {
    const { setData, setType } = useDataStore();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {  mes, year } = useCustomQueryStates();

    const authorizeDelete = isRouteAuthorized('/dashboard-admin/planificaciones-profesores/eliminar', user?.role!!);
    const authorizeEdit = isRouteAuthorized('/dashboard-admin/planificaciones-profesores/editar', user?.role!!);
    
    console.log(authorizeDelete)


    return (
        <DropdownMenu >
            <DropdownMenuTrigger >
                <EllipsisVertical />

            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 p-2 shadow-md bg-background rounded-box"
            >
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                {/* Opción Editar */}
                {authorizeEdit && (
                    <>
                        <DropdownMenuItem
                            onClick={() => {
                                setData(data);
                                setType("update");
                                navigate("/dashboard-admin/planificaciones-profesores/editar");
                            }}
                        >
                            <FilePenLine /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}

                {/* Opción Eliminar */}
                {authorizeDelete && (
                    <>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <FileX2 /> <CustomDialog
                                url={`/planificacion/delete/${data.id_planificacion}`}
                                title={" Planificación"}
                                path={`/planificacion/search/?query=${data.periodo_id}&year=${year}&mes=${mes}`}
                            />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}

                {/* Opción Ver Estado */}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => {
                    setData(data)
                    navigate("/dashboard/mis-planificaciones/profesor");

                }}> <NotebookTabs /> Ver Estado</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}