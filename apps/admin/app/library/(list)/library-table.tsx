"use client";

import { useState } from "react";
import { Search } from "@/app/components/search/search";
import { useRouter } from "next/navigation";
import { ILibraryItem } from "@repo/shared";
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
import { Prisma } from "@prisma/client";

interface LibraryGameTableProps {
  libraryItems: Prisma.LibraryItemGetPayload<{ include: { boardGameGeekThing: true }}>[]
  total: number
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    sortAscIcon: JSX.Element;
    sortDescIcon: JSX.Element;
    sortIcon: JSX.Element;
  }
}

export function LibraryGameTable({
  libraryItems,
  total,
}: LibraryGameTableProps): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "boardGameGeekThing_itemName", desc: false }
  ]);
  const router = useRouter()
  type LibraryItemPrismaRowType = Prisma.LibraryItemGetPayload<{ include: { boardGameGeekThing: true } }>

  const columnHelper = createColumnHelper<LibraryItemPrismaRowType>()

  const customGlobalFilter: FilterFn<any> = (
    row: Row<ILibraryItem>,
    columnId: string,
    query: string
  ) => {
    if (columnId === "boardGameGeekThing_itemName") {
      const valueToSearch = row.original.alias || row.original.boardGameGeekThing.itemName;
      return valueToSearch.toLowerCase().startsWith(query.toLowerCase())
    }
    const search = query.toLowerCase()
    const value = String(row.getValue<string>(columnId))
    return value?.toLowerCase().startsWith(search)
  }

  const columns = [
    columnHelper.accessor("barcode", {
      header: () => "Barcode",
      meta: {
        sortAscIcon: <FcNumericalSorting12 className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcNumericalSorting21 className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
      },
    }),
    columnHelper.accessor("boardGameGeekThing.itemName", {
      header: () => "Game Name",
      cell: (item) => item.row.original.alias ?? item.getValue(),
      meta: {
        sortAscIcon: <FcAlphabeticalSortingAz className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcAlphabeticalSortingZa className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
      },
    }),
    columnHelper.accessor("owner", {
      header: () => "Owner",
      meta: {
        sortAscIcon: <FcAlphabeticalSortingAz className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcAlphabeticalSortingZa className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
      },
    }),
    columnHelper.accessor("isCheckedOut", {
      header: () => "Checked In?",
      cell: ({ cell }) => {
        return (
          <span className="flex justify-center">
            {/* Is Checked out is the property */}
            {cell.getValue() ? (
              <FaPersonWalkingArrowRight className="text-red-400 h-4 w-4" />
            ) : (
              <FaCircleCheck className="text-green-400 h-4 w-4" />
            )}
          </span>
        );
      },
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
  ]

  const reactTable = useReactTable({
    data: libraryItems,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter: query,
      sorting: sorting,
    },
    globalFilterFn: customGlobalFilter,
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

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

        {libraryItems !== undefined && libraryItems.length > 0 && (
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
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
