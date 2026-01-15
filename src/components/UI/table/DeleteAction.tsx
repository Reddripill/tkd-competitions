import React, { useState } from "react";
import { Trash } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";

interface IProps {
   confirmedAction: () => void;
}

const DeleteAction = ({ confirmedAction }: IProps) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <>
         <Trash
            onClick={() => setIsOpen(true)}
            className="size-5 cursor-pointer text-red-accent"
         />
         <ConfirmModal
            title="Удаление"
            description="Запись невозможно будет восстановить. Вы уверены?"
            actionBtnText="Удалить"
            confirmedAction={confirmedAction}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            btnType="delete"
         />
      </>
   );
};

export default DeleteAction;
