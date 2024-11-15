import type { IBoardGameGeekEntity, IProxyBggApiResponse } from "@repo/board-game-geek-shared";
import { useState } from "react";
import type { DebouncedState } from "use-debounce"
import { useDebouncedCallback } from "use-debounce"

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

      fetch(`${process.env.BGG_PROXY_BASE_API_URL}/search/${query}?searchById=${searchById}`, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((json: IProxyBggApiResponse[]) => {
          setIsLoading(false)
          setTotalResults(json.length)
          setResults(json.map((r: IProxyBggApiResponse) => {
            const { name, ...rest } = r

            const bggEntity: IBoardGameGeekEntity = {
              itemName: r.name,
              publisherName: r.publishers[0]?.name ?? '',
              playingTimeMinutes: r.maximumPlayingTimeMinutes,
              votedBestPlayerCount: r.votedBestPlayerCounts[0] ?? 0,
              ...rest
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
