import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared"

interface IPlayToWinRequest {
  id: number,
  barcode: string
  gameName: string
  publisherName: string
  isHidden: boolean
  _count: { playToWinPlays: number }
  boardGameGeekId: number
  boardGameGeekThing: IBoardGameGeekEntity
}

export type { IPlayToWinRequest }