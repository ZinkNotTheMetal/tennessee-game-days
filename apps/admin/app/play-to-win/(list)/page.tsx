import { IConvention } from '@repo/shared';
import { redirect } from 'next/navigation';

async function getUpcomingConvention(): Promise<IConvention> {
  const upcomingConventionApi = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/convention/upcoming`, {
    cache: 'no-store',
  })

  const upcomingConvention: IConvention = await upcomingConventionApi.json();

  return upcomingConvention;
}

export default async function Page() {
  const upcomingConvention = await getUpcomingConvention()

  redirect(`/play-to-win/${upcomingConvention.id}`)
}