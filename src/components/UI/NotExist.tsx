import React from "react";
import Image from "next/image";

const NotExist = () => {
   return (
      <div className=" mt-32 w-full h-full">
         <div className="flex flex-col items-center">
            <Image
               src="/not-found.png"
               height={130}
               width={130}
               alt="Not found while searching"
               className="mb-6"
            />
            <h1 className="font-medium mb-2">Записей не найдено</h1>
            <div className="text-lg">Пока ни одной записи не было создано</div>
         </div>
      </div>
   );
};

export default NotExist;
