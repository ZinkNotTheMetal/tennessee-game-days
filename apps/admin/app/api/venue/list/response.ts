import { Prisma } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *    Venue:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: Unique identifier for the Venue
 *        name:
 *          type: string
 *          description: Name of the Venue (Hotel Name)
 *        streetNumber:
 *          type: string
 *          description: Street number for the venue address
 *        streetAddress:
 *          type: string
 *          description: Street name for the venue address
 *        city:
 *          type: string
 *          description: City for the venue address
 *        stateProvince:
 *          type: string
 *          description: State / Province for the venue address
 *        postalCode:
 *          type: string
 *          description: Postal Code for the venue address
 *        latitude:
 *          nullable: true
 *          type: number
 *          description: Latitude position for the venue
 *        longitude:
 *          nullable: true
 *          type: number
 *          description: Longitude position for the venue
 * 
 *    VenueListResponse:
 *      type: object
 *      properties:
 *        total:
 *          type: number
 *          description: Total amount of venues
 *        list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Venue'
 */
export interface VenueListResponse {
  total: number
  list: Prisma.VenueGetPayload<{}>[];
}