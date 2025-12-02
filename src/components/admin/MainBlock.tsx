import React from "react";
import cn from "classnames";

interface IProps {
   children: React.ReactNode;
   title: string;
   subTitle?: string;
   actions?: React.JSX.Element | React.ReactNode;
}

const MainBlock = ({ title, subTitle, children, actions }: IProps) => {
   return (
      <div className="h-full w-full p-10">
         <div className={cn({ "flex justify-between items-start": !!actions })}>
            <div className="mb-8">
               <h1>{title}</h1>
               {subTitle && <div className="mt-1">{subTitle}</div>}
            </div>
            {actions && <>{actions}</>}
         </div>
         <div>{children}</div>
      </div>
   );
};

export default MainBlock;
