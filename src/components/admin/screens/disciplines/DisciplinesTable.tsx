"use client";
import React from "react";
import {
   createColumnHelper,
   flexRender,
   getCoreRowModel,
   useReactTable,
} from "@tanstack/react-table";
import { IBaseEntityWithTitle } from "@/types/main.types";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { dateFormatter } from "@/utils/date-formatter";
import styles from "./DisciplineTable.module.css";
import { Checkbox } from "@/components/UI/lib-components/checkbox";
import { Pen, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import DisciplinesTableActions from "./DisciplinesTableActions";

const columnHelper = createColumnHelper<IBaseEntityWithTitle>();

const columns = [
   columnHelper.display({
      id: "actions",
      cell: () => (
         <div className="flex items-center justify-center">
            <Checkbox />
         </div>
      ),
      header: () => (
         <div className="flex items-center justify-center">
            <Checkbox />
         </div>
      ),
      size: 20,
   }),
   columnHelper.display({
      id: "rowNumber",
      header: "№",
      cell: ({ row }) => row.index + 1,
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
   const { data, isError, isFetching } = useQuery<IBaseEntityWithTitle[]>({
      queryKey: [QUERY_KEYS.DISCIPLINES],
      queryFn: async () => {
         const data = await fetch(`${API.DISCIPLINES}`);
         const result = await data.json();
         return result;
      },
   });
   const table = useReactTable({
      columns,
      data: data ?? [],
      getCoreRowModel: getCoreRowModel(),
   });
   return (
      <div>
         <DisciplinesTableActions />
         <table className={styles.table}>
            <thead>
               {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className={styles["header-row"]}>
                     {headerGroup.headers.map(header => {
                        console.log(header.getSize());
                        return (
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
                        );
                     })}
                  </tr>
               ))}
            </thead>
            <tbody>
               {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={styles["data-row"]}>
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
      </div>
   );
};

export default DisciplinesTable;
