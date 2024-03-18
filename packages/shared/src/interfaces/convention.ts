import { IVenue } from "./venue";

interface IConvention {
  /** @format int32 */
  id: number;
  name: string
  additionalTimeStartDateTimeUtc?: string
  startDateTimeUtc?: string
  endDateTimeUtc?: string
  updatedAtUtc?: string
  isCanceled: boolean
  venue?: IVenue
}

export type { IConvention };
