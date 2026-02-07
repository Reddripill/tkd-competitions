import { ICompetition } from "@/types/entities.types";
import React from "react";
import TournamentCard from "./TournamentCard";

interface IProps {
   competitionsByArena: ICompetition[][];
   tournamentId: string;
   isAdmin?: boolean;
}

const TournamentRow = ({
   competitionsByArena,
   tournamentId,
   isAdmin = false,
}: IProps) => {
   return (
      <>
         {competitionsByArena.map(competitions => (
            <TournamentCard
               key={competitions[0].id}
               tournamentId={tournamentId}
               competitions={competitions}
               isAdmin={isAdmin}
            />
         ))}
      </>
   );
};

export default TournamentRow;
