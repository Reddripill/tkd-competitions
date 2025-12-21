import { ICompetition } from "./new-competition.types";

export const defaultCompetition: ICompetition = {
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
