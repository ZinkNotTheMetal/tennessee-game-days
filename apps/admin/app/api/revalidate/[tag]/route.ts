import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { tag: string } }) {
  revalidateTag(params.tag)

  return NextResponse.json(
    {
      message: `Successfully revalidated tag ${params.tag}`,
    },
    { status: 200 }
  );
}