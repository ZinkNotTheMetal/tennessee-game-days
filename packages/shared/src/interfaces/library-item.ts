import { IBoardGameGeekEntity } from "../../../board-game-geek-shared";

interface ILibraryItem {
  /** @format int32 */
  id: number;
  /** @format int32 */
  boardGameGeekThingId: number;
  barcode: string;
  /* If a user renames a game in the library */
  alias: string | null;
  owner: string;
  isHidden: boolean;
  isCheckedOut: boolean;
  dateAddedUtc: string;
  updatedAtUtc: string;
  totalCheckedOutMinutes: number;
  additionalBoxContent: number[];
  checkOutEvents: any[]; // TODO: @WZ Fix this when I can test checkout events
  boardGameGeekThing: IBoardGameGeekEntity;
}

export type { ILibraryItem };