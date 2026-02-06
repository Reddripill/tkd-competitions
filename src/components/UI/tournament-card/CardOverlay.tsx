import React from "react";
import { ICompetition } from "@/types/entities.types";
import { EllipsisVertical } from "lucide-react";
import { Checkbox } from "../lib-components/checkbox";
import { CardItem } from "./TournamentCard";

interface IProps {
   item: ICompetition;
}

const CardOverlay = ({ item }: IProps) => {
   return (
      <div className="flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm min-h-10">
         <div className="flex items-center justify-center">
            <Checkbox className="size-4" />
         </div>
         <div className="grow">
            <CardItem item={item} />
         </div>
         <div className="shrink-0">
            <EllipsisVertical size={18} />
         </div>
      </div>
   );
};

export default CardOverlay;
