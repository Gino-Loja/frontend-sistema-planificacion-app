// import { AxiosInstance } from "@/api/axios";
// import { Button } from "@/components/ui/button"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import { Form } from "@/components/ui/form";
// import { ReloadIcon } from "@radix-ui/react-icons";
// import React from "react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from 'react-hot-toast';
// import { useSWRConfig } from "swr";
// //import createHistory from 'history/createBrowserHistory'



// export function CustomDialog({ title, url, path }: { title: string, url: string, path: string }) {
//     const [loading, setLoading] = useState(false);
//     const { mutate } = useSWRConfig()


//     const [hasOpenDialog, setHasOpenDialog] = React.useState(false);

//     const form = useForm()
//     function handleDialogItemOpenChange(open: boolean) {
//         setHasOpenDialog(open);
//     }

//     function onSubmit() {
//         // Do something with the form values.
//         // ✅ This will be type-safe and validated.
//         setLoading(true);
//         AxiosInstance.delete(url)

//             .then(() => {
//                 mutate(path);
//                 setLoading(false);
//                 setHasOpenDialog(false);
//                 toast.success("Datos eliminados")

//             })
//             .catch((e) => {
//                 setLoading(false);
//                 setHasOpenDialog(false);
//                 toast.error(e.response.data.detail)
//             })

//     }

//     return (

//         <Dialog open={hasOpenDialog} onOpenChange={handleDialogItemOpenChange}>
//             <DialogTrigger>{title}</DialogTrigger>

//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>¿Estás seguro de eliminar el {title || "elemento"}?</DialogTitle>
//                     <DialogDescription>
//                         Esta acción no se puede deshacer.
//                         Esto eliminara se permanentemente y eliminara todos los datos asociados.
//                     </DialogDescription>
//                 </DialogHeader>



//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                         <Button variant={'destructive'} className="w-full" type="submit" disabled={loading}>
//                             {loading ? (
//                                 <>
//                                     <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
//                                 </>
//                             ) : (
//                                 'Confirmar'
//                             )}
//                         </Button>
//                     </form>
//                 </Form>





//             </DialogContent>

//         </Dialog>






//     )
// }


'use client'

import { useState } from "react"
import { useSWRConfig } from "swr"
import toast from 'react-hot-toast'

import { AxiosInstance } from "@/api/axios"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface CustomDialogProps {
    title: string
    url: string
    path: string
}

export function CustomDialog({ title, url, path }: CustomDialogProps) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const { mutate } = useSWRConfig()


    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            console.log(url, path)

            await AxiosInstance.delete(url)
            mutate(path)
            setOpen(false)
            toast.success("Datos eliminados correctamente")
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Error al eliminar los datos")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
                Eliminar
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>¿Eliminar {title}?</DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente el elemento y todos los datos asociados.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" disabled={loading}>
                            {loading ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

