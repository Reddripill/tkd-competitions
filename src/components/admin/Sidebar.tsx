import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { menuItems } from "@/src/constants/dashboard-menu";

const Sidebar = () => {
   return (
      <div className="h-full basis-[320px] py-4 bg-light-white">
         <div className="h-full flex flex-col">
            <Link
               href="/"
               className="flex items-center gap-x-2 px-6 pb-8 border-b border-zinc-400/20"
            >
               <Image height={50} width={50} src="/tkd-logo.png" alt="ГТФ РТ" />
               <div className="font-bold text-sm">
                  Федерация Тхэквондо ГТФ Республики Татарстан
               </div>
            </Link>
            <menu className="grow pt-12">
               <ul>
                  {menuItems.map(item => (
                     <li key={item.title} className="px-6 h-12">
                        <Link
                           href={item.link}
                           className="h-full flex items-center gap-x-2 pl-4 text-[#7e7e80] hover:bg-gray hover:text-black rounded-xl transition-colors"
                        >
                           <item.logo />
                           <div className="text-lg font-medium">
                              {item.title}
                           </div>
                        </Link>
                     </li>
                  ))}
               </ul>
            </menu>
            <div className="flex items-center justify-between px-6 pt-6 border-t border-zinc-400/20">
               <div>
                  <div className="font-bold">Никита</div>
                  <div className="text-sm">@reddripill</div>
               </div>
               <button
                  type="button"
                  className="text-black transition-colors hover:text-[#c74b4b]"
               >
                  <LogOut />
               </button>
            </div>
         </div>
      </div>
   );
};

export default Sidebar;
