import React from "react";
import { ICompetition } from "@/types/entities.types";
import { EllipsisVertical } from "lucide-react";
import { Checkbox } from "../lib-components/checkbox";

interface IProps {
   item: ICompetition;
}

const CardOverlay = ({ item }: IProps) => {
   return (
      <div className="flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm min-h-10">
         <div className="flex items-center justify-center">
            <Checkbox checked={item.isFinished} className="size-4" />
         </div>

         <div className="grow cursor-grab">
            <div>
               {item.discipline.title}
               {item.categories.length > 0 && (
                  <span>
                     {" "}
                     (
                     {item.categories
                        .map(item => item.category.title)
                        .join(", ")}
                     )
                  </span>
               )}
            </div>
         </div>
         <div className="shrink-0">
            <EllipsisVertical size={18} />
         </div>
      </div>
   );
};

export default CardOverlay;
