"use client";
import React, { useState } from "react";
import {
   type SortingState,
   createColumnHelper,
   flexRender,
   getCoreRowModel,
   useReactTable,
} from "@tanstack/react-table";
import {
   IBaseEntityWithTitle,
   IBaseEntityWithTitleAndCount,
   ISourceAndKey,
} from "@/types/main.types";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import TableFooter from "./TableFooter";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { queryClient } from "@/providers/QueryProvider";
import styles from "./Table.module.css";
import TableActions from "./TableActions";
import { Checkbox } from "../lib-components/checkbox";
import { dateFormatter } from "@/utils/date-formatter";
import TableSkeleton from "./TableSkeleton";
import ActionButton from "../buttons/ActionButton";
import DeleteAction from "./DeleteAction";
import UpdateAction from "./UpdateAction";
import NotSearched from "./NotSearched";
import NotExist from "./NotExist";

const columnHelper = createColumnHelper<IBaseEntityWithTitle>();

export const columns = [
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
      size: 40,
   }),
   columnHelper.accessor("title", {
      header: "Название",
      cell: info => info.getValue(),
   }),
   columnHelper.accessor("updatedAt", {
      header: "Дата изменения",
      cell: info => dateFormatter(info.getValue()),
      size: 160,
   }),
   columnHelper.accessor("createdAt", {
      header: "Дата создания",
      cell: info => dateFormatter(info.getValue()),
      size: 160,
   }),
   columnHelper.display({
      id: "update",
      cell: ({ row, table }) => {
         const metaData = table.options.meta;
         return (
            <UpdateAction
               id={row.id}
               queryKey={metaData?.queryKey}
               source={metaData?.source}
            />
         );
      },
      size: 20,
   }),
   columnHelper.display({
      id: "delete",
      cell: ({ table, row }) => (
         <DeleteAction
            confirmedAction={() => table.options.meta?.onDelete(row.id)}
         />
      ),
      size: 20,
   }),
];

const Table = ({ queryKey, source }: ISourceAndKey) => {
   const [rowSelection, setRowSelection] = useState({});
   const [inputValue, setInputValue] = useState<string | null>(null);
   const debouncedValue = useDebounce(inputValue ?? "");
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
      isSuccess,
      isPending,
      isError,
      isPlaceholderData,
      refetch,
   } = useQuery<IBaseEntityWithTitleAndCount>({
      queryKey: [queryKey, pagination, debouncedValue, sorting],
      placeholderData: keepPreviousData,
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
      mutationFn: async (id: string) => {
         const res = await fetch(`${source}/${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
         });

         if (!res.ok) {
            throw new Error("Ошибка удаления");
         }

         return res.json();
      },

      onSuccess: (_, id) => {
         toast.success("Записи успешно удалены");
         setRowSelection(prev => {
            return Object.fromEntries(
               Object.entries(prev).filter(item => item[0] !== id)
            );
         });
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
      },
   });

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
      onRowSelectionChange: setRowSelection,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      getRowId: row => {
         return row.id;
      },
      meta: {
         onDelete: mutation.mutate,
         queryKey,
         source,
      },
   });

   const resettingSelection = () => {
      table.resetRowSelection();
   };

   if (isError) {
      return (
         <div className="mt-64 flex flex-col items-center justify-center">
            <CircleX className="mb-4 size-14 text-red-accent" />
            <h2 className="mb-8">Ошибка получения данных</h2>
            <ActionButton size="lg" action={refetch}>
               Попробовать снова
            </ActionButton>
         </div>
      );
   }
   return (
      <div>
         <div>
            <TableActions
               value={inputValue ?? ""}
               setValue={tableSearchHandler}
               selectedIds={Object.keys(rowSelection)}
               resettingSelection={resettingSelection}
               source={source}
               queryKey={queryKey}
            />
            {!isPending && isSuccess && response?.count === 0 ? (
               inputValue === null ? (
                  <NotExist />
               ) : (
                  <NotSearched inputValue={inputValue} />
               )
            ) : (
               <table className={styles.table}>
                  <thead>
                     {table.getHeaderGroups().map(headerGroup => (
                        <tr
                           key={headerGroup.id}
                           className={styles["header-row"]}
                        >
                           {headerGroup.headers.map(header => (
                              <th
                                 key={header.id}
                                 className={cn(styles["header-item"], {
                                    [styles._specified]:
                                       header.getSize() <= 100,
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
                                    onClick={() => {
                                       if (!isPending) {
                                          sortingHandler(
                                             header.id,
                                             header.column.getCanSort()
                                          );
                                       }
                                    }}
                                 >
                                    <div>
                                       {flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                       )}
                                    </div>
                                    {checkIsSorted(header.id) && (
                                       <div className="absolute -right-6 top-1/2 -translate-y-1/2">
                                          {sorting.find(
                                             item => item.id === header.id
                                          )?.desc ? (
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
                  {isPending ? (
                     <TableSkeleton table={table} />
                  ) : (
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
                                          cell.column.getSize() <= 100,
                                    })}
                                    style={{
                                       width: `${
                                          cell.column.getSize() !== 150
                                             ? cell.column.getSize() + "px"
                                             : ""
                                       }`,
                                       minWidth: `${
                                          cell.column.getSize() !== 150
                                             ? cell.column.getSize() + "px"
                                             : ""
                                       }`,
                                    }}
                                 >
                                    <div className="size-full overflow-hidden whitespace-nowrap text-ellipsis">
                                       {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext()
                                       )}
                                    </div>
                                 </td>
                              ))}
                           </tr>
                        ))}
                     </tbody>
                  )}
               </table>
            )}
            <TableFooter
               allRowsCount={response?.count}
               rowSelectedCount={Object.keys(rowSelection).length}
               nextClickHandler={() => table.nextPage()}
               prevClickHandler={() => table.previousPage()}
               isNextDisabled={!table.getCanNextPage() || isPlaceholderData}
               isPrevDisabled={!table.getCanPreviousPage() || isPlaceholderData}
               pageCount={pageCount}
               clickHandler={table.setPageIndex}
               pageIndex={pagination.pageIndex}
            />
         </div>
      </div>
   );
};

export default Table;
