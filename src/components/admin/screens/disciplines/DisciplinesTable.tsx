"use client";
import React, { useState } from "react";
import {
   createColumnHelper,
   flexRender,
   getCoreRowModel,
   useReactTable,
} from "@tanstack/react-table";
import {
   IBaseEntityWithTitle,
   IBaseEntityWithTitleAndCount,
} from "@/types/main.types";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { dateFormatter } from "@/utils/date-formatter";
import styles from "./DisciplineTable.module.css";
import { Checkbox } from "@/components/UI/lib-components/checkbox";
import { Pen, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import DisciplinesTableActions from "./DisciplinesTableActions";
import DisciplineFooter from "./DisciplineFooter";

const columnHelper = createColumnHelper<IBaseEntityWithTitle>();

const columns = [
   columnHelper.display({
      id: "actions",
      header: ({ table }) => (
         <div className="flex items-center justify-center">
            <Checkbox
               checked={table.getIsAllRowsSelected()}
               onClick={table.getToggleAllRowsSelectedHandler()}
            />
         </div>
      ),
      cell: ({ row }) => (
         <div className="flex items-center justify-center">
            <Checkbox
               checked={row.getIsSelected()}
               onClick={row.getToggleSelectedHandler()}
            />
         </div>
      ),
      size: 20,
   }),
   columnHelper.display({
      id: "rowNumber",
      header: "№",
      cell: ({ row, table }) => {
         const { pageIndex, pageSize } = table.getState().pagination;
         return pageIndex * pageSize + row.index + 1;
      },
      size: 60,
   }),
   columnHelper.accessor("title", {
      header: "Название",
      cell: info => info.getValue(),
   }),
   columnHelper.accessor("createdAt", {
      header: "Дата создания",
      cell: info => dateFormatter(info.getValue()),
   }),
   columnHelper.accessor("updatedAt", {
      header: "Дата изменения",
      cell: info => dateFormatter(info.getValue()),
   }),
   columnHelper.display({
      id: "update",
      cell: () => <Pen className="size-5 text-black cursor-pointer" />,
      size: 30,
   }),
   columnHelper.display({
      id: "delete",
      cell: () => <Trash className="size-5 text-black cursor-pointer" />,
      size: 30,
   }),
];

const DisciplinesTable = () => {
   const [rowSelection, setRowSelection] = useState({});
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 8,
   });
   const {
      data: response,
      isError,
      isFetching,
   } = useQuery<IBaseEntityWithTitleAndCount>({
      queryKey: [QUERY_KEYS.DISCIPLINES, pagination],
      queryFn: async () => {
         const data = await fetch(
            `${API.DISCIPLINES}?limit=${pagination.pageSize}&skip=${
               pagination.pageIndex * pagination.pageSize
            }`
         );
         const result = await data.json();
         return result;
      },
   });

   const pageCount = Math.ceil((response?.count ?? 0) / pagination.pageSize);

   const table = useReactTable({
      columns,
      data: response?.data ?? [],
      getCoreRowModel: getCoreRowModel(),
      state: {
         rowSelection,
         pagination,
      },
      enableRowSelection: true,
      pageCount,
      onRowSelectionChange: setRowSelection,
      manualPagination: true,
      autoResetPageIndex: false,
      onPaginationChange: setPagination,
   });

   return (
      <div>
         <DisciplinesTableActions />
         <table className={styles.table}>
            <thead>
               {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className={styles["header-row"]}>
                     {headerGroup.headers.map(header => (
                        <th
                           key={header.id}
                           className={cn(styles["header-item"], {
                              [styles._specified]: header.getSize() !== 150,
                           })}
                           style={{
                              width: `${
                                 header.getSize() !== 150
                                    ? header.getSize() + "px"
                                    : ""
                              }`,
                           }}
                        >
                           {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                           )}
                        </th>
                     ))}
                  </tr>
               ))}
            </thead>
            <tbody>
               {table.getRowModel().rows.map(row => (
                  <tr
                     key={row.id}
                     className={cn(styles["data-row"], {
                        [styles._selected]: row.getIsSelected(),
                     })}
                  >
                     {row.getVisibleCells().map(cell => (
                        <td
                           key={cell.id}
                           className={cn(styles["data-item"], {
                              [styles._specified]:
                                 cell.column.getSize() !== 150,
                           })}
                           style={{
                              width: `${
                                 cell.column.getSize() !== 150
                                    ? cell.column.getSize() + "px"
                                    : ""
                              }`,
                           }}
                        >
                           {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                           )}
                        </td>
                     ))}
                  </tr>
               ))}
            </tbody>
         </table>
         <DisciplineFooter
            allRowsCount={response?.count ?? 0}
            rowSelectedCount={table.getSelectedRowModel().rows.length}
            nextClickHandler={() => table.nextPage()}
            prevClickHandler={() => table.previousPage()}
            isNextDisabled={!table.getCanNextPage()}
            isPrevDisabled={!table.getCanPreviousPage()}
            pageCount={pageCount}
            clickHandler={table.setPageIndex}
            pageIndex={pagination.pageIndex}
         />
      </div>
   );
};

export default DisciplinesTable;
