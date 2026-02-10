export interface IReorderCompetitionBody {
   id: string;
   order: number;
   tournamentId: string;
   arenaId: string;
}

export interface IUpdateCompetitionStatusBody {
   id: string;
   isFinished: boolean;
}
