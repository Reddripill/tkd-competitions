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
