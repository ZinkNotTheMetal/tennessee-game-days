interface IAddAttendeeRequest {
  person: IPurchasingAttendee
  additionalAttendees: IPerson[] | undefined
  isStayingOnSite: boolean
  passPurchased: 'Free' | 'Individual' | 'Couple' | 'Family'
}

interface IPurchasingAttendee extends IPerson {
  phoneNumber: string
  email: string
  zipCode: string
  emergencyContact?: IEmergencyContact
}

interface IPerson {
  firstName: string
  lastName: string
  preferredName?: string
  email?: string
}

interface IEmergencyContact {
  name: string
  phoneNumber: string
  relationship: string
}

export type { IAddAttendeeRequest }