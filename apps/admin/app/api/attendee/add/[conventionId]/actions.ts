import {
  IPurchasingPerson,
  IPerson,
  IEmergencyContact,
} from "@/app/api/requests/add-attendee-request";
import prisma from "@/app/lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { DateTime } from "ts-luxon";

// Might need to this
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
    prisma.$transaction(
      async (
        transaction: Omit<
          PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
          | "$connect"
          | "$disconnect"
          | "$on"
          | "$transaction"
          | "$use"
          | "$extends"
        >
      ) => {
        console.log(
          `Attempting to create barcode for Person: ${personId} - ${barcode}`
        );
        // Really needed to streamline this transaction due to the database hosting solution
        // Vercel is very slow and unstable... oh and times out every 300 seconds

        // First you must insert a new barcode without an attendee
        const newBarcode = await transaction.centralizedBarcode.create({
          data: {
            entityId: 0,
            entityType: "Attendee",
            barcode: generatedBarcode,
          },
        });

        if (!newBarcode) {
          throw new Error(`Barcode already exists - ${generatedBarcode}`);
        }

        // Second we need to add an attendee...
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
          where: {
            id: newBarcode.id,
          },
          data: {
            entityId: newAttendee.id,
          },
        });

        return;
      }
    );

    success = true;
    barcode = generatedBarcode;
    console.log(
      `**Barcode & Attendee successfully added to database - ${barcode} - ${success}**`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    return { success: success, barcode: barcode };
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
  });

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
      },
    });
    personDbId = personToAdd.id;
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
      },
    });
    personDbId = personToUpdate.id;
  }
  console.log(`Purchasing Pereson DB ID: ${personDbId}`)

  return personDbId;
}

export async function AddAdditionalPeopleUnderPurchasingPerson(
  personId: number,
  conventionId: number,
  additionalAttendees: IPerson[],
  passPurchased: "Free" | "Individual" | "Couple" | "Family",
  isStayingOnSite: boolean
): Promise<{ personId: number; barcode: string | null }[]> {
  let barcodesCreated: { personId: number; barcode: string | null }[] = [];
  let personDbId: number;

  console.log(
    `Adding ${additionalAttendees.length} people under the person: ${personId}`
  );

  for (const additionalAttendee of additionalAttendees) {
    console.log(`Adding additional person to purchasing person Person ID: ${personId} - Name: ${additionalAttendee.preferredName ?? additionalAttendee.firstName} | Last Name: `)

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
    });

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
      });
      personDbId = additionalAttendeeToAdd.id;
    } else {
      console.log(
        `** Match found** - ${additionalAttendeeInSystem.id} | First Name: ${additionalAttendee.firstName} | Last Name: ${additionalAttendee.lastName} | Preferred Name: ${additionalAttendee.preferredName}`
      );

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
      });
      personDbId = additionalAttendeeToUpdate.id;
    }
    console.log(`Attendee Person DB ID: ${personDbId}`)

    const response = await GenerateBarcodeAndAddAttendee(
      conventionId,
      personDbId,
      passPurchased,
      isStayingOnSite
    );
    if (response.success) {
      barcodesCreated.push({ personId: personDbId, barcode: response.barcode });
    }
  }

  return barcodesCreated;
}
