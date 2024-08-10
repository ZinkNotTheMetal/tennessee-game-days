import { LibraryForm } from "../../library-form";
import type { ILibraryItem } from "@repo/shared";
import { LibraryItemEditButtons } from "./library-edit-buttons";

interface Props {
  params: { id: string };
}

async function getLibraryItem(id: number) {
  const libraryItemByIdApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/library/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const libraryItemResponse: ILibraryItem = await libraryItemByIdApi.json();
  return libraryItemResponse;
}

export async function generateMetadata({ params }: Props) {
  const libraryItem = await getLibraryItem(Number(params.id));

  return {
    title: `Edit - ${libraryItem.barcode} - ${libraryItem.alias || libraryItem.boardGameGeekThing?.itemName}`,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const libraryItemId = Number(params.id);
  const libraryItem = await getLibraryItem(libraryItemId);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">
        Edit Game in library
      </h1>

      <LibraryItemEditButtons
        id={libraryItemId}
        gameName={libraryItem?.boardGameGeekThing?.itemName || ""}
      />

      <div className="pt-4">
        {!libraryItem && (
          <div className="pt-8">
            Item not found in Library, someone may have deleted it while you
            were looking at it :(
          </div>
        )}
        {Boolean(libraryItem) && (
          <LibraryForm id={libraryItem.id} libraryItem={libraryItem} />
        )}
      </div>
    </main>
  );
}
