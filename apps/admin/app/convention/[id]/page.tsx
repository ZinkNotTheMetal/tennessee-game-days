import { DateTime } from "ts-luxon"
import { getConventionById, getAttendeeReport, getLibraryReport, getPlayToWinReport } from "../actions"
import EditConventionButton from "./edit-convention-button"
import BackButton from "@/app/components/buttons/back-button"

interface Props {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props
) {
  const convention = await getConventionById(Number(params.id))

  return {
    title: convention.name
  }
}

export default async function Page({ params }: Props): Promise<JSX.Element> {
  const convention = await getConventionById(Number(params.id))
  const attendeeCount = await getAttendeeReport(Number(params.id))
  const libraryReport = await getLibraryReport(Number(params.id))
  const playToWinReport = await getPlayToWinReport(Number(params.id))

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">
        {convention.name} Information
      </h1>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <div className="flex justify-end space-x-4">
          <BackButton />
          <EditConventionButton id={Number(params.id)} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Event Details:</h2>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Extra Hours Start Date:</p>
          <p className="w-full sm:w-1/2">{convention.extraHoursStartDateTimeUtc && (DateTime.fromISO(convention.extraHoursStartDateTimeUtc).toLocaleString(DateTime.DATETIME_FULL))}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Start Date:</p>
          <p className="w-full sm:w-1/2">{convention.startDateTimeUtc && (DateTime.fromISO(convention.startDateTimeUtc).toLocaleString(DateTime.DATETIME_FULL))}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">End Date:</p>
          <p className="w-full sm:w-1/2">{convention.endDateTimeUtc && (DateTime.fromISO(convention.endDateTimeUtc).toLocaleString(DateTime.DATETIME_FULL))}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Venue:</p>
          <p className="w-full sm:w-1/2">{convention.venue?.name}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Location:</p>
          <p className="w-full sm:w-1/2">{convention.venue?.streetNumber} {convention.venue?.streetName}, {convention.venue?.city}, {convention.venue?.stateProvince} {convention.venue?.postalCode}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Last Updated Date:</p>
          <p className="w-full sm:w-1/2">{convention.updatedAtUtc && (DateTime.fromISO(convention.updatedAtUtc).toLocaleString(DateTime.DATETIME_FULL))}</p>
        </div>
        <div className="flex flex-wrap items-center">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Cancelled:</p>
          <p className="w-full sm:w-1/2">{convention.isCancelled ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Attendance Counts:</h2>
        <p>All Attendees: {attendeeCount.counts.allAttendees}</p>
        <p>Cancelled Attendees: {attendeeCount.counts.canceledAttendees}</p>
        <p>Checked In Attendees: {attendeeCount.counts.checkedInAttendees}</p>
        <p>Not Checked In Attendees: {attendeeCount.counts.notCheckedInAttendees}</p>
      </div>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Library Game Counts:</h2>
        <p>Games not played: {libraryReport.itemsNotPlayed.length}</p>
        <p>Games played: {libraryReport.itemsPlayed.length}</p>
      </div>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Play to Win Counts:</h2>
        <p>Total Play To Win Games: {playToWinReport.length}</p>
        <p>Games played at least once: {playToWinReport.reduce((acc, current) => acc + current.plays, 0)}</p>
        <p>Games not played: {playToWinReport.filter(g => g.plays === 0).length}</p>
        <p>Total Play to Win players: {playToWinReport.reduce((acc, current) => acc + current.totalPlayers, 0)}</p>
      </div>
    </main>
  )
}