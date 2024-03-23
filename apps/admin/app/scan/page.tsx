import { Metadata } from "next";
import ScanningTerminalClient from "./scanning-form";
import { ApiListResponse, ILibraryItem } from "@repo/shared";

export const metadata: Metadata = {
  title: "Scanning Terminal",
};

async function getCheckedOutGames() {
  const checkedOutGamesApi = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/library/check-out`, {
    cache: 'no-store',
  })

  const checkedOutItems: ApiListResponse<ILibraryItem> = await checkedOutGamesApi.json()

  return checkedOutItems
}

async function getPlayToWinPlays() {
  const checkedOutGamesApi = await fetch(`/api/play-to-win/log`, {
    cache: 'no-store',
  })

  const playToWinPlays: { count: number } = await checkedOutGamesApi.json()

  return playToWinPlays.count
}

export default async function Page() {
  const checkedOutGames = await getCheckedOutGames()
  const playToWinPlays = await getPlayToWinPlays()

  return (
    <main className="container mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Terminal</h1>

      <div className="pb-8">
        <ScanningTerminalClient />
      </div>

      <div className="grid grid-cols-3 gap-6 pt-8">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Checked Out Games</h2>
          <ul>
            {checkedOutGames.list.map(game => (
              <li key={game.id} className="mb-2">{ game.alias || game.boardGameGeekThing.itemName }</li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Games Checked Out</h2>
          <p className="text-3xl font-bold">{checkedOutGames.total}</p>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Play-to-Win Plays</h2>
          <p className="text-3xl font-bold">{playToWinPlays}</p>
        </div>
      </div>
    </main>
  );
}