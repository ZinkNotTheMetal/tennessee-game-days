interface IAddAttendeeRequest {
  barcode: string
  firstName: string
  preferredName?: string
  lastName: string
  phoneNumber?: string
  email?: string
  isStayingAtConvention: Boolean
}

export type { IAddAttendeeRequest }