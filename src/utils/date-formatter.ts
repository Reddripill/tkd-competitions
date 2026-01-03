import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const dateFormatter = (date: Date | string) => {
   const formattedDate = format(date, `HH:mm, dd/LL/yy`, {
      locale: ru,
   });
   return formattedDate;
};
