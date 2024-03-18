interface IAddConventionItemRequest {
  name: string
  additionalTimeStartDateTimeUtc?: string
  startDateTimeUtc?: string
  endDateTimeUtc?: string
  isCanceled: boolean
  venue?: IAddVenueRequest
}

interface IAddVenueRequest {
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

export type { IAddConventionItemRequest, IAddVenueRequest }