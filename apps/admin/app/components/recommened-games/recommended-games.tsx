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
    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-5 divide-x-8">
        {topRecommendations.map((recommendations, index) => (
          <div key={index}>
            <div className="bold text-lg text-blue-500">
              Recommendations for {recommendations[0]?.boardGameGeekThing.votedBestPlayerCount} {recommendations[0]?.boardGameGeekThing.votedBestPlayerCount === 1 ? 'person' : 'people'}
            </div>
            {recommendations.map(recommendation => (
              <div key={recommendation.id} className="mb-4">
                <div>
                  <span className="text-2xl line-clamp-1">{recommendation.alias ?? recommendation.boardGameGeekThing.itemName}</span>
                </div>
                <div className="flex justify-center my-4">
                  <div className="relative h-64 w-56">
                    <RecommendedGameImage 
                      src={recommendation.boardGameGeekThing.imageUrl ?? ''} 
                      gameName={recommendation.alias ?? recommendation.boardGameGeekThing.itemName}
                    />
                  </div>
                </div>
                { recommendation.boardGameGeekThing.minimumPlayerCount === recommendation.boardGameGeekThing.maximumPlayerCount ? (
                  <div>
                    <span>{recommendation.boardGameGeekThing.maximumPlayerCount}</span>
                    <span>&nbsp;{recommendation.boardGameGeekThing.maximumPlayerCount === 1 ? 'player' : 'players'}</span>
                  </div>
                ) : (
                  <div>
                  <span>{recommendation.boardGameGeekThing.minimumPlayerCount}</span>
                  <span>-</span>
                  <span>{recommendation.boardGameGeekThing.maximumPlayerCount}</span>
                  <span>&nbsp;players</span>
                </div>
                )}
                <div>
                  <span>Complexity (1-5):</span>
                  <span className={`pl-1 ${getComplexityColor(recommendation.boardGameGeekThing.complexityRating ?? 0)}`}>{Number(recommendation.boardGameGeekThing.complexityRating).toFixed(1)}</span>
                </div>
                <div>
                  <span>Rating (1-10):</span>
                  <span className="pl-1 text-green-600">{Number(recommendation.boardGameGeekThing.averageUserRating).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}