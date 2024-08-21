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
  libraryItems: Prisma.LibraryItemGetPayload<{
    include: { boardGameGeekThing: true };
  }>[];
  total: number;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    sortAscIcon: JSX.Element
    sortDescIcon: JSX.Element
    sortIcon: JSX.Element
    canHide: boolean
  }
}

export function LibraryGameTable({
  libraryItems,
  total,
}: LibraryGameTableProps): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "boardGameGeekThing_itemName", desc: false },
  ]);
  const router = useRouter();
  type LibraryItemPrismaRowType = Prisma.LibraryItemGetPayload<{
    include: { boardGameGeekThing: true };
  }>;

  const columnHelper = createColumnHelper<LibraryItemPrismaRowType>();

  const customGlobalFilter: FilterFn<any> = (
    row: Row<ILibraryItem>,
    columnId: string,
    query: string
  ) => {
    if (columnId === "boardGameGeekThing_itemName") {
      const valueToSearch =
        row.original.alias || row.original.boardGameGeekThing.itemName;
      return valueToSearch.toLowerCase().startsWith(query.toLowerCase());
    }
    const search = query.toLowerCase();
    const value = String(row.getValue<string>(columnId));
    return value?.toLowerCase().startsWith(search);
  };

  const columns = [
    columnHelper.accessor("barcode", {
      header: () => "Barcode",
      cell: (item) => <span className="py-2 px-4 text-nowrap">{item.getValue()}</span>,
      meta: {
        sortAscIcon: <FcNumericalSorting12 className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcNumericalSorting21 className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
        canHide: false
      },
    }),
    columnHelper.accessor("boardGameGeekThing.itemName", {
      header: () => "Game Name",
      cell: (item) => item.row.original.alias ?? item.getValue(),
      meta: {
        sortAscIcon: <FcAlphabeticalSortingAz className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcAlphabeticalSortingZa className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
        canHide: false
      },
    }),
    columnHelper.accessor("owner", {
      header: () => <span className="hidden md:inline">Owner</span>,
      meta: {
        sortAscIcon: <FcAlphabeticalSortingAz className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcAlphabeticalSortingZa className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
        canHide: true
      },
    }),
    columnHelper.accessor("isCheckedOut", {
      header: () => <span className="hidden md:inline">Checked In?</span>,
      meta: {
        sortAscIcon: <></>,
        sortDescIcon:  <></>,
        sortIcon: <></>,
        canHide: true
      },
      cell: ({ cell }) => {
        return (
          <span className="hidden md:flex justify-center">
            {/* Is Checked out is the property */}
            {cell.getValue() ? (
              <FaPersonWalkingArrowRight className="text-red-400 h-4 w-4" />
            ) : (
              <FaCircleCheck className="text-green-400 h-4 w-4" />
            )}
          </span>
        )
      },
    }),
    columnHelper.accessor("isHidden", {
      header: () => <span className="hidden md:inline">Hidden?</span>,
      meta: {
        sortAscIcon: <></>,
        sortDescIcon:  <></>,
        sortIcon: <></>,
        canHide: true
      },
      cell: ({ cell }) => {
        return (
          <span className="hidden md:flex justify-center">
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
  });

  return (
    <>
      <div className="w-full px-2 md:w-4/5 lg:w-3/4">
        <div className="mb-1 md:mb-3">
          <Search
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder={`Search ${total} games...`}
            value={query}
          />
        </div>


        {libraryItems !== undefined && libraryItems.length > 0 && (
          <table className="min-w-full divide-y-0 divide-gray-300 bg-white rounded-t-xl rounded-b-xl">
            <thead className="border-b text-sm md:text-lg">
              {reactTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`${header.column.columnDef.meta?.canHide ? 'hidden md:table-cell' : ''} text-gray-500 py-2 px-4`}
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
                        {{
                          asc: header.column.columnDef.meta?.sortAscIcon,
                          desc: header.column.columnDef.meta?.sortDescIcon,
                        }[header.column.getIsSorted() as string] ?? null}
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
                        <td className={`${cell.column.columnDef.meta?.canHide ? 'hidden md:table-cell' : ''} p-4 text-xs md:text-base`} key={cell.id}>
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
