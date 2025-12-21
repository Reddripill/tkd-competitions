import * as z from "zod";

export const newCompetitionSchema = z.object({
   tournamentTitle: z.string().min(1, "Это обязательное поле"),
   arenas: z.array(
      z.object({
         arenaTitle: z.string().min(1, "Это обязательное поле"),
         info: z.array(
            z.object({
               discipline: z.string(),
               categories: z.array(z.string()),
            })
         ),
      })
   ),
});
