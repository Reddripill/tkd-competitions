import { ICompetition } from "./entities.types";

export type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ISourceAndKey {
   source: string;
   queryKey: string[] | string;
}

export interface IBaseEntity {
   id: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface IBaseEntityWithTitle extends IBaseEntity {
   title: string;
}

export interface IBaseEntityWithTitleAndCount<
   T extends IBaseEntityWithTitle = IBaseEntityWithTitle
> {
   data: T[];
   count: number;
}

export interface IDeleteMany {
   ids: string[];
}

export interface IReorderCompetitionBody {
   id: string;
   order: number;
   tournamentId: string;
}

export interface IReorderCompetition extends IReorderCompetitionBody {
   arenaId: string;
   competitions: ICompetition[];
}
