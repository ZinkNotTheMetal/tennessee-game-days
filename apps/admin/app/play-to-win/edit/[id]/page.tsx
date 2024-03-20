import { IPlayToWinItem } from "@repo/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Play to Win Item",
};

async function getPlayToWinItem(id: number) {
  const playToWinItemById = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/play-to-win/${id}`,
    {
      method: "GET",
      cache: 'no-store',
    }
  );

  const item: IPlayToWinItem = await playToWinItemById.json();
  return item;
}


export default async function Page({ params }: { params: { id: string } }) {
  const playToWinItemId = Number(params.id)
  const playToWinItem = await getPlayToWinItem(playToWinItemId)

  return(
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">
        Edit Play to Win Item
      </h1>

      <div className="text-right">
        {/* Add back and delete buttons */}
      </div>

      <div className="pt-4">
        {!playToWinItem && (
          <div className="pt-8">
            Item not found in Library, someone may have deleted it while you
            were looking at it :(
          </div>
        )}
        {Boolean(playToWinItem) && (
          JSON.stringify(playToWinItem)
        )}
      </div>
    </main>
  )

}