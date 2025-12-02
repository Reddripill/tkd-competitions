import {
   ChartColumnDecreasing,
   ClipboardEdit,
   LayoutDashboard,
   ListPlus,
   LucideIcon,
   User,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface IMenuItem {
   logo: LucideIcon;
   link: string;
   title: string;
}

export const menuItems: IMenuItem[] = [
   {
      title: "Панель",
      logo: LayoutDashboard,
      link: ROUTES.HOME,
   },
   {
      title: "Дисциплины",
      logo: ListPlus,
      link: ROUTES.DISCIPLINES,
   },
   {
      title: "Категории",
      logo: ChartColumnDecreasing,
      link: ROUTES.CATEGORIES,
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
      // title: "Список авторизованных пользователей",
   },
];
