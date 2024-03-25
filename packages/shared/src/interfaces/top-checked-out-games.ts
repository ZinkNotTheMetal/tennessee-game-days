import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared"

interface TopCheckedOutGame {
  alias: string
  barcode: string
  isCheckedOut: boolean
  boardGameGeekThing: IBoardGameGeekEntity,
  totalCheckedOutMinutes: number
  _count: {
    checkOutEvents: number;
    // Add any other properties you expect in _count
  };
}

export type { TopCheckedOutGame }