
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem
    , DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Book, EllipsisVertical, Settings2, Trash2 } from "lucide-react";
import { useDataStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { AreaProfesor } from "./columns";
import { CustomDialog } from "../../Dialog";
import FormAreas from "../FormAreas";
export default function AccionesAreasProfesor({ data }: { data: AreaProfesor }) {

    const { setData, setType, setIsOpen } = useDataStore();

    return (<DropdownMenu >
        <DropdownMenuTrigger >
            <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent
            className="w-56 p-2 shadow-md bg-background rounded-box"
        >
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
                // onSelect={(e) => e.preventDefault()}
                onClick={() => {
                    setData(data)
                    setType("update")
                    setIsOpen(true)
                }
                }
            // onClick={() => navigator.clipboard.writeText(payment.id)}
            >
                <Settings2 />  Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={

                (e) => {

                    e.preventDefault()
                }

            }>
                <Trash2 />  <CustomDialog path="/area/areas-profesor/search" title={"Eliminar Periodo"} url={`/area/areas-profesor/delete/${data.id}`} />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>)
}