import { IBoardGameGeekEntity, IProxyBggApiResponse } from "@repo/board-game-geek-shared"

export default async function SearchBoardGameGeekProxy(
  query: string,
  searchById: boolean
) : Promise<IBoardGameGeekEntity[]> {

  let results: IBoardGameGeekEntity[] = []

  fetch(`${process.env.BGG_PROXY_BASE_API_URL}/search/${query}?searchById=${searchById}`, {
    method: 'GET'
  })
    .then((response) => response.json())
    .then((json: IProxyBggApiResponse[]) => {

      results = json.map((r: IProxyBggApiResponse) => {
        const { name, ...rest } = r

        const bggEntity: IBoardGameGeekEntity = {
          itemName: r.name,
          publisherName: r.publishers[0]?.name ?? '',
          playingTimeMinutes: r.maximumPlayingTimeMinutes,
          votedBestPlayerCount: r.votedBestPlayerCounts[0] ?? 0,
          ...rest
        }

        return bggEntity

      })
    })
    .catch((error) => {
      console.log('search-bgg - api search error', error)
    })

    return results;
}
