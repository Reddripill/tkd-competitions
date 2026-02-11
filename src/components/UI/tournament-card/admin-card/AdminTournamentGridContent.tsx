import React from "react";
import { IStructuredTournaments } from "../changeTournamentData";
import styles from "../Tournament.module.css";
import AdminTournamentCard from "./AdminTournamentCard";

interface IProps {
   data: IStructuredTournaments;
}

const AdminTournamentGridContent = ({ data }: IProps) => {
   return (
      <div>
         {data.tournaments.allIds.map(tournamentId => {
            const currentTournament = data.tournaments.byId[tournamentId];
            const arenas = data.orderByArena[tournamentId];
            const arenaIds = Object.keys(arenas);
            return (
               <div className="mb-12" key={tournamentId}>
                  <h2 className="mb-4">{currentTournament.title}</h2>
                  <div>
                     {arenaIds.length !== 0 ? (
                        <div className={styles["card-grid"]}>
                           {arenaIds.map(arenaId => {
                              const competitionIdsByArena =
                                 data.orderByArena[tournamentId][arenaId];
                              const competitionsByArena =
                                 competitionIdsByArena.map(
                                    comp => data.competitions.byId[comp]
                                 );
                              return (
                                 <AdminTournamentCard
                                    key={arenaId}
                                    tournamentId={tournamentId}
                                    competitions={competitionsByArena}
                                    competitionsList={competitionIdsByArena}
                                    arenaId={arenaId}
                                    arenaEntity={
                                       data.arenas.byId[arenaId].arena
                                    }
                                 />
                              );
                           })}
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

export default AdminTournamentGridContent;
