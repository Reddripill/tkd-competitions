"use client";
import React, { useState, useRef } from "react";
import {
   Command,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "./lib-components/command";
import ActionButton from "./buttons/ActionButton";
import useOutside from "@/hooks/useOutside";
import { useQuery } from "@tanstack/react-query";
import { IBaseEntityWithTitleAndCount } from "@/types/main.types";
import { Spinner } from "./lib-components/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { Grip, Trash2 } from "lucide-react";
import { FieldLabel } from "./lib-components/field";
import { cn } from "@/lib/utils";

export interface ISelectProps {
   isMulti?: boolean;
   source: string;
   label?: string;
   queryKey?: string;
   validation?: boolean;
   suggestion?: boolean;
   isValid?: boolean;
   blurHandler?: () => void;
   changeHandler?: (val: string) => void;
   unselectHandler?: (val: string) => void;
   errorMessage?: string;
   placeholder?: string;
}

const InputAndSelect = ({
   isMulti = true,
   source,
   label,
   queryKey,
   validation = true,
   isValid = true,
   blurHandler,
   changeHandler,
   unselectHandler,
   errorMessage,
   suggestion = true,
   placeholder,
}: ISelectProps) => {
   const commandRef = useRef<HTMLDivElement>(null);
   const [value, setValue] = useState("");
   const debouncedValue = useDebounce(value);
   const [open, setOpen] = useState(false);
   const [selectedValues, setSelectedValues] = useState<string[]>([]);
   const [hoverIndex, setHoverIndex] = useState<number>(0);
   const {
      data: response,
      isError,
      isFetching,
   } = useQuery<IBaseEntityWithTitleAndCount>({
      queryKey: [queryKey, debouncedValue],
      queryFn: async () => {
         const data = await fetch(
            `${source}?q=${encodeURIComponent(debouncedValue)}`
         );
         const result = await data.json();
         return result;
      },
      enabled: !!open && !!source && !!queryKey,
   });

   const suggestedItems = response?.data.filter(
      item => !selectedValues.includes(item.title)
   );

   const closeHandler = () => {
      if (open) {
         setOpen(false);
         setHoverIndex(0);
         if (blurHandler) {
            blurHandler();
         }
      }
   };

   useOutside(commandRef, closeHandler);

   const onChangeHandler = (val: string) => {
      setValue(val);
      if (!isMulti && changeHandler) {
         changeHandler(val);
      }
   };

   const onBlurHandler = (e: React.FocusEvent<HTMLInputElement, Element>) => {
      const commandEl = commandRef.current;
      if (
         !e.relatedTarget ||
         (commandEl && !commandEl.contains(e.relatedTarget))
      ) {
         closeHandler();
      }
   };

   const chooseHandler = (value: string) => {
      onChangeHandler(value);
      closeHandler();
      if (blurHandler) {
         blurHandler();
      }
   };

   const submitHandler = () => {
      if (value.length >= 3) {
         if (changeHandler) {
            changeHandler(value);
         }
         setValue("");
         setSelectedValues(prev => [...prev, value]);
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
      <div>
         {label && (
            <FieldLabel
               className={cn("mb-3", {
                  "text-red-accent": !isValid && validation && errorMessage,
               })}
            >
               {label}
            </FieldLabel>
         )}
         <div>
            <div className="flex items-center gap-x-4 h-10">
               <Command
                  ref={commandRef}
                  shouldFilter={false}
                  className="relative overflow-visible h-full"
               >
                  <CommandInput
                     value={value}
                     onValueChange={val => {
                        onChangeHandler(val);
                     }}
                     onKeyDown={handleKeyDown}
                     onClick={() => {
                        setOpen(true);
                     }}
                     onBlur={onBlurHandler}
                     onFocus={() => {
                        setOpen(true);
                     }}
                     placeholder={placeholder}
                     className={cn({
                        "border-red-accent text-red-accent focus-within:border-red-accent focus-within:ring-red-accent/80":
                           !isValid,
                     })}
                  />
                  {!isError && open && suggestion && (
                     <CommandList className="absolute top-[calc(100%+6px)] left-0 z-10 w-full h-auto bg-white rounded-lg shadow-main">
                        {isFetching ? (
                           <div className="py-4 flex justify-center">
                              <Spinner className="size-8 text-black" />
                           </div>
                        ) : suggestedItems &&
                          (suggestedItems.length > 0 ||
                             selectedValues.length > 0) ? (
                           <div className="py-2">
                              {suggestedItems.length > 0 && (
                                 <CommandGroup>
                                    {suggestedItems.map((item, index) => (
                                       <CommandItem
                                          key={item.id}
                                          className={`cursor-pointer px-3 py-2 font-medium rounded-lg ${
                                             hoverIndex === index &&
                                             "bg-blue-accent/10"
                                          }`}
                                          onMouseEnter={() =>
                                             setHoverIndex(index)
                                          }
                                          onSelect={() =>
                                             chooseHandler(item.title)
                                          }
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
            {!isValid && validation && errorMessage && (
               <em role="alert" className="text-red-accent text-sm">
                  {errorMessage}
               </em>
            )}
            {isMulti && selectedValues.length > 0 && (
               <div className="flex flex-col gap-y-4 mt-6">
                  {selectedValues.map(selectedVal => (
                     <div
                        key={selectedVal}
                        className="flex items-center gap-x-4 h-10"
                     >
                        <div className="flex items-center h-full grow bg-light-gray rounded-lg pl-4">
                           {selectedVal}
                        </div>
                        <div className="flex items-center justify-center h-full w-10 bg-light-gray rounded-lg cursor-grab">
                           <Grip />
                        </div>
                        <button
                           type="submit"
                           onClick={() => {
                              if (unselectHandler) {
                                 unselectHandler(selectedVal);
                                 setSelectedValues(
                                    selectedValues.filter(
                                       item => item !== selectedVal
                                    )
                                 );
                              }
                           }}
                        >
                           <Trash2 className="text-red-accent" />
                        </button>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

export default InputAndSelect;
