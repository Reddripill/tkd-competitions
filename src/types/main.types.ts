export type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ISourceAndKey {
   source: string;
   queryKey: string;
}

export interface IBaseEntity {
   id: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface IBaseEntityWithTitle extends IBaseEntity {
   title: string;
}

export interface IBaseEntityWithTitleAndCount {
   data: IBaseEntityWithTitle[];
   count: number;
}

export interface IDeleteMany {
   ids: string[];
}
