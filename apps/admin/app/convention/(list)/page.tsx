import Link from "next/link";
import type { Metadata } from "next";
import { ConventionTable } from "./convention-table";
import { ApiListResponse } from "@repo/shared";
import type { IConvention } from "@repo/shared";

export const metadata: Metadata = {
  title: "TGD - Conventions",
};

async function getConventionsFromApi() {
  const conventionListApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/convention/list`,
    {
      method: "GET",
      next: {
        tags: ["convention"],
        revalidate: 3600,
      },
    }
  );

  const conventionListResponse: ApiListResponse<IConvention> =
    await conventionListApi.json();

  return conventionListResponse;
}

export default async function Page() {
  
}
