import React from "react";
import { cn } from "@/lib/utils";
import styles from "./Table.module.css";
import { IBaseEntityWithTitle } from "@/types/main.types";
import type { Table } from "@tanstack/react-table";
import { Skeleton } from "../lib-components/skeleton";

interface IProps {
   table: Table<IBaseEntityWithTitle>;
}

const TableSkeleton = ({ table }: IProps) => {
   const COUNT = 8;
   const zerosArr = new Array(COUNT).fill(0);
   return (
      <tbody>
         {zerosArr.map((_, index) => (
            <React.Fragment key={index}>
               {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className={styles["data-row"]}>
                     {headerGroup.headers.map(header => (
                        <td
                           key={header.id}
                           className={cn(styles["data-item"], {
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
                           <Skeleton className="w-full h-6" />
                        </td>
                     ))}
                  </tr>
               ))}
            </React.Fragment>
         ))}
      </tbody>
   );
};

export default TableSkeleton;
