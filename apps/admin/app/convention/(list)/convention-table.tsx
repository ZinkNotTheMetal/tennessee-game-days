"use client"

import { IConvention } from "@repo/shared"
import { useRouter } from "next/navigation"

const ConventionStatus = (isCanceled: boolean, startDateTimeUtc?: string, endDateTimeUtc?: string) : "Canceled" | "Happening" | "Scheduled" | "Upcoming" | "Completed" => {
  if (isCanceled) return 'Canceled'
  if (!startDateTimeUtc) return 'Upcoming'
  // if (startDateTimeUtc && endDateTimeUtc
  //   && DateTime.fromISO(startDateTimeUtc) < DateTime.utc()
  //   && DateTime.fromISO(endDateTimeUtc) > DateTime.utc()
  //   ) return 'Happening'
  // if (endDateTimeUtc && DateTime.fromISO(endDateTimeUtc) < DateTime.utc()) return 'Completed'

  return 'Scheduled'
}

interface ConventionTableProps {
  conventions: IConvention[]
  total: number
}

export function ConventionTable({conventions, total}: ConventionTableProps): JSX.Element {

  return(
    <div className="shadow-lg rounded-lg overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg">
        <ConventionHeader />

        <tbody>

          {conventions.map(convention => (
            <ConventionRow {...convention} />
          ))}

        </tbody>
      </table>
    </div>
  )
}

function ConventionHeader() : JSX.Element {
  return (
    <thead>
      <tr>
        <th className='py-4 px-6 border-b text-left'>Name</th>
        <th className='py-4 px-6 border-b text-left'>Start Date</th>
        <th className='py-4 px-6 border-b text-left'>End Date</th>
        <th className='py-4 px-6 border-b text-left'>Venue</th>
        <th className='py-4 px-6 border-b text-left'>Status</th>
        <th className='py-4 px-6 border-b text-left'>Days Remaining</th>
        <th className='py-4 px-6 border-b text-left'>&nbsp;</th>
      </tr>
    </thead>
  )
}

interface ConventionRowProps {
  id: number,
  name: string,
  startDateTimeUtc?: string,
  endDateTimeUtc?: string,
  isCanceled: boolean
}

function ConventionRow({ id, name, startDateTimeUtc, endDateTimeUtc, isCanceled }: ConventionRowProps) {
  const router = useRouter()

  return (
    <tr
      className="hover:bg-slate-200"
      key={id}
      onClick={() => router.push(`/conventions/edit/${id}`)}
    >
      <td className="py-4 px-6 border-b">{name}</td>
    </tr>
  )

}


// function ConventionRow({ convention, status}: RowProps): JSX.Element {
//   const { id, name, startDateTimeUtc, endDateTimeUtc, venue } = convention

//   return (
//     <tr className='hover:bg-slate-200' key={id}>
//       <td className="py-4 px-6 border-b">{ name }</td>
//       <td className="py-4 px-6 border-b">
//         { startDateTimeUtc !== undefined && startDateTimeUtc.length > 0 && (
//           <>
//             { DateTime.fromISO(startDateTimeUtc, { zone: 'America/Chicago' }).toLocaleString() }
//           </>
//         ) }
//       </td>
//       <td className="py-4 px-6 border-b">
//       { endDateTimeUtc !== undefined  && endDateTimeUtc.length > 0 && (
//           <>
//             { DateTime.fromISO(endDateTimeUtc, { zone: 'America/Chicago' }).toLocaleString() }
//           </>
//         ) }
//       </td>
//       <td className="py-4 px-6 border-b">{ venue }</td>
//       <td className="py-4 px-6 border-b">{ status }</td>
//       <td className="py-4 px-6 border-b">
//         { startDateTimeUtc !== undefined && (
//           <>
//           { DateTime.fromISO(startDateTimeUtc, { zone: 'America/Chicago' }).diff(DateTime.now(), 'days').days >= 0 && (
//             DateTime.fromISO(startDateTimeUtc, { zone: 'America/Chicago' }).diff(DateTime.now(), 'days').days.toFixed(0)
//           )}
//           { DateTime.fromISO(startDateTimeUtc, { zone: 'America/Chicago' }).diff(DateTime.now(), 'days').days < 0 && (
//             <span>Past</span>
//           )}
//           </>
//         )}
//       </td>
//       <td className="py-4 px-6 border-b">
//         <Link href={`/convention/edit/${id}`}>
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </Link>
//       </td>
//     </tr>
//   )
// }
