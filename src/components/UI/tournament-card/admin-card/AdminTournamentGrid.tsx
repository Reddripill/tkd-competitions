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
      const activeId = active.id as string;

      const activeCompetition = active.data.current as SortableItemDataType;

      const nextTournaments = queryClient.getQueryData<IStructuredTournaments>([
         QUERY_KEYS.TOURNAMENTS,
      ]);

      if (!prevTournaments || !nextTournaments) return;

      const fromTournamentId =
         prevTournaments.competitions.byId[activeId].tournamentId;
      const fromArenaId = prevTournaments.competitions.byId[activeId].arena.id;
      const fromList =
         prevTournaments.orderByArena[fromTournamentId][fromArenaId];

      const toTournamentId = activeCompetition.tournamentId;
      const toArenaId = activeCompetition.arenaId;
      const toList = nextTournaments.orderByArena[toTournamentId][toArenaId];

      const fromIndex = fromList.indexOf(activeId);
      const toIndex = toList.indexOf(activeId);

      if (
         fromTournamentId === toTournamentId &&
         fromArenaId === toArenaId &&
         fromIndex === toIndex
      ) {
         return;
      }

      if (fromTournamentId === toTournamentId && fromArenaId === toArenaId) {
         const minIndex = Math.min(fromIndex, toIndex);
         const maxIndex = Math.max(fromIndex, toIndex);

         const nextBody: IReorderCompetitionBody[] = toList.map(
            (item, index) => ({
               id: item,
               tournamentId: toTournamentId,
               arenaId: toArenaId,
               order: index + 1,
            })
         );

         const filteredNextBody = nextBody.filter(
            (_, index) => index >= minIndex && index <= maxIndex
         );

         changeOrderMutation.mutate(filteredNextBody);
      } else {
         const newFromList = fromList.filter(item => item !== activeId);

         const prevBody: IReorderCompetitionBody[] = newFromList.map(
            (item, index) => ({
               id: item,
               tournamentId: fromTournamentId,
               arenaId: fromArenaId,
               order: index + 1,
            })
         );

         const nextBody: IReorderCompetitionBody[] = toList.map(
            (item, index) => ({
               id: item,
               tournamentId: toTournamentId,
               arenaId: toArenaId,
               order: index + 1,
            })
         );

         changeOrderMutation.mutate([...prevBody, ...nextBody]);
      }
   };

   const dragOverHandler = (event: DragOverEvent) => {
      const { active, over } = event;

      if (!prevTournaments || !over?.data.current || active.id === over.id)
         return;

      // const activeCompetition = active.data.current as SortableItemDataType;
      const overCompetition = over.data.current as SortableItemDataType;

      queryClient.setQueryData<IStructuredTournaments>(
         [QUERY_KEYS.TOURNAMENTS],
         old => {
            if (!old) return old;

            const activeId = active.id as string;
            const overId = over.id as string;

            const fromTournamentId =
               old.competitions.byId[activeId].tournamentId;
            const fromArenaId = old.competitions.byId[activeId].arena.id;
            const fromList = old.orderByArena[fromTournamentId][fromArenaId];

            const toTournamentId = overCompetition.tournamentId;
            const toArenaId = overCompetition.arenaId;
            const toList = old.orderByArena[toTournamentId][toArenaId];

            const fromIndex = fromList.indexOf(activeId);
            const toIndex = toList.indexOf(overId);

            if (fromIndex === -1 || toIndex === -1) return old;

            if (
               fromTournamentId === toTournamentId &&
               fromArenaId === toArenaId
            ) {
               const newList = arrayMove(fromList, fromIndex, toIndex);
               return {
                  ...old,
                  orderByArena: {
                     ...old.orderByArena,
                     [fromTournamentId]: {
                        ...old.orderByArena[fromTournamentId],
                        [fromArenaId]: newList,
                     },
                  },
               };
            } else {
               const arenaEntity = old.arenas.byId[toArenaId];

               const newFromList = fromList.filter(item => item !== activeId);
               const newToList = [
                  ...toList.slice(0, toIndex),
                  activeId,
                  ...toList.slice(toIndex),
               ];

               const nextOrderByArena = { ...old.orderByArena };

               if (fromTournamentId === toTournamentId) {
                  nextOrderByArena[fromTournamentId] = {
                     ...nextOrderByArena[fromTournamentId],
                     [fromArenaId]: newFromList,
                     [toArenaId]: newToList,
                  };
               } else {
                  nextOrderByArena[fromTournamentId] = {
                     ...nextOrderByArena[fromTournamentId],
                     [fromArenaId]: newFromList,
                  };
                  nextOrderByArena[toTournamentId] = {
                     ...nextOrderByArena[toTournamentId],
                     [toArenaId]: newToList,
                  };
               }
               return {
                  ...old,
                  competitions: {
                     ...old.competitions,
                     byId: {
                        ...old.competitions.byId,
                        [activeId]: {
                           ...old.competitions.byId[activeId],
                           arena: arenaEntity,
                        },
                     },
                  },
                  orderByArena: nextOrderByArena,
               };
            }
         }
      );
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
