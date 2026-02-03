import React from "react";
import { ICompetition } from "@/types/entities.types";
import ActionButton from "../buttons/ActionButton";
import CardOptions from "./CardOptions";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import { IDeleteCompetitionsBody } from "./AdminTournamentGrid";
import { SortableContext } from "@dnd-kit/sortable";
import AdminCardItem from "./AdminCardItem";
import { useDroppable } from "@dnd-kit/core";

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
   const { setNodeRef } = useDroppable({
      id: competitions[0].arena.id,
   });
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
      <div className="bg-light-gray rounded-xl min-h-40 shadow-border">
         <div ref={setNodeRef}>
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
                                    <SortableContext
                                       items={competitions.map(comp => comp.id)}
                                    >
                                       <AdminCardItem
                                          item={item}
                                          arenaId={competitions[0].arena.id}
                                          tournamentId={tournamentId}
                                       />
                                    </SortableContext>
                                 ) : (
                                    <div className="p-2 text-sm">
                                       <CardItem item={item} />
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
      </div>
   );
};

export const CardItem = ({ item }: { item: ICompetition }) => {
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

export default TournamentCard;
