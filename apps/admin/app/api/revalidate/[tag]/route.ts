import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ tag: string }> }) {
  const tag = (await params).tag

  revalidateTag(tag)

  return NextResponse.json(
    {
      message: `Successfully revalidated tag ${tag}`,
    },
    { status: 200 }
  );
}