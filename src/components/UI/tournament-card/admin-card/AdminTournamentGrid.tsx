import React, { useState } from "react";
import { ITournament } from "@/types/entities.types";
import ConfirmModal from "../../modals/ConfirmModal";
import UpdateModal from "../../modals/UpdateModal";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ModalsProvider } from "@/contexts/ModalsContext";
import CreateModal from "../../modals/CreateModal";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/providers/QueryProvider";
import {
   closestCenter,
   DndContext,
   DragEndEvent,
   DragOverEvent,
   DragOverlay,
   DragStartEvent,
   PointerSensor,
   useSensor,
   useSensors,
} from "@dnd-kit/core";
import CardOverlay from "../CardOverlay";
import { IBaseEntityWithTitleAndCount } from "@/types/main.types";
import { arrayMove } from "@dnd-kit/sortable";
import { SortableItemDataType } from "@/types/dnd.types";
import { createPortal } from "react-dom";
import { IReorderCompetitionBody } from "@/types/query.types";
import { IStructuredTournaments } from "../changeTournamentData";
import AdminTournamentGridContent from "./AdminTournamentGridContent";

interface IProps {
   tournaments: IStructuredTournaments;
}

export interface IDeleteCompetitionsBody {
   arena_id: string;
   tournament_id: string;
}

const AdminTournamentGrid = ({ tournaments }: IProps) => {
   const [currentId, setCurrentId] = useState<IDeleteCompetitionsBody | null>(
      null
   );
   const [prevTournaments, setPrevTournaments] =
      useState<IStructuredTournaments | null>(null);
   const [activeDragId, setActiveDragId] = useState<string | null>(null);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const sensors = useSensors(useSensor(PointerSensor));
   const deleteMutation = useMutation({
      mutationFn: async (body: IDeleteCompetitionsBody) => {
         const res = await fetch(API.COMPETITIONS, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         });

         if (!res.ok) {
            throw new Error("Ошибка удаления");
         }

         return res.json();
      },

      onSuccess: () => {
         toast.success("Записи успешно удалены");
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
      },
   });

   const changeOrderMutation = useMutation<
      IBaseEntityWithTitleAndCount<ITournament>,
      unknown,
      IReorderCompetitionBody[]
   >({
      mutationFn: async (competitions: IReorderCompetitionBody[]) => {
         const res = await fetch(`${API.REORDER_COMPETITIONS}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: competitions }),
         });

         if (!res.ok) {
            throw new Error("Ошибка при изменении");
         }

         return res.json();
      },

      onError: (err, newCompetitions, onMutateResult, context) => {
         toast.error("Ошибка при изменении");
         if (onMutateResult) {
            context.client.setQueryData(
               [QUERY_KEYS.TOURNAMENTS],
               prevTournaments
            );
         }
      },

      onSettled: (data, error, variables, onMutateResult, context) => {
         context.client.invalidateQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });
         setPrevTournaments(null);
      },
   });

   const deleteEntityHandler = () => {
      if (currentId) {
         deleteMutation.mutate(currentId);
      }
   };

   const getOverlayItem = () => {
      if (activeDragId) {
         return tournaments.competitions.byId[activeDragId];
      }
      return null;
   };

   const overlayItem = activeDragId ? getOverlayItem() : null;

   const dragStartHandler = async (event: DragStartEvent) => {
      setActiveDragId(event.active.id.toString());
      await queryClient.cancelQueries({
         queryKey: [QUERY_KEYS.TOURNAMENTS],
      });
      if (!prevTournaments) {
         const prevState = queryClient.getQueryData<IStructuredTournaments>([
            QUERY_KEYS.TOURNAMENTS,
         ]);
         if (prevState) {
            setPrevTournaments(prevState);
         }
      }
   };

   const dragEndHandler = (event: DragEndEvent) => {
      setActiveDragId(null);
      const { active } = event;

      const activeCompetition = active.data.current as SortableItemDataType;

      if (!prevTournaments) return;

      const prevActiveIndex = prevTournaments.orderByArena[
         activeCompetition.tournamentId
      ][activeCompetition.arenaId].findIndex(item => item === active.id);

      const prevArenaId = prevTournaments.competitions.byId[active.id].arena.id;

      const prevTournamentId =
         prevTournaments.competitions.byId[active.id].tournamentId;

      if (prevActiveIndex === +activeCompetition.sortable.index) return;

      const minIndex = Math.min(
         prevActiveIndex ?? 0,
         +activeCompetition.sortable.index
      );
      const maxIndex = Math.max(
         prevActiveIndex ?? 0,
         +activeCompetition.sortable.index
      );

      if (
         activeCompetition.tournamentId === prevTournamentId &&
         activeCompetition.arenaId === prevArenaId
      ) {
         const competitionsBody: IReorderCompetitionBody[] =
            activeCompetition.sortable.items.map((item, index) => ({
               id: item.toString(),
               tournamentId: activeCompetition.tournamentId,
               order: index + 1,
            }));
         const updatedCompetitionsBody = competitionsBody.filter(
            (_, index) => index >= minIndex && index <= maxIndex
         );
         changeOrderMutation.mutate(updatedCompetitionsBody);
      }
   };

   const dragOverHandler = (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over?.data.current || active.id === over.id) return;

      const activeCompetition = active.data.current as SortableItemDataType;
      const overCompetition = over.data.current as SortableItemDataType;

      if (
         activeCompetition.tournamentId === overCompetition.tournamentId &&
         activeCompetition.arenaId === overCompetition.arenaId
      ) {
         const newCompetitionsArr = arrayMove(
            activeCompetition.sortable.items as string[],
            activeCompetition.sortable.index,
            overCompetition.sortable.index
         );

         queryClient.setQueryData(
            [QUERY_KEYS.TOURNAMENTS],
            (old: IStructuredTournaments) => {
               if (!old) return old;
               const nextCompetitionsById = { ...old.competitions.byId };

               newCompetitionsArr.forEach((compId, index) => {
                  nextCompetitionsById[compId] = {
                     ...nextCompetitionsById[compId],
                     order: index + 1,
                  };
               });
               const nextState: IStructuredTournaments = {
                  ...old,
                  competitions: {
                     ...old.competitions,
                     byId: nextCompetitionsById,
                  },
                  orderByArena: {
                     ...old.orderByArena,
                     [overCompetition.tournamentId]: {
                        ...old.orderByArena[overCompetition.tournamentId],
                        [overCompetition.arenaId]: newCompetitionsArr,
                     },
                  },
               };

               return nextState;
            }
         );
      }
   };

   return (
      <DndContext
         collisionDetection={closestCenter}
         sensors={sensors}
         onDragStart={dragStartHandler}
         onDragEnd={dragEndHandler}
         onDragOver={dragOverHandler}
      >
         <ModalsProvider<IDeleteCompetitionsBody | null>
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
               id={currentId?.arena_id || null}
               isOpen={isUpdateModalOpen}
               setIsOpen={setIsUpdateModalOpen}
               source={API.ARENAS}
               queryKey={QUERY_KEYS.TOURNAMENTS}
            />
            <CreateModal
               isOpen={isCreateModalOpen}
               setIsOpen={setIsCreateModalOpen}
               queryKey={QUERY_KEYS.DISCIPLINES}
               source={API.TOURNAMENTS}
               isAdding={true}
               title="Добавление соревнованией"
               description="Добавьте одну или несколько записей дисциплин"
               actionBtnText="Добавить"
            />
            <AdminTournamentGridContent data={tournaments} />
         </ModalsProvider>
         {createPortal(
            <DragOverlay>
               {activeDragId && overlayItem ? (
                  <CardOverlay item={overlayItem} />
               ) : null}
            </DragOverlay>,
            document.body
         )}
      </DndContext>
   );
};

export default AdminTournamentGrid;
