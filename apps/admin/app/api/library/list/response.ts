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
 *           description: Total (non hidden) count of library games
 *         list:
 *           type: array
 *           description: Library Game
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