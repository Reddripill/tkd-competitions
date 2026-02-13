import React, { useState } from "react";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "../lib-components/popover";
import { Ellipsis, EllipsisVertical, Pen, Trash } from "lucide-react";
import { Command, CommandItem, CommandList } from "../lib-components/command";

interface IProps {
   isVertical?: boolean;
   showDelete: () => void;
   showUpdate: () => void;
}

const CardOptions = ({
   showDelete,
   showUpdate,
   isVertical = false,
}: IProps) => {
   const [isOpen, setIsOpen] = useState(false);

   const showDeleteModalHandler = () => {
      setIsOpen(false);
      showDelete();
   };
   const showUpdateModalHandler = () => {
      setIsOpen(false);
      showUpdate();
   };
   return (
      <div className="relative">
         <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild={true}>
               {isVertical ? (
                  <EllipsisVertical size={18} className="cursor-pointer" />
               ) : (
                  <Ellipsis className="cursor-pointer" />
               )}
            </PopoverTrigger>
            <PopoverContent
               align="end"
               className="bg-white rounded-lg shadow-popover border-0 w-28 p-0"
            >
               <Command>
                  <CommandList>
                     <CommandItem className="group w-full transition-colors hover:bg-alt-gray cursor-pointer p-0">
                        <button
                           type="button"
                           className="w-full h-full p-2 flex items-center justify-between"
                           onClick={showUpdateModalHandler}
                        >
                           <div className="text-sm font-bold group-hover:text-black/80 transition-colors">
                              Изменить
                           </div>
                           <Pen className="size-4 group-hover:text-black/80 transition-colors" />
                        </button>
                     </CommandItem>
                     <CommandItem className="group w-full transition-colors hover:bg-alt-gray cursor-pointer p-0">
                        <button
                           type="button"
                           className="w-full h-full p-2 flex items-center justify-between"
                           onClick={showDeleteModalHandler}
                        >
                           <div className="text-sm font-bold text-red-accent group-hover:text-black/80 transition-colors">
                              Удалить
                           </div>
                           <Trash className="size-4 text-red-accent group-hover:text-black/80 transition-colors" />
                        </button>
                     </CommandItem>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </div>
   );
};

export default CardOptions;
