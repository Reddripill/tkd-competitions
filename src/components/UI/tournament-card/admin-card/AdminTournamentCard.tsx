import React, { useState } from "react";
import { ICompetition } from "@/types/entities.types";
import { useDroppable } from "@dnd-kit/core";
import { ModalsProvider, useGetModalsContext } from "@/contexts/ModalsContext";
import CardOptions from "../CardOptions";
import ActionButton from "../../buttons/ActionButton";
import { SortableContext } from "@dnd-kit/sortable";
import AdminCardItem from "./AdminCardItem";
import { IBaseEntityWithTitle, SetStateType } from "@/types/main.types";
import { cn } from "@/lib/utils";
import ConfirmModal from "../../modals/ConfirmModal";
import UpdateModal from "../../modals/UpdateModal";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useDeleteEntity } from "@/hooks/query";
import { IArenaInfo } from "./AdminTournamentGridContent";
import CompetitionModal from "../../modals/CompetitionModal";

interface IProps {
   competitions: ICompetition[];
   competitionsList: string[];
   tournamentId: string;
   arenaId: string;
   arenaEntity: IBaseEntityWithTitle;
   isCreateModalOpen: boolean;
   setIsCreateModalOpen: SetStateType<boolean>;
}

const AdminTournamentCard = ({
   competitions,
   tournamentId,
   competitionsList,
   arenaId,
   arenaEntity,
   isCreateModalOpen,
   setIsCreateModalOpen,
}: IProps) => {
   const [currentCompId, setCurrentCompId] = useState<string | null>(null);
   const [isDeleteCompModalOpen, setIsDeleteCompModalOpen] = useState(false);
   const [isUpdateCompModalOpen, setIsUpdateCompModalOpen] = useState(false);

   const { setNodeRef, isOver } = useDroppable({
      id: arenaId,
      data: { arenaId, tournamentId },
   });
   const {
      showCreateModal,
      setCurrentId,
      showDeleteModal,
      showUpdateModal,
      currentId,
   } = useGetModalsContext<IArenaInfo>();

   const deleteCompetition = useDeleteEntity({
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.COMPETITIONS,
   });

   const deleteCompetitionHandler = () => {
      if (currentCompId) {
         deleteCompetition.mutate(currentCompId);
      }
   };

   const showCreateModalHandler = () => {
      if (showCreateModal && setCurrentId) {
         showCreateModal();
         setCurrentId({
            arena_id: arenaId,
            tournament_id: tournamentId,
         });
      }
   };

   const showDeleteModalHandler = () => {
      if (showDeleteModal && setCurrentId) {
         setCurrentId({
            arena_id: arenaId,
            tournament_id: tournamentId,
         });
         showDeleteModal();
      }
   };
   const showUpdateModalHandler = () => {
      if (showUpdateModal && setCurrentId) {
         setCurrentId({
            arena_id: arenaId,
            tournament_id: tournamentId,
         });
         showUpdateModal();
      }
   };
   return (
      <ModalsProvider<string | null>
         value={{
            setCurrentId: setCurrentCompId,
            showDeleteModal: () => setIsDeleteCompModalOpen(true),
            showUpdateModal: () => setIsUpdateCompModalOpen(true),
         }}
      >
         <ConfirmModal
            title="Удаление дисциплины"
            description="Запись невозможно будет восстановить. Вы уверены?"
            actionBtnText="Удалить"
            confirmedAction={deleteCompetitionHandler}
            isOpen={isDeleteCompModalOpen}
            setIsOpen={setIsDeleteCompModalOpen}
            btnType="delete"
         />
         <UpdateModal
            id={currentCompId || null}
            isOpen={isUpdateCompModalOpen}
            setIsOpen={setIsUpdateCompModalOpen}
            source={API.COMPETITIONS}
            queryKey={QUERY_KEYS.TOURNAMENTS}
         />
         <CompetitionModal
            isOpen={isCreateModalOpen}
            setIsOpen={setIsCreateModalOpen}
            tournamentId={currentId?.tournament_id}
            arenaId={currentId?.arena_id}
            queryKey={QUERY_KEYS.TOURNAMENTS}
            title="Добавление соревнованией"
            description="Добавьте одну или несколько записей дисциплин"
            actionBtnText="Добавить"
         />
         <div
            className={cn(
               "bg-light-gray rounded-xl min-h-40 shadow-border transition border border-transparent",
               {
                  "shadow-border-overed border-blue-accent/10 bg-blue-accent/10":
                     isOver && competitionsList.length === 0,
               }
            )}
         >
            <div ref={setNodeRef} className="size-full">
               <div className="flex flex-col h-full text-black py-4 px-2">
                  <div className="flex items-center justify-between mb-4">
                     <div className="font-medium pl-2">{arenaEntity.title}</div>
                     <CardOptions
                        showDelete={showDeleteModalHandler}
                        showUpdate={showUpdateModalHandler}
                     />
                  </div>
                  <div className="grow flex flex-col">
                     <div className="grow">
                        {competitionsList.length > 0 && (
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
      </ModalsProvider>
   );
};

export default AdminTournamentCard;
