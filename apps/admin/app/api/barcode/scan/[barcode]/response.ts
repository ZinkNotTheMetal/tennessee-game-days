import { $Enums } from "@prisma/client";


/**
 * @swagger
 * components:
 *   schemas:
 *     BarcodeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the barcode
 *         barcode:
 *           type: string
 *           description: The barcode that was scanned
 *         entityType:
 *           type: string
 *           description: Type of entity associated with the barcode
 *         entityId:
 *           type: number
 *           description: Unique identifier of the entity
 */
export interface BarcodeResponse {
  id: number
  barcode: string
  entityType: $Enums.EntityType
  entityId: number
}

/**
 * @swagger
 * components:
 *   schemas:
 *    AttendeeBarcodeResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BarcodeResponse'
 *         - type: object
 *           properties:
 *             isUserCheckedIn:
 *               type: boolean
 *               description: Indicates if the attendee is checked in
 */
export interface AttendeeBarcodeResponse extends BarcodeResponse {
  isUserCheckedIn: boolean | undefined
}


/**
 * @swagger
 * components:
 *   schemas:
 *    LibraryBarcodeResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BarcodeResponse'
 *         - type: object
 *           properties:
 *             isCheckedOut:
 *               type: boolean
 *               description: Indicates if the library item is checked out
 */
export interface LibraryBarcodeResponse extends BarcodeResponse {
  isCheckedOut: boolean | undefined
}