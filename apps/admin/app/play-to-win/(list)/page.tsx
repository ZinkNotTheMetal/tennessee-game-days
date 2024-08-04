import { UpcomingConventionResponse } from "@/app/api/convention/upcoming/response";
import { redirect } from "next/navigation";

async function getUpcomingConvention(): Promise<number | undefined> {
  const upcomingConventionApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/convention/upcoming`,
    {
      next: {
        tags: ["convention"],
        revalidate: 3600,
      },
    }
  );

  const upcomingConvention: UpcomingConventionResponse =
    await upcomingConventionApi.json();

  console.log(upcomingConvention?.convention?.id);
  return upcomingConvention?.convention?.id;
}

export default async function Page() {
  const upcomingConventionId = await getUpcomingConvention();

  if (!upcomingConventionId) {
    return (
      <section>
        <span className="py-8 text-red-400">
          No conventions have been added, ensure that you add a convention and
          that the connection to the database is ok. If you are receiving this
          error unexpectedly please Contact your administrator.
        </span>
      </section>
    );
  }

  redirect(`/play-to-win/${upcomingConventionId}`);
}
