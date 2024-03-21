"use client";

import { ChangeEvent, useState } from "react";
import { CheckBarcode } from "./scan-functions";

export default function ScanningTerminalClient() {
  const [scannedItems, setScannedItems] = useState<{ barcode: string, type: string }[]>([]);
  const [currentBarcode, setCurrentBarcode] = useState<string>('');

  const handleScan = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setCurrentBarcode(value)

    if (value.trim() === "") return // Prevent scanning empty barcode

    const response = await CheckBarcode(value)

    switch (response.entityType) {
      case 'LibraryItem':
        if (response.isLibraryItemCheckedOut) {
          // Check in the game
        } else {
          // Wait for barcode
        }
        break
      case 'Attendee':
        // Add new barcode box
        break
      case 'PlayToWinItem':
        break

      default:
        console.log('Nothing planned yet')
        break
    }

    console.log(response)

    setScannedItems((prevItems) => [...prevItems, { barcode: value, type: response.entityType }])
    setCurrentBarcode('')
  }

  return (
    <div>

      <input
        type="text"
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        placeholder="Scan or enter barcode..."
        value={currentBarcode}
        onChange={handleScan}
      />

      { JSON.stringify(scannedItems)}

    </div>

  );
}
