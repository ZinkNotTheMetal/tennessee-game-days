import { ILibraryItem } from "@repo/shared"
import RecommendedGameImage from "./recommend-game-image"

async function getRecommendedGames() {
  const topBggRecommendedGames = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/library/recommendations`,
    {
      method: "GET",
      next: {
        tags: ['scanner'],
        revalidate: 600
      }
    }
  )

  const response = await topBggRecommendedGames.json()
  const topRecommendations: Array<Array<{
    id: number;
    alias: string | null;
    isCheckedOut: boolean;
    boardGameGeekThing: {
      id: number;
      itemName: string;
      votedBestPlayerCount: number;
      minimumPlayerCount: number;
      maximumPlayerCount: number;
      complexityRating: number | null;
      averageUserRating: number | null;
      imageUrl: string | null;
    }
  }>> = response.highestRatedGames

  return topRecommendations
}

function getComplexityColor(complexityRating: number) {
  if (complexityRating <= 1) return 'text-green-500'
  if (complexityRating <= 2) return 'text-amber-300'
  if (complexityRating <= 3) return 'text-yellow-500'
  if (complexityRating <= 4) return 'text-orange-500'
  return 'text-red-500'
}

export default async function DisplayTopRecommendedGames(): Promise<JSX.Element> {
  const topRecommendations = await getRecommendedGames()

  return (
    <></>
  )
}