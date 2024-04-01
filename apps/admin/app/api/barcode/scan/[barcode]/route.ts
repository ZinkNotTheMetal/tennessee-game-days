import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({
      ...barcodeScanned,
      isCheckedOut: libraryItem?.isCheckedOut
    })
  }

  if (barcodeScanned.entityType === 'Attendee') {
    const attendee = await prisma.attendee.findFirst({
      where: { id: barcodeScanned.entityId }
    })

    return NextResponse.json({
      ...barcodeScanned,
      isUserCheckedIn: attendee?.isCheckedIn
    })
  }

  return NextResponse.json(barcodeScanned);
}