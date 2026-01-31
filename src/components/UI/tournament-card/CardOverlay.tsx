import React from "react";
import { ICompetition } from "@/types/entities.types";
import { EllipsisVertical } from "lucide-react";
import { TournamentItem } from "./TournamentCard";
import { Checkbox } from "../lib-components/checkbox";

interface IProps {
   item: ICompetition;
}

const CardOverlay = ({ item }: IProps) => {
   return (
      <div className="flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm">
         <div className="flex items-center justify-center">
            <Checkbox className="size-4" />
         </div>
         <div className="grow">
            <TournamentItem item={item} />
         </div>
         <EllipsisVertical size={18} />
      </div>
   );
};

export default CardOverlay;
