import React, { useState } from "react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../lib-components/dialog";
import { ISourceAndKey } from "@/types/main.types";
import ActionButton from "../buttons/ActionButton";
import CreateForm from "../form/create-form/CreateForm";
import { XIcon } from "lucide-react";
import { useAppForm } from "@/contexts/AdminFormContext";
import { defaultCreationData } from "../form/create-form/create-form.constants";
import { useAddEntity } from "@/hooks/query";
import ConfirmModal from "./ConfirmModal";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import { IModalOptionalContent } from "@/types/modals.types";

interface IProps extends ISourceAndKey, IModalOptionalContent {
   isAdding?: boolean;
}

const CreateModal = ({
   isOpen,
   setIsOpen,
   source,
   queryKey,
   isAdding = false,
   title,
   actionBtnText,
   cancelBtnText,
   description,
}: IProps) => {
   const { setCurrentId } = useGetModalsContext();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const [selectedValues, setSelectedValues] = useState<string[]>([]);
   const { mutate: createEntities } = useAddEntity({ queryKey, source });
   const form = useAppForm({
      defaultValues: defaultCreationData,
   });

   const resetForm = () => {
      form.reset();
      setSelectedValues([]);
   };

   const createHandler = () => {
      if (selectedValues.length > 0) {
         if (setCurrentId) {
            setCurrentId(null);
         }
         createEntities(selectedValues);
         resetForm();
      }
   };

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
   ) => {
      if (selectedValues.length > 0) {
         e.preventDefault();
         showConfirmHandler();
      } else {
         if (setCurrentId) {
            setCurrentId(null);
         }
      }
   };

   const cancelHandler = () => {
      setIsOpen(true);
      setIsConfirmModalOpen(false);
   };

   const closeHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(false);
      resetForm();
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
                     {title ? title : "Создание записей"}
                  </DialogTitle>
                  <DialogDescription>
                     {description
                        ? description
                        : "Добавление только уникальных записейs"}
                  </DialogDescription>
                  <div className="text-md mb-4">
                     <CreateForm
                        form={form}
                        source={source}
                        queryKey={queryKey}
                        value={selectedValues}
                        setValue={setSelectedValues}
                        isAdding={isAdding}
                     />
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                     <DialogClose asChild={true}>
                        <ActionButton
                           btnType="basic"
                           onClick={closeCurrentModal}
                        >
                           {cancelBtnText ? cancelBtnText : "Отмена"}
                        </ActionButton>
                     </DialogClose>
                     <DialogClose asChild={true}>
                        <ActionButton btnType="blue" onClick={createHandler}>
                           {actionBtnText ? actionBtnText : "Создать"}
                        </ActionButton>
                     </DialogClose>
                  </div>
                  <DialogClose
                     className="ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity size-5 cursor-pointer"
                     asChild={true}
                     onClick={closeCurrentModal}
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
