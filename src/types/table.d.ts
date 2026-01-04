import "@tanstack/table-core";

declare module "@tanstack/table-core" {
   interface TableMeta<TData extends RowData> {
      onDelete: (val: string) => void;
   }
}
