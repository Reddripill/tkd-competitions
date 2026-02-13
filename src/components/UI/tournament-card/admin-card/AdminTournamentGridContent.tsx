import React, { useState } from "react";
import { IStructuredTournaments } from "../changeTournamentData";
import styles from "../Tournament.module.css";
import AdminTournamentCard from "./AdminTournamentCard";
import { ModalsProvider, useGetModalsContext } from "@/contexts/ModalsContext";
import { useDeleteEntities } from "@/hooks/query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { API } from "@/constants/api";
import ConfirmModal from "../../modals/ConfirmModal";
import UpdateModal from "../../modals/UpdateModal";
import CardOptions from "../CardOptions";

interface IProps {
   data: IStructuredTournaments;
}

export interface IArenaInfo {
   arena_id: string;
   tournament_id: string;
}

const AdminTournamentGridContent = ({ data }: IProps) => {
   const {
      setCurrentId: setCurrentTournamentId,
      showDeleteModal,
      showUpdateModal,
   } = useGetModalsContext<string>();

   const [currentId, setCurrentId] = useState<IArenaInfo | null>(null);
   const [isDeleteArenaModalOpen, setIsDeleteArenaModalOpen] = useState(false);
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   const deleteArena = useDeleteEntities<IArenaInfo>({
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.ARENAS_IN_TOURNAMENT,
   });
   const deleteArenaHandler = () => {
      if (currentId) {
         deleteArena.mutate({ items: [{ ...currentId }] });
      }
   };
   return (
      <ModalsProvider<IArenaInfo | null>
         value={{
            setCurrentId: setCurrentId,
            showDeleteModal: () => setIsDeleteArenaModalOpen(true),
            showUpdateModal: () => setIsUpdateModalOpen(true),
            showCreateModal: () => setIsCreateModalOpen(true),
            currentId,
         }}
      >
         <ConfirmModal
            title="Удаление арены"
            description="Запись невозможно будет восстановить. Вы уверены?"
            actionBtnText="Удалить"
            confirmedAction={deleteArenaHandler}
            isOpen={isDeleteArenaModalOpen}
            setIsOpen={setIsDeleteArenaModalOpen}
            btnType="delete"
         />
         <UpdateModal
            id={currentId?.arena_id || null}
            isOpen={isUpdateModalOpen}
            setIsOpen={setIsUpdateModalOpen}
            source={API.ARENAS}
            queryKey={QUERY_KEYS.TOURNAMENTS}
         />
         <div>
            {data.tournaments.allIds.map(tournamentId => {
               const currentTournament = data.tournaments.byId[tournamentId];
               const arenas = data.orderByArena[tournamentId];
               const arenaIds = Object.keys(arenas);
               const showTournamentDeleteModal = () => {
                  if (showDeleteModal && setCurrentTournamentId) {
                     setCurrentTournamentId(tournamentId);
                     showDeleteModal();
                  }
               };
               const showTournamentUpdateModal = () => {
                  if (showUpdateModal && setCurrentTournamentId) {
                     setCurrentTournamentId(tournamentId);
                     showUpdateModal();
                  }
               };
               return (
                  <div className="mb-12" key={tournamentId}>
                     <div className="flex gap-x-2 items-center mb-4">
                        <h2>{currentTournament.title}</h2>
                        <CardOptions
                           showDelete={showTournamentDeleteModal}
                           showUpdate={showTournamentUpdateModal}
                        />
                     </div>
                     <div>
                        {arenaIds.length !== 0 ? (
                           <div className={styles["card-grid"]}>
                              {arenaIds.map(arenaId => {
                                 const competitionIdsByArena =
                                    data.orderByArena[tournamentId][arenaId];
                                 const competitionsByArena =
                                    competitionIdsByArena.map(
                                       comp => data.competitions.byId[comp]
                                    );
                                 return (
                                    <AdminTournamentCard
                                       key={arenaId}
                                       tournamentId={tournamentId}
                                       competitions={competitionsByArena}
                                       competitionsList={competitionIdsByArena}
                                       isCreateModalOpen={isCreateModalOpen}
                                       setIsCreateModalOpen={
                                          setIsCreateModalOpen
                                       }
                                       arenaId={arenaId}
                                       arenaEntity={
                                          data.arenas.byId[arenaId].arena
                                       }
                                    />
                                 );
                              })}
                           </div>
                        ) : (
                           <div>Нет арен</div>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </ModalsProvider>
   );
};

export default AdminTournamentGridContent;
