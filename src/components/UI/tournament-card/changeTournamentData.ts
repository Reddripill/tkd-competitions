import { ICompetition, ITournament } from "@/types/entities.types";
import {
   IBaseEntityWithTitle,
   IBaseEntityWithTitleAndCount,
} from "@/types/main.types";

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
      byId: Record<string, IBaseEntityWithTitle>;
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
   const arenasArr: IBaseEntityWithTitle[] = [];
   for (const tournament of rawData) {
      structuredData.tournaments.allIds.push(tournament.id);
      structuredData.tournaments.byId[tournament.id] = {
         id: tournament.id,
         title: tournament.title,
         competitions: [],
      };

      const competitionsList: Record<string, ICompetition[]> = {};

      for (const competition of tournament.competitions) {
         if (!structuredData.orderByArena[tournament.id]) {
            structuredData.orderByArena[tournament.id] = {};
         }

         if (!arenasArr.find(item => item.id === competition.arena.id)) {
            arenasArr.push(competition.arena);
         }

         structuredData.tournaments.byId[tournament.id].competitions.push(
            competition.id
         );

         structuredData.competitions.allIds.push(competition.id);
         structuredData.competitions.byId[competition.id] = {
            ...competition,
            tournamentId: tournament.id,
         };

         if (!competitionsList[competition.arena.id]) {
            competitionsList[competition.arena.id] = [];
         }
         competitionsList[competition.arena.id].push(competition);
      }

      for (const [arenaId, competitions] of Object.entries(competitionsList)) {
         const competitionIdsList = competitions
            .sort((a, b) => a.order - b.order)
            .map(item => item.id);
         structuredData.orderByArena[tournament.id][arenaId] =
            competitionIdsList;
      }
   }

   structuredData.arenas.allIds = arenasArr.map(item => item.id);

   for (const arena of arenasArr) {
      structuredData.arenas.byId[arena.id] = arena;
   }
   return structuredData;
};
