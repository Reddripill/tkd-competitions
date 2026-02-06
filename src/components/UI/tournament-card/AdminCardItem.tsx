import React from "react";
import { cn } from "@/lib/utils";
import { ICompetition, ITournament } from "@/types/entities.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "../lib-components/checkbox";
import { CardItem } from "./TournamentCard";
import CardOptions from "./CardOptions";
import { useMutation } from "@tanstack/react-query";
import { API } from "@/constants/api";
import { toast } from "sonner";
import { IUpdateCompetitionStatusBody } from "@/types/query.types";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { IBaseEntityWithTitleAndCount } from "@/types/main.types";

interface IProps {
   item: ICompetition;
   tournamentId: string;
   arenaId: string;
}

const AdminCardItem = ({ item, tournamentId, arenaId }: IProps) => {
   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      setActivatorNodeRef,
      isDragging,
   } = useSortable({ id: item.id, data: { arenaId, tournamentId } });

   const updateStatusMutation = useMutation<
      unknown,
      unknown,
      IUpdateCompetitionStatusBody,
      { prevState: IBaseEntityWithTitleAndCount<ITournament> | undefined }
   >({
      mutationFn: async (body: IUpdateCompetitionStatusBody) => {
         const res = await fetch(`${API.COMPETITIONS}/${body.id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               isFinished: body.isFinished,
            }),
         });

         if (!res.ok) {
            throw new Error("Ошибка удаления");
         }

         return res.json();
      },

      onMutate: async (updatedCompetition, context) => {
         await context.client.cancelQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });

         const prevState = context.client.getQueryData<
            IBaseEntityWithTitleAndCount<ITournament>
         >([QUERY_KEYS.TOURNAMENTS]);

         context.client.setQueryData<IBaseEntityWithTitleAndCount<ITournament>>(
            [QUERY_KEYS.TOURNAMENTS],
            old => {
               if (!old) return old;
               return {
                  ...old,

                  data: old.data.map(tournament => {
                     return {
                        ...tournament,

                        competitions: tournament.competitions.map(comp => {
                           if (comp.id !== updatedCompetition.id) return comp;

                           return {
                              ...comp,
                              isFinished: updatedCompetition.isFinished,
                           };
                        }),
                     };
                  }),
               };
            }
         );
         return { prevState };
      },

      onError: (error, variables, onMutateResult, context) => {
         toast.error("Ошибка при изменении статуса");
         context.client.setQueryData(
            [QUERY_KEYS.TOURNAMENTS],
            onMutateResult?.prevState
         );
      },

      onSettled: (data, error, variables, onMutateResult, context) => {
         context.client.invalidateQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });
      },
   });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
   };

   const handleChecked = () => {
      updateStatusMutation.mutate({
         id: item.id,
         isFinished: !item.isFinished,
      });
   };

   if (!item.discipline) return null;

   return (
      <div ref={setNodeRef} style={style} {...attributes}>
         <div
            className={cn(
               "flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm min-h-10",
               { "opacity-50": isDragging }
            )}
         >
            <div className="flex items-center justify-center">
               <Checkbox
                  checked={item.isFinished}
                  onCheckedChange={handleChecked}
                  className="size-4"
               />
            </div>
            <div
               className="grow cursor-grab"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <CardItem item={item} />
            </div>
            <div className="shrink-0">
               <CardOptions
                  tournamentId={tournamentId}
                  arenaId={arenaId}
                  isVertical={true}
               />
            </div>
         </div>
      </div>
   );
};

export default AdminCardItem;
