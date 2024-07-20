import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetAllConventions } from "./actions"
import { ConventionListResponse } from "./response"

export const revalidate = 0 //Very important

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

/**
 * @swagger
 * /api/convention/list:
 *   get:
 *     summary: Returns list of all conventions in descending order (latest first)
 *     description: A convention is an instance of TGD
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConventionListResponse'
 */
export async function GET() {
  const [count, conventions] = await Promise.all([
    prisma.convention.count(),
    GetAllConventions()
  ])

  return NextResponse.json<ConventionListResponse>({
    total: count,
    list: conventions,
  })
}
