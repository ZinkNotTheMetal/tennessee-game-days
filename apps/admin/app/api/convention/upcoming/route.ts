import { NextResponse } from "next/server";
import { UpcomingConventionResponse } from "./response";
import { revalidateTag } from "next/cache";
import { GetCurrentOrUpcomingConvention } from "./actions";

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
  const convention = await GetCurrentOrUpcomingConvention()

  revalidateTag("convention");

  return NextResponse.json<UpcomingConventionResponse>({
    convention: convention,
  });
}
