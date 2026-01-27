import { SetStateType } from "@/types/main.types";
import React, { createContext, useContext } from "react";

export interface IModalsContext {
   showDeleteModal?: () => void;
   showUpdateModal?: () => void;
   showCreateModal?: () => void;
   setCurrentId?: SetStateType<string | null>;
}

export const ModalsContext = createContext<IModalsContext>({});

interface IModalsProviderProps {
   children: React.ReactNode;
   value: IModalsContext;
}

export const ModalsProvider = ({ children, value }: IModalsProviderProps) => {
   return (
      <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>
   );
};

export const useGetModalsContext = () => {
   const modalsContext = useContext(ModalsContext);
   return modalsContext;
};
