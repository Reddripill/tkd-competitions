import "@tanstack/table-core";
import { ISourceAndKey } from "./main.types";

declare module "@tanstack/table-core" {
   interface TableMeta<TData extends RowData> extends ISourceAndKey {
      onDelete: (val: string) => void;
   }
}
