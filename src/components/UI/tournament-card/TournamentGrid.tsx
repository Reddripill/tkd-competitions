import React from "react";
import { ITournament } from "@/types/entities.types";
import TournamentCard from "./TournamentCard";
import styles from "./Tournament.module.css";

interface IProps {
   items: ITournament[];
}

const TournamentGrid = ({ items }: IProps) => {
   return (
      <div>
         {items.map(item => {
            const uniqueArenas = new Set(
               item.competitions.map(comp => comp.arena.id)
            );
            const itemCompetitions = Array.from(uniqueArenas).map(itemComp =>
               item.competitions.filter(i => i.arena.id === itemComp)
            );
            return (
               <div key={item.id} className="mb-12">
                  <h2 className="mb-4">{item.title}</h2>
                  <div>
                     {itemCompetitions.length !== 0 ? (
                        <div className={styles["card-grid"]}>
                           {itemCompetitions.map(competitions => (
                              <TournamentCard
                                 key={competitions[0].id}
                                 competitions={competitions}
                                 tournamentId={item.id}
                              />
                           ))}
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
