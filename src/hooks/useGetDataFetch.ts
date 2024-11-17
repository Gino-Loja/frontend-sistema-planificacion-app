import { getfetcher } from '@/api/axios';
import { useMemo } from 'react';


type SuspenseResource<T> = {
    read: () => T;
};

function wrapPromise<T>(promise: Promise<T>): SuspenseResource<T> {
    let status = "pending";
    let result: T;

    const suspender = promise.then(
        (res) => {
            status = "success";
            result = res;
        },
        (err) => {
            status = "error";
            result = err;
        }
    );

    return {
        read() {
            if (status === "pending") throw suspender;
            if (status === "error") throw result;
            return result;
        },
    };
}

export function useDataFetch<T>(url: string) {

  const resource =  wrapPromise(getfetcher<T>(url));
  return resource;
}
