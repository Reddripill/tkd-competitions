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
import { XIcon } from "lucide-react";
import ConfirmModalContent from "./ConfirmModalContent";
import { useAppForm } from "@/contexts/AdminFormContext";
import { useGetEntity, useUpdateEntity } from "@/hooks/query";
import UpdateForm from "../form/update-form/UpdateForm";

interface IProps extends ISourceAndKey {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
   id: string;
}

const UpdateModal = ({ isOpen, setIsOpen, source, queryKey, id }: IProps) => {
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const { data, isPending } = useGetEntity({
      queryKey,
      source,
      id,
      enabled: !!isOpen,
   });

   const { mutate } = useUpdateEntity({ queryKey, source, id });

   const form = useAppForm({
      defaultValues: {
         title: data?.title ?? "",
      },
   });

   const updateHandler = () => {
      const fieldValue = form.state.values.title;
      if (data) {
         if (data.title !== fieldValue) {
            mutate(fieldValue);
         }
      }
   };
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
                        Изменение
                     </DialogTitle>
                     <DialogDescription>
                        Измение данных записи
                     </DialogDescription>
                     <div className="text-md mb-4">
                        <UpdateForm
                           form={form}
                           source={source}
                           queryKey={queryKey}
                           isPending={isPending}
                           initialValue={data?.title}
                        />
                     </div>
                     <div className="flex items-center justify-end">
                        <DialogClose asChild={true}>
                           <ActionButton btnType="blue" onClick={updateHandler}>
                              Изменить
                           </ActionButton>
                        </DialogClose>
                     </div>
                     <DialogClose
                        className="ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity size-5 cursor-pointer"
                        asChild={true}
                        onClick={e => {
                           if (data && data.title !== form.state.values.title) {
                              e.preventDefault();
                              setIsConfirmModalOpen(true);
                           }
                        }}
                     >
                        <XIcon />
                     </DialogClose>
                  </>
               ) : (
                  <ConfirmModalContent
                     clickHandler={() => setIsConfirmModalOpen(false)}
                     closeHandler={() => {
                        setIsOpen(false);
                     }}
                     // Убрать костыль
                  />
               )}
            </DialogContent>
         </DialogPortal>
      </Dialog>
   );
};

export default UpdateModal;
