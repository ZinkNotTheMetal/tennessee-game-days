import { Prisma } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     BggSearchResponse:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: Total amount of Conventions
 *         list:
 *           type: array
 *           description: Library items with Board Game Geek Id
 *           items:
 *             $ref: '#/components/schemas/LibraryItemResponse'
 */
export interface BggSearchResponse {
  total: number
  list: Prisma.LibraryItemGetPayload<{
    include: {
      boardGameGeekThing: true,
    },
  }>[];
}