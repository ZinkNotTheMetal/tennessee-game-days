import { SearchBoardGameGeek, MapToBoardGameEntity } from "@repo/board-game-geek-shared";
import type { IBoardGameGeekEntity } from "@repo/board-game-geek-shared";
import { useState } from "react";
import type { DebouncedState } from "use-debounce"
import { useDebouncedCallback } from "use-debounce"


interface ProxyBggApiResponse {
  id: number
  name: string
  imageUrl: string
  thumbnailUrl: string
  description: string
  yearPublished: number
  minimumPlayerCount: number
  maximumPlayerCount: number
  minimumPlayerAge: number
  type: string
  ranking: number
  minimumPlayingTimeMinutes: number
  maximumPlayingTimeMinutes: number
  averageUserRating: number
  complexityRating: number
  mechanics: Array<{ id: number, name: string }>
  publishers: Array<{ id: number, name: string }>
  votedBestPlayerCounts: Array<number>
}

export default function useBoardGameGeekSearch(
  query: string,
  searchById: boolean
): [isLoading: boolean, debouncedState: DebouncedState<(value: string) => void>, resultsCount: number, results: IBoardGameGeekEntity[], error: unknown] {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [results, setResults] = useState<IBoardGameGeekEntity[]>([] as IBoardGameGeekEntity[]);
  const [error, setError] = useState<unknown>()

  const debounced = useDebouncedCallback((value: string) => {
    setIsLoading(true)

    if (query === undefined || query === "") {
      setIsLoading(false);
      setTotalResults(0);
      setResults([] as IBoardGameGeekEntity[]);
    } else {

      fetch(`http://localhost:5226/search/${query}?searchById=${searchById}`, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((json: ProxyBggApiResponse[]) => {
          setIsLoading(false)
          setTotalResults(json.length)
          setResults(json.map((r) => {
            const bggEntity: IBoardGameGeekEntity = {
              itemName: r.name,
              publisherName: r.publishers[0]?.name ?? '',
              playingTimeMinutes: r.maximumPlayingTimeMinutes,
              votedBestPlayerCount: r.votedBestPlayerCounts[0] ?? 0,
              ...r
            }

            return bggEntity
          }))
        })
        .catch((error) => {
          console.log('api search error', error)
        })
    }
  }, 500)

  return [isLoading, debounced, totalResults, results, error];
}
