import React from "react";
import { ChevronLeft, ChevronRight, EllipsisIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IPaginationProps {
   prevClickHandler: () => void;
   nextClickHandler: () => void;
   isNextDisabled: boolean;
   isPrevDisabled: boolean;
   pageCount: number;
   pageIndex: number;
   clickHandler: (val: number) => void;
}

const TablePagination = ({
   clickHandler,
   isNextDisabled,
   isPrevDisabled,
   nextClickHandler,
   pageCount,
   pageIndex,
   prevClickHandler,
}: IPaginationProps) => {
   const MAX_ITEMS = 10;
   const itemsArr = new Array(Math.min(pageCount, MAX_ITEMS)).fill(0);
   const isManyPages = pageCount > MAX_ITEMS;
   return (
      <div className="flex items-center gap-x-2">
         <button
            type="button"
            className={cn(
               "text-black transition-colors hover:text-black/50 pointer-events-auto",
               {
                  "text-black/20 pointer-events-none cursor-auto":
                     isPrevDisabled,
               }
            )}
            onClick={prevClickHandler}
         >
            <ChevronLeft />
         </button>
         <div className="flex items-center gap-x-1">
            {itemsArr.map((_, index) => (
               <button
                  type="button"
                  key={index}
                  onClick={() => clickHandler(index)}
                  className={cn(
                     "size-8 rounded-md hover:bg-alt-gray transition-colors",
                     {
                        "border border-black/50 hover:bg-alt-gray/50":
                           pageIndex === index,
                     }
                  )}
               >
                  {index + 1}
               </button>
            ))}
            {isManyPages && (
               <div>
                  <EllipsisIcon />
               </div>
            )}
         </div>
         <button
            type="button"
            className={cn(
               "text-black transition-colors hover:text-black/50 pointer-events-auto",
               {
                  "text-black/20 pointer-events-none cursor-auto":
                     isNextDisabled,
               }
            )}
            onClick={nextClickHandler}
         >
            <ChevronRight />
         </button>
      </div>
   );
};

export default TablePagination;
