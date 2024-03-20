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

  return NextResponse.json(barcodeScanned);
}