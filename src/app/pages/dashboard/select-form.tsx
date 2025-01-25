
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useSWR from "swr";
import { getfetcher } from "@/api/axios";
import { useCustomQueryStates } from "@/app/hooks/useSearchParams";

export default function SelectForm() {

    const { data: ultimoPeriodo, isLoading: isLoadingPeriodo } = useSWR<{ id: number, nombre: string }>('/periodo/last', getfetcher);

    const { data, isLoading } = useSWR<{ id: number, nombre: string }[]>(`/periodo/periodo/`, getfetcher);
    const { setCoordinates } = useCustomQueryStates();

    React.useEffect(() => {
        if (ultimoPeriodo) {
            setCoordinates({ periodo: ultimoPeriodo.id.toString() })
        }
    }, [ultimoPeriodo]) 


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>No data</div>;
    }

    return (
        <Select onValueChange={(value) => setCoordinates({ periodo: value })}>
            <SelectTrigger  className="w-[200px]">
                <SelectValue placeholder="Seleccione un periodo" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup >
                    <SelectLabel>Periodos</SelectLabel>
                    {
                        data.map((item) => (
                            <SelectItem 
                                
                                key={item.id} value={item.id.toString()}
                                
                                >
                                {item.nombre}
                            </SelectItem>
                        ))
                    }

                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
