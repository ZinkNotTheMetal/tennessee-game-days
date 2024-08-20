"use client";

import { useEffect, useState } from "react"
import { BarcodeResponse, CheckBarcode, CheckInAttendee, CheckInLibraryItem, CheckOutLibraryItem, LogPlayToWinPlay } from "./scan-functions"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { FaPerson, FaRegTrashCan, FaTicket } from "react-icons/fa6"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import useSound from "use-sound";
import { IoLibrary } from "react-icons/io5";

export default function ScanningTerminalClient() {

  const router = useRouter()
  const [barcodeResults, setBarcodeResults] = useState<BarcodeResponse[]>([])
  const [ playErrorChime ] = useSound("/sounds/checkout-error.mp3")
  const [ playCompleteChime ] = useSound("/sounds/complete-chime.mp3")

  // React Hook Form
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

  // useEffect that dynamically checks the data and submits when ready
  useEffect(() => {
    const scannedAttendees = barcodeResults.filter(f => f.entityType === 'Attendee')
    const scannedPlayToWinItems = barcodeResults.filter(f => f.entityType === 'PlayToWinItem')
    const scannedLibraryItems = barcodeResults.filter(f => f.entityType == 'LibraryItem')

    const duplicateAttendeesScanned = scannedAttendees.some((attendee, index, array) => 
      array.findIndex(a => a.entityId === attendee.entityId) !== index)
    const duplicatePlayToWinItems = scannedPlayToWinItems.some((ptwItem, index, array) => 
      array.findIndex(a => a.entityId === ptwItem.entityId) !== index
    )

    // 1. Library game and a user scanned (potentially not checked in)
    if (scannedAttendees[0] && scannedAttendees.length === 1 && scannedLibraryItems.length === 1 && scannedLibraryItems[0] && !scannedLibraryItems[0].isLibraryItemCheckedOut) {
      const scannedAttendee = scannedAttendees[0]

      if (!scannedAttendee.isUserCheckedIn) {
        CheckInAttendee(scannedAttendee.entityId)
          .then((response) => {
            if (response === 200) {
              toast(`Successfully checked in user ${scannedAttendee.barcode}`, { type: "success" })
              handleSubmit(onSubmit)()
            } else {
              toast(`Failed to check in user ${scannedAttendee.barcode}`, { type: "error" })
              playErrorChime()
            }
          })
      } else {
        handleSubmit(onSubmit)()
      }
    }
    // 2. library game that has been checked out (just checking back in)
    // TODO: Valid Scenario? Person brings back a game without checking it in, then someone else tries to check it out... this won't work well for that
    else if (scannedLibraryItems.length === 1 && scannedLibraryItems[0] && scannedLibraryItems[0].isLibraryItemCheckedOut) {
      handleSubmit(onSubmit)()
    }

    // 3. Register Play to Win play
    else if (duplicateAttendeesScanned || duplicatePlayToWinItems) {
      handleSubmit(onSubmit)()
    }

    // 4. Clear and reset to last if multiple library games are scanned
    
    if ((scannedPlayToWinItems.length >= 1 && scannedLibraryItems.length >= 1) || scannedLibraryItems.length > 1) {
      // Remove the last one
      const lastBarCodeResult = scannedLibraryItems.slice(-1)[0]
      // Find the index of the last scanned library item in barcodeResults
      const indexToRemove = barcodeResults.findIndex(
        (result) => result.barcode === lastBarCodeResult?.barcode // Assuming each result has a unique id
      );

      remove(indexToRemove)
      setBarcodeResults((prevResults) => 
        prevResults.filter((_, index) => index !== indexToRemove)
      )
    }

  }, [barcodeResults])

  const getBarcodeInformation = async (barcodeScanned: string, barcodeFieldIndex: number): Promise<string | undefined> => {
    // Ensure that no spaces are in front or at the end of the barcode
    const trimmedBarcode = barcodeScanned.trim()

    // See if the barcode has already been scanned or not
    if (!(barcodeResults.find(f => f.barcode === trimmedBarcode))) {
      const barcodeScannedResponse = await CheckBarcode(trimmedBarcode)
      if (barcodeScannedResponse?.barcode) {

        setBarcodeResults((previous) => [...previous, barcodeScannedResponse])
        append({ barcode: '' })

      }

      return barcodeScannedResponse?.entityType
    } else {
      // If it has, remove the barcode - submit it
      remove(barcodeFieldIndex)
      append({ barcode: '' })
      handleSubmit(onSubmit)()
    }

  }

  const onSubmit: SubmitHandler<{ barcodes: { barcode: string; }[]; }> = async (data) => {
    console.log('submitted', data)

    const scannedLibraryItems = barcodeResults.filter(f => f.entityType === 'LibraryItem')
    const scannedPlayToWinGames = barcodeResults
    .filter(f => f.entityType === 'PlayToWinItem')
    .filter((attendee, index, array) => 
      array.findIndex(a => a.entityId === attendee.entityId) === index)

    const scannedAttendees = barcodeResults
      .filter(f => f.entityType === 'Attendee')
      .filter((attendee, index, array) => 
        array.findIndex(a => a.entityId === attendee.entityId) === index)
    

    // 1. Library game and a user scanned
    if (scannedAttendees.length === 1 && scannedAttendees[0] && scannedLibraryItems.length === 1 && scannedLibraryItems[0] && !scannedLibraryItems[0]?.isLibraryItemCheckedOut) {
      try {
        const result = await CheckOutLibraryItem(scannedLibraryItems[0].entityId, scannedAttendees[0]?.entityId)
        if (result === 200) {
          toast(`Successfully checked out ${scannedLibraryItems[0].barcode} to ${scannedAttendees[0]?.barcode}`, { type: "success" })
          playCompleteChime()
        } else {
          toast(`Failed to check out - ${scannedAttendees[0]?.barcode} already has an item checked out!`)
          playErrorChime()
        }
      } catch (error) {
        console.log(error)
        playErrorChime()
        toast(`Failed to check out check ${scannedLibraryItems[0].barcode} to ${scannedAttendees[0]?.barcode} - check the error logs`, { type: "error" })
      }
      // 2. Scan game back in after 
    } else if (scannedLibraryItems.length === 1 && scannedLibraryItems[0]?.isLibraryItemCheckedOut) {
      try {
        const result = await CheckInLibraryItem(scannedLibraryItems[0].entityId)
        if (result === 200) {
          toast(`Successfully checked ${scannedLibraryItems[0].barcode} game back into library `, { type: "success" })
          playCompleteChime()
        } else {
          toast(`Failed to check ${scannedLibraryItems[0].barcode} back into library`)
          playErrorChime()
        }
      } catch (error) {
        console.log(error)
        playErrorChime()
        toast(`Failed to check library game ${scannedLibraryItems[0].barcode} back into the library - check the error logs`, { type: "error" })
      }
      // 3. Handle play to win plays
    } else if (scannedPlayToWinGames.length === 1 && scannedPlayToWinGames[0] && scannedAttendees.length >= 1) {
      try {
        const result = await LogPlayToWinPlay(scannedPlayToWinGames[0]?.entityId, scannedAttendees.map(m => m.entityId))
        toast(`Successfully logged Play to Win play ${scannedPlayToWinGames[0].barcode} for ${scannedAttendees.length} ${scannedAttendees.length === 1 ? 'attendee' : 'attendees'}`, { type: "success" })
        playCompleteChime()
      } catch(error) {
        playErrorChime()
        toast(`Failed to log Play to Win play - ${scannedPlayToWinGames[0].barcode} for ${scannedAttendees.length} ${scannedAttendees.length === 1 ? 'attendee' : 'attendees'}`)
      }
    }

    setBarcodeResults([])
    reset()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {fields.map(({ id }, index) => (
        <div key={index} className="py-2 flex items-center">
          <div className="relative w-full">
            <input
              className="w-full p-2 pr-10 border border-gray-300 rounded" // Adjusted padding for icon space
              placeholder="Enter or scan a barcode"
              {...register(`barcodes.${index}.barcode`)}
              key={id}
              onChange={(e) => {
                if (e.target.value.trim() === '') {
                  remove(index)
                  setBarcodeResults((prevResults) => 
                    prevResults.filter((_, idx) => idx !== index)
                  );
                } else {
                  getBarcodeInformation(e.target.value, index)
                }                
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit)()
                }
              }}
            />
            { barcodeResults[index]?.entityType === 'Attendee' && (
              <FaPerson className="absolute inset-y-1.5 right-0 flex items-center pr-3 h-8 w-8 text-green-500"/>
            )}
            { barcodeResults[index]?.entityType === 'PlayToWinItem' && (
              <FaTicket className="absolute inset-y-1 right-0 flex items-center pr-3 text-green-500" fontSize={35} />
            )}
            { barcodeResults[index]?.entityType === 'LibraryItem' && (
              <IoLibrary className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500" fontSize={40} />
            )}
          </div>
          {index === 0 ? (
            <span className="w-4 h-4">&nbsp;</span>
          ) : (
            <button
              type="button"
              key={`${id}-btn`}
              onClick={(e) => {
                e.preventDefault();
                remove(index);
                // Remove the barcode from barcodeResults
                setBarcodeResults((previous) => {
                  const updatedResults = [...previous];
                  updatedResults.splice(index, 1); // Remove the barcode at the specified index
                  return updatedResults;
                });
              }}
              className="w-4 h-4"
            >
              <FaRegTrashCan />
            </button>
          )}
        </div>
      ))}

    </form>

  )
}
