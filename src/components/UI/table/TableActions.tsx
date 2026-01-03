import React from "react";
import DropDown from "@/components/UI/table/DropDown";
import TableSearch from "@/components/UI/table/TableSearch";

interface IProps {
   value: string;
   setValue: (val: string) => void;
   selectedIds?: string[];
   source: string;
}

const TableActions = ({ value, setValue, selectedIds, source }: IProps) => {
   return (
      <div className="flex items-center justify-between mb-8">
         <div className="basis-xs">
            {/* <InputAndSelect
               isMulti={false}
               source={API.DISCIPLINES}
               queryKey={QUERY_KEYS.DISCIPLINES}
               validation={false}
               suggestion={false}
               placeholder="Введите название"
            /> */}
            <TableSearch
               value={value}
               setValue={setValue}
               placeholder="Введите название"
            />
         </div>
         <DropDown ids={selectedIds} source={source} />
      </div>
   );
};

export default TableActions;
