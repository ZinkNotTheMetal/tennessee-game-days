import Link from "next/link";
import type { Metadata } from "next";
import { ConventionTable } from "./convention-table";
import { ApiListResponse } from "@repo/shared";
import type { IConvention } from "@repo/shared";
import BackToTopButton from "@/app/components/back-to-top/back-to-top-button";

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
  const conventionsResponse = await getConventionsFromApi();

  return (
    <main className="py-16 md:w-full">
      <h1 className="text-4xl font-bold mb-4 text-center">Conventions</h1>

      <div className="mx-auto w-4/5">
        <div className="text-right">
          <Link
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
            href="/convention/add"
          >
            Add
          </Link>
        </div>

        {conventionsResponse.total <= 0 && (
          <div className="py-8 text-red-400">
            <span>
              No conventions have been added, ensure that you add a convention
              and that the connection to the database is ok. If you are
              receiving this error unexpectedly please Contact your
              administrator.
            </span>
          </div>
        )}
        {conventionsResponse.total > 0 && (
          <div className="py-8">
            <ConventionTable
              conventions={conventionsResponse.list}
              total={conventionsResponse.total}
            />
            <BackToTopButton />
          </div>
        )}
      </div>
    </main>
  );
}

