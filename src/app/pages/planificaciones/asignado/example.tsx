const fetchPdf = async (archivo: string) => {
    const response = await AxiosInstance.get('/planificacion/descargar-planificacion', {
      params: { ruta_archivo: archivo },
      responseType: 'blob',
    });
    return URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  };


  const { data: pdfUrl, error, isLoading } = useSWR(
    data?.archivo ? `/planificacion/descargar-planificacion?ruta_archivo=${data.archivo}` : null,
    () => fetchPdf(data.archivo)
  );