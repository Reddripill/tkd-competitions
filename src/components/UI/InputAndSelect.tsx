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
import {
   IBaseEntityWithTitleAndCount,
   ISourceAndKey,
   SetStateType,
} from "@/types/main.types";
import { Spinner } from "./lib-components/spinner";
import { useDebounce } from "@/hooks/useDebounce";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./buttons/button";

export interface ISelectProps
   extends Partial<ISourceAndKey>,
      VariantProps<typeof buttonVariants> {
   value?: string;
   setValue?: SetStateType<string>;
   selectedValues?: string[];
   setSelectedValues?: SetStateType<string[]>;
   initialValue?: string;
   isControlledInput?: boolean;
   isControlledSelect?: boolean;
   isMulti?: boolean;
   label?: string;
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
   value: controlledValue,
   setValue: setControlledValue,
   selectedValues: controlledSelectedValues,
   setSelectedValues: setControlledSelectedValues,
   isControlledInput = false,
   isControlledSelect = false,
   initialValue,
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
   size = "lg",
}: ISelectProps) => {
   const commandRef = useRef<HTMLDivElement>(null);
   const [uncontrolledValue, setUncontrolledValue] = useState(
      initialValue ? initialValue : ""
   );
   const [uncontrolledSelectedValues, setUncontrolledSelectedValues] = useState<
      string[]
   >([]);
   const [open, setOpen] = useState(false);
   const [hoverIndex, setHoverIndex] = useState<number>(0);

   const value =
      isControlledInput && controlledValue
         ? controlledValue
         : uncontrolledValue;
   const selectedValues =
      isControlledSelect && controlledSelectedValues
         ? controlledSelectedValues
         : uncontrolledSelectedValues;
   const debouncedValue = useDebounce(value);

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
      enabled: !!open && !!source && !!queryKey && !!suggestion,
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
      if (isControlledInput) {
         if (setControlledValue) {
            setControlledValue(val);
         } else {
         }
      } else {
         setUncontrolledValue(val);
      }
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
         if (isControlledInput && setControlledValue) {
            setControlledValue("");
         } else {
            setUncontrolledValue("");
         }
         if (isControlledSelect && setControlledSelectedValues) {
            setControlledSelectedValues(prev => [...prev, value]);
         } else {
            setUncontrolledSelectedValues(prev => [...prev, value]);
         }
      }
   };

   const deleteHandler = (selectedVal: string) => {
      if (unselectHandler) {
         unselectHandler(selectedVal);
         if (isControlledSelect && setControlledSelectedValues) {
            setControlledSelectedValues(
               selectedValues.filter(item => item !== selectedVal)
            );
         } else {
            setUncontrolledSelectedValues(
               selectedValues.filter(item => item !== selectedVal)
            );
         }
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!suggestion && isMulti) {
         if (e.key === "Enter") {
            submitHandler();
         }
      }
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
         if (isControlledInput && setControlledValue) {
            setControlledValue(suggestedItems[hoverIndex].title);
         } else {
            setUncontrolledValue(suggestedItems[hoverIndex].title);
         }
      }
      if (e.key === "Escape") {
         setOpen(false);
      }
   };

   const heightStyle = {
      "h-9 text-sm": size === "default",
      "h-8 text-sm": size === "sm",
      "h-10": size === "lg",
      "size-9": size === "icon",
      "size-8": size === "icon-sm",
      "size-10": size === "icon-lg",
   };
   return (
      <div>
         {label && (
            <div
               className={cn("mb-2 text-sm", {
                  "text-red-accent": !isValid && validation && errorMessage,
               })}
            >
               {label}
            </div>
         )}
         <div>
            <div className={cn("flex items-center gap-x-4 h-10", heightStyle)}>
               <Command
                  ref={commandRef}
                  shouldFilter={false}
                  className="relative overflow-visible h-full"
                  label={label}
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
                  {!isError && open && suggestion && value.length !== 0 && (
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
               {isMulti && <ActionButton size={size} action={submitHandler} />}
            </div>
            {!isValid && validation && errorMessage && (
               <em role="alert" className="text-red-accent text-sm">
                  {errorMessage}
               </em>
            )}
            {isMulti && selectedValues.length > 0 && (
               <div className="flex flex-col gap-y-4 mt-6 max-h-[300px] overflow-auto">
                  {selectedValues.map((selectedVal, index) => (
                     <div
                        key={selectedVal + index}
                        className={cn(
                           "shrink-0 flex items-center gap-x-4",
                           heightStyle
                        )}
                     >
                        <div className="flex items-center h-full grow bg-light-gray rounded-lg pl-4">
                           {selectedVal}
                        </div>
                        <button
                           type="button"
                           onClick={() => deleteHandler(selectedVal)}
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
