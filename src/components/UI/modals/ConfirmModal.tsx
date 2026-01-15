import React from "react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../lib-components/dialog";
import ActionButton, { IActionButtonProps } from "../buttons/ActionButton";
import { SetStateType } from "@/types/main.types";
import { XIcon } from "lucide-react";

interface IProps extends Pick<IActionButtonProps, "btnType"> {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
   children?: React.ReactNode;
   confirmedAction: () => void;
   cancelHandler?: () => void;
   title: string;
   description: string;
   actionBtnText: string;
   cancelBtnText?: string;
}

const ConfirmModal = ({
   isOpen,
   setIsOpen,
   children,
   confirmedAction,
   cancelHandler,
   title,
   description,
   actionBtnText,
   cancelBtnText,
   btnType,
}: IProps) => {
   const closeConfirmModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
   ) => {
      e.preventDefault();
      if (cancelHandler) {
         cancelHandler();
      } else {
         setIsOpen(false);
      }
   };
   return (
      <>
         {children}
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogPortal>
               <DialogContent
                  className="bg-white border-none shadow-popover visible opacity-100 transition-opacity"
                  onInteractOutside={e => {
                     e.preventDefault();
                  }}
                  onEscapeKeyDown={e => {
                     e.preventDefault();
                  }}
               >
                  <DialogTitle className="text-xl font-bold">
                     {title}
                  </DialogTitle>
                  <DialogDescription className="text-md mb-4">
                     {description}
                  </DialogDescription>
                  <div className="flex items-center justify-end gap-x-2">
                     <DialogClose asChild={true} onClick={closeConfirmModal}>
                        <ActionButton btnType="basic">
                           {cancelBtnText ? cancelBtnText : "Отмена"}
                        </ActionButton>
                     </DialogClose>
                     <DialogClose asChild={true} onClick={confirmedAction}>
                        <ActionButton btnType={btnType}>
                           {actionBtnText}
                        </ActionButton>
                     </DialogClose>
                  </div>
                  <DialogClose
                     className="ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity size-5 cursor-pointer"
                     asChild={true}
                     onClick={closeConfirmModal}
                  >
                     <XIcon />
                  </DialogClose>
               </DialogContent>
            </DialogPortal>
         </Dialog>
      </>
   );
};

export default ConfirmModal;
