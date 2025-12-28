import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const dateFormatter = (date: Date | string) => {
   const month = format(date, "MMMM", { locale: ru });
   const formattedMonth = month[0].toUpperCase() + month.slice(1);
   const formattedDate = format(date, `HH:mm, dd ${formattedMonth}, uuuu`, {
      locale: ru,
   });
   return formattedDate;
};
