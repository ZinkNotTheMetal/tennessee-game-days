"use client"

import { IConvention } from "@repo/shared"
import { IVenue } from "@repo/shared/src/interfaces/venue"
import { useRouter } from "next/navigation"
import { DateTime } from 'ts-luxon'

const ConventionStatus = (isCancelled: boolean, startDateTimeUtc?: string, endDateTimeUtc?: string) : string => {
  if (isCancelled) return 'Canceled'
  if (!startDateTimeUtc || !endDateTimeUtc) return 'Upcoming'

  const daysUntilStart = DateTime.fromISO(startDateTimeUtc).diff(DateTime.now(), 'days').days
  const daysUntilEnd = DateTime.fromISO(endDateTimeUtc).diff(DateTime.now(), 'days').days

  console.log("until", daysUntilStart)
  console.log("end", daysUntilEnd)

  if (daysUntilStart >= 0) return `${daysUntilStart.toFixed(0)} days from now`
  if (daysUntilStart <= 0 && daysUntilEnd >= 0) return "Happening"
  if (daysUntilEnd < 0) return "Completed"

  return 'Scheduled'

}

interface ConventionTableProps {
  conventions: IConvention[]
  total: number
}

export function ConventionTable({conventions, total}: ConventionTableProps): JSX.Element {

  return(
    <div className="">
      <table className="min-w-full divide-y-0 divide-gray-300 bg-white rounded-t-xl rounded-b-xl">
        <thead>
          <ConventionHeader />
        </thead>

        <tbody>

          {conventions.map(convention => (
            <ConventionRow key={convention.id} {...convention} />
          ))}

        </tbody>
      </table>
    </div>
  )
}

function ConventionHeader() : JSX.Element {
  return (
    <>
      <tr>
        <th className='py-4 px-6 border-b text-gray-500'>Name</th>
        <th className='py-4 px-6 border-b text-gray-500'>Venue Name</th>
        <th className='py-4 px-6 border-b text-gray-500'>Start Date</th>
        <th className='py-4 px-6 border-b text-gray-500'>End Date</th>
        <th className='py-4 px-6 border-b text-gray-500'>Status</th>
      </tr>
    </>
  )
}

interface ConventionRowProps {
  id: number,
  name: string,
  startDateTimeUtc?: string,
  endDateTimeUtc?: string,
  isCancelled: boolean,
  venue?: IVenue
}

function ConventionRow({ id, name, startDateTimeUtc, endDateTimeUtc, isCancelled, venue }: ConventionRowProps) {
  const router = useRouter()

  const localStartTimeDisplay = (startDateTimeUtc !== undefined && startDateTimeUtc !== null) && DateTime.fromISO(startDateTimeUtc).toLocal() || undefined
  const localEndDateTimeDisplay = (endDateTimeUtc !== undefined && endDateTimeUtc !== null) && DateTime.fromISO(endDateTimeUtc).toLocal() || undefined

  return (
    <tr
      className="border-b hover:bg-blue-100 hover:cursor-pointer text-center"
      key={id}
      onClick={() => router.push(`/convention/${id}`)}
    >
      <td className="py-4 px-6 border-b">{name}</td>
      <td className="py-4 px-6 border-b">{venue?.name}</td>
      <td className="py-4 px-6 border-b">{localStartTimeDisplay?.toLocaleString()}</td>
      <td className="py-4 px-6 border-b">{localEndDateTimeDisplay?.toLocaleString()}</td>
      <td className="py-4 px-6 border-b">{ConventionStatus(isCancelled, startDateTimeUtc, endDateTimeUtc)}</td>
    </tr>
  )

}
