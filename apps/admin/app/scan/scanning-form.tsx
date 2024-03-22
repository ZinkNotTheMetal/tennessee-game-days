"use client";

import { useEffect, useState } from "react";
import { BarcodeResponse, CheckBarcode, CheckInLibraryItem, CheckOutLibraryItem } from "./scan-functions";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { FaRegTrashCan } from "react-icons/fa6";

export default function ScanningTerminalClient() {

  // Can we submit via a function rather than button on submit
  //  - Submitting after 1 textbox if library item checked out
  //  - Submitting after 2 textboxes if library item is not checked out and attendee scanned
  //  - We can call handleSubmit programatically to 
  // Can we dynamically add fields to the form and give it focus
  //  - Add new textbox to be scanned if scenario 2
  //  - Add N amount of textboxes everytime scanned until submitted
  // How to have the website make a noise on status code 420
  //  - https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/
  //  - https://www.youtube.com/watch?v=8sDto47tLfE
  //  - Accepted?
  //    - https://freesound.org/people/tim.kahn/sounds/91926/
  //    - https://freesound.org/people/zerolagtime/sounds/144418/
  //    - https://freesound.org/people/Scrampunk/sounds/345299/
  //    - https://freesound.org/people/FoolBoyMedia/sounds/352661/
  //  - Error?
  //    - https://freesound.org/people/MrAngelGames/sounds/674824/
  //    - https://freesound.org/people/rakkarage/sounds/516905/
  //    - https://freesound.org/people/Autistic%20Lucario/sounds/142608/
  //    - https://freesound.org/people/guitarguy1985/sounds/57806/
  // Next is to pick from above and get them to mp3

  const [barcodeResults, setBarcodeResults] = useState<BarcodeResponse[]>([])

  useEffect(() => {
    const scannedLibraryItem = barcodeResults.find(f => f.entityType === 'LibraryItem')
    const scannedAttendee = barcodeResults.find(f => f.entityType === 'Attendee')
    const scannedPlayToWin = barcodeResults.find(f => f.entityType === 'PlayToWinItem')

    if (scannedLibraryItem?.entityType === 'LibraryItem' && scannedLibraryItem?.isLibraryItemCheckedOut) {
      const status = CheckInLibraryItem(scannedLibraryItem?.entityId)
        .then(() => {
          reset()
        })
    }

    if (scannedLibraryItem && scannedAttendee) {
      console.log(" Got here!")
      CheckOutLibraryItem(scannedLibraryItem.entityId, scannedAttendee.entityId)
        .then((response) => {
          console.log("check out status", response)
          setBarcodeResults([])
          reset()
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

  const determineScan = async (barcodeScanned: string) => {
    console.log(barcodeScanned)

    const barcodeScannedResponse = await CheckBarcode(barcodeScanned)
    setBarcodeResults((previous) => [...previous, barcodeScannedResponse])

    // // If it's a checked out game, just check it back in and reset
    // if (barcodeScannedResponse.entityType === 'LibraryItem' && barcodeScannedResponse.isLibraryItemCheckedOut) {
    //   const status = await CheckInLibraryItem(barcodeScannedResponse.entityId)
    //   reset()
    // }

    // const scannedLibraryItem = barcodeResults.find(f => f.entityType === 'LibraryItem')
    // const scannedAttendee = barcodeResults.find(f => f.entityType === 'Attendee')
    // const scannedPlayToWin = barcodeResults.find(f => f.entityType === 'PlayToWinItem')

    // console.log("scannedLibraryItem", scannedLibraryItem)

    // if (scannedLibraryItem && scannedAttendee) {
    //   console.log(" Got here!")
    //   const status = await CheckOutLibraryItem(scannedLibraryItem.entityId, scannedAttendee.entityId)

    //   setBarcodeResults([])
    //   reset()
    // }

    append({ barcode: '' })

  }

  const onSubmit: SubmitHandler<{ barcodes: { barcode: string; }[]; }> = async (data) => {

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      { fields.map(({ id }, index) => (
        <div className="py-2 flex items-center">
          <input
            className="w-full p-2 mr-2 border border-gray-300 rounded"
            placeholder="Enter or scan a barcode"
            {...register(`barcodes.${index}.barcode`)}
            key={id} // important to include key with field's id
            onChange={(e) => {
              determineScan(e.target.value)
            }}
          />
          <button type="button" 
            key={`${id}-btn`}
            onClick={(e) => {
              e.preventDefault()
              remove(index)
            }}
            className="w-4 h-4"
          >
            <FaRegTrashCan />
          </button>
        </div>
      ))}

      <button onClick={(e) => {
        e.preventDefault()
        append({ barcode: '' })
      }}>Add field</button>


      { JSON.stringify(barcodeResults)}

    </form>
  )
}
