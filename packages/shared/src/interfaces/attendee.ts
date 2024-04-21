import { IPerson } from "./person"

interface IAttendee {
  id: number
  barcode: string
  isCheckedIn: boolean
  hasCancelled: boolean
  isStayingOnSite: boolean
  checkedInUtc: string // ISO UTC
  dateRegistered: string // ISO UTC
  isVolunteer: boolean
  isTgdOrganizer: boolean
  passPurchased: "Free" | "Individual" | "Couple" | "Family"
  person: IPerson
}

export type { IAttendee }