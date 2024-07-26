import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { AttendeeBarcodeResponse, BarcodeResponse, LibraryBarcodeResponse } from "./response";

/**
 * @swagger
 * /api/barcode/scan/{barcode}:
 *   get:
 *     tags:
 *       - Barcode
 *     summary: Returns what barcode was scanned
 *     description: Determines what barcode was scanned (Attendee, PTW or Library Game) and successfully returns that result
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         description: Barcode
 *     responses:
 *       200:
 *         description: Barcode found and data returned
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/BarcodeResponse'
 *                 - $ref: '#/components/schemas/LibraryBarcodeResponse'
 *                 - $ref: '#/components/schemas/AttendeeBarcodeResponse'
 *       404:
 *         description: Barcode not found within the system
 *         content:
 *           application/json:
 *             schema:
 *                message: string
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {

  const barcodeScanned = await prisma.centralizedBarcode.findFirst({
    where: { barcode: params.barcode }
  })

  if (barcodeScanned === null) {
    return NextResponse.json({ message: "Barcode not in system!" }, { status: 404 });
  }

  if (barcodeScanned.entityType === 'LibraryItem') {
    const libraryItem = await prisma.libraryItem.findFirst({
      where: { id: barcodeScanned.entityId}
    })

    return NextResponse.json<LibraryBarcodeResponse>({
      ...barcodeScanned,
      isCheckedOut: libraryItem?.isCheckedOut
    })
  }

  if (barcodeScanned.entityType === 'Attendee') {
    const attendee = await prisma.attendee.findFirst({
      where: { id: barcodeScanned.entityId }
    })

    return NextResponse.json<AttendeeBarcodeResponse>({
      ...barcodeScanned,
      isUserCheckedIn: attendee?.isCheckedIn
    })
  }

  return NextResponse.json<BarcodeResponse>(barcodeScanned);
}