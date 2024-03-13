import { IBoardGameGeekThing } from "./board-game-thing";

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
  additionalBoxContent: any[]; // TODO: @WZ Fix this when I can test content
  checkOutEvents: any[]; // TODO: @WZ Fix this when I can test checkout events
  boardGameGeekThing: IBoardGameGeekThing;
}

export type { ILibraryItem };