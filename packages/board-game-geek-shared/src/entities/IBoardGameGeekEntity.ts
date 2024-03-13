interface IBoardGameGeekEntity {
  boardGameGeekId: number
  itemName: string
  description: string
  type: string
  thumbnailUrl: string
  imageUrl: string
  yearPublished: number
  playingTimeMinutes: number
  minimumPlayerCount: number
  maximumPlayerCount: number
  minimumPlayerAge: number
  /** @format double */
  averageUserRating: number
  /** @format double */
  complexityRating: number
  ranking: number | null
  votedBestPlayerCount: number | null
  mechanics: {id: number, name: string}[]
}

export type { IBoardGameGeekEntity }