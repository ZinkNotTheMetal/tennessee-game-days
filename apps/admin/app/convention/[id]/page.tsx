import { DateTime } from "ts-luxon"
import EditConventionButton from "@/app/components/buttons/edit-convention-button"
import BackButton from "@/app/components/buttons/back-button"
import ViewPlayToWinGamesForConvention from "@/app/components/buttons/view-ptw-games-button"
import ViewAttendeesForConvention from "./view-attendees-button"
import { GetConventionById } from "@/app/api/convention/[id]/actions"
import { GetAttendeeCounts } from "@/app/api/report/[conventionId]/attendee/actions"
import { GetPlayToWinReportByConvention } from "@/app/api/report/[conventionId]/play-to-win/actions"
import { GetLibraryPlaytimeCounts } from "@/app/api/report/[conventionId]/library/actions"

interface Props {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props
) {
  const convention = await GetConventionById(Number(params.id))

  return {
    title: convention?.name
  }
}

export default async function Page({ params }: Props): Promise<JSX.Element> {
  const convention = await GetConventionById(Number(params.id))
  const attendeeCount = await GetAttendeeCounts(Number(params.id))
  const libraryReport = await GetLibraryPlaytimeCounts(Number(params.id))
  const playToWinReport = await GetPlayToWinReportByConvention(Number(params.id))

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">
        {convention?.name} Information
      </h1>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <div className="flex justify-end space-x-4">
          <BackButton />
          <EditConventionButton id={Number(params.id)} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Event Details:</h2>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Extra Hours Start Date:</p>
          <p className="w-full sm:w-1/2">{convention?.extraHoursStartDateTimeUtc && (DateTime.fromJSDate(convention.extraHoursStartDateTimeUtc).toLocaleString(DateTime.DATETIME_FULL))}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Start Date:</p>
          <p className="w-full sm:w-1/2">{convention?.startDateTimeUtc && (DateTime.fromJSDate(convention.startDateTimeUtc).toLocaleString(DateTime.DATETIME_FULL))}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">End Date:</p>
          <p className="w-full sm:w-1/2">{convention?.endDateTimeUtc && (DateTime.fromJSDate(convention.endDateTimeUtc).toLocaleString(DateTime.DATETIME_FULL))}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Venue:</p>
          <p className="w-full sm:w-1/2">{convention?.venue?.name}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Location:</p>
          <p className="w-full sm:w-1/2">{convention?.venue?.streetNumber} {convention?.venue?.streetName}, {convention?.venue?.city}, {convention?.venue?.stateProvince} {convention?.venue?.postalCode}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Last Updated Date:</p>
          <p className="w-full sm:w-1/2">{convention?.updatedAtUtc && (DateTime.fromISO(convention.updatedAtUtc).toLocaleString(DateTime.DATETIME_FULL))}</p>
        </div>
        <div className="flex flex-wrap items-center">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Cancelled:</p>
          <p className="w-full sm:w-1/2">{convention?.isCancelled ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <div className="flex justify-end space-x-4">
          <ViewAttendeesForConvention conventionId={Number(params.id)} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Attendance Counts:</h2>
        <p>All Attendees: {attendeeCount?.allAttendees}</p>
        <p>Cancelled Attendees: {attendeeCount?.cancelledAttendees}</p>
        <p>Checked In Attendees: {attendeeCount?.checkedInAttendees}</p>
        <p>Not Checked In Attendees: {attendeeCount?.notCheckedInAttendees}</p>
      </div>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Library Game Counts:</h2>
        <p>Games not played: {libraryReport?.itemsNotPlayed.length ?? 0}</p>
        <p>Games played: {libraryReport?.itemsPlayed.length ?? 0}</p>
      </div>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <div className="flex justify-end space-x-4">
          <ViewPlayToWinGamesForConvention conventionId={Number(params.id)} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Play to Win Counts:</h2>
        <p>Total Play To Win Games: {playToWinReport?.length}</p>
        <p>Games played at least once: {playToWinReport?.reduce((acc: any, current: { plays: any }) => acc + current.plays, 0)}</p>
        <p>Games not played: {playToWinReport?.filter((g: { plays: number }) => g.plays === 0).length}</p>
        <p>Total Play to Win players: {playToWinReport?.reduce((acc: any, current: { totalPlayers: any }) => acc + current.totalPlayers, 0)}</p>
      </div>
    </main>
  )
}