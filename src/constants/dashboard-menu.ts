import {
   ClipboardEdit,
   LayoutDashboard,
   ListPlus,
   LucideIcon,
   User,
} from "lucide-react";

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
      link: "/",
   },
   {
      title: "Соревнования",
      logo: ClipboardEdit,
      link: "/",
   },
   {
      title: "Пользователи",
      logo: User,
      link: "/",
   },
];
