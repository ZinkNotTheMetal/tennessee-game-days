import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { VenueListResponse } from "./response";

export const revalidate = 0; //Very important

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * @swagger
 * /api/venue/list:
 *   get:
 *     tags:
 *       - Venue
 *     summary: Returns all venues used for conventions
 *     description: A venue is where a TGD conference will be held
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VenueListResponse'
 */
export async function GET() {
  const venueCount = await prisma.venue.count();

  const venues = await prisma.venue.findMany();

  return NextResponse.json<VenueListResponse>({
    total: venueCount,
    list: venues,
  });
}
