import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"


import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { AxiosInstance } from "@/api/axios"
import toast from 'react-hot-toast';
import { ReloadIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import React from "react"
import AsyncSelect from "react-select/async"

const formSchema = z.object({
    profesor_id: z.string().min(1, { message: "El area es obligatorio." }),
    area_id: z.string().min(1, { message: "El area es obligatorio." })
});
interface SelectOption {
    value: string;
    label: string;
}
type FormSchema = z.infer<typeof formSchema>;

interface AsyncSelectFieldProps {
    name: keyof FormSchema;
    labelName: string;
    select: SelectOption | null;
    setSelect: React.Dispatch<React.SetStateAction<SelectOption | null>>;
    placeholder: string;
    loadOptions: (inputValue: string) => Promise<SelectOption[]>;
    defaultOptions?: boolean | SelectOption[];
}

import { useDataStore } from "@/store"
import { mutate } from "swr"



export default function FormAreas() {
    const { isOpen, setIsOpen, type } = useDataStore()
    return (
        <div className="w-full">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="w-full">
                    <SheetHeader>
                        <SheetTitle> Formulario de Asignación de Profesor</SheetTitle>
                        <SheetDescription>
                            Ingrese los datos del profesor
                        </SheetDescription>
                    </SheetHeader>

                    <FormAsignatura />

                </SheetContent>
            </Sheet>
        </div>

    )
}



const FormAsignatura = () => {
    const { data: storeData, type } = useDataStore();

    const [loading, setLoading] = useState(false);
    const [selectedArea, setSelectedArea] = useState<SelectOption | null>(null);
    const [selectedProfesor, setselectedProfesor] = useState<SelectOption | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            area_id: storeData?.area_id ? storeData?.area_id.toString() : '',
            profesor_id: storeData?.profesor_id ? storeData?.profesor_id.toString() : '',
        },
    })

    const loadArea = async (inputValue: string): Promise<SelectOption[]> => {
        try {
            const response = await AxiosInstance.get<{ id: number, nombre: string }[]>(`area/areas/search?query=${inputValue}`);
            //const { data } = useSWR<{ id: number, nombre: string }[]>(`/area/areas/search?query=${inputValue}`, getfetcher)
            return response.data.map(area => ({
                value: area.id.toString(),
                label: area.nombre
            }));

        } catch (error) {
            console.error('Error loading areas:', error);
            return [];
        }
    };

    const loadProfessor = async (inputValue: string): Promise<SelectOption[]> => {
        try {
            const response = await AxiosInstance.get<{ id: number, nombre: string }[]>(`/profesor/search/directores-area/name?query=${inputValue}`);
            //const { data } = useSWR<{ id: number, nombre: string }[]>(`/area/areas/search?query=${inputValue}`, getfetcher)
            return response.data.map(profesor => ({
                value: profesor.id.toString(),
                label: profesor.nombre
            }));
        } catch (error) {
            console.error('Error loading profesores:', error);
            return [];
        }
    };

    React.useEffect(() => {
        const loadInitialArea = async () => {
            setSelectedArea({
                value: storeData?.area_id.toString(),
                label: storeData?.area_nombre
            })
            setselectedProfesor({
                value: storeData?.profesor_id.toString(),
                label: storeData?.profesor_nombre
            })
        };

        if (type === "update") {
            loadInitialArea();
        }

    }, [storeData])


    function onSubmit(values: z.infer<typeof formSchema>) {

        setLoading(true);

        if (type === "create") {
            AxiosInstance.post('/area/areas-profesor/', values)
                .then(() => {
                    setLoading(false);
                    form.reset();
                    form.setValue("profesor_id", "");
                    form.setValue("area_id", "");
                    toast.success("Datos guardados")
                    mutate('/area/areas-profesor/search');

                })
                .catch((e) => {
                    setLoading(false);
                    toast.error(e.response.data.detail)
                })
        } else {
            
           
            AxiosInstance.put(`/area/areas-profesor/update/${storeData?.id}`, values)
            .then(() => {
                setLoading(false);
                form.reset();
 
                toast.success("Datos actualizados")
                mutate('/area/areas-profesor/search');

            })
            .catch((e) => {
                setLoading(false);
                toast.error(e.response.data.detail)
            })
        }




        // toast.promise(
        //     AxiosInstance.post('/profesor/create', values)
        //     ,
        //     {
        //         loading: 'Saving...',
        //         success: (r) => {

        //             form.reset();
        //             return <b>Saved!</b>
        //         },
        //         error: <b>Could not save.</b>,
        //     }
        // );


    }

    const AsyncSelectField = ({
        name,
        labelName,
        placeholder,
        select,
        setSelect,
        loadOptions,
        defaultOptions
    }: AsyncSelectFieldProps) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{labelName}</FormLabel>
                    <FormControl>
                        <Controller
                            name={name}
                            control={form.control}
                            render={({ field: { onChange, value, ref } }) => (
                                <AsyncSelect
                                    ref={ref}
                                    cacheOptions
                                    defaultOptions={defaultOptions}
                                    value={select}
                                    loadOptions={loadOptions}
                                    onChange={(option) => {
                                        setSelect(option);
                                        onChange(option?.value);
                                    }}
                                    placeholder={placeholder}
                                    className="w-72"
                                    isClearable
                                    loadingMessage={() => "Cargando..."}
                                    noOptionsMessage={({ inputValue }) =>
                                        inputValue ? "No se encontraron resultados" : "Escriba para buscar..."
                                    }
                                />
                            )}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );


    return (
        <div className="border-2 border-gray-300 rounded-md p-4 w-full mt-2">
            <Form  {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <AsyncSelectField
                        select={selectedArea}
                        setSelect={setSelectedArea}
                        name="area_id"
                        labelName="Area"
                        placeholder="Buscar Area..."
                        loadOptions={loadArea}
                        defaultOptions
                    />

                    <AsyncSelectField
                        select={selectedProfesor}
                        setSelect={setselectedProfesor}
                        name="profesor_id"
                        labelName="Profesor"
                        placeholder="Buscar Profesor..."
                        loadOptions={loadProfessor}
                        defaultOptions
                    />

                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            'Guardar'
                        )}
                    </Button>
                </form>
            </Form>

        </div>

    )
}