"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface IProps {
   className?: string;
}

const BackButton = ({ className }: IProps) => {
   const router = useRouter();
   const pathname = usePathname();
   const pathArr = pathname.split("/");
   if (pathArr.length <= 2) {
      return null;
   }
   return (
      <button
         type="button"
         className={cn("flex items-center gap-x-2 text-blue-accent", className)}
         onClick={() => {
            router.back();
         }}
      >
         <ArrowLeft size={20} />
         <div className="font-medium">Назад</div>
      </button>
   );
};

export default BackButton;
