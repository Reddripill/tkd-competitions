import React from "react";
import { cn } from "@/lib/utils";
import { ICompetition } from "@/types/entities.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "../lib-components/checkbox";
import { CardItem } from "./TournamentCard";
import CardOptions from "./CardOptions";

interface IProps {
   item: ICompetition;
   tournamentId: string;
   arenaId: string;
}

const AdminCardItem = ({ item, tournamentId, arenaId }: IProps) => {
   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      setActivatorNodeRef,
      isDragging,
   } = useSortable({ id: item.id, data: { arenaId, tournamentId } });
   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
   };
   if (!item.discipline) return null;
   return (
      <div ref={setNodeRef} style={style} {...attributes}>
         <div
            className={cn(
               "flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm",
               { "opacity-50": isDragging }
            )}
         >
            <div className="flex items-center justify-center">
               <Checkbox className="size-4" />
            </div>
            <div
               className="grow cursor-grab"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <CardItem item={item} />
            </div>
            <CardOptions
               tournamentId={tournamentId}
               arenaId={arenaId}
               isVertical={true}
            />
         </div>
      </div>
   );
};

export default AdminCardItem;
