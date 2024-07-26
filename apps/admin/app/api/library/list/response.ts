import { Prisma } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     LibraryListResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: Total amount of Conventions
 *         list:
 *           type: array
 *           description: Only limited to 15 conventions
 *           items:
 *             $ref: '#/components/schemas/LibraryItemResponse'
 */
export interface LibraryListResponse {
  total: number
  list: Prisma.LibraryItemGetPayload<{
    include: {
      boardGameGeekThing: true,
    },
  }>[];
}