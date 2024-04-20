interface IPerson {
  id: number
  firstName: string
  preferredName: string
  lastName: string
  email: string
  phoneNumber: string
  zipCode: string
  dateAdded: string // ISO UTC
  emergencyContactName: string
  emergencyContactPhoneNumber: string
  emergencyContactRelationship: string
  relatedTo: IPerson
}

export type { IPerson }