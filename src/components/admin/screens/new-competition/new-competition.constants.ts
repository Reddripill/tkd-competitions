import { CompetitionType } from "./new-competition.schema";

export const defaultCompetition: CompetitionType = {
   tournamentTitle: "",
   arenas: [
      {
         arenaTitle: "",
         info: [
            {
               discipline: "",
               categories: [],
            },
         ],
      },
   ],
};
