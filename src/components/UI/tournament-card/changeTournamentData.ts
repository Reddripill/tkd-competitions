import { ICompetition, ITournament } from "@/types/entities.types";
import { IBaseEntityWithTitleAndCount } from "@/types/main.types";

interface IStructuredTournament {
   id: string;
   title: string;
   competitions: string[];
}
interface IStructuredCompetition extends ICompetition {
   tournamentId: string;
}

export interface IStructuredTournaments {
   tournaments: {
      byId: Record<string, IStructuredTournament>;
      allIds: string[];
   };
   competitions: {
      byId: Record<string, IStructuredCompetition>;
      allIds: string[];
   };
   orderByArena: Record<string, Record<string, string[]>>;
   count: number;
}

const defaultValue: IStructuredTournaments = {
   tournaments: {
      byId: {},
      allIds: [],
   },
   competitions: {
      byId: {},
      allIds: [],
   },
   orderByArena: {},
   count: 0,
};

export const changeTournamentData = (
   response: IBaseEntityWithTitleAndCount<ITournament> | undefined
) => {
   if (!response) return defaultValue;
   const rawData = response.data;
   const structuredData: IStructuredTournaments = {
      tournaments: {
         byId: {},
         allIds: [],
      },
      competitions: {
         byId: {},
         allIds: [],
      },
      orderByArena: {},
      count: response.count,
   };
   for (const tournament of rawData) {
      structuredData.tournaments.allIds.push(tournament.id);
      structuredData.tournaments.byId[tournament.id] = {
         id: tournament.id,
         title: tournament.title,
         competitions: [],
      };
      for (const competition of tournament.competitions) {
         structuredData.tournaments.byId[tournament.id].competitions.push(
            competition.id
         );

         structuredData.competitions.allIds.push(competition.id);
         structuredData.competitions.byId[competition.id] = {
            ...competition,
            tournamentId: tournament.id,
         };

         if (!structuredData.orderByArena[tournament.id]) {
            structuredData.orderByArena[tournament.id] = {};
         }
         if (
            !structuredData.orderByArena[tournament.id][competition.arena.id]
         ) {
            structuredData.orderByArena[tournament.id][competition.arena.id] =
               [];
         }

         structuredData.orderByArena[tournament.id][
            competition.arena.id
         ].splice(competition.order - 1, 0, competition.id);
      }
   }

   return structuredData;
};
