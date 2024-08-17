import { IVenue } from "./venue"

interface IConvention {
  /** @format int32 */
  id: number;
  name: string
  extraHoursStartDateTimeUtc?: string // ISO format in string
  startDateTimeUtc?: string // ISO format in string
  endDateTimeUtc?: string // ISO format in string
  updatedAtUtc?: string // ISO format in string
  isCancelled: boolean
  venueId: number
  venue?: IVenue
}

export type { IConvention }
