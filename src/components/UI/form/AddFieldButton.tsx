import { Plus } from "lucide-react";
import React from "react";

interface IProps {
   clickHandler: () => void;
   text: string;
}

const AddFieldButton = ({ clickHandler, text }: IProps) => {
   return (
      <button
         type="button"
         className="flex items-center gap-x-2 mx-auto text-sm text-blue-accent"
         onClick={clickHandler}
      >
         <Plus size={18} />
         <div>{text}</div>
      </button>
   );
};

export default AddFieldButton;
