interface TopCheckedOutGame {
  id: number
  bggId: number
  libraryItemName: string
  allCopiesCheckedOut: boolean
  totalCheckedOutMinutes: string // bigint needs to be string
  totalCheckedOutEvents: string // bigint needs to be string
  bggAverageRating: number
  bggAverageComplexity: number
  votedBestPlayerCount: number
  minPlayerCount: number
  maxPlayerCount: number
  bggPlaytimeMinutes: number
}

export type { TopCheckedOutGame }