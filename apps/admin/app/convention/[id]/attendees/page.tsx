import { AttendeesTable } from "./attendee-table"
import { GetAllAttendeesForConvention } from "@/app/api/attendee/count/[conventionId]/actions"
import BackToTopButton from "@/app/components/back-to-top/back-to-top-button";
import { GetConventionById } from "../page";

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const conventionId = Number((await params).id)
  const convention = await GetConventionById(conventionId)

  return {
    title: `${convention?.name} - Attendees`,
  };
}

export default async function Page({ params }: Props): Promise<JSX.Element> {
  const conventionId = Number((await params).id)

  const allAttendees = await GetAllAttendeesForConvention(conventionId)
  const convention = await GetConventionById(conventionId)

  return(
    <main className="py-16 md:w-full">
      <h1 className="text-4xl font-bold mb-4 text-center">{convention?.name} - Attendees</h1>

      { allAttendees.length <= 0 && (
        <div className="py-8 text-red-400">
          No attendees have been registered for this convention...
        </div>
      )}

      { allAttendees.length > 0 && (
        <div className="py-8 flex justify-center">
          <AttendeesTable attendees={allAttendees} total={allAttendees.length} />
          <BackToTopButton />
        </div>
      )}
    </main>
  )
}