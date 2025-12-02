import React from "react";
import { ActionButtonLink } from "./ActionButton";
import { Plus } from "lucide-react";

const AddingButton = ({ link }: { link: string }) => {
   return (
      <ActionButtonLink
         className="bg-blue-accent! hover:bg-blue-accent/80! transition-colors"
         link={link}
      >
         <div className="flex items-center gap-x-2 text-white">
            <Plus />
            <div>Добавить</div>
         </div>
      </ActionButtonLink>
   );
};

export default AddingButton;
