import { DateTime } from "ts-luxon";
import EditConventionButton from "@/app/components/buttons/edit-convention-button";
import BackButton from "@/app/components/buttons/back-button";
import ViewPlayToWinGamesForConvention from "@/app/components/buttons/view-ptw-games-button";
import ViewAttendeesForConventionButton from "./view-attendees-button";
import { GetAttendeeCounts } from "@/app/api/report/[conventionId]/attendee/actions";
import { GetPlayToWinReportByConvention } from "@/app/api/report/[conventionId]/play-to-win/actions";
import { GetLibraryPlaytimeCounts } from "@/app/api/report/[conventionId]/library/actions";
import { IConvention } from "@repo/shared";
import ExportAttendeesButton from "../../components/buttons/export-attendees-button";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GetConventionById(id: number) {
  const conventionApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/convention/${id}`,
    {
      method: "GET",
      next: {
        tags: ["convention"],
        revalidate: 3600,
      },
    }
  );

  const convention: IConvention = await conventionApi.json();
  return convention;
}

export async function generateMetadata({ params }: Props) {
  const conventionId = Number((await params).id);
  const convention = await GetConventionById(conventionId);

  return {
    title: convention?.name,
  };
}

export default async function Page({ params }: Props): Promise<JSX.Element> {
  const conventionId = Number((await params).id);

  const convention = await GetConventionById(conventionId);
  const attendeeCount = await GetAttendeeCounts(conventionId);
  const libraryReport = await GetLibraryPlaytimeCounts(conventionId);
  const playToWinReport = await GetPlayToWinReportByConvention(conventionId);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">
        {convention?.name} Information
      </h1>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <div className="flex justify-end space-x-4">
          <BackButton />
          <EditConventionButton id={conventionId} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Event Details:</h2>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">
            Extra Hours Start Date:
          </p>
          <p className="w-full sm:w-1/2">
            {convention?.extraHoursStartDateTimeUtc &&
              DateTime.fromISO(convention.extraHoursStartDateTimeUtc.toString())
                .toLocal()
                .toLocaleString(DateTime.DATETIME_FULL)}
          </p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Start Date:</p>
          <p className="w-full sm:w-1/2">
            {convention?.startDateTimeUtc &&
              DateTime.fromISO(convention.startDateTimeUtc.toString())
                .toLocal()
                .toLocal()
                .toLocaleString(DateTime.DATETIME_FULL)}
          </p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">End Date:</p>
          <p className="w-full sm:w-1/2">
            {convention?.endDateTimeUtc &&
              DateTime.fromISO(convention.endDateTimeUtc.toString())
                .toLocal()
                .toLocaleString(DateTime.DATETIME_FULL)}
          </p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Venue:</p>
          <p className="w-full sm:w-1/2">{convention?.venue?.name}</p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Location:</p>
          <p className="w-full sm:w-1/2">
            {convention?.venue?.streetNumber} {convention?.venue?.streetName},{" "}
            {convention?.venue?.city}, {convention?.venue?.stateProvince}{" "}
            {convention?.venue?.postalCode}
          </p>
        </div>
        <div className="flex flex-wrap items-center mb-4">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Last Updated Date:</p>
          <p className="w-full sm:w-1/2">
            {convention?.updatedAtUtc &&
              DateTime.fromISO(convention.updatedAtUtc)
                .toLocal()
                .toLocaleString(DateTime.DATETIME_FULL)}
          </p>
        </div>
        <div className="flex flex-wrap items-center">
          <p className="w-full sm:w-1/2 mb-2 sm:mb-0">Cancelled:</p>
          <p className="w-full sm:w-1/2">
            {convention?.isCancelled ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-6 mb-8">
        <div className="flex justify-end space-x-4">
          <ExportAttendeesButton conventionId={conventionId} />
          <ViewAttendeesForConventionButton conventionId={conventionId} />
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
          <ViewPlayToWinGamesForConvention conventionId={conventionId} />
        </div>
        <h2 className="text-xl font-semibold mb-4">Play to Win Counts:</h2>
        <p>Total Play To Win Games: {playToWinReport?.length}</p>
        <p>
          Games played at least once:{" "}
          {playToWinReport?.reduce(
            (acc, current) => acc + (current.totalPlays > 0 ? 1 : 0),
            0
          )}
        </p>
        <p>
          Games not played:{" "}
          {playToWinReport?.filter((g) => g.totalPlays === 0).length}
        </p>
        <p>
          Total Play to Win players:{" "}
          {playToWinReport?.reduce(
            (acc, current) => acc + current.totalPlayerCount,
            0
          )}
        </p>
      </div>
    </main>
  );
}
