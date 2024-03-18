import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const conventionById = await prisma.convention.findFirst({
    where: {id: Number(params.id)},
    include: {
      venue: true,
    }
  })

  if (conventionById === null || conventionById === undefined)
    return NextResponse.json({ message: "Convention not found" }, { status: 404 });

  return NextResponse.json(conventionById);
}



export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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