import React from "react";
import { cn } from "@/lib/utils";
import BackButton from "../UI/buttons/BackButton";

interface IProps {
   children: React.ReactNode;
   title?: string;
   subTitle?: string;
   actions?: React.JSX.Element | React.ReactNode;
   className?: string;
}

const MainBlock = ({
   title,
   subTitle,
   children,
   actions,
   className,
}: IProps) => {
   return (
      <div className="h-full grow pt-4 pr-4">
         <div className="min-h-full h-auto w-full py-14 px-22 bg-white border border-border rounded-xl">
            <BackButton className="mb-2" />
            {title && (
               <div
                  className={cn(
                     "mb-12",
                     {
                        "flex justify-between items-start": !!actions,
                     },
                     className
                  )}
               >
                  <div>
                     <h1>{title}</h1>
                     {subTitle && (
                        <div className="mt-2 text-sm">{subTitle}</div>
                     )}
                  </div>
                  {actions && <>{actions}</>}
               </div>
            )}
            <div>{children}</div>
         </div>
      </div>
   );
};

export default MainBlock;
