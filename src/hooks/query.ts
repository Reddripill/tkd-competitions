import { queryClient } from "@/providers/QueryProvider";
import {
   IBaseEntityWithTitle,
   IDeleteMany,
   ISourceAndKey,
} from "@/types/main.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface IEntityWithId extends ISourceAndKey {
   id: string | null;
}

interface IEnabledEntityWithId extends IEntityWithId {
   enabled: boolean;
}

export const useAddEntity = ({ queryKey, source }: ISourceAndKey) => {
   const mutation = useMutation({
      mutationFn: async (titles: string[]) => {
         const res = await fetch(source, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               titles,
            }),
         });

         if (!res.ok) {
            throw new Error("Ошибка при создании");
         }

         return res.json();
      },

      onSuccess: () => {
         toast.success("Записи успешно созданы");
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при создании");
      },
   });
   return mutation;
};

export const useDeleteEntity = ({ queryKey, source }: ISourceAndKey) => {
   const mutation = useMutation({
      mutationFn: async (id: string) => {
         const res = await fetch(`${source}/${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
         });

         if (!res.ok) {
            toast.error("Ошибка при удалении");
         }

         return res.json();
      },

      onSuccess: () => {
         toast.success("Запись успешно удалена");
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
      },
   });
   return mutation;
};

export const useGetEntity = ({
   queryKey,
   source,
   id,
   enabled,
}: IEnabledEntityWithId) => {
   const query = useQuery<IBaseEntityWithTitle>({
      queryKey: [queryKey, id],
      queryFn: async () => {
         const data = await fetch(`${source}/${id}`);
         const result = await data.json();
         return result;
      },
      enabled: !!enabled && !!id,
   });
   return query;
};

export const useUpdateEntity = ({ queryKey, source, id }: IEntityWithId) => {
   const mutation = useMutation({
      mutationFn: async (title: string) => {
         const res = await fetch(`${source}/${id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               title,
            }),
         });

         if (!res.ok) {
            throw new Error("Ошибка при обновлении");
         }

         return res.json();
      },

      onSuccess: () => {
         toast.success("Запись успешно обновлена");
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при обновлении");
      },
   });
   return mutation;
};
