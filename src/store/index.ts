import { create } from 'zustand'

type DataState<T = any> = {
    data: T;
    setData: (data: T) => void;
    type: "create" | "update";
    setType: (type: "create" | "update") => void;


    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;

};

export const useDataStore = create<DataState>((set) => ({
    data: {},
    setData: (data) => set({ data }),
    type: "create",
    setType: (type: "create" | "update") => set({ type }),

    isOpen: false,  // Inicializa el estado del modal como cerrado
    setIsOpen: (isOpen) => set({ isOpen }),  // Método para abrir o cerrar el modal
}));


