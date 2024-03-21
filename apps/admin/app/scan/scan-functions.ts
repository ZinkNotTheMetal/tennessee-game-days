interface BarcodeResponse {
  barcode: string
  entityType: 'Attendee' | 'PlayToWinItem' | 'LibraryItem'
  isLibraryItemCheckedOut: boolean
}

// Check scanned barcode
async function CheckBarcode(barcode: string) : Promise<BarcodeResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_URL}/api/barcode/scan/${barcode}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json()

  console.log(data)

  return {
    barcode: data.barcodeScanned.barcode,
    entityType: data.barcodeScanned?.entityType,
    isLibraryItemCheckedOut: data?.isCheckedOut
  }
}

// Check in LibraryItem
async function CheckInLibraryItem(barcode: string) {
  // End event
  // Add minutes to
}

export { CheckBarcode }