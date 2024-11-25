
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem
    , DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Book, Trash2, Wrench } from "lucide-react";
import { CustomDialog } from "../Dialog";
import { Periodo } from "./columns";
import { useDataStore } from "@/store";
import { useNavigate } from "react-router-dom";
export default function AccionesPeriodo({ data }: { data: Periodo }) {

    const { setData, setType } = useDataStore();
    const navigate = useNavigate();

    return (<DropdownMenu >
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

                    navigate("/periodo-lectivo/editar");
                }
                }
            // onClick={() => navigator.clipboard.writeText(payment.id)}
            >
                < Book />Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 />  <CustomDialog path="/periodo/periodo/" title={"Eliminar Periodo"} url={`/periodo/periodo/${data.id}`} />
            </DropdownMenuItem>

        </DropdownMenuContent>
    </DropdownMenu>)
}