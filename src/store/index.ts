import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DataState<T = any> = {
    data: T;
    setData: (data: T) => void;
    type: "create" | "update";
    setType: (type: "create" | "update") => void;

    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export const useDataStore = create<DataState>()(
    persist(
        (set) => ({
            data: {}, // Estado inicial de `data`
            setData: (data) => set({ data }),

            type: "create", // Estado inicial de `type`
            setType: (type) => set({ type }),

            isOpen: false, // Estado inicial del modal
            setIsOpen: (isOpen) => set({ isOpen }),
        }),
        {
            name: 'data-store', // Nombre de la clave en localStorage
        }
    )
);
