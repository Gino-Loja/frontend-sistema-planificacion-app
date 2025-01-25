import { AxiosInstance } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  comentario: z.string().min(2, { message: "Debe ingresar frases o palabras completas" }),
  profesor_id: z.number().int().positive(),
  planificacion_profesor_id: z.number().int().positive(),
  nombre_planificacion: z.string().min(2),
  periodo_nombre: z.string().min(2)
});

type FormValues = z.infer<typeof formSchema>;

interface FormComentarioProps {
  profesor_id: number;
  planificacion_profesor_id: number;
  nombre_planificacion: string;
  periodo_nombre: string;
}

export default function FormComentario({
  profesor_id,
  planificacion_profesor_id,
  nombre_planificacion,
  periodo_nombre
}: FormComentarioProps) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profesor_id,
      planificacion_profesor_id,
      nombre_planificacion,
      periodo_nombre,
      comentario: ""
    }
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    setLoading(true);
    try {
      await AxiosInstance.post('/planificacion/comentar-planificacion/', values);
      form.reset();
      mutate('/planificacion/comentarios/?planificacion_profesor_id=' + planificacion_profesor_id.toString());
      toast.success("Datos guardados");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="comentario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nuevo comentario</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Ingrese sus comentarios sobre la planificación..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}