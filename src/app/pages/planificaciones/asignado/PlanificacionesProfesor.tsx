import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, FileUp, Loader2, ClockAlert } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataStore } from '@/store';
import PdfView from '../PdfView';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosInstance, getfetcher } from '@/api/axios';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { useAuth } from '@/context/AuthContext';
import { statusColorMap } from '../tabla/columns';
import { Badge } from '@/components/ui/badge';
import FormComentario from './form-comentario';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { format, addHours } from 'date-fns';

const formSchema = z.object({
  pdf: z.instanceof(File).refine((file) => file.size <= 3 * 1024 * 1024, {
    message: "El pdf debe ser menor a 3 MB.",
  }),
  id_planificacion: z.number(),
  area_codigo: z.string(),
  id_usuario: z.number(),
  nombre_asignatura: z.string(),
  periodo_nombre: z.string(),
})

const PlanificacionesAsignadoProfesor = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { data, setData } = useDataStore(); // Added clearData method
  const { user } = useAuth()


  if (!user) {
    return <div>Usted no está autenticado</div>
  }



  const fetchPdf = async (archivo: string) => {
    setLoadingFile(true);
    try {
      const response = await AxiosInstance.get('/planificacion/descargar-planificacion', {
        params: { ruta_archivo: archivo },
        responseType: 'blob',
      });

      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setLoadingFile(false);
      setPdfUrl(url);
    } catch (error) {
      setLoadingFile(false);
      
      toast.error("Error al cargar el archivo");
    }
  };

 


  // const { data: pdfUrl, error, isLoading } = useSWR(
  //   data?.archivo ? `/planificacion/descargar-planificacion?ruta_archivo=${data.archivo}` : null,
  //   () => fetchPdf(data.archivo)
  // );

  const form = useForm<z.infer<typeof formSchema>>({

    resolver: zodResolver(formSchema),

    defaultValues: {
      id_planificacion: data?.id,
      area_codigo: data?.area_codigo,
      id_usuario: user?.id,
      nombre_asignatura: data?.asignatura_nombre,
      periodo_nombre: data?.periodo_nombre,
    },
  })



  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    AxiosInstance.put('/planificacion/subir-pdf', values, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        setLoading(false);
        toast.success("Datos guardados")
      })
      .catch((e) => {
        setLoading(false);
        toast.error("Error al subir el archivo")
      })
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(URL.createObjectURL(file));
      form.setValue('pdf', file);
    } else {
      alert('Por favor, seleccione un archivo PDF válido');
    }
  };

  const formatDate = (dateString: string) => {
    console.log(dateString)
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const handleUploadAnotherDocument = () => {
    setSelectedFile(null);
    setPdfUrl(null);
    setLoading(false);
    setData({ ...data, archivo: null });
  };
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Juan Pérez",
      date: "2024-11-24T10:30:00Z",
      content: "Por favor revisar la sección de evaluación",
    },
    {
      id: 2,
      author: "Gino Loja",
      date: "2024-11-24T11:45:00Z",
      content: "Contenido actualizado según las observaciones",
    }
  ]);
  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Usuario Actual",
        date: new Date().toISOString(),
        content: newComment
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const getCurrentDateInEcuador = () => {
    const now = new Date(); // Fecha actual en UTC
    return addHours(now, -5); // Ajustamos a GMT-5 (Ecuador)
  };

  // Función para formatear la fecha en un formato legible
  const formatDateInEcuador = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  };

  // Función para verificar si la fecha de subida ha caducado
  const isFechaCaducada = (fechaSubida: string) => {
    const currentDate = getCurrentDateInEcuador();
    const fechaSubidaDate = new Date(fechaSubida);
    return currentDate > fechaSubidaDate;
  };

  const fechaVencimiento = isFechaCaducada(data?.fecha_subida);

  useEffect(() => {
    if (data?.archivo && !fechaVencimiento) {
      fetchPdf(data.archivo);
    }
    return () => {
      // Cleanup URL object when component unmounts
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [data?.archivo,fechaVencimiento]);




  return (
    <div className="container flex h-full min-h-screen gap-6 py-4 lg:grid-cols-2">
      {/* PDF Viewer Section */}
      <div className="w-3/5 rounded-lg border bg-card h-full shadow-lg">
        <form className="flex h-full flex-col " onSubmit={form.handleSubmit(onSubmit)}>
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Vista previa del documento</h3>


              {fechaVencimiento ? (
                <Badge className="text-sm" variant="destructive">Su entrega ha vencido</Badge>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    type='button'
                    onClick={handleUploadAnotherDocument}
                  >
                    Subir otro documento
                  </Button>
                  <Button
                    variant="outline"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FileUp className="mr-2 h-4 w-4" />
                        Guardar planificación
                      </>
                    )}
                  </Button>

                </div>

              )}


            </div>

            {
              form.formState.errors?.pdf?.message && <p className="text-sm text-red-500">{'Por favor, seleccione un archivo PDF'}</p>
            }
          </div>

          <div
            style={{ maxHeight: '800px' }}
            className="flex-1 bg-muted p-4"
          >
            {loadingFile && (
              <div className="flex h-full items-center justify-center">
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                  <span>Cargando archivo...</span>
                </div>
              </div>
            )}



            {!loadingFile && (
              fechaVencimiento ? ( // Si la fecha ha vencido
                <div className='flex h-full flex-col items-center justify-center rounded-lg border border-dashed'>
                  <ClockAlert color='red' width={50} height={50} />
                  <p className="text-sm text-muted-foreground">No puede subir el archivo porque su entrega ha vencido</p>
                </div>
              ) : (
                pdfUrl ? ( // Si hay un PDF cargado
                  <PdfView pdf={pdfUrl} />
                ) : selectedFile ? ( // Si hay un archivo seleccionado
                  <PdfView pdf={selectedFile} />
                ) : ( // Si no hay archivo seleccionado ni PDF cargado
                  <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
                    <div className="w-full">
                      <label htmlFor="file-input" className="block cursor-pointer">
                        <div className="flex h-full flex-col items-center justify-center">
                          <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Sube un archivo PDF para visualizarlo</p>
                        </div>
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        accept=".pdf"
                        {...form.register('pdf', { required: true })}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </form>

      </div>

      {/* Details Section */}
      <div className="w-2/5 space-y-6">
        <Tabs defaultValue="general" >
          <TabsList className='w-full'>
            <TabsTrigger className='w-full' value="general">General</TabsTrigger>
            <TabsTrigger className='w-full' value="comentarios">Comentarios</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <div className="flex justify-between items-center gap-4">
                  <CardTitle className="text-2xl font-semibold text-slate-800">
                    {data?.titulo}
                  </CardTitle>

                  <Badge style={{ backgroundColor: statusColorMap[data?.estado], color: '#ffffff' }}>
                    {data?.estado}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="space-y-6">
                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-slate-800">Detalles de la planificación</h4>
                      <Separator className="flex-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Asignatura</p>
                        <p className="text-slate-600">{data?.asignatura_nombre}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Área</p>
                        <p className="text-slate-600">
                          {data?.area_nombre} <span className="text-slate-400">({data?.area_codigo})</span>
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Profesor Asignado</p>
                        <p className="text-slate-600">{data?.profesor_nombre}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Periodo</p>
                        <p className="text-slate-600">{data?.periodo_nombre}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Curso</p>
                        <p className="text-slate-600">{data?.curso_nombre}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Fecha de subida</p>
                        <p className="text-slate-600">{formatDate(data?.fecha_subida)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Última actualización</p>
                        <p className="text-slate-600">{formatDate(data?.fecha_de_actualizacion)}</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-slate-800">Revisión</h4>
                      <Separator className="flex-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Revisor</p>
                        <p className="text-slate-600">{data?.profesor_revisor_nombre}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-700">Aprobador</p>
                        <p className="text-slate-600">{data?.profesor_aprobador_nombre}</p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-slate-800">Descripción</h4>
                      <Separator className="flex-1" />
                    </div>
                    <p className="text-slate-600 leading-relaxed">{data?.descripcion}</p>
                  </section>
                </div>
              </CardContent>
            </Card>

          </TabsContent>
          <TabsContent value="comentarios">
            <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle>Comentarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">



                <div className="space-y-4">
                  <div>
                    <Separator className="my-2" />
                    {/* <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card key={comment.id}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-muted-foreground">{formatDate(comment.date)}</span>
                            </div>
                            <p className="mt-2 text-sm">{comment.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div> */}
                    <ObtenerComentarios planificacion_profesor_id={data?.id} formateDate={formatDate} />
                  </div>


                  <div className="space-y-2">
                    <FormComentario
                      nombre_planificacion={data?.titulo}
                      periodo_nombre={data?.periodo_nombre}
                      planificacion_profesor_id={data?.id}
                      profesor_id={user?.id} />
                  </div>
                </div>
              </CardContent >
            </Card >
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

function ObtenerComentarios({ planificacion_profesor_id, formateDate }: { planificacion_profesor_id: number, formateDate: Function }) {
  const { data: comentarios, error: errorComentarios, isLoading: isLoadingComentarios, mutate } = useSWR<{
    id: number;
    id_profesor: number;
    planificacion_profesor_id: number;
    comentario: string;
    fecha_enviado: Date;
    nombre_profesor: string;
  }[]>('/planificacion/comentarios/?planificacion_profesor_id=' + planificacion_profesor_id, getfetcher);

  if (isLoadingComentarios) return (<div className="space-y-6">
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-px flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-px flex-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-px flex-1" />
      </div>
      <Skeleton className="h-20 w-full" />
    </section>
  </div>)
  if (!comentarios) return <div>Error al cargar los comentarios</div>


  return (
    <ScrollArea className="h-[350px]">

      <div className="space-y-4">

        {comentarios.map((comment) => (

          <Card key={comment.id}>
            <CardContent className="pt-4">

              <div className="flex justify-between text-sm">
                <span className="font-medium">{comment.nombre_profesor}</span>
                <span className="text-muted-foreground">{formateDate(comment.fecha_enviado)}</span>
              </div>
              <p className="mt-2 text-sm">{comment.comentario}</p>
            </CardContent>
          </Card>

        ))}

      </div>
    </ScrollArea>

  )
}

export default PlanificacionesAsignadoProfesor;
