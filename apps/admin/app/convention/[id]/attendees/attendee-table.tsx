'use client'

import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from "react-icons/fc"
import { FaCalendarTimes, FaCalendar, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Row,
  FilterFn
} from "@tanstack/react-table"
import Search from "@/app/components/search/search"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AttendeeWithPreviousConventions } from "@/app/api/attendee/count/[conventionId]/response";


type AttendeePrismaRowType = AttendeeWithPreviousConventions

interface AttendeeTableProps {
  attendees: AttendeePrismaRowType[]
  total: number
}

export function AttendeesTable({ attendees, total }: AttendeeTableProps) : JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "person_lastName", desc: false }
  ]);
  const router = useRouter();
  

  // Column definition
  const columnHelper = createColumnHelper<AttendeePrismaRowType>();
  const columns = [
    columnHelper.accessor("barcode", {
      header: () => "Barcode",
      meta: {
        sortAscIcon: <FcNumericalSorting12 className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcNumericalSorting21 className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
        canHide: false
      },
    }),
    columnHelper.accessor("person.firstName", {
      header: () => "First/Preferred",
      cell: ({ cell }) => <span>
          {!cell.row.original.person.preferredName || cell.row.original.person.preferredName.trim() === ""
            ? cell.row.original.person.firstName
            : cell.row.original.person.preferredName}
        </span>,
      meta: {
        sortAscIcon: <FcAlphabeticalSortingAz className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcAlphabeticalSortingZa className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
        canHide: false
      },
    }),
    columnHelper.accessor("person.lastName", {
      header: () => "Last Name",
      meta: {
        sortAscIcon: <FcAlphabeticalSortingAz className="pl-3 h-9 w-9" />,
        sortDescIcon: <FcAlphabeticalSortingZa className="pl-3 h-9 w-9" />,
        sortIcon: <></>,
        canHide: false
      },
      enableGlobalFilter: true,
    }),
    columnHelper.accessor("hasCancelled", {
      header: () => "Cancelled?",
      cell: ({ cell }) => {
        return (
          <span className="flex justify-center">
            {cell.getValue() ? (
              <FaCalendarTimes className="text-red-400 h-4 w-4" />
            ) : (
              <FaCalendar className="text-green-400 h-4 w-4" />
            )}
          </span>
        )
      },
    }),
    columnHelper.accessor("checkedInUtc", {
      header: () => "Checked In",
      cell: ({ cell }) => {
        return (
          <span className="flex justify-center">
            { cell.getValue() ? (
              <FaCheckCircle className="text-green-400 h-4 w-4" />
            ) : (
              <FaTimesCircle className="text-red-400 h-4 w-4" />
            )}
          </span>
        )
      }
    }),
    columnHelper.accessor("person.phoneNumber", {
      header: () => "Phone"
    }),
    columnHelper.accessor("person.email", {
      header: () => "Email"
    }),
    columnHelper.accessor("person.relatedPersonId", {
      header: () => "With",
      cell: ({ cell }) => {
        return (
          <span>
            {!cell.row.original.person.relatedTo?.preferredName || cell.row.original.person.relatedTo?.preferredName.trim() === ""
              ? cell.row.original.person.relatedTo?.firstName
              : cell.row.original.person.relatedTo?.preferredName }&nbsp;{ cell.row.original.person.relatedTo?.lastName }
          </span>
        )
      }
    }),
    columnHelper.accessor("previousConventionsAttended", {
      header: () => "Previously attended",
      cell: ({ cell }) => <span>{ cell.row.original.previousConventionsAttended }</span>
    }),
  ]

  const customGlobalFilter: FilterFn<any> = (
    row: Row<AttendeePrismaRowType>,
    columnId: string,
    query: string
  ) => {
    console.log(columnId)
    if (columnId === "person_preferredName") {
      const valueToSearch = row.original.person.preferredName || row.original.person.firstName
      return valueToSearch.toLowerCase().startsWith(query.toLowerCase())
    }
    const search = query.toLowerCase()
    const value = String(row.getValue<string>(columnId))
    return value?.toLowerCase().includes(search)
  }

  const reactTable = useReactTable({
    data: attendees,
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

  return(
    <>
      <div className="w-4/5 pb-6">
        <div className="mb-1 md:mb-3">
          <Search
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder={`Search ${total} attendees...`}
            value={query}
          />
        </div>

        {attendees !== undefined && attendees.length > 0 && (
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
                    // onClick={() => {
                    //   router.push(`/library/edit/${row.original.id}`);
                    // }}
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