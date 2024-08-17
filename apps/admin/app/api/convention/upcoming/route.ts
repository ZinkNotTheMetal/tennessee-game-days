import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { DateTime } from "ts-luxon";
import { UpcomingConventionResponse } from "./response";
import { revalidateTag } from "next/cache";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * @swagger
 * /api/convention/upcoming:
 *   get:
 *     tags:
 *       - Convention
 *     summary: Returns next convention (upcoming)
 *     description: Returns the next convention (useful for getting the next ID)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpcomingConventionResponse'
 */
export async function GET() {
  const nextUpcomingConvention = await prisma.convention.findFirst({
    where: {
      startDateTimeUtc: {
        not: null,
      },
      endDateTimeUtc: {
        not: null,
        gt: DateTime.utc().toISO(),
      },
    },
    include: {
      venue: true,
    },
    orderBy: {
      startDateTimeUtc: "asc",
    },
  });

  revalidateTag("convention");

  return NextResponse.json<UpcomingConventionResponse>({
    convention: nextUpcomingConvention,
  });
}
