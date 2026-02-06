import { SortableData } from "@dnd-kit/sortable";
import { ICompetition } from "./entities.types";

export interface IReorderCompetitionBody {
   id: string;
   order: number;
   tournamentId: string;
}

export type CompetitionInfoType = {
   arenaId: string;
   tournamentId: string;
};

export type ReorderCompetitionType = CompetitionInfoType & {
   competitions: ICompetition[];
   order: number;
};

export type SortableItemDataType = CompetitionInfoType & SortableData;
