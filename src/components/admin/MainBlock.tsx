import React from "react";
import { cn } from "@/lib/utils";

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
      <div className="grow pt-4 pr-4">
         <div className="h-full w-full p-14 bg-white border border-border rounded-xl">
            {title && (
               <div
                  className={cn(
                     {
                        "flex justify-between items-start": !!actions,
                     },
                     className
                  )}
               >
                  <div className="mb-10">
                     <h1>{title}</h1>
                     {subTitle && (
                        <div className="mt-1 text-sm">{subTitle}</div>
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
