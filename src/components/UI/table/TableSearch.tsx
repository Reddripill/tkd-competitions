import React from "react";
import { Command, CommandInput } from "../lib-components/command";

interface IProps {
   value: string;
   setValue: (val: string) => void;
   placeholder?: string;
}

const TableSearch = ({ value, setValue, placeholder }: IProps) => {
   return (
      <div className="flex items-center gap-x-4 h-10">
         <Command
            shouldFilter={false}
            className="relative overflow-visible h-full"
         >
            <CommandInput
               value={value}
               onValueChange={setValue}
               placeholder={placeholder}
            />
         </Command>
      </div>
   );
};

export default TableSearch;
