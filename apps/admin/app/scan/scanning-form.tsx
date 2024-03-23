"use client";

import { useEffect, useState } from "react";
import { BarcodeResponse, CheckBarcode, CheckInLibraryItem, CheckOutLibraryItem } from "./scan-functions";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";

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
    // Scenarios:
    // 1. If a library game that is checked out is scanned
    if (scannedLibraryItem && scannedLibraryItem.isLibraryItemCheckedOut) {
      CheckInLibraryItem(scannedLibraryItem.entityId)
        .then((response) => {
          if (response === 200) {
            toast(`Successfully checked in ${scannedLibraryItem.barcode}`, { type: "success" })
          }
        })
      setBarcodeResults([])
      reset()
    }

    const scannedAttendees = barcodeResults.filter(f => f.entityType === 'Attendee')
    
    // 2. If an attendee and library item (not checked out) are scanned in any order
    if (scannedLibraryItem && scannedAttendees.length === 1 && scannedAttendees[0]) {
      CheckOutLibraryItem(scannedLibraryItem.entityId, scannedAttendees[0].entityId)
        .then((response) => {
          if (response === 200) {
            toast(`Successfully checked out ${scannedLibraryItem.barcode}`, { type: "success" })
          } else if (response === 420) {
            toast(`Unable to check out game, as the user already has a game checked out!`, { type: "error" })
          }
        })
      setBarcodeResults([])
      reset()
    }

    const scannedPlayToWinGame = barcodeResults.find(f => f.entityType === 'PlayToWinItem')
    if (scannedLibraryItem && scannedAttendees) {
      
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
    const trimmedBarcode = barcodeScanned.trim()

    if (!(barcodeResults.find(f => f.barcode === trimmedBarcode))) {
      const barcodeScannedResponse = await CheckBarcode(trimmedBarcode)
      setBarcodeResults((previous) => [...previous, barcodeScannedResponse])
      append({ barcode: '' })
    } else {
      remove(barcodeFieldIndex)
      append({ barcode: '' })
    }

  }

  const onSubmit: SubmitHandler<{ barcodes: { barcode: string; }[]; }> = async (data) => {

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
          />
          <button type="button" 
            key={`${id}-btn`}
            onClick={(e) => {
              e.preventDefault();
              // Remove the barcode from barcodeResults
              setBarcodeResults(previous => {
                const updatedResults = [...previous];
                updatedResults.splice(index, 1); // Remove the barcode at the specified index
                return updatedResults;
              });
              // Remove the field using useFieldArray's remove function
              remove(index);
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
