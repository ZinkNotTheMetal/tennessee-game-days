import { IBoardGameGeekEntity } from "../../../board-game-geek-shared";

interface IPlayToWinItem {
  /** @format int32 */
  id: number
  barcode: string
  gameName: string
  isHidden: boolean
  dateAddedUtc: string
  totalTimesPlayed: number
  /** @format int32 */
  boardGameGeekId?: number
  boardGameGeekThing?: IBoardGameGeekEntity
}

export type { IPlayToWinItem };
