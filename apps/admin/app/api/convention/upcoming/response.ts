import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

/**
 * @swagger
 * components:
 *   schemas:
 *    UpcomingConventionResponse:
 *      type: object
 *      nullable: true
 *      $ref: '#/components/schemas/Convention'
 */

export interface UpcomingConventionResponse {
  convention: Prisma.ConventionGetPayload<{
    include: {
      venue: true
    },
    orderBy: {
      startDateTimeUtc: 'asc'
    }
  }> | null;
}