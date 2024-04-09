import { IConvention } from "@repo/shared";

export async function getConventionById(id: number) {
  const conventionByIdApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/convention/${id}`,
    {
      method: "GET",
      cache: 'no-store',
    }
  );

  const item: IConvention = await conventionByIdApi.json();
  return item;
}

interface IAttendeeReport {
  conventionId: number
  counts: {
    allAttendees: number
    checkedInAttendees: number
    canceledAttendees: number
    notCheckedInAttendees: number
  }
}

export async function getAttendeeReport(id: number) {
  const conventionByIdApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/report/${id}/attendee`,
    {
      method: "GET",
      cache: 'no-store',
    }
  )

  const item: IAttendeeReport = await conventionByIdApi.json();
  return item;
}

interface ILibraryReportItem {
  barcode: string
  owner: string
  totalCheckedOutMinutes: number
  name: string
}

interface INotPlayedItem extends ILibraryReportItem {}
interface IPlayedItem extends ILibraryReportItem {
  totalTimeCheckedOut: number
  conferenceTimeCheckOut: number
}

interface ILibraryReport {
  itemsPlayed: IPlayedItem[]
  itemsNotPlayed: INotPlayedItem[]
}

export async function getLibraryReport(id: number) {
  const libraryGamesByConventionApi = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/report/${id}/library`,
    {
      method: "GET",
      cache: 'no-store',
    }
  )

  const item: ILibraryReport = await libraryGamesByConventionApi.json();
  return item;
}