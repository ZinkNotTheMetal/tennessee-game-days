"use client";

import { useState } from "react";
import { Search } from "@/app/components/search/search";
import { useRouter } from "next/navigation";
import { ILibraryItem } from "@repo/shared";
import { FormatBoardGameGeekType } from "@/app/components/bgg-type/format-type";

interface LibraryGameTableProps {
  libraryItems: ILibraryItem[];
  total: number;
}

export function LibraryGameTable({
  libraryItems,
  total,
}: LibraryGameTableProps): JSX.Element {
  const [query, setQuery] = useState<string>("");

  return (
    <>
      <div className="w-2/3 pb-6">
        <Search
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search..."
          value={query}
        />

        {libraryItems !== undefined && libraryItems.length > 0 && (
          <table className="min-w-full divide-y-0 divide-gray-300 bg-white rounded-t-xl rounded-b-xl">
            <GameTableHeader />

            <tbody className="text-center">
              {libraryItems
                .filter(
                  (item) =>
                    item.barcode.toUpperCase().startsWith(query.toUpperCase()) ||
                    item.alias?.toUpperCase().includes(query.toUpperCase()) ||
                    item.boardGameGeekThing.itemName.toUpperCase().includes(
                      query.toUpperCase()
                    )
                )
                .slice(0, 20)
                .map((item) => (
                  <GameTableRow key={item.id} Id={item.id} libraryItem={item} />
                ))}
            </tbody>
            <tfoot className="rounded-b-xl">
              <tr>
                <td colSpan={6} className="px-4 py-2 italic text-right">
                  Showing{" "}
                  {
                    libraryItems.filter(
                      (item) =>
                        item.barcode.toUpperCase().startsWith(query.toUpperCase()) ||
                        item.alias?.toUpperCase().includes(query.toUpperCase()) ||
                        item.boardGameGeekThing.itemName.toUpperCase().includes(
                          query.toUpperCase()
                        )
                    ).slice(0,20).length 
                  }{" "}
                  of {total}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  );
}

// Table Header
export function GameTableHeader(): JSX.Element {
  return (
    <thead className="border-b">
      <tr>
        <th className="py-2 px-12 text-gray-500">Barcode</th>
        <th className="py-2 px-4 text-gray-500">Name</th>
        <th className="py-2 px-4 text-gray-500 hidden lg:table-cell">
          Item Type
        </th>
        <th className="py-2 px-4 text-gray-500">Owner</th>
        <th className="py-2 px-4 text-gray-500 hidden sm:table-cell">
          Checked Out?
        </th>
        <th className="py-2 px-4 text-gray-500 hidden md:table-cell">
          Is Hidden?
        </th>
      </tr>
    </thead>
  );
}

interface GameTableRowProps {
  Id: number;
  libraryItem: ILibraryItem;
}

// Table Row
export function GameTableRow({
  Id,
  libraryItem,
}: GameTableRowProps): JSX.Element {
  const router = useRouter();

  return (
    <tr
      className="border-b hover:bg-gray-300 hover:cursor-pointer"
      key={Id}
      onClick={() => {
        router.push(`/library/edit/${libraryItem.id}`);
      }}
    >
      <td className="py-3 px-3">{libraryItem.barcode}</td>
      <td className="py-3 px-3">
        {libraryItem.alias ?? libraryItem.boardGameGeekThing.itemName}
      </td>
      <td className="py-3 px-3 hidden lg:table-cell">
        {FormatBoardGameGeekType(libraryItem.boardGameGeekThing.type)}
      </td>
      <td className="py-3 px-3">{libraryItem.owner}</td>
      <td className="py-3 px-3 hidden sm:table-cell">
        {libraryItem.isCheckedOut ? "Y" : "N"}
      </td>
      <td className="py-3 px-3 hidden md:table-cell">
        {libraryItem.isHidden ? "Y" : "N"}
      </td>
    </tr>
  );
}
