import { IPerson } from "./add-attendee-request";

interface IAddAttendeeWithRequest {
  people: IPerson[] | undefined
  isVolunteer: boolean
  isStayingOnSite: boolean
  passPurchased: "Free" | "Individual" | "Couple" | "Family";
}

export type { IAddAttendeeWithRequest }