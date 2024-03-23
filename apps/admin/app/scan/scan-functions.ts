interface BarcodeResponse {
  barcode: string
  entityType: 'Attendee' | 'PlayToWinItem' | 'LibraryItem',
  entityId: number
  isLibraryItemCheckedOut: boolean
}

// Check scanned barcode
async function CheckBarcode(barcode: string) : Promise<BarcodeResponse | undefined> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/barcode/scan/${barcode}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    console.log("Check barcode response", response)
    console.log("Barcode response status", response.status)
    return undefined
  }

  const data = await response.json()

  console.log("scanned barcode data:", data)

  return {
    barcode: barcode,
    entityType: data.entityType,
    entityId: data.entityId,
    isLibraryItemCheckedOut: data.isCheckedOut
  }
}

// Check in LibraryItem
async function CheckInLibraryItem(libraryItemId: number) : Promise<number> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/library/check-in/${libraryItemId}`,
    {
      method: "PUT",
    }
  )
  if (!response.ok) {
    console.log(response.status)
    return response.status
  }

  return response.status
}

async function CheckOutLibraryItem(libraryItemId: number, attendeeId: number): Promise<number> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/library/check-out`,
    {
      method: "POST",
      body: JSON.stringify({ libraryId: libraryItemId, attendeeId: attendeeId })
    }
  )
  if (!response.ok) {
    console.log(response.status)
    return response.status
  }
  return response.status

}

async function LogPlayToWinPlay(playToWinItemId: number, attendeeIds: number[]): Promise<number> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/play-to-win/log`,
    {
      method: "POST",
      body: JSON.stringify({ playToWinItemId: playToWinItemId, attendeeIds: attendeeIds })
    }
  )
  if (!response.ok) {
    console.log(response.status)
    return response.status
  }
  return response.status

}

export { CheckBarcode, CheckInLibraryItem, CheckOutLibraryItem, LogPlayToWinPlay }
export type { BarcodeResponse }