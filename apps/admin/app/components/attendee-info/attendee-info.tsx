
interface ConventionAttendeeInformationProps {
  total: number
  cancelled: number
  volunteers: number
  checkedIn: number
}

export default function ConventionAttendeeInformation({ total, cancelled, volunteers, checkedIn }: ConventionAttendeeInformationProps) : JSX.Element {

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md text-xl divide-y-4">
      <h2 className="text-2xl mb-4 text-blue-500">Attendee Information</h2>
      <span className="block">Total: {total}</span>
      <span className="block">Cancelled: {cancelled}</span>
      <span className="block">Volunteers: {volunteers}</span>
      <span className="block">Checked In: {checkedIn}</span>
    </div>
  )
}
