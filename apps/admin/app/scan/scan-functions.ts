interface BarcodeResponse {
  barcode: string
  entityType: 'Attendee' | 'PlayToWinItem' | 'LibraryItem',
  entityId: number
  isLibraryItemCheckedOut: boolean
  isUserCheckedIn: boolean
}

// Check scanned barcode
async function CheckBarcode(barcode: string) : Promise<BarcodeResponse | undefined> {
  const response = await fetch(
    `/api/barcode/scan/${barcode}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    console.log("CheckBarcode - full response", response)
    console.log("CheckBarcode - response status", response.status)
    return undefined
  }

  const data = await response.json()

  return {
    barcode: barcode,
    entityType: data.entityType,
    entityId: data.entityId,
    isLibraryItemCheckedOut: data.isCheckedOut,
    isUserCheckedIn: data.isUserCheckedIn
  }
}

// Check in LibraryItem
async function CheckInLibraryItem(libraryItemId: number) : Promise<number> {
  const response = await fetch(
    `/api/library/check-in/${libraryItemId}`,
    {
      method: "PUT",
      next: {
        tags: ['scanner']
      }
    }
  )
  if (!response.ok) {
    console.log(response.status)
    return response.status
  }

  return response.status
}

async function CheckInAttendee(attendeeId: number): Promise<number> {
  const response = await fetch(`/api/attendee/check-in/${attendeeId}`, {
      method: "PATCH",
      next: {
        tags: ['scanner']
      }
    },
  )
  if (!response.ok) {
    console.log(response.status)
    return response.status
  }
  return response.status
}

async function CheckOutLibraryItem(libraryItemId: number, attendeeId: number): Promise<number> {
  const response = await fetch(
    `/api/library/check-out`,
    {
      method: "POST",
      body: JSON.stringify({ libraryId: libraryItemId, attendeeId: attendeeId }),
      next: {
        tags: ['scanner']
      }
    }
  )
  if (!response.ok) {
    console.log(response.status)
    return response.status
  }
  return response.status

}

async function LogPlayToWinPlay(playToWinItemId: number, attendeeIds: number[]): Promise<{ status: number, alreadyAddedAttendees: { firstName: string, preferredName?: string, lastName: string, barcode: string}[]}> {
  const response = await fetch(
    `/api/play-to-win/log`,
    {
      method: "POST",
      body: JSON.stringify({ playToWinItemId: playToWinItemId, attendeeIds: attendeeIds }),
      next: {
        tags: ['scanner']
      }
    }
  )
  if (!response.ok) {
    return {
      status: response.status,
      alreadyAddedAttendees: []
    }
  }

  const data = await response.json()
  const alreadyAddedAttendees = data.alreadyPlayedAttendees.map((attendee: AlreadyPlayedAttendee) => ({
    firstName: attendee.attendee.person.firstName,
    preferredName: attendee.attendee.person.preferredName,
    lastName: attendee.attendee.person.lastName,
    barcode: attendee.attendee.barcode
  }));

  return {
    status: response.status,
    alreadyAddedAttendees: alreadyAddedAttendees
  }

}

export interface AlreadyPlayedAttendee {
  attendeeId: number
  attendee: Attendee
}

export interface Attendee {
  barcode: string
  person: Person
}

export interface Person {
  firstName: string
  preferredName?: string
  lastName: string
}


export { CheckBarcode, CheckInLibraryItem, CheckOutLibraryItem, LogPlayToWinPlay, CheckInAttendee }
export type { BarcodeResponse }