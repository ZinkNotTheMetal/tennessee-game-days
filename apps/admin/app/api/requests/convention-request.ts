/**
 * @swagger
 * components:
 *   schemas:
 *     VenueRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int32
 *           description: Unique identifier of the venue
 *         name:
 *           type: string
 *           description: Name of the venue
 *         streetNumber:
 *           type: string
 *           description: Street number of the venue
 *         streetName:
 *           type: string
 *           description: Street name of the venue
 *         city:
 *           type: string
 *           description: City where the venue is located
 *         stateProvince:
 *           type: string
 *           description: State or province where the venue is located
 *         postalCode:
 *           type: string
 *           description: Postal code of the venue
 *         latitude:
 *           type: number
 *           format: double
 *           description: Latitude of the venue location
 *         longitude:
 *           type: number
 *           format: double
 *           description: Longitude of the venue location
 */
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
  timeZone?: string
}

/**
 * @swagger
 * components:
 *   schemas:
 *    ConventionRequest:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the convention
 *        extraHoursStartDateTimeUtc:
 *          type: string
 *          format: date-time
 *          description: Extra Hours Start Date in UTC (typically for volunteers)
 *          example: "2024-10-31T21:00:00.000Z"
 *        startDateTimeUtc:
 *          type: string
 *          format: date-time
 *          description: Start Date of the convention in UTC
 *          example: "2024-11-01T13:00:00.000Z"
 *        endDateTimeUtc:
 *          type: string
 *          format: date-time
 *          description: End Date of the convention in UTC
 *          example: "2024-10-31T21:00:00.000Z"
 *        isCancelled:
 *          type: boolean
 *          description: Flag to state whether a convention has been cancelled
 *        venueId:
 *          type: number
 *          description: Unique identifier for the Venue
 *        venue:
 *          $ref: '#/components/schemas/VenueRequest'
 */
interface IConventionRequest {
  name: string
  extraHoursStartDateTimeUtc?: string
  startDateTimeUtc?: string
  endDateTimeUtc?: string
  isCancelled: boolean
  venue?: IVenueRequest
}

export type { IConventionRequest, IVenueRequest }