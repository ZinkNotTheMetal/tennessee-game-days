import { ApiListResponse, ILibraryItem, TopCheckedOutGame } from "@repo/shared"
import { GET as CheckedOutGamesGetApi } from "../api/library/check-out/route"
import { GET as PlayToWinGamesGetApi} from "../api/play-to-win/log/route"
import { GET as GetTop20GamesApi } from "../api/library/stats/all-time-top-20/route"

export async function getCheckedOutGames() {
  const checkedOutGamesApi = await CheckedOutGamesGetApi()
  const checkedOutItems: ApiListResponse<ILibraryItem> = await checkedOutGamesApi.json()

  return checkedOutItems
}

export async function getPlayToWinPlays() {
  const checkedOutGamesApi = await PlayToWinGamesGetApi()
  const playToWinPlays: { count: number } = await checkedOutGamesApi.json()

  return playToWinPlays.count
}

export async function getTop20CheckedOutGames() {
  const allTimeTop20Api = await GetTop20GamesApi()
  const allTimeTop20LibraryGames: { list: TopCheckedOutGame[] } = await allTimeTop20Api.json()

  return allTimeTop20LibraryGames.list
}