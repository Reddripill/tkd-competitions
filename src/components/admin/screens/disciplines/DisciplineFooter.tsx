import TablePagination, {
   IPaginationProps,
} from "@/components/UI/table/TablePagination";
import React from "react";

interface IProps extends IPaginationProps {
   rowSelectedCount: number;
   allRowsCount: number;
}

const DisciplineFooter = ({
   allRowsCount,
   rowSelectedCount,
   ...pagination
}: IProps) => {
   return (
      <div className="flex items-center justify-between">
         <div className="text-lg">
            Выбрано {rowSelectedCount} из {allRowsCount}
         </div>
         <div>
            <TablePagination {...pagination} />
         </div>
      </div>
   );
};

export default DisciplineFooter;
