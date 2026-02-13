import React, { useState } from "react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../lib-components/dialog";
import ActionButton from "../buttons/ActionButton";
import { XIcon } from "lucide-react";
import { useAppForm } from "@/contexts/AdminFormContext";
import { useCreateCompetition } from "@/hooks/query";
import ConfirmModal from "./ConfirmModal";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import { IModalOptionalContent } from "@/types/modals.types";
import { defaultCreationCompData } from "../form/competition-form/competition-form.contstants";
import CompetitionForm from "../form/competition-form/CompetitionForm";
import { ISourceAndKey } from "@/types/main.types";

interface IProps
   extends IModalOptionalContent,
      Pick<ISourceAndKey, "queryKey"> {
   isAdding?: boolean;
   tournamentId?: string;
   arenaId?: string;
}

const CompetitionModal = ({
   isOpen,
   setIsOpen,
   title,
   actionBtnText,
   cancelBtnText,
   description,
   tournamentId,
   arenaId,
   queryKey,
}: IProps) => {
   const { setCurrentId } = useGetModalsContext();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const [categoriesValues, setCategoriesValues] = useState<string[]>([]);
   const [disciplineValue, setDisciplineValue] = useState<string>("");
   const { mutate: createEntities } = useCreateCompetition({ queryKey });
   const form = useAppForm({
      defaultValues: defaultCreationCompData,
   });

   const resetForm = () => {
      form.reset();
      setCategoriesValues([]);
      setDisciplineValue("");
   };

   const createHandler = () => {
      if (disciplineValue !== "" && tournamentId && arenaId) {
         if (setCurrentId) {
            setCurrentId(null);
         }
         createEntities({
            tournamentId: tournamentId,
            arenas: [
               {
                  arenaId: arenaId,
                  info: [
                     {
                        discipline: disciplineValue,
                        categories: categoriesValues,
                     },
                  ],
               },
            ],
         });
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
      if (categoriesValues.length > 0 || disciplineValue !== "") {
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
                     <CompetitionForm
                        form={form}
                        disciplineValue={disciplineValue}
                        setDisciplineValue={setDisciplineValue}
                        categoriesValue={categoriesValues}
                        setCategoriesValue={setCategoriesValues}
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

export default CompetitionModal;
