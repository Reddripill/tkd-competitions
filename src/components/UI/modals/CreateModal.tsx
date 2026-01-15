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
import { useAppForm } from "@/contexts/AdminFormContext";
import { defaultCreationData } from "../form/create-form/create-form.constants";
import { useAddEntity } from "@/hooks/query";
import ConfirmModal from "./ConfirmModal";

interface IProps extends ISourceAndKey {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
}

const CreateModal = ({ isOpen, setIsOpen, source, queryKey }: IProps) => {
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const [selectedValues, setSelectedValues] = useState<string[]>([]);
   const { mutate: createEntities } = useAddEntity({ queryKey, source });
   const form = useAppForm({
      defaultValues: defaultCreationData,
   });

   const createHandler = () => {
      if (selectedValues.length > 0) {
         createEntities(selectedValues);
      }
   };

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const cancelHandler = () => {
      setIsOpen(true);
      setIsConfirmModalOpen(false);
   };

   const closeHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(false);
      form.reset();
      setSelectedValues([]);
   };

   return (
      <ConfirmModal
         title="Вы уверены?"
         description="Все введенные данные будут утеряны"
         actionBtnText="Закрыть"
         confirmedAction={closeHandler}
         cancelHandler={cancelHandler}
         isOpen={isConfirmModalOpen}
         setIsOpen={setIsConfirmModalOpen}
         btnType="delete"
      >
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
                     showConfirmHandler();
                  }}
               >
                  <DialogTitle className="text-xl font-bold">
                     Создание записей
                  </DialogTitle>
                  <DialogDescription>
                     Добавление только уникальных записей
                  </DialogDescription>
                  <div className="text-md mb-4">
                     <CreateForm
                        form={form}
                        source={source}
                        queryKey={queryKey}
                        value={selectedValues}
                        setValue={setSelectedValues}
                     />
                  </div>
                  <div className="flex items-center justify-end">
                     <DialogClose asChild={true}>
                        <ActionButton btnType="blue" onClick={createHandler}>
                           Создать
                        </ActionButton>
                     </DialogClose>
                  </div>
                  <DialogClose
                     className="ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity size-5 cursor-pointer"
                     asChild={true}
                     onClick={e => {
                        if (selectedValues.length > 0) {
                           e.preventDefault();
                           showConfirmHandler();
                        }
                     }}
                  >
                     <XIcon />
                  </DialogClose>
               </DialogContent>
            </DialogPortal>
         </Dialog>
      </ConfirmModal>
   );
};

export default CreateModal;
