import {
   IBaseEntity,
   IBaseEntityWithTitle,
   IOrderedBaseEntity,
} from "./main.types";

export interface ICompetitionCategory extends IBaseEntity {
   category: IBaseEntityWithTitle;
}

export interface ICompetition extends IBaseEntity {
   discipline: IBaseEntityWithTitle;
   arena: IOrderedBaseEntity;
   categories: ICompetitionCategory[];
   order: number;
   isFinished: boolean;
}

export interface ITournament extends IOrderedBaseEntity {
   competitions: ICompetition[];
}
