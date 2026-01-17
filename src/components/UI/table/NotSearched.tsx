import React from "react";
import Image from "next/image";

interface IProps {
   inputValue: string;
}

const NotSearched = ({ inputValue }: IProps) => {
   return (
      <div className=" mt-32 w-full h-full">
         <div className="flex flex-col items-center">
            <Image
               src="/search.png"
               height={130}
               width={130}
               alt="Not found while searching"
               className="mb-6"
            />
            <h1 className="font-medium mb-2">Записей не найдено</h1>
            <div className="text-center">
               <div className="text-lg">
                  По вашему запросу ничего не найдено:
               </div>
               <div className="italic font-light tracking-wider">
                  {inputValue}
               </div>
            </div>
         </div>
      </div>
   );
};

export default NotSearched;
