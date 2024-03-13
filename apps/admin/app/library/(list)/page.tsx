import type { Metadata } from "next";
import { LibraryGameTable } from "./library-table";
import { ILibraryItem } from "@repo/shared";
import AddGameToLibraryButton from "@/app/components/buttons/add-game-to-library";

export const metadata: Metadata = {
  title: "Game Library",
};

export const revalidate = 0

async function getLibraryItems() {
  const libraryItemsApi = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/library/list`)

  const libraryItems = await libraryItemsApi.json();

  libraryItems.list.sort((a: ILibraryItem, b: ILibraryItem) => {
    // If Alias is null, use ItemName for sorting
    const aliasA = a.alias ?? a.boardGameGeekThing.itemName;
    const aliasB = b.alias ?? b.boardGameGeekThing.itemName;

    // Compare Alias values
    if (aliasA < aliasB) return -1;
    if (aliasA > aliasB) return 1;

    return 0;
  });

  return libraryItems;
}

export default async function Page() {
  const libraryItems = await getLibraryItems();

  return (
    <div className="pt-6">
      {libraryItems.total <= 0 && (
        <div>
          No games have been loaded in the library, ensure that you have games
          in the database and the connection is ok. If you are receiving this
          message and are unsure what to do. Contact your administrator
        </div>
      )}

      {libraryItems.total > 0 && (
        <>
          <div className="flex justify-end">
            <div className="pr-8">
              <AddGameToLibraryButton />
            </div>
            
          </div>
          <div className="flex justify-center">
            <LibraryGameTable
              libraryItems={libraryItems.list}
              total={libraryItems.total}
            />
          </div>
        </>
      )}
    </div>
  );
}
