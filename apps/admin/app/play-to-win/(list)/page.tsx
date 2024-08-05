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

}
