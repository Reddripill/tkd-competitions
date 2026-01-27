import React, { useState } from "react";
import { ITournament } from "@/types/entities.types";
import TournamentGrid from "./TournamentGrid";
import ConfirmModal from "../modals/ConfirmModal";
import UpdateModal from "../modals/UpdateModal";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useDeleteEntity } from "@/hooks/query";
import { ModalsProvider } from "@/contexts/ModalsContext";
import CreateModal from "../modals/CreateModal";

interface IProps {
   items: ITournament[];
}

const AdminTournamentGrid = ({ items }: IProps) => {
   const [currentId, setCurrentId] = useState<string | null>(null);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const deleteMutation = useDeleteEntity({
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.TOURNAMENTS,
   });

   const deleteEntityHandler = () => {
      if (currentId) {
         deleteMutation.mutate(currentId);
      }
   };
   return (
      <div>
         <ModalsProvider
            value={{
               setCurrentId: setCurrentId,
               showDeleteModal: () => setIsDeleteModalOpen(true),
               showUpdateModal: () => setIsUpdateModalOpen(true),
               showCreateModal: () => setIsCreateModalOpen(true),
            }}
         >
            <ConfirmModal
               title="Удаление"
               description="Запись невозможно будет восстановить. Вы уверены?"
               actionBtnText="Удалить"
               confirmedAction={deleteEntityHandler}
               isOpen={isDeleteModalOpen}
               setIsOpen={setIsDeleteModalOpen}
               btnType="delete"
            />
            <UpdateModal
               id={currentId}
               isOpen={isUpdateModalOpen}
               setIsOpen={setIsUpdateModalOpen}
               source={API.ARENAS}
               queryKey={QUERY_KEYS.TOURNAMENTS}
            />
            <CreateModal
               isOpen={isCreateModalOpen}
               setIsOpen={setIsCreateModalOpen}
               queryKey={QUERY_KEYS.COMPETITIONS}
               source={API.COMPETITIONS}
            />
            <TournamentGrid items={items} />
         </ModalsProvider>
      </div>
   );
};

export default AdminTournamentGrid;
