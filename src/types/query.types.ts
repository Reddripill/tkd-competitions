export interface IReorderCompetitionBody {
   id: string;
   order: number;
   tournamentId: string;
   arenaId: string;
}

export interface ICreateCompetitionBody {
   tournamentId?: string;
   tournamentTitle?: string;
   arenas: {
      arenaId?: string;
      arenaTitle?: string;
      info: {
         discipline?: string;
         categories: string[];
      }[];
   }[];
}

export interface IUpdateCompetitionStatusBody {
   id: string;
   isFinished: boolean;
}

export interface IDeleteMany<T> {
   items: T[];
}
