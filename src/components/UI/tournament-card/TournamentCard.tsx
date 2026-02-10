import React from "react";
import { ICompetition } from "@/types/entities.types";
import CardOptions from "./CardOptions";

interface IProps {
   competitions: ICompetition[];
   tournamentId: string;
}

const TournamentCard = ({ competitions, tournamentId }: IProps) => {
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
                  {competitions.length > 0 && (
                     <div className="flex flex-col gap-y-2 mb-6">
                        {competitions.map(item => (
                           <div key={item.id} className="p-2 text-sm">
                              <div>
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
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default TournamentCard;
