import React from "react";
import { ITournament } from "@/types/entities.types";
import styles from "./Tournament.module.css";
import TournamentRow from "./TournamentRow";

interface IProps {
   tournaments: ITournament[];
   isAdmin?: boolean;
}

const TournamentGrid = ({ tournaments, isAdmin = false }: IProps) => {
   return (
      <div>
         {tournaments.map(tournament => {
            const uniqueArenas = new Set(
               tournament.competitions.map(comp => comp.arena.id)
            );
            const competitionsByArena = Array.from(uniqueArenas).map(itemComp =>
               tournament.competitions
                  .filter(i => i.arena.id === itemComp)
                  .sort((a, b) => a.order - b.order)
            );
            return (
               <div className="mb-12" key={tournament.id}>
                  <h2 className="mb-4">{tournament.title}</h2>
                  <div>
                     {competitionsByArena.length !== 0 ? (
                        <div className={styles["card-grid"]}>
                           <TournamentRow
                              competitionsByArena={competitionsByArena}
                              tournamentId={tournament.id}
                              isAdmin={isAdmin}
                           />
                        </div>
                     ) : (
                        <div>Нет арен</div>
                     )}
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default TournamentGrid;
