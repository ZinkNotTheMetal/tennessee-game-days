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
  return(<></>)
}