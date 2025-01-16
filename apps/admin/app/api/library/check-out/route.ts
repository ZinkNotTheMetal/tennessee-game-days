import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "ts-luxon";
import { CheckoutItemListResponse } from "./response";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";

/**
 * @swagger
 * components:
 *   schemas:
 *    CheckOutRequest:
 *      type: object
 *      properties:
 *        libraryId:
 *          type: string
 *          description: Unique identifier of the library item
 *        attendeeId:
 *          type: string
 *          description: Unique identifier of the attendee (not the barcode)
 */
interface CheckOutRequest {
  libraryId: string;
  attendeeId: string;
}

/**
 * @swagger
 * /api/library/check-out/{libraryId}:
 *   put:
 *     summary: Check out a library item
 *     tags:
 *       - Barcode
 *       - Library
 *     description: Checks out a library item from the library to a user
 *     parameters:
 *       - in: path
 *         name: libraryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The library item unique identifier
 *     requestBody:
 *       description: Library Checkout Request
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckOutRequest'
 *     responses:
 *       200:
 *         description: Successfully checked out the library game the library item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message after successful check-in of the item back into the library
 *       404:
 *         description: Invalid Data / Bad Request
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function POST(request: NextRequest) {
  const data: CheckOutRequest = await request.json();
  if (!data.attendeeId || !data.libraryId)
    return NextResponse.json(
      { message: "Request not properly formed" },
      { status: 400 }
    );

  const checkedOutTime = DateTime.utc().toISO();

  const libraryItem = await prisma.libraryItem.findFirst({
    where: { id: Number(data.libraryId) },
  });

  const attendee = await prisma.attendee.findFirst({
    where: { id: Number(data.attendeeId) },
  });

  const hasGameCheckedOut = await prisma.libraryCheckoutEvent.count({
    where: { attendeeId: Number(data.attendeeId), checkedInTimeUtcIso: null },
  });

  if (libraryItem === null)
    return NextResponse.json(
      { message: "Library Item not found" },
      { status: 404 }
    );
  if (attendee === null)
    return NextResponse.json(
      { message: "Attendee not found in system" },
      { status: 404 }
    );
  if (hasGameCheckedOut !== 0)
    return NextResponse.json(
      { message: "User has game already checked out!" },
      { status: 420 }
    );
  if (libraryItem.isCheckedOut)
    return NextResponse.json(
      { message: "Game already checked out!" },
      { status: 400 }
    );

  const currentConvention = await prisma.convention.findFirst({
    where: {
      AND: [
        {
          startDateTimeUtc: {
            gte: DateTime.utc().toISO(),
          },
        },
        {
          endDateTimeUtc: {
            lte: DateTime.utc().toISO(),
          },
        },
      ],
    },
  });

  await prisma.$transaction(async (t: Prisma.TransactionClient) => {
    await t.libraryItem.update({
      where: { id: Number(data.libraryId) },
      data: {
        isCheckedOut: true,
      },
    });

    await t.libraryCheckoutEvent.create({
      data: {
        attendeeId: Number(data.attendeeId),
        checkedOutTimeUtcIso: checkedOutTime,
        libraryCopyId: Number(data.libraryId),
      },
    });
  });

  revalidateTag("scanner");

  return NextResponse.json(
    {
      message: "Successfully checked out!",
    },
    { status: 200 }
  );
}

/**
 * @swagger
 * /api/library/check-out:
 *   get:
 *     tags:
 *       - Library
 *     summary: Gets all games currently checked out
 *     description: Gets a list of all library items that are currently checked out from the library
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutItemListResponse'
 *       404:
 *         description: Invalid Data / Bad Request
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function GET() {
  const count = await prisma.libraryItem.count({
    where: { isCheckedOut: true },
  });

  const checkedOutGames = await prisma.libraryItem.findMany({
    where: { isCheckedOut: true },
    include: {
      boardGameGeekThing: true,
      checkOutEvents: {
        orderBy: {
          checkedOutTimeUtcIso: "desc",
        },
        include: {
          attendee: {
            include: {
              person: {
                include: {
                  relatedTo: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json<CheckoutItemListResponse>({
    total: count,
    list: checkedOutGames,
  });
}
