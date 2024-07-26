
/**
 * @swagger
 * components:
 *   schemas:
 *     LibraryReportResponse:
 *       type: object
 *       properties:
 *         itemsPlayed:
 *           type: array
 *           nullable: true
 *           description: All library items checked out at least once during the convention
 *           items:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *                 description: Barcode of the library item
 *               owner:
 *                 type: string
 *                 description: Owner of the library item
 *               timesCheckedOut:
 *                 type: number
 *                 description: Number of times the item was checked out during the convention
 *               name:
 *                 type: string
 *                 description: Name of the library item
 *               totalTimeCheckedOut:
 *                 type: number
 *                 description: Total time the item was checked out
 *               conferenceTimeCheckedOut:
 *                 type: number
 *                 description: Total time the item was checked out during the convention
 *               itemsNotPlayed:
 *                 type: array
 *                 nullable: true
 *                 description: All library games that were not checked out at all during the convention
 *         itemsNotPlayed:
 *           type: array
 *           nullable: true
 *           description: All library items that were not checked out during this convention
 *           items:
 *             type: object
 *             properties:
 *               barcode:
 *                 type: string
 *                 description: Barcode of the library item
 *               owner:
 *                 type: string
 *                 description: Owner of the library item
 *               name:
 *                 type: string
 *                 description: Name of the library item
 *               totalTimeCheckedOut:
 *                 type: number
 *                 description: Total time the item was checked out
 */
export interface LibraryReportResponse {
  itemsPlayed: {
    barcode: string
    owner: string
    timesCheckedOut: number
    name: string
    totalTimeCheckedOut: number
    conferenceTimeCheckedOut: number
  }[]
  itemsNotPlayed: {
    barcode: string
    owner: string
    totalCheckedOutMinutes: number
    name: string
  }[]
}