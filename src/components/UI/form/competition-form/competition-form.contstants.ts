export interface ICompetitionData {
   discipline: string;
   categories: string[];
}

export const defaultCreationCompData: ICompetitionData = {
   discipline: "",
   categories: [],
};
