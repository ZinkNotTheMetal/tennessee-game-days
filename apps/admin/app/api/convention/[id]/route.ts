import { NextRequest, NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"
import { GetConventionById } from "./actions"

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const convention = await GetConventionById(Number(params.id))

  if (convention === null || convention === undefined)
    return NextResponse.json({ message: "Convention not found" }, { status: 404 });

  return NextResponse.json(convention);
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