import React from "react";
import {
   DialogClose,
   DialogDescription,
   DialogTitle,
} from "../lib-components/dialog";
import ActionButton from "../buttons/ActionButton";

const ConfirmModalContent = ({
   clickHandler,
}: {
   clickHandler: () => void;
}) => {
   return (
      <>
         <DialogTitle className="text-xl font-bold">
            Отменить создание?
         </DialogTitle>
         <DialogDescription className="text-md mb-4">
            Все введенные данные будут утеряна
         </DialogDescription>
         <div className="flex items-center justify-end gap-x-2">
            <DialogClose
               asChild={true}
               onClick={e => {
                  e.preventDefault();
                  clickHandler();
               }}
            >
               <ActionButton btnType="basic">Отмена</ActionButton>
            </DialogClose>
            <DialogClose asChild={true} onClick={clickHandler}>
               <ActionButton btnType="delete">Закрыть</ActionButton>
            </DialogClose>
         </div>
      </>
   );
};

export default ConfirmModalContent;
