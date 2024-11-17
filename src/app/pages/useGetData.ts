import { useState, useEffect } from "react";
import  { AxiosResponse } from "axios";
import { AxiosInstance } from "@/api/axios";

// Definimos un tipo para el estado del recurso
type ResourceStatus = "pending" | "success" | "error";

// Definimos un tipo para el recurso
type Resource<T> = {
  read: () => T;
};

// Función para envolver la promesa
const promiseWrapper = <T>(promise: Promise<T>): Resource<T> => {
  let status: ResourceStatus = "pending";
  let result: T | any;

  const suspender = promise.then(
    (value) => {
      status = "success";
      result = value;
    },
    (error) => {
      status = "error";
      result = error;
    }
  );

  return {
    read: () => {
      switch (status) {
        case "pending":
          throw suspender;
        case "success":
          return result;
        case "error":
          throw result;
        default:
          throw new Error("Unknown status");
      }
    }
  };
};

// Hook corregido
function useGetData<T>(url: string): Resource<T> {
  const [resource, setResource] = useState<Resource<T>>(() => ({
    read: () => {
      throw new Promise(() => {});
    }
  }));

  useEffect(() => {
    const getData = async () => {
      const promise = AxiosInstance.get<T>(url).then((response: AxiosResponse<T>) => response.data);
      console.log(promise);
      setResource(promiseWrapper(promise));
    };

    getData();
  }, [url]);

  
  return resource;
}

export default useGetData;