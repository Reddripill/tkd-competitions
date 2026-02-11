import React from "react";
import { ICompetition } from "@/types/entities.types";
import { useDroppable } from "@dnd-kit/core";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import { IDeleteCompetitionsBody } from "./AdminTournamentGrid";
import CardOptions from "../CardOptions";
import ActionButton from "../../buttons/ActionButton";
import { SortableContext } from "@dnd-kit/sortable";
import AdminCardItem from "./AdminCardItem";
import { IBaseEntityWithTitle } from "@/types/main.types";

interface IProps {
   competitions: ICompetition[];
   competitionsList: string[];
   tournamentId: string;
   arenaId: string;
   arenaEntity: IBaseEntityWithTitle;
}

const AdminTournamentCard = ({
   competitions,
   tournamentId,
   competitionsList,
   arenaId,
   arenaEntity,
}: IProps) => {
   const { setNodeRef } = useDroppable({
      id: arenaId,
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
         <div ref={setNodeRef} className="size-full">
            <div className="flex flex-col h-full text-black py-4 px-2">
               <div className="flex items-center justify-between mb-4">
                  <div className="font-medium pl-2">{arenaEntity.title}</div>
                  <CardOptions
                     tournamentId={tournamentId}
                     arenaId={arenaEntity.id}
                  />
               </div>
               <div className="grow flex flex-col">
                  {competitionsList.length > 0 && (
                     <div className="grow">
                        {disciplineCount > 0 && (
                           <SortableContext items={competitionsList}>
                              <div className="flex flex-col gap-y-2 mb-6">
                                 {competitions.map(competition => (
                                    <AdminCardItem
                                       key={competition.id}
                                       item={competition}
                                       arenaId={arenaId}
                                       tournamentId={tournamentId}
                                    />
                                 ))}
                              </div>
                           </SortableContext>
                        )}
                     </div>
                  )}
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

export default AdminTournamentCard;
