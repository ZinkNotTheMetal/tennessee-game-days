import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetConventionById } from "./actions"
import { ConventionResponse } from "./response"

export const dynamic = "force-dynamic"

/**
 * @swagger
 * /api/convention/{id}:
 *   get:
 *     summary: Get a convention by the unique identifier
 *     description: Gets basic convention information based on the unique identifier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The convention ID
 *     responses:
 *       200:
 *         description: Convention found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConventionResponse'
 *       404:
 *         description: Convention not found with that ID
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const convention = await GetConventionById(Number(params.id))

  if (convention === null || convention === undefined)
    return NextResponse.json({ message: "Convention not found" }, { status: 404 });

  return NextResponse.json<ConventionResponse>({
    convention: convention
  });
}

/**
 * @swagger
 * /api/convention/{id}:
 *   delete:
 *     summary: Deletes a convention
 *     description: Hard deletes a convention based on the unique identifier
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The convention ID
 *     responses:
 *       200:
 *         description: Convention Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConventionResponse'
 *       404:
 *         description: Convention not found with that ID
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const convention = await GetConventionById(Number(params.id))

  if (convention === null || convention === undefined)
    return NextResponse.json({ message: "Convention not found" }, { status: 404 });

  // TODO: Fix 500 error (PTW items not deleted) or return unable to delete
  await prisma.convention.delete({
    where: { id: Number(params.id) },
  });

  return NextResponse.json(
    {
      message: `Successfully deleted convention - ${params.id}`,
    },
    { status: 200 }
  );
}