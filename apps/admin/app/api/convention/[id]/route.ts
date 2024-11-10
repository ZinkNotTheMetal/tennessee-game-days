import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { revalidateTag } from "next/cache"
import { Prisma } from "@prisma/client"

export const dynamic = "force-dynamic"

/**
 * @swagger
 * /api/convention/{id}:
 *   get:
 *     tags:
 *       - Convention
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const conventionId = (await params).id

  const convention = await prisma.convention.findFirst({
    where: { id: Number(conventionId) },
    include: {
      venue: true,
    },
  })

  if (convention === null || convention === undefined)
    return NextResponse.json({ message: "Convention not found" }, { status: 404 });

  return NextResponse.json<Prisma.ConventionGetPayload<{include: { venue: true }}>>(convention);
}

/**
 * @swagger
 * /api/convention/{id}:
 *   delete:
 *     summary: Deletes a convention
 *     tags:
 *       - Convention
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
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const conventionId = (await params).id

  const conventionById = await prisma.convention.findFirst({
    where: { id: Number(conventionId) },
    include: {
      venue: true,
    },
  })

  if (conventionById === null || conventionById === undefined)
    return NextResponse.json({ message: "Convention not found" }, { status: 404 })

  // TODO: Fix 500 error (PTW items not deleted) or return unable to delete
  await prisma.convention.delete({
    where: { id: Number(conventionId) },
  });

  revalidateTag('convention')

  return NextResponse.json(
    {
      message: `Successfully deleted convention - ${conventionId}`,
    },
    { status: 200 }
  );
}