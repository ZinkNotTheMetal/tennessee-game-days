import { Metadata } from "next"
import ScanningTerminalClient from "./scanning-form"
import TopCheckedOutGames from "../components/top-20-results/results-table"
import GameCheckoutItemOverview from "../components/checked-out-overview/overview";
import { ApiListResponse, ILibraryItem, TopCheckedOutGame } from "@repo/shared";

export const metadata: Metadata = {
  title: "Scanning Terminal",
};

async function getCheckedOutGames() {
  const checkedOutGamesApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/library/check-out`,
    {
      method: "GET",
      next: {
        tags: ['scanner']
      }
    }
  );
  const checkedOutItems: ApiListResponse<ILibraryItem> = await checkedOutGamesApi.json()
  return checkedOutItems;
}

async function getPlayToWinPlays() {
  const getPlayToWinPlayCount = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/play-to-win/log`,
    {
      method: "GET",
      next: {
        tags: ['scanner']
      }
    }
  );

  const response = await getPlayToWinPlayCount.json();
  const count: number = response.count; 
  return count;
}

async function getTop20CheckedOutGames() {
  const top20AllTimeApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/library/stats/all-time-top-20`,
    {
      method: "GET",
      next: {
        tags: ['scanner']
      }
    }
  );
  const response: { list: TopCheckedOutGame[] } = await top20AllTimeApi.json()

  return response.list

}


export default async function Page() {
  const checkedOutGames = await getCheckedOutGames()
  const playToWinPlays = await getPlayToWinPlays()
  const top20CheckedOutGames = await getTop20CheckedOutGames()

  return (
    <main className="container mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Terminal</h1>

      <div className="py-2">
        <ScanningTerminalClient />
      </div>

      <div className="pt-6 grid grid-cols-4">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Total Play-to-Win Plays</h2>
          <p className="text-3xl font-bold">{playToWinPlays}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-4">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Checked Out Games</h2>
          { checkedOutGames.list.map((game) => (
            <>
              { game.checkOutEvents[0]?.checkedInTimeUtcIso !== undefined && (
                <div className="hover:bg-slate-200">
                  <GameCheckoutItemOverview
                    id={game.id}
                    key={game.barcode}
                    gameName={game.alias || game.boardGameGeekThing.itemName} 
                    checkOutTimeUtcIso={game.checkOutEvents[0]?.checkedOutTimeUtcIso || ''}
                    attendeePreferredName={game.checkOutEvents[0]?.attendee.person.preferredName || game.checkOutEvents[0]?.attendee.person.firstName || ''}
                    attendeeLastName={game.checkOutEvents[0]?.attendee.person.lastName || ''}
                  />
                </div>
              )}
            </>

          ))}
        </div>

        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Games Checked Out Now</h2>
          <p className="text-3xl font-bold">{checkedOutGames.total}</p>
        </div>

      </div>

      <div>
        <TopCheckedOutGames topCheckedOutGames={top20CheckedOutGames} />
      </div>
    </main>
  );
}