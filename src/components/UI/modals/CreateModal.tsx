import React, { useState } from "react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../lib-components/dialog";
import { ISourceAndKey, SetStateType } from "@/types/main.types";
import ActionButton from "../buttons/ActionButton";
import CreateForm from "../form/create-form/CreateForm";
import { XIcon } from "lucide-react";
import ConfirmModalContent from "./ConfirmModalContent";

interface IProps extends ISourceAndKey {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
}

const CreateModal = ({ isOpen, setIsOpen, source, queryKey }: IProps) => {
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const [inputValue, setInputValue] = useState<string[]>([]);
   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogPortal>
            <DialogContent
               showCloseButton={false}
               className="bg-white border-none shadow-popover visible opacity-100 transition-opacity"
               onInteractOutside={e => {
                  e.preventDefault();
               }}
               onEscapeKeyDown={e => {
                  e.preventDefault();
               }}
            >
               {!isConfirmModalOpen && isOpen ? (
                  <>
                     <DialogTitle className="text-xl font-bold">
                        Создание записей
                     </DialogTitle>
                     <DialogDescription>
                        Добавление только уникальных записей
                     </DialogDescription>
                     <div className="text-md mb-4">
                        <CreateForm
                           source={source}
                           queryKey={queryKey}
                           value={inputValue}
                           setValue={setInputValue}
                        />
                     </div>
                     <div className="flex items-center justify-end">
                        <DialogClose asChild={true}>
                           <ActionButton btnType="blue">Создать</ActionButton>
                        </DialogClose>
                     </div>
                     <DialogClose
                        className="ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity size-5 cursor-pointer"
                        asChild={true}
                        onClick={e => {
                           e.preventDefault();
                           setIsConfirmModalOpen(true);
                        }}
                     >
                        <XIcon />
                     </DialogClose>
                  </>
               ) : (
                  <ConfirmModalContent
                     clickHandler={() => setIsConfirmModalOpen(false)}
                  />
               )}
            </DialogContent>
         </DialogPortal>
      </Dialog>
   );
};

export default CreateModal;
