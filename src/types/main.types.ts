export interface IBaseEntity {
   id: string;
   createdAt: string;
   updatedAt: string;
}

export interface IBaseEntityWithTitle extends IBaseEntity {
   title: string;
}
