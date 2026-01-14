import { queryClient } from "@/providers/QueryProvider";
import { IBaseEntityWithTitle, ISourceAndKey } from "@/types/main.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface IEntityWithId extends ISourceAndKey {
   id: string;
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

export const useGetEntity = ({
   queryKey,
   source,
   id,
   enabled,
}: IEntityWithId) => {
   const query = useQuery<IBaseEntityWithTitle>({
      queryKey: [queryKey, id],
      queryFn: async () => {
         const data = await fetch(`${source}/${id}`);
         const result = await data.json();
         return result;
      },
      enabled,
   });
   return query;
};
