import prisma from "@/app/lib/prisma";
import { DateTime } from "ts-luxon";

export async function GenerateBarcodeAndAddAttendee(
  conventionId: number, 
  personId: number, 
  passPurchased: 'Free' | 'Individual' | 'Couple' | 'Family',
  stayingOnSite: boolean
): Promise<{ success: boolean, barcode: string | null }> {
  let success = false
  let barcode: string | null = null
  try {
    const generatedBarcode = `${DateTime.now().toFormat('yy')}${conventionId}-${personId}`

    // 4. Add a new barcode in a transaction
    prisma.$transaction(async (transaction) => {
      const newBarcode = await transaction.centralizedBarcode.create({
        data: {
          entityId: 0,
          entityType: 'Attendee',
          barcode: generatedBarcode
        }
      })

      const newAttendee = await transaction.attendee.create({
        data: {
          barcode: generatedBarcode,
          isStayingOnSite: stayingOnSite,
          passPurchased: passPurchased,
          conventionId: conventionId,
          personId: personId,
          dateRegistered: DateTime.utc().toISO()
        }
      })

      await transaction.centralizedBarcode.update({
        where: { id: newBarcode.id },
        data: { 
          entityId: newAttendee.id
        }
      })

    })
    success = true
    barcode = generatedBarcode

  } catch (error) {
    throw error
  } finally {
    return { success: success, barcode: barcode }
  }

}