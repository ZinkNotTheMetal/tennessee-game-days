import { Prisma } from "@prisma/client";


//TODO: WZ - add attendee object
/**
 * @swagger
 * components:
 *   schemas:
 *     Attendee:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The unique identifier for Attendee
 *         barcode:
 *           type: string
 *           description: The barcode for the attendee
 *         isCheckedIn:
 *           type: boolean
 *           description: Whether this attendee has checked in or not
 *         hasCancelled:
 *           type: boolean
 *           description: Whether this attendee has cancelled
 *         isStayingOnSite:
 *           type: boolean
 *           description: Flag that states whether the attendee is staying on site
 *         checkedInUtc:
 *           type: string
 *           format: date-time
 *           description: Date & Time when the person checked in
 *         dateRegistered:
 *            type: string
 *            format: date-time
 *            description: When a person registered for the convention
 *         isVolunteer:
 *           type: boolean
 *           description: Flag that states whether this attendee is a volunteer for this event
 *         isTgdOrganizer:
 *           type: boolean
 *           description: Flag that states whether this attendee is a TGD organizer for this event
 *         passPurchased:
 *           type: string
 *           description: Which pass was purchased
 *           example: Free, Individual, Couple, Family
 *         person:
 *           $ref: '#/components/schemas/Person'
 *     AttendeeCountResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: Total amount of players (cancelled + registered)
 *         cancelled:
 *           type: number
 *           description: The total amount of players who have cancelled for this convention
 *         checkedIn:
 *           type: number
 *           description: The total amount of players who have checked in to this conference
 *         list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Attendee'
 */
export interface AttendeeCountResponse {
  total: number
  cancelled: number
  checkedIn: number
  list: Prisma.AttendeeGetPayload<{}>[]
}
