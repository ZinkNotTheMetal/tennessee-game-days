import { Prisma } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendee:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the attendee
 *         personId:
 *           type: number
 *           description: Unique identifier for the person
 *         barcode:
 *           type: string
 *           description: The barcode assigned to the attendee
 *         person:
 *           $ref: '#/components/schemas/Person'
 *         isCheckedIn:
 *           type: boolean
 *           description: Flag that says if the user has checked in to the convention
 *         hasCancelled:
 *           type: boolean
 *           description: Flag to state if the user has cancelled and will not be attending
 *         isStayingOnSite:
 *           type: boolean
 *           description: Flag to state whether the user planned on staying on site at the convention
 *         conventionId:
 *           type: number
 *           description: Convention that the attendee is attending
 *         convention:
 *           $ref: '#/components/schemas/Convention'
 *         checkedInUtc:
 *           type: string
 *           format: date-time
 *           description: Date Time that they checked in (in UTC)
 *        dateRegistered:
 *           type: string
 *           format: date-time
 *           description: Date Time that the user registered to attend
 *        isVolunteer:
 *           type: boolean
 *           description: Flag to mark if this member was a volunteer for this convention
 *        idTgdOrganizer:
 *           type: boolean
 *           description: Flag to mark if this member was an organizer for this convention
 *        passPurchased:
 *           type: string
 *           description: The pass purchased by the attendee
 *           example: 'Free/Individual/Couple/Family'
 */
export interface AttendeeCountResponse {
  total: number
  cancelled: number
  checkedIn: number
  list: Prisma.AttendeeGetPayload<{}>[]
}
