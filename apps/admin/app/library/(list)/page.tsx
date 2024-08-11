import { GetAllLibraryItems } from "@/app/api/library/list/actions";
import { LibraryGameTable } from "./library-table"
import AddGameToLibraryButton from "@/app/components/buttons/add-game-to-library"
import BackToTopButton from "@/app/components/back-to-top/back-to-top-button";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function generateMetadata() {
  const libraryItems = await GetAllLibraryItems()
  const libraryItemCount = libraryItems.length

  return {
    title: `TGD - Game Library - ${libraryItemCount} games`
  }
}


export default async function Page() {
  const libraryItems = await GetAllLibraryItems()
  const libraryItemCount = libraryItems.length

  return (
    <main className="pt-6">
      {libraryItemCount <= 0 && (
        <div>
          No games have been loaded in the library, ensure that you have games
          in the database and the connection is ok. If you are receiving this
          message and are unsure what to do. Contact your administrator
        </div>
      )}

      {libraryItemCount > 0 && (
        <>
          <div className="flex justify-end pr-8 py-2">
            <AddGameToLibraryButton />
          </div>
          <div className="flex justify-center">
            <LibraryGameTable
              libraryItems={libraryItems}
              total={libraryItemCount}
            />
            <BackToTopButton />
          </div>
        </>
      )}
    </main>
  );
}
