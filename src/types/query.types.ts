export interface IReorderCompetitionBody {
   id: string;
   order: number;
   tournamentId: string;
}

export interface IUpdateCompetitionStatusBody {
   id: string;
   isFinished: boolean;
}
