import {
  IPurchasingPerson,
  IPerson,
  IEmergencyContact,
} from "@/app/api/requests/add-attendee-request";
import prisma from "@/app/lib/prisma";
import { convertToTitleCase } from "@/utils/stringUtils";
import { Prisma } from '@prisma/client'
import { DateTime } from "ts-luxon";



// Might need to this
export async function GenerateBarcodeAndAddAttendee(
  conventionId: number,
  personId: number,
  isVolunteer: boolean,
  passPurchased: "Free" | "Individual" | "Couple" | "Family",
  stayingOnSite: boolean
): Promise<{ success: boolean; barcode: string | null }> {
  let success = false;
  let barcode: string | null = null;
  try {
    const generatedBarcode = `${DateTime.now().toFormat("yy")}${conventionId}-${personId}`;

    prisma.$transaction(async (transaction) => {
      // 1. Ensure there is not already a code
      const existingBarcode = await transaction.centralizedBarcode.findUnique({
        where: {
          barcode: generatedBarcode,
        },
      });

      if (existingBarcode) {
        throw new Error(`Barcode already exists - ${generatedBarcode}`);
      }

      const newBarcode = await transaction.centralizedBarcode.create({
        data: {
          entityId: 0,
          entityType: "Attendee",
          barcode: generatedBarcode,
        },
      });

      const existingAttendee = await transaction.attendee.findUnique({
        where: {
          barcode: generatedBarcode,
        },
      });

      if (existingAttendee) {
        throw new Error(`Attendee already exists - ${generatedBarcode}`);
      }

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

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function AddPurchasingPersonIntoSystem(
  person: IPurchasingPerson,
  emergencyContact: IEmergencyContact | undefined
): Promise<number | undefined> {
  let personDbId: number;

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
      ],
    },
  })

  if (!isPersonInSystem) {
    const personToAdd = await prisma.person.create({
      data: {
        firstName: convertToTitleCase(person.firstName),
        preferredName: person.preferredName ? convertToTitleCase(person.preferredName) : null,
        lastName: convertToTitleCase(person.lastName),
        email: person.email,
        phoneNumber: person.phoneNumber,
        zipCode: person.zipCode,
        emergencyContactName: emergencyContact?.name ? convertToTitleCase(emergencyContact.name) : null,
        emergencyContactPhoneNumber: emergencyContact?.phoneNumber,
        emergencyContactRelationship: emergencyContact?.relationship,
      },
    })
    personDbId = personToAdd.id;
  } else {
    const personToUpdate = await prisma.person.update({
      where: { id: isPersonInSystem.id },
      data: {
        // Merge existing data with provided data
        firstName: convertToTitleCase(person.firstName) || isPersonInSystem?.firstName,
        preferredName: person.preferredName || isPersonInSystem?.preferredName,
        lastName: convertToTitleCase(person.lastName) || isPersonInSystem?.lastName,
        email: person.email || isPersonInSystem?.email,
        phoneNumber: person.phoneNumber || isPersonInSystem?.phoneNumber,
      },
    })
    personDbId = personToUpdate.id
  }

  return personDbId;
}

export async function AddAdditionalPeopleUnderPurchasingPerson(
  personId: number,
  conventionId: number,
  additionalAttendees: IPerson[],
  isVolunteer: boolean,
  passPurchased: "Free" | "Individual" | "Couple" | "Family",
  isStayingOnSite: boolean
): Promise<{ personId: number; barcode: string | null }[]> {
  let barcodesCreated: { personId: number; barcode: string | null }[] = [];
  let personDbId: number;

  console.log(
    `Adding ${additionalAttendees.length} people under the person: ${personId}`
  )

  for (const additionalAttendee of additionalAttendees) {
    console.log(
      `Adding additional person to purchasing person Person ID: ${personId} - Name: ${additionalAttendee.preferredName ?? additionalAttendee.firstName} | Last Name: `
    )

    // Find first person with as much information as we can
    const additionalAttendeeInSystem = await prisma.person.findFirst({
      where: {
        OR: [
          {
            firstName: additionalAttendee.firstName,
            preferredName: additionalAttendee.preferredName,
            lastName: additionalAttendee.lastName,
            relatedPersonId: personId,
          },
          {
            email: additionalAttendee.email
              ? additionalAttendee.email
              : undefined,
          },
          {
            phoneNumber: additionalAttendee.phoneNumber
              ? additionalAttendee.phoneNumber
              : undefined,
          },
          {
            firstName:
              additionalAttendee.preferredName || additionalAttendee.firstName,
            lastName: additionalAttendee.lastName,
          },
          {
            firstName: additionalAttendee.firstName,
            preferredName: additionalAttendee.preferredName,
            lastName: additionalAttendee.lastName,
          },
        ],
      },
    })

    if (!additionalAttendeeInSystem) {
      const additionalAttendeeToAdd = await prisma.person.create({
        data: {
          // Merge existing data with provided data
          firstName: additionalAttendee.firstName,
          preferredName: additionalAttendee.preferredName,
          lastName: additionalAttendee.lastName,
          email: additionalAttendee.email,
          phoneNumber: additionalAttendee.phoneNumber,
          relatedPersonId: personId,
        },
      })
      personDbId = additionalAttendeeToAdd.id;
    } else {
      console.log(
        `** Match found** - ${additionalAttendeeInSystem.id} | First Name: ${additionalAttendee.firstName} | Last Name: ${additionalAttendee.lastName} | Preferred Name: ${additionalAttendee.preferredName}`
      )

      const additionalAttendeeToUpdate = await prisma.person.update({
        where: { id: additionalAttendeeInSystem.id },
        data: {
          // Merge existing data with provided data
          firstName: additionalAttendee.firstName,
          preferredName: additionalAttendee.preferredName,
          lastName: additionalAttendee.lastName,
          email: additionalAttendee.email,
          phoneNumber: additionalAttendee.phoneNumber,
          relatedPersonId: personId,
        },
      })
      personDbId = additionalAttendeeToUpdate.id;
    }

    try {
      const response = await GenerateBarcodeAndAddAttendee(
        conventionId,
        personDbId,
        isVolunteer,
        passPurchased,
        isStayingOnSite
      )

      if (response.success) {
        barcodesCreated.push({
          personId: personDbId,
          barcode: response.barcode,
        });
      } else {
        console.error(
          "Failed to Generate Barcode for additional people under purchasing person"
        )
      }
    } catch (e) {
      console.log("transaction error", e)
    }
  }

  return barcodesCreated
}
