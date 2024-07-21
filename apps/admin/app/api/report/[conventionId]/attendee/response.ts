/**
 * @swagger
 * components:
 *   schemas:
 *     ConventionAttendeeResponse:
 *       type: object
 *       properties:
 *         conventionId:
 *           type: number
 *           description: The unique identifier of the convention
 *         counts:
 *           type: object
 *           properties:
 *             allAttendees:
 *               type: number
 *               description: The total amount of attendees who registered
 *             checkedInAttendees:
 *               type: number
 *               description: The total amount of attendees who checked in to the convention
 *             notCheckedInAttendees:
 *               type: number
 *               description: The total amount of attendees who did not check in to the convention
 */
export interface ConventionAttendeeResponse {
  conventionId: number
  counts: {
    allAttendees: number
    checkedInAttendees: number
    cancelledAttendees: number
    notCheckedInAttendees: number
  }
}