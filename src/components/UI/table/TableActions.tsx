import React from "react";
import DropDown from "@/components/UI/table/DropDown";
import TableSearch from "@/components/UI/table/TableSearch";

interface IProps {
   value: string;
   setValue: (val: string) => void;
   selectedIds?: string[];
   source: string;
   queryKey: string;
}

const TableActions = ({
   value,
   setValue,
   selectedIds,
   source,
   queryKey,
}: IProps) => {
   return (
      <div className="flex items-center justify-between mb-8">
         <div className="basis-xs">
            <TableSearch
               value={value}
               setValue={setValue}
               placeholder="Введите название"
            />
         </div>
         <DropDown ids={selectedIds} source={source} queryKey={queryKey} />
      </div>
   );
};

export default TableActions;
