import { Prisma } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *     ConventionResponse:
 *       type: object
 *       properties:
 *         convention:
 *          type: object
 *          $ref: '#/components/schemas/Convention'
 */
export interface ConventionResponse {
  convention: Prisma.ConventionGetPayload<{}>
}