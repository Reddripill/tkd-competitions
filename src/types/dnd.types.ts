import { SortableData } from "@dnd-kit/sortable";
import { ICompetition } from "./entities.types";

export interface IReorderCompetitionBody {
   id: string;
   order: number;
   tournamentId: string;
}

export interface ICompetitionInfo {
   arenaId: string;
   tournamentId: string;
}

export interface IReorderCompetition extends ICompetitionInfo {
   competitions: ICompetition[];
   order: number;
}

export interface ISortableItemData extends ICompetitionInfo {
   sortable: SortableData;
}
