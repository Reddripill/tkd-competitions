import React, { useState } from "react";
import { ICompetition, ITournament } from "@/types/entities.types";
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
   PointerSensor,
   useSensor,
   useSensors,
} from "@dnd-kit/core";
import CardOverlay from "./CardOverlay";
import { IBaseEntityWithTitleAndCount } from "@/types/main.types";
import { arrayMove, SortableData } from "@dnd-kit/sortable";
import {
   IReorderCompetition,
   IReorderCompetitionBody,
} from "@/types/dnd.types";

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
   const [prevTournaments, setPrevTournaments] = useState<ITournament[] | null>(
      null
   );
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

   const findCompetition = (id: string): IReorderCompetition | null => {
      const formattedCompetitions = tournaments.flatMap(tournament =>
         tournament.competitions.map(competition => {
            const currentCompetitions = tournament.competitions.filter(
               comp => comp.arena.id === competition.arena.id
            );
            return {
               id: competition.id,
               tournamentId: tournament.id,
               order: competition.order,
               arenaId: competition.arena.id,
               competitions: currentCompetitions,
            };
         })
      );
      const currentCompetiton = formattedCompetitions.find(
         item => item.id === id
      );
      if (!currentCompetiton) {
         return null;
      }
      return currentCompetiton;
   };

   const dragEndHandler = (event: DragEndEvent) => {
      setActiveDragId(null);
      const { active, over } = event;
      if (over === null) return;
      const activeCompetition = findCompetition(active.id.toString());
      const overCompetition = findCompetition(over.id.toString());

      if (!activeCompetition || !overCompetition) return;

      if (activeCompetition.arenaId === overCompetition.arenaId) {
         const sortedCompetitions = activeCompetition.competitions
            .sort((a, b) => a.order - b.order)
            .map(item => item.id);
         const newCompetitionsArr = arrayMove(
            sortedCompetitions,
            activeCompetition.order - 1,
            overCompetition.order - 1
         );
         const competitionsBody: IReorderCompetitionBody[] =
            newCompetitionsArr.map((item, index) => ({
               id: item,
               tournamentId: activeCompetition.tournamentId,
               order: index + 1,
            }));
         changeOrderMutation.mutate(competitionsBody);
      }
   };

   const dragOverHandler = async (event: DragOverEvent) => {
      await queryClient.cancelQueries({
         queryKey: [QUERY_KEYS.TOURNAMENTS],
      });
      if (!prevTournaments) {
         const prevState = queryClient.getQueryData<ITournament[]>([
            QUERY_KEYS.TOURNAMENTS,
         ]);
         if (prevState) {
            setPrevTournaments(prevState);
         }
      }
      const { active, over } = event;

      if (over === null) return;

      const activeCompetition = findCompetition(active.id.toString());
      const overCompetition = findCompetition(over.id.toString());

      if (!activeCompetition || !overCompetition) return;

      if (activeCompetition.arenaId === overCompetition.arenaId) {
         const sortedCompetitions = activeCompetition.competitions
            .sort((a, b) => a.order - b.order)
            .map(item => item.id);
         const newCompetitionsArr = arrayMove(
            sortedCompetitions,
            activeCompetition.order - 1,
            overCompetition.order - 1
         );
         const competitionsBody: IReorderCompetitionBody[] =
            newCompetitionsArr.map((item, index) => ({
               id: item,
               tournamentId: activeCompetition.tournamentId,
               order: index + 1,
            }));

         queryClient.setQueryData(
            [QUERY_KEYS.TOURNAMENTS],
            (old: IBaseEntityWithTitleAndCount<ITournament>) => {
               const oldData = old.data;
               const newOrderMap = new Map<string, number>();
               competitionsBody.forEach(item => {
                  newOrderMap.set(item.id, item.order);
               });

               const updatedTournaments = oldData.map(tournament => {
                  const tournamentCompetitions = competitionsBody.filter(
                     comp => comp.tournamentId === tournament.id
                  );

                  if (tournamentCompetitions.length === 0) {
                     return tournament;
                  }

                  const updatedCompetitionsList = tournament.competitions
                     .map(competition => {
                        const newOrder = newOrderMap.get(competition.id);
                        if (newOrder !== undefined) {
                           return {
                              ...competition,
                              order: newOrder,
                           };
                        }
                        return competition;
                     })
                     .sort((a, b) => a.order - b.order);

                  return {
                     ...tournament,
                     competitions: updatedCompetitionsList,
                  };
               });

               return {
                  data: updatedTournaments,
                  count: updatedTournaments.length,
               };
            }
         );
      }
   };

   return (
      <DndContext
         collisionDetection={closestCenter}
         sensors={sensors}
         onDragStart={e => setActiveDragId(e.active.id.toString())}
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
         <DragOverlay>
            {activeDragId && overlayItem ? (
               <CardOverlay item={overlayItem} />
            ) : null}
         </DragOverlay>
      </DndContext>
   );
};

export default AdminTournamentGrid;
