import { Prisma } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *    CheckoutItemListResponse:
 *      type: object
 *      properties:
 *        total:
 *          type: number
 *          description: Total amount of Conventions
 *        list:
 *           type: array
 *           description: Only limited to 15 conventions
 *           items:
 *             $ref: '#/components/schemas/LibraryItem'
 */
export interface CheckoutItemListResponse {
  total: number
  list: Prisma.LibraryItemGetPayload<{
    include: {
      boardGameGeekThing: true,
      checkOutEvents: {
        orderBy: { 
          checkedOutTimeUtcIso: 'desc'
        },
        include: {
          attendee: {
            include: {
              person: {
                include: {
                  relatedTo: true
                }
              }
            }
          }
        }
      }
    },
  }>[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *    Convention:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *          description: Unique identifier for the Convention
 *        name:
 *          type: string
 *          description: Name of the Convention (Hotel Name)
 *        extraHoursStartDateTimeUtc:
 *          type: string
 *          description: Extra Hours Start Date in UTC (typically for volunteers)
 *          example: "2024-10-31T21:00:00.000Z"
 *        startDateTimeUtc:
 *          type: string
 *          description: Start Date of the convention in UTC
 *          example: "2024-11-01T13:00:00.000Z"
 *        endDateTimeUtc:
 *          type: string
 *          description: End Date of the convention in UTC
 *          example: "2024-10-31T21:00:00.000Z"
 *        isCancelled:
 *          type: boolean
 *          description: Flag to state whether a convention has been cancelled
 *        venueId:
 *          type: number
 *          description: Unique identifier for the Venue
 *        venue:
 *          type: object
 *          $ref: '#/components/schemas/Venue'
 * 
 *    ConventionListResponse:
 *      type: object
 *      properties:
 *        total:
 *          type: number
 *          description: Total amount of Conventions
 *        list:
 *           type: array
 *           description: Only limited to 15 conventions
 *           items:
 *             $ref: '#/components/schemas/Convention'
 */