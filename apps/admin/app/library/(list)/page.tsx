import { LibraryGameTable } from "./library-table";
import AddGameToLibraryButton from "@/app/components/buttons/add-game-to-library";
import BackToTopButton from "@/app/components/back-to-top/back-to-top-button";
import { ApiListResponse, ILibraryItem } from "@repo/shared";
import ExportLibraryButton from "@/app/components/buttons/export-library-games-button";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata() {
  const libraryItems = await GetAllLibraryItems();
  const libraryItemCount = libraryItems.total;

  return {
    title: `TGD - Game Library - ${libraryItemCount} games`,
  };
}

async function GetAllLibraryItems() {
  const libraryListApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/library/list?showHidden=true`,
    {
      method: "GET",
      next: {
        revalidate: 600,
        tags: ["library"],
      },
    }
  );

  const response: ApiListResponse<ILibraryItem> = await libraryListApi.json();
  return response;
}

export default async function Page() {
  const libraryItems: ApiListResponse<ILibraryItem> =
    await GetAllLibraryItems();
  const libraryItemCount = libraryItems.total;

  return (
    <main className="md:pt-6">
      {libraryItemCount <= 0 && (
        <div>
          No games have been loaded in the library, ensure that you have games
          in the database and the connection is ok. If you are receiving this
          message and are unsure what to do. Contact your administrator
        </div>
      )}

      {libraryItemCount > 0 && (
        <>
          <div className="hidden md:flex justify-end gap-5 pr-8 pt-2">
            <ExportLibraryButton />
            <AddGameToLibraryButton />
          </div>
          <div className="flex pt-2 justify-center">
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
