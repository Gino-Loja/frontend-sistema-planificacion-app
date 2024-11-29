import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem
    , DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDataStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { NotebookTabs, EllipsisVertical, FilePenLine, FileX2 } from "lucide-react";
import { Planificaciones } from "./columns";
import { CustomDialog } from "../../Dialog";


export default function Acciones({ data }: { data: Planificaciones }) {
    const { setData, setType } = useDataStore();
    const navigate = useNavigate();

    return (
        <DropdownMenu >
            <DropdownMenuTrigger >
                <EllipsisVertical />

            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 p-2 shadow-md bg-background rounded-box"
            >
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem

                    onClick={() => {
                        setData(data)
                        console.log(data)
                        setType("update")
                        navigate("/planificaciones-profesores/editar");
                    }
                    }
                // onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                    <FilePenLine />Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <FileX2 /> <CustomDialog path={`/planificacion/search/?query=${data.periodo_id}`} title={"Eliminar Planificacion"} url={`/profesor/${data.id}`} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={()=>{
                    setData(data)
                    navigate("/planificaciones-profesores/profesor");

                }}> <NotebookTabs /> Ver Estado</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}