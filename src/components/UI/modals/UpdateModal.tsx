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
import { XIcon } from "lucide-react";
import { useAppForm } from "@/contexts/AdminFormContext";
import { useGetEntity, useUpdateEntity } from "@/hooks/query";
import UpdateForm from "../form/update-form/UpdateForm";
import ConfirmModal from "./ConfirmModal";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import { IModalProps } from "@/types/modals.types";

interface IProps extends IModalProps, ISourceAndKey {
   id: string | null;
}

const UpdateModal = ({ isOpen, setIsOpen, source, queryKey, id }: IProps) => {
   const { setCurrentId } = useGetModalsContext();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const { data, isPending } = useGetEntity({
      queryKey,
      source,
      id,
      enabled: !!isOpen && !!id,
   });

   const { mutate } = useUpdateEntity({ queryKey, source, id });

   const form = useAppForm({
      defaultValues: {
         title: data?.title ?? "",
      },
   });

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
   ) => {
      if (data && data.title !== form.state.values.title) {
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
      form.reset();
   };

   const updateHandler = () => {
      const fieldValue = form.state.values.title;
      if (data && id) {
         if (setCurrentId) {
            setCurrentId(null);
         }
         if (data.title !== fieldValue) {
            mutate(fieldValue);
         }
      }
   };
   return (
      <ConfirmModal
         title="Вы уверены?"
         description="Измененные данные не сохранятся. Отменить изменения?"
         actionBtnText="Закрыть"
         cancelBtnText="Продолжить"
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
                     Изменение
                  </DialogTitle>
                  <DialogDescription>Измение данных записи</DialogDescription>
                  <div className="text-md mb-4">
                     <UpdateForm
                        form={form}
                        source={source}
                        queryKey={queryKey}
                        isPending={isPending}
                     />
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                     <DialogClose asChild={true}>
                        <ActionButton
                           btnType="basic"
                           onClick={closeCurrentModal}
                        >
                           Отмена
                        </ActionButton>
                     </DialogClose>
                     <DialogClose asChild={true}>
                        <ActionButton btnType="blue" onClick={updateHandler}>
                           Подтвердить
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

export default UpdateModal;
