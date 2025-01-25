import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem
    , DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDataStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { NotebookTabs, UserPen, Wrench, UserX } from "lucide-react";
import { Profesor } from "./columns";
import { CustomDialog } from "../Dialog";


export default function Acciones({ data }: { data: Profesor }) {
    const { setData, setType } = useDataStore();
    const navigate = useNavigate();

    return (
        <DropdownMenu >
            <DropdownMenuTrigger >
                <Wrench color="#22c55e" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 p-2 shadow-md bg-background rounded-box"
            >
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem

                    onClick={() => {
                        setData(data)
                        setType("update")

                        navigate("/dashboard-admin/profesores/editar");
                    }
                    }
                // onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                    <UserPen />Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <UserX /> <CustomDialog path="/profesor" title={" Profesor"} url={`/profesor/${data.id}`} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />



            </DropdownMenuContent>
        </DropdownMenu>
    )
}