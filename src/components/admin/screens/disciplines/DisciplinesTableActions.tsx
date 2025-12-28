import React from "react";
import InputAndSelect from "@/components/UI/InputAndSelect";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import DropDown from "@/components/UI/table/DropDown";

const DisciplinesTableActions = () => {
   return (
      <div className="flex items-center justify-between mb-8">
         <div className="basis-xs">
            <InputAndSelect
               isMulti={false}
               source={API.DISCIPLINES}
               queryKey={QUERY_KEYS.DISCIPLINES}
               validation={false}
               suggestion={false}
               placeholder="Введите название"
            />
         </div>
         <DropDown />
      </div>
   );
};

export default DisciplinesTableActions;
