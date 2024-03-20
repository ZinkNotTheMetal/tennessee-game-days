import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared"

interface IPlayToWinRequest {
  barcode: string
  gameName: string
  isHidden: boolean
  boardGameGeekId: number
  boardGameGeekThing: IBoardGameGeekEntity
}

export type { IPlayToWinRequest }