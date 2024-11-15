interface IProxyBggApiResponse {
  id: number
  name: string
  imageUrl: string
  thumbnailUrl: string
  description: string
  yearPublished: number
  minimumPlayerCount: number
  maximumPlayerCount: number
  minimumPlayerAge: number
  type: string
  ranking: number
  minimumPlayingTimeMinutes: number
  maximumPlayingTimeMinutes: number
  averageUserRating: number
  complexityRating: number
  mechanics: Array<{ id: number, name: string }>
  publishers: Array<{ id: number, name: string }>
  votedBestPlayerCounts: Array<number>
}

export type { IProxyBggApiResponse }