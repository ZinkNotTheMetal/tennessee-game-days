import { SearchBoardGameGeek, MapToBoardGameEntity } from "@repo/board-game-geek-shared";
import type { IBoardGameGeekEntity } from "@repo/board-game-geek-shared";
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
      SearchBoardGameGeek(query, searchById)
        .then((results) => {
          setIsLoading(false)
          setTotalResults(results.totalCount)
          setResults(results.results.map((r) => MapToBoardGameEntity(r)))
        })
        .catch((e) => {
          setError(e)
        });
    }
  }, 225)

  return [isLoading, debounced, totalResults, results, error];
}
