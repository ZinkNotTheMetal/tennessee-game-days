import {
  IPurchasingPerson,
  IPerson,
  IEmergencyContact,
} from "@/app/api/requests/add-attendee-request";
import prisma from "@/app/lib/prisma";
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
    prisma.$transaction(async (transaction) => {
      // Really needed to streamline this transaction due to the database hosting solution
      // Vercel is very slow and unstable... oh and times out every 300 seconds

      // Desired:
      //  1. Check if the barcode is already added in centralized database
      //  2. Add attendee
      //  3. if new attendee fails kill transaction
      //  4. Add new centralized barcode with the proper entity id
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

      const newBarcode = await transaction.centralizedBarcode.create({
        data: {
          entityId: newAttendee.id,
          entityType: "Attendee",
          barcode: generatedBarcode,
        },
      });
    });

    success = true;
    barcode = generatedBarcode;
    console.log(
      `Generate Barcode and add attendee completed - ${barcode} - ${success}`
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
    personId = personToAdd.id;
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
    personId = personToUpdate.id;
  }

  return personId;
}

export async function AddAdditionalPeopleUnderPurchasingPerson(
  personId: number,
  conventionId: number,
  additionalAttendees: IPerson[],
  passPurchased: "Free" | "Individual" | "Couple" | "Family",
  isStayingOnSite: boolean
): Promise<{ personId: number; barcode: string | null }[]> {
  let barcodesCreated: { personId: number; barcode: string | null }[] = [];

  console.log(`Adding ${additionalAttendees.length} people under the person`);

  for (const additionalAttendee of additionalAttendees) {
    let attendeeId: number = 0;
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
      attendeeId = additionalAttendeeToAdd.id;
    } else {
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
      attendeeId = additionalAttendeeToUpdate.id;
    }

    const response = await GenerateBarcodeAndAddAttendee(
      conventionId,
      attendeeId,
      passPurchased,
      isStayingOnSite
    );
    if (response.success) {
      barcodesCreated.push({ personId: attendeeId, barcode: response.barcode });
    }
  }

  return barcodesCreated;
}
