"use client";
import React, { useState } from "react";
import {
   createColumnHelper,
   flexRender,
   getCoreRowModel,
   type SortingState,
   useReactTable,
} from "@tanstack/react-table";
import {
   IBaseEntityWithTitle,
   IBaseEntityWithTitleAndCount,
   IDeleteOne,
} from "@/types/main.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "@/constants/api";
import { dateFormatter } from "@/utils/date-formatter";
import { Checkbox } from "@/components/UI/lib-components/checkbox";
import { ArrowDown, ArrowUp, Pen, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import TableFooter from "./TableFooter";
import { useDebounce } from "@/hooks/useDebounce";
import { toast, Toaster } from "sonner";
import { queryClient } from "@/providers/QueryProvider";
import styles from "./Table.module.css";
import TableActions from "./TableActions";

const columnHelper = createColumnHelper<IBaseEntityWithTitle>();

const columns = [
   columnHelper.display({
      id: "actions",
      header: ({ table }) => (
         <div className="flex items-center justify-center">
            <Checkbox
               checked={table.getIsAllRowsSelected()}
               onClick={table.getToggleAllPageRowsSelectedHandler()}
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
      size: 250,
   }),
   columnHelper.accessor("updatedAt", {
      header: "Дата изменения",
      cell: info => dateFormatter(info.getValue()),
      size: 250,
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

interface IProps {
   source: string;
   queryKey: string;
}

const Table = ({ queryKey, source }: IProps) => {
   const [rowSelection, setRowSelection] = useState({});
   const [inputValue, setInputValue] = useState("");
   const debouncedValue = useDebounce(inputValue);
   const [sorting, setSorting] = useState<SortingState>([
      {
         id: "updatedAt",
         desc: true,
      },
   ]);
   const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 8,
   });
   const {
      data: response,
      isError,
      isFetching,
   } = useQuery<IBaseEntityWithTitleAndCount>({
      queryKey: [queryKey, pagination, debouncedValue, sorting],
      queryFn: async () => {
         const order = sorting
            .map(s => `${s.id}:${s.desc ? "DESC" : "ASC"}`)
            .join(",");

         const params = new URLSearchParams({
            q: debouncedValue,
            limit: String(pagination.pageSize),
            skip: String(pagination.pageIndex * pagination.pageSize),
            order,
         });

         const data = await fetch(`${source}?${params.toString()}`);
         const result = await data.json();
         return result;
      },
   });

   const mutation = useMutation({
      mutationFn: async (body: IDeleteOne) => {
         const res = await fetch(source, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         });

         if (!res.ok) {
            throw new Error("Ошибка удаления");
         }

         return res.json();
      },

      onSuccess: () => {
         toast.success("Записи успешно удалены");
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
      },
   });

   const deleteEntity = (id: string) => {
      mutation.mutate({ id });
   };

   const tableSearchHandler = (val: string) => {
      setPagination(prev => ({
         ...prev,
         pageIndex: 0,
      }));
      setRowSelection({});
      setInputValue(val);
   };

   const sortingHandler = (id: string, isSorted: boolean) => {
      if (isSorted) {
         const sortingElement = sorting.find(item => item.id === id);
         if (sortingElement) {
            setSorting(prev =>
               prev.map(item =>
                  item.id === id ? { ...item, desc: !item.desc } : item
               )
            );
         } else {
            setSorting([
               {
                  id,
                  desc: true,
               },
            ]);
         }
      }
   };

   const checkIsSorted = (id: string) => {
      return sorting.some(item => item.id === id);
   };

   const pageCount = Math.ceil((response?.count ?? 0) / pagination.pageSize);

   const table = useReactTable<IBaseEntityWithTitle>({
      columns,
      data: response?.data ?? [],
      getCoreRowModel: getCoreRowModel(),
      state: {
         rowSelection,
         pagination,
         sorting,
      },
      enableRowSelection: true,
      pageCount,
      manualPagination: true,
      manualSorting: true,
      autoResetPageIndex: false,
      getRowId: row => {
         return row.id;
      },
      onRowSelectionChange: setRowSelection,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
   });
   return (
      <div>
         <Toaster position="top-center" expand={true} richColors={true} />
         <TableActions
            value={inputValue}
            setValue={tableSearchHandler}
            selectedIds={Object.keys(rowSelection)}
            source={source}
         />
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
                           <div
                              className={styles["header-cell"]}
                              onClick={() =>
                                 sortingHandler(
                                    header.id,
                                    header.column.getCanSort()
                                 )
                              }
                           >
                              <div>
                                 {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                 )}
                              </div>
                              {checkIsSorted(header.id) && (
                                 <div className="absolute -right-6 top-1/2 -translate-y-1/2">
                                    {sorting.find(item => item.id === header.id)
                                       ?.desc ? (
                                       <ArrowDown size={18} />
                                    ) : (
                                       <ArrowUp size={18} />
                                    )}
                                 </div>
                              )}
                           </div>
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
         <TableFooter
            allRowsCount={response?.count ?? 0}
            rowSelectedCount={Object.keys(rowSelection).length}
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

export default Table;
