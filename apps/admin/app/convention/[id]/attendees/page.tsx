import { GetConventionById } from "@/app/api/convention/[id]/actions";
import { AttendeesTable } from "./attendee-table"
import { GetAllAttendeesForConvention } from "@/app/api/attendee/count/[conventionId]/actions"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const convention = await GetConventionById(Number(params.id))

  return {
    title: `${convention?.name} - Attendees`,
  };
}

export default async function Page({ params }: { params: { id: string }}): Promise<JSX.Element> {
  const allAttendees = await GetAllAttendeesForConvention(Number(params.id))
  const convention = await GetConventionById(Number(params.id))

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
        </div>
      )}
    </main>
  )
}