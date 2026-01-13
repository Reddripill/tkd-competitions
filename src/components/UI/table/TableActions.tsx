import React from "react";
import DropDown from "@/components/UI/table/DropDown";
import TableSearch from "@/components/UI/table/TableSearch";
import { ISourceAndKey } from "@/types/main.types";

interface IProps extends ISourceAndKey {
   value: string;
   setValue: (val: string) => void;
   selectedIds?: string[];
   resettingSelection: () => void;
}

const TableActions = ({
   value,
   setValue,
   selectedIds,
   resettingSelection,
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
         <DropDown
            ids={selectedIds}
            source={source}
            queryKey={queryKey}
            resettingSelection={resettingSelection}
         />
      </div>
   );
};

export default TableActions;
