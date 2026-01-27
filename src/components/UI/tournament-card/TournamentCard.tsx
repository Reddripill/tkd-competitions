import React from "react";
import { ICompetition } from "@/types/entities.types";
import ActionButton from "../buttons/ActionButton";
import CardOptions from "./CardOptions";
import { Checkbox } from "../lib-components/checkbox";
import { EllipsisVertical } from "lucide-react";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import { IDeleteCompetitionsBody } from "./AdminTournamentGrid";

interface IProps {
   competitions: ICompetition[];
   tournamentId: string;
}

const TournamentCard = ({ competitions, tournamentId }: IProps) => {
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
                        {competitions.map(item => {
                           if (!item.discipline) return null;
                           return (
                              <div
                                 key={item.id}
                                 className="flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm"
                              >
                                 <div className="flex items-center justify-center">
                                    <Checkbox className="size-4" />
                                 </div>
                                 <div className="grow">
                                    {item.discipline.title}
                                    {item.categories.length > 0 && (
                                       <span>
                                          {" "}
                                          (
                                          {item.categories
                                             .map(item => item.category.title)
                                             .join(", ")}
                                          )
                                       </span>
                                    )}
                                 </div>
                                 <button type="button">
                                    <EllipsisVertical size={18} />
                                 </button>
                              </div>
                           );
                        })}
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
   );
};

export default TournamentCard;
