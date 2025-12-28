import React, { useState } from "react";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "../lib-components/popover";
import { Ellipsis, Trash } from "lucide-react";
import { Command, CommandItem, CommandList } from "../lib-components/command";

const DropDown = () => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <div className="relative">
         <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild={true}>
               <Ellipsis className="cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent
               align="end"
               className="bg-white rounded-lg shadow-popover border-0 w-30 p-0"
            >
               <Command>
                  <CommandList>
                     <CommandItem
                        onClick={() => console.log("УДАЛИТЬ???")}
                        className="group flex items-center justify-between w-full transition-colors hover:bg-alt-gray p-3 cursor-pointer"
                     >
                        <div className="font-bold text-red-accent group-hover:text-black/80 transition-colors">
                           Удалить
                        </div>
                        <Trash className="text-red-accent group-hover:text-black/80 transition-colors" />
                     </CommandItem>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </div>
   );
};

export default DropDown;
