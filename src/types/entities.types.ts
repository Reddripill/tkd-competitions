import { IBaseEntity, IBaseEntityWithTitle } from "./main.types";

export interface ICompetitionCategory extends IBaseEntity {
   category: IBaseEntityWithTitle;
}

export interface ICompetition extends IBaseEntity {
   discipline: IBaseEntityWithTitle;
   arena: IBaseEntityWithTitle;
   categories: ICompetitionCategory[];
   order: number;
   isFinished: boolean;
}

export interface ITournament extends IBaseEntityWithTitle {
   competitions: ICompetition[];
}
