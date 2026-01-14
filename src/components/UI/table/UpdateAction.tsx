import React, { useState } from "react";
import { Pen } from "lucide-react";
import UpdateModal from "../modals/UpdateModal";
import { ISourceAndKey } from "@/types/main.types";

interface IProps extends Partial<ISourceAndKey> {
   id: string;
}

const UpdateAction = ({ queryKey, source, id }: IProps) => {
   const [isOpen, setIsOpen] = useState(false);
   if (!queryKey || !source) {
      return null;
   }
   return (
      <>
         <Pen
            className="size-5 text-black cursor-pointer"
            onClick={() => setIsOpen(true)}
         />
         <UpdateModal
            id={id}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            source={source}
            queryKey={queryKey}
         />
      </>
   );
};

export default UpdateAction;
