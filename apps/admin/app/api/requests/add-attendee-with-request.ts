import { IPerson } from "./add-attendee-request";

interface IAddAttendeeWithRequest {
  people: IPerson[] | undefined;
  isStayingOnSite: boolean;
  passPurchased: "Free" | "Individual" | "Couple" | "Family";
}

export type { IAddAttendeeWithRequest }