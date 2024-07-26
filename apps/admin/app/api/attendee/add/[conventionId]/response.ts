/**
 * @swagger
 * components:
 *   schemas:
 *     BarcodeResponse:
 *       type: object
 *       properties:
 *         personId:
 *           type: number
 *           description: Unique identifier for a person
 *         barcode:
 *           type: string
 *           nullable: true
 *           description: Barcode assigned to a person
 */
interface BarcodeResponse {
  personId: number
  barcode: string | null
}

/**
 * @swagger
 * components:
 *   schemas:
 *     AddAttendeeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         barcodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BarcodeResponse'
 */
export interface AddAttendeeResponse {
  message: string
  barcodes: BarcodeResponse[]
}
