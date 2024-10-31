'use client'

import { SubmitHandler, useForm } from "react-hook-form"
import { BarcodeResponse, CheckBarcode, CheckInAttendee } from "../scan/scan-functions"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useSound from "use-sound"

export default function AttendeeScanner() {
  const router = useRouter()
  const [attendeeBarcode, setAttendeeBarcode] = useState<BarcodeResponse>()
  const [playErrorChime] = useSound("/sounds/checkout-error.mp3")
  const [playCompleteChime] = useSound("/sounds/complete-chime.mp3")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus
  } = useForm<{ barcode: string }>({
    defaultValues: { barcode: '' }
  })

  const getAndSubmitBarcode = async (barcodeScanned: string): Promise<void> => {
    const trimmedBarcode = barcodeScanned.trim()
    const barcodeScannedResponse = await CheckBarcode(trimmedBarcode)

    console.log('Scanned Attendee Response', barcodeScannedResponse)

    if (barcodeScannedResponse?.barcode && barcodeScannedResponse.entityType === 'Attendee') {
      setAttendeeBarcode(barcodeScannedResponse)
    }
  }

  useEffect(() => {
    handleSubmit(onSubmit)()
    setFocus("barcode")
  }, [attendeeBarcode])

  const onSubmit: SubmitHandler<{ barcode: string }> = async (data) => {

    if (attendeeBarcode) {
      await CheckInAttendee(attendeeBarcode.entityId)
      toast.success(`Successfully checked in attendee ${attendeeBarcode.barcode}`, {
        autoClose: 9000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true
      })
      playCompleteChime()

      setAttendeeBarcode(undefined)
    }
    reset()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        className="w-full p-2 pr-10 border border-gray-300 rounded"
        placeholder="Scan an attendee barcode"
        {...register("barcode")}
        onChange={(e) => {
          const value = e.target.value.trim()
          if (value !== '') {
            getAndSubmitBarcode(value)
          }
        }}
      />
    </form>
  )
}
