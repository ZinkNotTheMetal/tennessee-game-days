import {
  IPurchasingPerson,
  IPerson,
  IEmergencyContact,
} from "@/app/api/requests/add-attendee-request";
import prisma from "@/app/lib/prisma";
import { DateTime } from "ts-luxon";

export async function GenerateBarcodeAndAddAttendee(
  conventionId: number,
  personId: number,
  passPurchased: "Free" | "Individual" | "Couple" | "Family",
  stayingOnSite: boolean
): Promise<{ success: boolean; barcode: string | null }> {
  let success = false;
  let barcode: string | null = null;
  try {
    const generatedBarcode = `${DateTime.now().toFormat("yy")}${conventionId}-${personId}`;

    // 4. Add a new barcode in a transaction
    prisma.$transaction(async (transaction) => {
      const newBarcode = await transaction.centralizedBarcode.create({
        data: {
          entityId: 0,
          entityType: "Attendee",
          barcode: generatedBarcode,
        },
      });

      const newAttendee = await transaction.attendee.create({
        data: {
          barcode: generatedBarcode,
          isStayingOnSite: stayingOnSite,
          passPurchased: passPurchased,
          conventionId: conventionId,
          personId: personId,
          dateRegistered: DateTime.utc().toISO(),
        },
      });

      await transaction.centralizedBarcode.update({
        where: { id: newBarcode.id },
        data: {
          entityId: newAttendee.id,
        },
      });
    });
    success = true;
    barcode = generatedBarcode;
  } catch (error) {
    throw error;
  } finally {
    return { success: success, barcode: barcode };
  }
}

export async function AddPurchasingPersonIntoSystem(
  person: IPurchasingPerson,
  emergencyContact: IEmergencyContact | undefined
): Promise<number | undefined> {

  let personId: number;

  // Find first person with as much information as we can
  const isPersonInSystem = await prisma.person.findFirst({
    where: {
      OR: [
        { email: person.email ? person.email : undefined },
        { phoneNumber: person.phoneNumber ? person.phoneNumber : undefined },
        { 
          firstName: person.preferredName || person.firstName,
          lastName: person.lastName,
        },
        {
          firstName: person.firstName,
          preferredName: person.preferredName,
          lastName: person.lastName,
        },
      ]
    }
  })

  if (!isPersonInSystem) {
    const personToAdd = await prisma.person.create({
      data: {
        // Merge existing data with provided data
        firstName: person.firstName,
        preferredName: person.preferredName,
        lastName: person.lastName,
        email: person.email,
        phoneNumber: person.phoneNumber,
        zipCode: person.zipCode,
        emergencyContactName: emergencyContact?.name,
        emergencyContactPhoneNumber: emergencyContact?.phoneNumber,
        emergencyContactRelationship: emergencyContact?.relationship,
      }
    })
    personId = personToAdd.id
  } else {
    const personToUpdate = await prisma.person.update({
      where: { id: isPersonInSystem.id },
      data: {
        // Merge existing data with provided data
        firstName: person.firstName || isPersonInSystem?.firstName,
        preferredName: person.preferredName || isPersonInSystem?.preferredName,
        lastName: person.lastName || isPersonInSystem?.lastName,
        email: person.email || isPersonInSystem?.email,
        phoneNumber: person.phoneNumber || isPersonInSystem?.phoneNumber,
      }
    })
    personId = personToUpdate.id
  }

  return personId;
}


export async function AddAdditionalPeopleUnderPurchasingPerson(personId: number, conventionId: number, additionalAttendees: IPerson[], passPurchased: "Free" | "Individual" | "Couple" | "Family", isStayingOnSite: boolean) 
: Promise<{ personId: number, barcode: string | null }[]> 
{
  let barcodesCreated: { personId: number, barcode: string | null }[] = []

  console.log(`Adding ${additionalAttendees.length} people under the person`)

  for (const additionalAttendee of additionalAttendees) {
    const additionalPersonToAdd = await prisma.person.upsert({
      where: { 
        firstName_lastName_relatedPersonId: {
          firstName: additionalAttendee.firstName,
          lastName: additionalAttendee.lastName,
          relatedPersonId: personId
        }
       },
      create: {
        email: additionalAttendee.email || null,
        firstName: additionalAttendee.firstName,
        lastName: additionalAttendee.lastName,
        preferredName: additionalAttendee.preferredName,
        relatedPersonId: personId,
      },
      update: {
        email: additionalAttendee.email || null,
        firstName: additionalAttendee.firstName,
        preferredName: additionalAttendee.preferredName,
        lastName: additionalAttendee.lastName,
      }
    })

    const response = await GenerateBarcodeAndAddAttendee(conventionId, additionalPersonToAdd.id, passPurchased, isStayingOnSite)
    if (response.success) {
      barcodesCreated.push({ personId: additionalPersonToAdd.id, barcode: response.barcode })
    }
  }

  return barcodesCreated
}