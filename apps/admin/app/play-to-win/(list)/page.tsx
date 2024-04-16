import { GET } from '@/app/api/convention/upcoming/route';
import { IConvention } from '@repo/shared';
import { redirect } from 'next/navigation';

async function getUpcomingConvention(): Promise<IConvention> {
  const upcomingConventionApi = await GET() // Call server side GET, as you are on the server you don't have to talk to the API
  const upcomingConvention: IConvention = await upcomingConventionApi.json();

  return upcomingConvention;
}

export default async function Page() {
  const upcomingConvention = await getUpcomingConvention()

  if (!upcomingConvention) {
    return(
      <section>
        <span className='py-8 text-red-400'>
          No conventions have been added, ensure that you add a convention and that the connection to the database is ok. If you are receiving this error unexpectedly please Contact your administrator.
        </span>
      </section>
    )
  }


  redirect(`/play-to-win/${upcomingConvention.id}`)
}