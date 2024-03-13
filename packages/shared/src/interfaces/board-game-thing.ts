import { IBggGameMechanic } from "./mechanic";

interface IBoardGameGeekThing {
  /* This is the Board Game Geek Id (URL) */
  id: number;
  /* (i.e.) Yokohama */
  itemName: string;
  /* BoardGame / expansion / accessory */
  type: string;
  /* HTML encoded version of the description */
  description: string;
  thumbnailUrl: string;
  imageUrl: string;
  /** @format int32 */
  yearPublished: number;
  /** @format int32 */
  playingTimeMinutes: number;
  /** @format int32 */
  minimumPlayerCount: number;
  /** @format int32 */
  maximumPlayerCount: number;
  /** @format int32 */
  minimumPlayerAge: number;
  /** @format double */
  boardGameGeekRanking: number;
  /** @format int32 */
  votedBestPlayerCount: number;
  /** @format double */
  averageRating: number;
  /** @format double */
  complexityRating: number;
  
  gameMechanics: IBggGameMechanic[];
}

export type { IBoardGameGeekThing };
