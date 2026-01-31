import React from "react";
import { ICompetition } from "@/types/entities.types";
import ActionButton from "../buttons/ActionButton";
import CardOptions from "./CardOptions";
import { Checkbox } from "../lib-components/checkbox";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import { IDeleteCompetitionsBody } from "./AdminTournamentGrid";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface IProps {
   competitions: ICompetition[];
   tournamentId: string;
   isAdmin?: boolean;
   isOver?: boolean;
}

const TournamentCard = ({
   competitions,
   tournamentId,
   isAdmin = false,
   isOver = false,
}: IProps) => {
   const { showCreateModal, setCurrentId } =
      useGetModalsContext<IDeleteCompetitionsBody>();
   const disciplineCount = competitions.filter(
      item => item.discipline !== null
   ).length;
   const showCreateModalHandler = () => {
      if (showCreateModal && setCurrentId) {
         showCreateModal();
         setCurrentId({
            arena_id: competitions[0].arena.id,
            tournament_id: tournamentId,
         });
      }
   };
   return (
      <div
         className={cn("bg-light-gray rounded-xl min-h-40 shadow-border", {
            "bg-light-gray/60": isOver,
         })}
      >
         <div className="flex flex-col h-full text-black py-4 px-2">
            <div className="flex items-center justify-between mb-4">
               <div className="font-medium pl-2">
                  {competitions[0].arena.title}
               </div>
               <CardOptions
                  tournamentId={tournamentId}
                  arenaId={competitions[0].arena.id}
               />
            </div>
            <div className="grow flex flex-col">
               <div className="grow">
                  {disciplineCount > 0 && (
                     <div className="flex flex-col gap-y-2 mb-6">
                        {competitions.map(item => (
                           <React.Fragment key={item.id}>
                              {isAdmin ? (
                                 <>
                                    <AdminTournamentItem
                                       item={item}
                                       arenaId={competitions[0].arena.id}
                                       tournamentId={tournamentId}
                                    />
                                 </>
                              ) : (
                                 <div className="p-2 text-sm">
                                    <TournamentItem item={item} />
                                 </div>
                              )}
                           </React.Fragment>
                        ))}
                     </div>
                  )}
               </div>
               <div className="w-full">
                  <ActionButton
                     action={showCreateModalHandler}
                     className="w-full rounded-xl"
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export const TournamentItem = ({ item }: { item: ICompetition }) => {
   if (!item.discipline) return null;
   return (
      <div>
         {item.discipline.title}
         {item.categories.length > 0 && (
            <span>
               {" "}
               ({item.categories.map(item => item.category.title).join(", ")})
            </span>
         )}
      </div>
   );
};

const AdminTournamentItem = ({
   item,
   tournamentId,
   arenaId,
}: {
   item: ICompetition;
   tournamentId: string;
   arenaId: string;
}) => {
   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      setActivatorNodeRef,
      isDragging,
   } = useSortable({ id: item.id });
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
               <TournamentItem item={item} />
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

export default TournamentCard;
