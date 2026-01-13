import React, { useState } from "react";
import { Trash } from "lucide-react";
import DeleteConfirmModal from "../modals/DeleteConfirmModal";

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
         <DeleteConfirmModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            confirmedAction={confirmedAction}
         />
      </>
   );
};

export default DeleteAction;
