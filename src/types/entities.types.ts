import { IBaseEntity, IBaseEntityWithTitle } from "./main.types";

export interface ICompetitionCategory extends IBaseEntity {
   category: IBaseEntityWithTitle;
}

export interface ICompetition extends IBaseEntity {
   discipline: IBaseEntityWithTitle | null;
   arena: IBaseEntityWithTitle;
   categories: ICompetitionCategory[];
}

export interface ITournament extends IBaseEntityWithTitle {
   competitions: ICompetition[];
}
