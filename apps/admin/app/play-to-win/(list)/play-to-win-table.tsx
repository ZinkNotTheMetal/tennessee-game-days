"use client";

import { useState } from "react";
import { Search } from "@/app/components/search/search";
import { useRouter } from "next/navigation";
import { IPlayToWinItem } from "@repo/shared";
import {
  FaPersonWalkingArrowRight,
  FaCircleCheck,
  FaEyeSlash,
  FaEye,
} from "react-icons/fa6";
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from "react-icons/fc";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Row,
  FilterFn,
  RowData,
} from "@tanstack/react-table";

interface IPlayToWinTableProps {
  items: IPlayToWinItem[];
  total: number;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    sortAscIcon: JSX.Element;
    sortDescIcon: JSX.Element;
    sortIcon: JSX.Element;
  }
}

export function PlayToWinItemsTable({
  items,
  total,
}: IPlayToWinTableProps): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const columnHelper = createColumnHelper<IPlayToWinItem>();


  const columns = [
    columnHelper.accessor("barcode", {
      header: () => "Barcode",
      meta: {
        sortAscIcon: <FcNumericalSorting12 className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcNumericalSorting21 className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
      },
    }),
    columnHelper.accessor("gameName", {
      header: () => "Game Name",
      meta: {
        sortAscIcon: <FcAlphabeticalSortingAz className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcAlphabeticalSortingZa className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
      },
    }),
    columnHelper.accessor("boardGameGeekId", {
      header: () => "Board Game Geek ID",
      meta: {
        sortAscIcon: <FcNumericalSorting12 className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcNumericalSorting21 className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
      }
    }),
    columnHelper.accessor("isHidden", {
      header: () => "Hidden?",
      cell: ({ cell }) => {
        return (
          <span className="flex justify-center">
            {/* Is Checked out is the property */}
            {cell.getValue() ? (
              <FaEyeSlash className="text-red-400 h-5 w-5" />
            ) : (
              <FaEye className="text-green-400 h-5 w-5" />
            )}
          </span>
        );
      },
    }),
  ];

  const reactTable = useReactTable({
    data: items,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter: query,
      sorting: sorting,
    },
    enableGlobalFilter: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="w-2/3 pb-6">
        <Search
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder={`Search ${total} games...`}
          value={query}
        />

        {items !== undefined && items.length > 0 && (
          <table className="min-w-full divide-y-0 divide-gray-300 bg-white rounded-t-xl rounded-b-xl">
            <thead className="border-b">
              {reactTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-2 px-4 text-gray-500"
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <span className="inline-block align-middle">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                        )}
                      </span>
                      {/* Render sort icon based on meta properties */}
                      <span className="inline-block align-middle">
                        {
                          { 
                            asc: header.column.columnDef.meta?.sortAscIcon,
                            desc: header.column.columnDef.meta?.sortDescIcon
                          }
                          [header.column.getIsSorted() as string] ?? null
                        }
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {reactTable.getRowModel().rows.map((row) => {
                return (
                  <tr
                    key={row.id}
                    className="border-b hover:bg-blue-100 hover:cursor-pointer text-center"
                    onClick={() => {
                      router.push(`/library/edit/${row.original.id}`);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td className="p-4" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
