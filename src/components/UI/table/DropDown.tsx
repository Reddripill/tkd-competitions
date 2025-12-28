import React, { useState } from "react";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "../lib-components/popover";
import { Ellipsis, Trash } from "lucide-react";
import { Command, CommandItem, CommandList } from "../lib-components/command";
import { useMutation } from "@tanstack/react-query";
import { IDeleteMany } from "@/types/main.types";
import { toast, Toaster } from "sonner";
import { queryClient } from "@/providers/QueryProvider";
import { QUERY_KEYS } from "@/constants/queryKeys";

interface IProps {
   ids?: string[];
   source: string;
}

const DropDown = ({ ids, source }: IProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const mutation = useMutation({
      mutationFn: async (body: IDeleteMany) => {
         const res = await fetch(source, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         });

         if (!res.ok) {
            throw new Error("Ошибка удаления");
         }

         return res.json();
      },

      onSuccess: () => {
         toast.success("Записи успешно удалены");
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.DISCIPLINES],
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
      },
   });
   const clickHandler = () => {
      setIsOpen(false);
      if (ids && ids.length > 0) {
         mutation.mutate({ ids });
      } else {
         toast.error("Записи для удаления не выбраны");
      }
   };
   return (
      <div className="relative">
         <Toaster position="top-center" expand={true} richColors={true} />
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
                     <CommandItem className="group w-full transition-colors hover:bg-alt-gray p-3 cursor-pointer">
                        <button
                           type="button"
                           className="w-full flex items-center justify-between"
                           onClick={clickHandler}
                        >
                           <div className="font-bold text-red-accent group-hover:text-black/80 transition-colors">
                              Удалить
                           </div>
                           <Trash className="text-red-accent group-hover:text-black/80 transition-colors" />
                        </button>
                     </CommandItem>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </div>
   );
};

export default DropDown;
