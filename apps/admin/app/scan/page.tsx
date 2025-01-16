import { Metadata } from "next"
import ScanningTerminalClient from "./scanning-form"
import GameCheckoutItemOverview from "../components/checked-out-overview/overview";
import { ApiListResponse, ILibraryItem, TopCheckedOutGame } from "@repo/shared";
import { UpcomingConventionResponse } from "../api/convention/upcoming/response";
import PlayToWinInformation from "../components/play-to-win-info/play-to-win-info";
import ConventionAttendeeInformation from "../components/attendee-info/attendee-info";
import { AttendeeCountResponse } from "../api/attendee/count/[conventionId]/response";
import DisplayTopCheckedOutGames from "../components/top-checked-out/results";
import DisplayTopRecommendedGames from "../components/recommened-games/recommended-games";

export const metadata: Metadata = {
  title: "Scanning Terminal",
};

async function getCheckedOutGames() {
  const checkedOutGamesApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/library/check-out`,
    {
      method: "GET",
      next: {
        tags: ['scanner'],
        revalidate: 300
      }
    }
  );
  const checkedOutItems: ApiListResponse<ILibraryItem> = await checkedOutGamesApi.json()
  return checkedOutItems;
}

async function getPlayToWinInformation() {
  const getPlayToWinPlayCount = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/play-to-win/info`,
    {
      method: "GET",
      next: {
        tags: ['scanner', 'ptw-entry'],
        revalidate: 300
      }
    }
  )

  const response : { totalPlayToWinGames: number, playToWinGamesPlayed: number, playToWinPlays: number, attendeesPlayed: number } = await getPlayToWinPlayCount.json()
  return response;
}

async function getTop20CheckedOutGames() {
  const top20AllTimeApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/library/stats/all-time-top-20`,
    {
      method: "GET",
      next: {
        tags: ['scanner'],
        revalidate: 600
      }
    }
  );
  const response: { list: TopCheckedOutGame[] } = await top20AllTimeApi.json()

  return response.list

}

async function getCurrentConvention() {
  const getUpcomingConvention = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/convention/upcoming`, {
      method: "GET",
      next: {
        revalidate: 600,
        tags: ['convention']
      }
    }
  )

  const response : UpcomingConventionResponse = await getUpcomingConvention.json()

  return response.convention
}

async function getAttendeeInformation(conventionId: number) {
  const attendeeInformationApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/attendee/count/${conventionId}`, {
      method: "GET",
      next: {
        revalidate: 600,
        tags: ['scanner']
      }
    }
  )

  const response: AttendeeCountResponse = await attendeeInformationApi.json()
  return response
}


export default async function Page() {
  const checkedOutGames = await getCheckedOutGames()
  const playToWinInfo = await getPlayToWinInformation()
  const top20CheckedOutGames = await getTop20CheckedOutGames()
  const currentConvention = await getCurrentConvention()
  const attendeeInformation = await getAttendeeInformation(currentConvention?.id || 0)

  return (
    <main className="container mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">Begin by scanning a barcode</h2>

      <div className="py-2">
        <ScanningTerminalClient />
      </div>

      <div className="convention-header text-center">
        <h1 className="text-3xl text-blue-600">
          {currentConvention?.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 pt-4">

        <div className="bg-gray-200 p-6 rounded-lg shadow-md">
          <div className="flex justify-between">
            <h2 className="text-2xl text-blue-500">Checked out Games</h2>
            <span className="text-blue-400">Checked out: {checkedOutGames.total}</span>
          </div>
          
          { checkedOutGames.total === 0 ? (
            <div className="pt-4">
              <span className="text-green-700 italic pt-4">No library games are currently checked out</span>
            </div>
          ) : (
            <div className="checked-out-games pt-4">
              { checkedOutGames.list.map((game) => (
                <div key={game.id} className="hover:bg-slate-200">
                  <GameCheckoutItemOverview
                    id={game.id}
                    key={game.barcode}
                    gameName={game.alias || game.boardGameGeekThing.itemName} 
                    checkOutTimeUtcIso={game.checkOutEvents[0]?.checkedOutTimeUtcIso || ''}
                    attendeePreferredName={game.checkOutEvents[0]?.attendee.person.preferredName || game.checkOutEvents[0]?.attendee.person.firstName || ''}
                    attendeeLastName={game.checkOutEvents[0]?.attendee.person.lastName || ''}
                    attendeeBadgeNumber={game.checkOutEvents[0]?.attendee.barcode ?? ''}
                  />
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      <div className="pt-6 grid grid-cols-3 gap-x-5">
        <PlayToWinInformation {...playToWinInfo} />
        <ConventionAttendeeInformation {...attendeeInformation} />
        <DisplayTopCheckedOutGames count={5} showFullDetails={false} topCheckedOutGames={top20CheckedOutGames} />
      </div>

      <div>
        <div className="text-center py-4">
          <span className="text-2xl">Top Recommended Games</span>
          <div className="p-4">
            <DisplayTopRecommendedGames />
          </div>
        </div>
      </div>
    </main>
  )
}