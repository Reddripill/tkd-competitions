import React, { useId } from "react";
import { ICompetition, ITournament } from "@/types/entities.types";
import TournamentCard from "./TournamentCard";
import styles from "./Tournament.module.css";
import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface IProps {
   tournaments: ITournament[];
   isAdmin?: boolean;
}

interface IInnerProps {
   tournament: ITournament;
   competitionsByArena: ICompetition[];
   isAdmin?: boolean;
}

interface ITournamentCotentProps extends IInnerProps {
   isOver?: boolean;
}

const TournamentGrid = ({ tournaments, isAdmin = false }: IProps) => {
   return (
      <div>
         {tournaments.map(tournament => {
            const uniqueArenas = new Set(
               tournament.competitions.map(comp => comp.arena.id)
            );
            const competitionsByArena = Array.from(uniqueArenas).flatMap(
               itemComp =>
                  tournament.competitions
                     .filter(i => i.arena.id === itemComp)
                     .sort((a, b) => a.order - b.order)
            );
            return (
               <React.Fragment key={tournament.id}>
                  {isAdmin ? (
                     <SortableContext
                        items={tournament.competitions.map(comp => comp.id)}
                     >
                        <AdminTournamentGridContent
                           tournament={tournament}
                           competitionsByArena={competitionsByArena}
                           isAdmin={isAdmin}
                        />
                     </SortableContext>
                  ) : (
                     <TournamentGridContent
                        tournament={tournament}
                        competitionsByArena={competitionsByArena}
                        isAdmin={isAdmin}
                     />
                  )}
               </React.Fragment>
            );
         })}
      </div>
   );
};

const TournamentGridContent = ({
   tournament,
   competitionsByArena,
   isAdmin = false,
   isOver = false,
}: ITournamentCotentProps) => {
   return (
      <div className="mb-12">
         <h2 className="mb-4">{tournament.title}</h2>
         <div>
            {competitionsByArena.length !== 0 ? (
               <div className={styles["card-grid"]}>
                  <TournamentCard
                     competitions={competitionsByArena}
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
};

export default TournamentGrid;

const AdminTournamentGridContent = (props: IInnerProps) => {
   const defaultId = useId();
   const isEmpyCompetitions = props.competitionsByArena.length === 0;
   const { setNodeRef, isOver, over } = useDroppable({
      id: isEmpyCompetitions
         ? defaultId
         : `${props.tournament.id}:${props.competitionsByArena[0].id}`,
      disabled: isEmpyCompetitions,
   });
   // console.log(over);
   return (
      <div ref={setNodeRef}>
         <TournamentGridContent isOver={isOver} {...props} />
      </div>
   );
};
