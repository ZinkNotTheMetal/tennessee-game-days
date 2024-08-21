import { RowData } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    sortAscIcon: JSX.Element
    sortDescIcon: JSX.Element
    sortIcon: JSX.Element
    canHide: boolean
  }
}