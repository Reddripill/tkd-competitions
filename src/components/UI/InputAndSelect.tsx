"use client";
import React, { useState, useRef } from "react";
import {
   Command,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from "./lib-components/command";
import ActionButton from "./buttons/ActionButton";
import useOutside from "@/hooks/useOutside";
import { useQuery } from "@tanstack/react-query";
import { IBaseEntityWithTitle } from "@/types/main.types";
import { Spinner } from "./lib-components/spinner";
import { Checkbox } from "./lib-components/checkbox";
import { useDebounce } from "@/hooks/useDebounce";

interface IProps {
   clickHandler: (value: string) => void;
   unselectHandler?: (value: string) => void;
   isMulti?: boolean;
}

const InputAndSelect = ({
   clickHandler,
   unselectHandler,
   isMulti = true,
}: IProps) => {
   const commandRef = useRef<HTMLDivElement>(null);
   const [value, setValue] = useState("");
   const debouncedValue = useDebounce(value);
   const [open, setOpen] = useState(false);
   const [selectedValues, setSelectedValues] = useState<string[]>([]);
   const [hoverIndex, setHoverIndex] = useState<number>(0);
   const { data, isError, isPending } = useQuery<IBaseEntityWithTitle[]>({
      queryKey: ["categories", debouncedValue],
      queryFn: async () => {
         const data = await fetch(
            `http://localhost:3001/categories?q=${encodeURIComponent(
               debouncedValue
            )}`
         );
         const categories = await data.json();
         return categories;
      },
      enabled: !!open,
   });

   const suggestedItems = data?.filter(
      item => !selectedValues.includes(item.title)
   );

   const closeHandler = () => {
      setOpen(false);
      setHoverIndex(0);
   };
   useOutside(commandRef, closeHandler);

   const chooseHandler = (value: string) => {
      closeHandler();
      setValue(value);
   };

   const submitHandler = () => {
      clickHandler(value);
      setValue("");
      setSelectedValues(prev => [...prev, value]);
   };

   const checkboxClick = (item: string) => {
      if (unselectHandler) {
         unselectHandler(item);
         setSelectedValues(
            selectedValues.filter(selectedItem => selectedItem !== item)
         );
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open || !suggestedItems) return;
      if (e.key === "ArrowDown") {
         e.preventDefault();
         setHoverIndex(prev => (prev + 1) % suggestedItems.length);
      }
      if (e.key === "ArrowUp") {
         e.preventDefault();
         setHoverIndex(
            prev => (prev - 1 + suggestedItems.length) % suggestedItems.length
         );
      }
      if (e.key === "Enter" && hoverIndex >= 0) {
         setValue(suggestedItems[hoverIndex].title);
         setOpen(false);
      }
      if (e.key === "Escape") {
         setOpen(false);
      }
   };
   return (
      <div className="flex items-center gap-x-4 h-10">
         <Command
            ref={commandRef}
            shouldFilter={false}
            className="relative overflow-visible h-full"
         >
            <CommandInput
               value={value}
               onValueChange={setValue}
               onKeyDown={handleKeyDown}
               onClick={() => setOpen(true)}
               onFocus={() => setOpen(true)}
               className="h-full"
            />
            {!isError && open && (
               <CommandList className="absolute top-[calc(100%+6px)] left-0 z-10 w-full h-auto bg-white rounded-lg shadow-main">
                  {isPending ? (
                     <div className="py-4 flex justify-center">
                        <Spinner className="size-8 text-black" />
                     </div>
                  ) : suggestedItems &&
                    (suggestedItems.length > 0 || selectedValues.length > 0) ? (
                     <div className="py-2">
                        {selectedValues.length > 0 && (
                           <>
                              <CommandGroup heading="Выбрано">
                                 {selectedValues.map(item => (
                                    <CommandItem
                                       key={item}
                                       className={`cursor-pointer px-3 py-2 font-medium rounded-lg`}
                                    >
                                       <div className="flex items-center gap-x-2">
                                          <Checkbox
                                             className="bg-blue-accent text-white size-4"
                                             defaultChecked={true}
                                             onClick={() => checkboxClick(item)}
                                          />
                                          {item}
                                       </div>
                                    </CommandItem>
                                 ))}
                              </CommandGroup>
                              {suggestedItems.length > 0 && (
                                 <CommandSeparator />
                              )}
                           </>
                        )}
                        {suggestedItems.length > 0 && (
                           <CommandGroup>
                              {suggestedItems.map((item, index) => (
                                 <CommandItem
                                    key={item.id}
                                    className={`cursor-pointer px-3 py-2 font-medium rounded-lg ${
                                       hoverIndex === index &&
                                       "bg-blue-accent/10"
                                    }`}
                                    onMouseEnter={() => setHoverIndex(index)}
                                    onSelect={() => chooseHandler(item.title)}
                                 >
                                    {item.title}
                                 </CommandItem>
                              ))}
                           </CommandGroup>
                        )}
                     </div>
                  ) : null}
               </CommandList>
            )}
         </Command>
         {isMulti && <ActionButton size="lg" action={submitHandler} />}
      </div>
   );
};

export default InputAndSelect;
