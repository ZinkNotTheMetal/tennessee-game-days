"use client";

import { useEffect, useState } from "react"
import { BarcodeResponse, CheckBarcode, CheckInLibraryItem, CheckOutLibraryItem, LogPlayToWinPlay } from "./scan-functions"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { FaRegTrashCan } from "react-icons/fa6"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import useSound from "use-sound";

export default function ScanningTerminalClient() {

  const [barcodeResults, setBarcodeResults] = useState<BarcodeResponse[]>([])
  const router = useRouter()
  const [ playErrorChime ] = useSound("/sounds/checkout-error.mp3")
  const [ playCompleteChime ] = useSound("/sounds/complete-chime.mp3")

  useEffect(() => {

    const scannedLibraryItem = barcodeResults.find(f => f.entityType === 'LibraryItem')
    // Scenarios:
    // 1. If a library game that is checked out is scanned
    if (scannedLibraryItem && scannedLibraryItem.isLibraryItemCheckedOut) {
      CheckInLibraryItem(scannedLibraryItem.entityId)
        .then((response) => {
          if (response === 200) {
            toast(`Successfully checked in ${scannedLibraryItem.barcode}`, { type: "success" })
            playCompleteChime()
          }
        })
        .finally(() => {
          setBarcodeResults([])
          reset()
          router.refresh()
        })
    }

    const scannedAttendees = barcodeResults.filter(f => f.entityType === 'Attendee')
    
    // 2. If an attendee and library item (not checked out) are scanned in any order
    if (scannedLibraryItem && scannedAttendees.length === 1 && scannedAttendees[0]) {
      CheckOutLibraryItem(scannedLibraryItem.entityId, scannedAttendees[0].entityId)
        .then((response) => {
          if (response === 200) {
            toast(`Successfully checked out ${scannedLibraryItem.barcode}`, { type: "success" })
            playCompleteChime()
          } else if (response === 420) {
            toast(`Unable to check out game, as the user already has a game checked out!`, { type: "error" })
            playErrorChime()
          }
        })
        .finally(() => {
          setBarcodeResults([])
          reset()
          router.refresh()
        })
    }

  }, [barcodeResults])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      barcodes: [{ barcode: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "barcodes"
  })

  const getBarcodeInformation = async (barcodeScanned: string, barcodeFieldIndex: number) => {
    // Ensure that no spaces are in front or at the end of the barcode
    const trimmedBarcode = barcodeScanned.trim()

    // See if the barcode has already been scanned or not
    if (!(barcodeResults.find(f => f.barcode === trimmedBarcode))) {
      const barcodeScannedResponse = await CheckBarcode(trimmedBarcode)
      if (barcodeScannedResponse?.barcode) {

        setBarcodeResults((previous) => [...previous, barcodeScannedResponse])
        append({ barcode: '' })

      }
    } else {
      // If it has, remove the barcode - submit it
      remove(barcodeFieldIndex)
      append({ barcode: '' })
      handleSubmit(onSubmit)()
    }

  }

  const onSubmit: SubmitHandler<{ barcodes: { barcode: string; }[]; }> = async (data) => {
    // 3. If an attendee and a play to win game are scanned in any order
    const scannedPlayToWinGame = barcodeResults.find(f => f.entityType === 'PlayToWinItem')
    const scannedAttendees = barcodeResults.filter(f => f.entityType === 'Attendee')

    if (scannedPlayToWinGame === undefined) return

    await LogPlayToWinPlay(scannedPlayToWinGame.entityId, scannedAttendees.map(m => m.entityId))

    setBarcodeResults([])
    reset()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      { fields.map(({ id }, index) => (
        <div key={id} className="py-2 flex items-center">
          <input
            className="w-full p-2 mr-2 border border-gray-300 rounded"
            placeholder="Enter or scan a barcode"
            {...register(`barcodes.${index}.barcode`)}
            key={id} // important to include key with field's id
            onChange={(e) => {
              getBarcodeInformation(e.target.value, index)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                console.log('hi')
                handleSubmit(onSubmit)()
              }
            }}
          />
          <button type="button" 
            key={`${id}-btn`}
            onClick={(e) => {
              e.preventDefault()
              remove(index)
              append({ barcode: ''})
              // Remove the barcode from barcodeResults
              setBarcodeResults(previous => {
                const updatedResults = [...previous];
                updatedResults.splice(index, 1); // Remove the barcode at the specified index
                return updatedResults;
              })
            }}
            className="w-4 h-4"
          >
            <FaRegTrashCan />
          </button>
        </div>
      ))}

    </form>
  )
}
