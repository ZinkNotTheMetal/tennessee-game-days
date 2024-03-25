import { LibraryGameTable } from "./library-table";
import { ApiListResponse, ILibraryItem } from "@repo/shared";
import AddGameToLibraryButton from "@/app/components/buttons/add-game-to-library";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function getLibraryItems() {
  const libraryItemsApi = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/library/list`, {
    cache: 'no-store',
  })

  const libraryItems: ApiListResponse<ILibraryItem> = await libraryItemsApi.json()

  return libraryItems
}

export async function generateMetadata() {
  const libraryItems = await getLibraryItems()
  const libraryItemCount = libraryItems.total

  return {
    title: `TGD - Game Library - ${libraryItemCount} games`
  }
}


export default async function Page() {
  const libraryItems = await getLibraryItems();

  return (
    <main className="pt-6">
      {libraryItems.total <= 0 && (
        <div>
          No games have been loaded in the library, ensure that you have games
          in the database and the connection is ok. If you are receiving this
          message and are unsure what to do. Contact your administrator
        </div>
      )}

      {libraryItems.total > 0 && (
        <>
          <div className="flex justify-end pr-8 py-2">
            <AddGameToLibraryButton />
          </div>
          <div className="flex justify-center">
            <LibraryGameTable
              libraryItems={libraryItems.list}
              total={libraryItems.total}
            />
          </div>
        </>
      )}
    </main>
  );
}
