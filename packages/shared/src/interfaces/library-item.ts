import { IBoardGameGeekEntity } from "../../../board-game-geek-shared";

interface ILibraryItem {
  /** @format int32 */
  id: number
  /** @format int32 */
  boardGameGeekId: number
  barcode: string
  /* If a user renames a game in the library */
  alias: string | null
  owner: string
  isHidden: boolean
  isCheckedOut: boolean
  dateAddedUtc: string
  updatedAtUtc: string
  totalCheckedOutMinutes: number
  checkOutEvents: ICheckoutEvent[]
  additionalBoxContent: number[]
  boardGameGeekThing: IBoardGameGeekEntity
}

interface ICheckoutEvent {
  id: string,
  checkedInTimeUtcIso?: string
  checkedOutTimeUtcIso: string
}

export type { ILibraryItem, ICheckoutEvent };