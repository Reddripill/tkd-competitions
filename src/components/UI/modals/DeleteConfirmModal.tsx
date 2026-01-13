"use state";
import React from "react";
import { SetStateType } from "@/types/main.types";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../lib-components/dialog";
import ActionButton from "../buttons/ActionButton";

interface IProps {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
   confirmedAction: () => void;
}

const ConfirmModal = ({ isOpen, setIsOpen, confirmedAction }: IProps) => {
   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogPortal>
            <DialogContent
               className="bg-white border-none shadow-popover"
               onInteractOutside={e => {
                  e.preventDefault();
               }}
               onEscapeKeyDown={e => {
                  e.preventDefault();
               }}
            >
               <DialogTitle className="text-xl font-bold">Удаление</DialogTitle>
               <DialogDescription className="text-md mb-4">
                  Запись невозможно будет восстановить. Вы уверены?
               </DialogDescription>
               <div className="flex items-center justify-end gap-x-2">
                  <DialogClose asChild={true}>
                     <ActionButton btnType="basic">Отмена</ActionButton>
                  </DialogClose>
                  <DialogClose asChild={true} onClick={confirmedAction}>
                     <ActionButton btnType="delete">Удалить</ActionButton>
                  </DialogClose>
               </div>
            </DialogContent>
         </DialogPortal>
      </Dialog>
   );
};

export default ConfirmModal;
