interface IBoardGameGeekEntity {
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
  ranking: number | null;
  /** @format int32 */
  votedBestPlayerCount: number;
  /** @format double */
  averageUserRating: number;
  /** @format double */
  complexityRating: number;
  mechanics: {id: number, name: string}[]
}

export type { IBoardGameGeekEntity }
