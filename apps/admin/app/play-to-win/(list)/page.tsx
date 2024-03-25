import { Metadata } from "next";
import { PlayToWinItemsTable } from "./play-to-win-table";
import { ApiListResponse, IPlayToWinItem } from "@repo/shared";
import PlayToWinItemUploadButton from "./upload-ptw-games-button";
import { title } from "process";

async function getPlayToWinItems() {
  const playToWinItemsApi = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/play-to-win/list`, {
    cache: 'no-store',
  })

  const playToWinItems: ApiListResponse<IPlayToWinItem> = await playToWinItemsApi.json();

  return playToWinItems;
}

export async function generateMetadata() {
  const playToWinItems = await getPlayToWinItems()
  const playToWinItemCount = playToWinItems.total

  return {
    title: `Play to Win Items - ${playToWinItemCount} `
  }
}


export default async function Page() {
  const playToWinItems = await getPlayToWinItems()
  return(
    <main className="pt-6">
      <div className="flex justify-end pr-8 py-2">
        <PlayToWinItemUploadButton />
      </div>
      <div className="flex justify-center">
        <PlayToWinItemsTable
          items={playToWinItems.list}
          total={playToWinItems.total}
        />
      </div>
    </main>
  )
}