import { IVenue } from "./venue";

interface IConvention {
  /** @format int32 */
  id: number;
  name: string
  extraHoursStartDateTimeUtc?: string
  startDateTimeUtc?: string
  endDateTimeUtc?: string
  updatedAtUtc?: string
  isCancelled: boolean
  venue?: IVenue
}

export type { IConvention };
