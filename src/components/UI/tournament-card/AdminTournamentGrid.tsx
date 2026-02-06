import React, { useState } from "react";
import { ITournament } from "@/types/entities.types";
import TournamentGrid from "./TournamentGrid";
import ConfirmModal from "../modals/ConfirmModal";
import UpdateModal from "../modals/UpdateModal";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ModalsProvider } from "@/contexts/ModalsContext";
import CreateModal from "../modals/CreateModal";
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
import CardOverlay from "./CardOverlay";
import { IBaseEntityWithTitleAndCount } from "@/types/main.types";
import { arrayMove } from "@dnd-kit/sortable";
import {
   IReorderCompetitionBody,
   SortableItemDataType,
} from "@/types/dnd.types";
import { createPortal } from "react-dom";

interface IProps {
   tournaments: ITournament[];
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
      useState<IBaseEntityWithTitleAndCount<ITournament> | null>(null);
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
      return tournaments
         .flatMap(tournament => tournament.competitions)
         .find(comp => comp.id === activeDragId);
   };

   const overlayItem = activeDragId ? getOverlayItem() : null;

   const dragStartHandler = async (event: DragStartEvent) => {
      setActiveDragId(event.active.id.toString());
      await queryClient.cancelQueries({
         queryKey: [QUERY_KEYS.TOURNAMENTS],
      });
      if (!prevTournaments) {
         const prevState = queryClient.getQueryData<
            IBaseEntityWithTitleAndCount<ITournament>
         >([QUERY_KEYS.TOURNAMENTS]);
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

      const prevTournament = prevTournaments.data.find(tournmanent =>
         tournmanent.competitions.map(comp => comp.id === active.id)
      );

      if (!prevTournament) return;

      if (activeCompetition.tournamentId === prevTournament.id) {
         const competitionsBody: IReorderCompetitionBody[] =
            activeCompetition.sortable.items.map((item, index) => ({
               id: item.toString(),
               tournamentId: activeCompetition.tournamentId,
               order: index + 1,
            }));
         changeOrderMutation.mutate(competitionsBody);
      }
   };

   const dragOverHandler = (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over?.data.current || active.id === over.id) return;

      const activeCompetition = active.data.current as SortableItemDataType;
      const overCompetition = over.data.current as SortableItemDataType;

      if (activeCompetition.arenaId === overCompetition.arenaId) {
         const newCompetitionsArr = arrayMove(
            activeCompetition.sortable.items,
            activeCompetition.sortable.index,
            overCompetition.sortable.index
         );
         const competitionsBody: IReorderCompetitionBody[] =
            newCompetitionsArr.map((item, index) => ({
               id: item.toString(),
               tournamentId: activeCompetition.tournamentId,
               order: index + 1,
            }));

         queryClient.setQueryData(
            [QUERY_KEYS.TOURNAMENTS],
            (old: IBaseEntityWithTitleAndCount<ITournament>) => {
               if (!old) return old;

               return {
                  ...old,

                  data: old.data.map(tournament => {
                     return {
                        ...tournament,

                        competitions: tournament.competitions.map(comp => {
                           const updated = competitionsBody.find(
                              b => b.id === comp.id
                           );

                           if (!updated) return comp;

                           return {
                              ...comp,
                              order: updated.order,
                           };
                        }),
                     };
                  }),
               };
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
            <TournamentGrid tournaments={tournaments} isAdmin={true} />
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
