interface IArenaField {
   arenaTitle: string;
   info: IArenaInfo[];
}

interface IArenaInfo {
   discipline: string;
   categories: string[];
}

export interface ICompetition {
   tournamentTitle: string;
   arenas: IArenaField[];
}
