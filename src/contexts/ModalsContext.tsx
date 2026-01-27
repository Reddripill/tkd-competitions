import { SetStateType } from "@/types/main.types";
import React, { createContext, useContext } from "react";

export interface IModalsContext<T = string> {
   showDeleteModal?: () => void;
   showUpdateModal?: () => void;
   showCreateModal?: () => void;
   setCurrentId?: SetStateType<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModalsContext = createContext<IModalsContext<any>>({});

interface IModalsProviderProps<T> {
   children: React.ReactNode;
   value: IModalsContext<T>;
}

export function ModalsProvider<T>({
   children,
   value,
}: IModalsProviderProps<T>) {
   return (
      <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>
   );
}

export function useGetModalsContext<T>() {
   const modalsContext = useContext(ModalsContext) as IModalsContext<T>;
   return modalsContext;
}
