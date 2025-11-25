import {
   ClipboardEdit,
   LayoutDashboard,
   ListPlus,
   LucideIcon,
   User,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface IMenuItem {
   logo: LucideIcon;
   title: string;
   link: string;
}

export const menuItems: IMenuItem[] = [
   {
      title: "Панель",
      logo: LayoutDashboard,
      link: "/",
   },
   {
      title: "Дисциплины",
      logo: ListPlus,
      link: ROUTES.DISCIPLINES,
   },
   {
      title: "Соревнования",
      logo: ClipboardEdit,
      link: ROUTES.COMPETITIONS,
   },
   {
      title: "Пользователи",
      logo: User,
      link: ROUTES.USERS,
   },
];
