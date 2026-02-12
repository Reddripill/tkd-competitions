import {
   ICompetition,
   ITournament,
   ITournamentArena,
} from "@/types/entities.types";
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
   arenas: {
      byId: Record<string, ITournamentArena>;
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
   arenas: {
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
      arenas: {
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

   rawData.sort((a, b) => a.order - b.order);

   for (const tournament of rawData) {
      structuredData.tournaments.allIds.push(tournament.id);
      structuredData.tournaments.byId[tournament.id] = {
         id: tournament.id,
         title: tournament.title,
         competitions: [],
      };

      for (const item of tournament.arenas) {
         structuredData.arenas.allIds.push(item.arena.id);
         structuredData.arenas.byId[item.arena.id] = item;
      }

      const competitionsList: Record<string, ICompetition[]> = {};

      for (const competition of tournament.competitions) {
         if (!structuredData.orderByArena[tournament.id]) {
            structuredData.orderByArena[tournament.id] = {};
         }

         structuredData.tournaments.byId[tournament.id].competitions.push(
            competition.id
         );

         structuredData.competitions.allIds.push(competition.id);
         structuredData.competitions.byId[competition.id] = {
            ...competition,
            tournamentId: tournament.id,
         };

         const arenaEntity = structuredData.arenas.byId[competition.arena.id];

         if (!competitionsList[arenaEntity.id]) {
            competitionsList[arenaEntity.id] = [];
         }
         competitionsList[arenaEntity.id].push(competition);
      }

      const sortedArenas = tournament.arenas
         .slice()
         .sort((a, b) => a.order - b.order);

      for (const arenaEntity of sortedArenas) {
         if (!competitionsList[arenaEntity.id]) {
            competitionsList[arenaEntity.id] = [];
         }
         const competitionIdsList = competitionsList[arenaEntity.id]
            .sort((a, b) => a.order - b.order)
            .map(item => item.id);

         structuredData.orderByArena[tournament.id][arenaEntity.arena.id] =
            competitionIdsList;
      }
   }
   return structuredData;
};
