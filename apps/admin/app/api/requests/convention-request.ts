interface IConventionRequest {
  name: string
  extraHoursStartDateTimeUtc?: string
  startDateTimeUtc?: string
  endDateTimeUtc?: string
  isCancelled: boolean
  venue?: IVenueRequest
}

interface IVenueRequest {
  /** @format int32 */
  id?: number
  name: string
  streetNumber: string
  streetName: string
  city: string
  stateProvince: string
  postalCode: string
  /** @format decimal */
  latitude?: number
  /** @format decimal */
  longitude?: number
}

export type { IConventionRequest, IVenueRequest }