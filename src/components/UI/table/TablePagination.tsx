import React from "react";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
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

// 1 2 3 4 5 6 7

const getPaginationItems = (
   count: number,
   currentIndex: number,
   maxCount: number
) => {
   const center = Math.floor(maxCount / 2);
   let itemsArr = new Array(Math.min(count, maxCount)).fill(0);
   if (count <= maxCount) {
      itemsArr = itemsArr.map((_, index) => index);
   } else {
      itemsArr = itemsArr.map((_, index) => {
         if (index === maxCount - 1) {
            return count - 1;
         }

         if (index === 0 || currentIndex <= center) {
            return index;
         }

         if (currentIndex >= count - center - 1) {
            return count - maxCount + index;
         }

         if (index === center) {
            return currentIndex;
         } else {
            const diff = center - index;
            const diffModal = Math.abs(diff);
            if (diff < 0) {
               return currentIndex + diffModal;
            } else {
               return currentIndex - diffModal;
            }
         }
      });
   }
   return itemsArr;
};

const TablePagination = ({
   clickHandler,
   isNextDisabled,
   isPrevDisabled,
   nextClickHandler,
   pageCount,
   pageIndex,
   prevClickHandler,
}: IPaginationProps) => {
   const MAX_ITEMS = 7;
   const itemsArr = getPaginationItems(pageCount, pageIndex, MAX_ITEMS);
   if (pageCount <= 1) {
      return null;
   }
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
            {itemsArr.map((item, index) => (
               <React.Fragment key={item}>
                  {pageCount > MAX_ITEMS && index === 1 && item > index && (
                     <div>
                        <Ellipsis />
                     </div>
                  )}
                  <button
                     type="button"
                     onClick={() => clickHandler(item)}
                     className={cn(
                        "size-8 rounded-md hover:bg-alt-gray transition-colors",
                        {
                           "border border-black/50 hover:bg-alt-gray/50":
                              pageIndex === item,
                        }
                     )}
                  >
                     {item + 1}
                  </button>
                  {pageCount > MAX_ITEMS &&
                     index === MAX_ITEMS - 2 &&
                     item < pageCount - 2 && (
                        <div>
                           <Ellipsis />
                        </div>
                     )}
               </React.Fragment>
            ))}
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
