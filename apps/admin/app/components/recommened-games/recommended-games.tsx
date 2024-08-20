import { ILibraryItem } from "@repo/shared"
import RecommendedGameImage from "./recommend-game-image"

async function getRecommendedGames() {
  const topBggRecommendedGames = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/library/recommendations`,
    {
      method: "GET",
      next: {
        tags: ['scanner'],
        revalidate: 6000
      }
    }
  )

  const response = await topBggRecommendedGames.json()
  const topRatedGames: ILibraryItem[] =  response.highestRatedGames

  return topRatedGames
}

export default async function DisplayTopRecommendedGames(): Promise<JSX.Element> {
  const recommendations = await getRecommendedGames()

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-5 divide-x-8">
        {recommendations.map(recommendation => (
          <div key={recommendation.id}>
            <div className={`${recommendation.isCheckedOut ? "text-red-500 italic text-lg" : "text-lg"}`}>Recommended for {recommendation.boardGameGeekThing.votedBestPlayerCount} {recommendation.boardGameGeekThing.votedBestPlayerCount === 1 ? 'person' : 'people'}</div>
            <div>
              <span className={`${recommendation.isCheckedOut ? "text-red-500 italic text-2xl" : "text-2xl line-clamp-1"}`}>{recommendation.alias ?? recommendation.boardGameGeekThing.itemName}</span>
            </div>
            <div className="flex justify-center">
              <div className="relative h-64 w-56">
                <RecommendedGameImage 
                  src={recommendation.boardGameGeekThing.imageUrl} 
                  gameName={recommendation.alias ?? recommendation.boardGameGeekThing.itemName}
                  isCheckedOut={recommendation.isCheckedOut}
                />
              </div>
            </div>
            <div>
              <span>{recommendation.boardGameGeekThing.minimumPlayerCount}</span>
              <span>-</span>
              <span>{recommendation.boardGameGeekThing.maximumPlayerCount}</span>
              <span>&nbsp;players</span>
            </div>
            <div>
              <span>Complexity (1-5): {recommendation.boardGameGeekThing.complexityRating}</span>
            </div>
            <div>
              <span>Rating (1-10): {recommendation.boardGameGeekThing.averageUserRating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}