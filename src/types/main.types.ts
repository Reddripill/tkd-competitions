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

export interface IOrderedBaseEntity extends IBaseEntity {
   order: number;
}

export interface IOrderedBaseEntityWithTitle extends IBaseEntityWithTitle {
   order: number;
}

export interface IBaseEntityWithTitleAndCount<
   T extends IBaseEntityWithTitle = IBaseEntityWithTitle
> {
   data: T[];
   count: number;
}
