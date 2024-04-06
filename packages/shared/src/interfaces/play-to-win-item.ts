import { IBoardGameGeekEntity } from "../../../board-game-geek-shared";

interface IPlayToWinItem {
  /** @format int32 */
  id: number
  barcode: string
  gameName: string
  publisherName: string
  isHidden: boolean
  dateAddedUtc: string
  _count: { playToWinPlays: number }
  /** @format int32 */
  boardGameGeekId?: number
  boardGameGeekThing?: IBoardGameGeekEntity
}

export type { IPlayToWinItem };
