interface IVenue {
  /** @format int32 */
  id: number
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

export type { IVenue }
