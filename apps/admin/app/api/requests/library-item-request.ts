import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared"

interface ILibraryItemRequest {
  barcode: string
  alias: string | null
  owner: string
  isHidden: boolean
  additionalBoxContent: number[]
  boardGameGeekId: number
  boardGameGeekThing: IBoardGameGeekEntity
}

export default ILibraryItemRequest