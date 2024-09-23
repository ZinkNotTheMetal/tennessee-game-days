/**
 * @swagger
 * components:
 *   schemas:
 *     AddAttendeeRequest:
 *       type: object
 *       properties:
 *         person:
 *           $ref: '#/components/schemas/PurchasingPerson'
 *         additionalAttendees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Person'
 *         isStayingOnSite:
 *           type: boolean
 *           description: Flag to see if main attendee is staying on site
 *         passPurchased:
 *           type: string
 *           description: Which pass was purchased
 *           example: Free, Individual, Couple, Family
 */
interface IAddAttendeeRequest {
  person: IPurchasingPerson;
  additionalPeople: IPerson[] | undefined;
  isStayingOnSite: boolean;
  isVolunteer: boolean;
  passPurchased: "Free" | "Individual" | "Couple" | "Family";
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchasingPerson:
 *       type: object
 *       description: Person attending the conference who is purchasing (need more details than additional attendees)
 *       properties:
 *         firstName:
 *           type: string
 *           description: First name of the person
 *         lastName:
 *           type: string
 *           description: Last name of the person
 *         preferredName:
 *           type: string
 *           description: Preferred name of the person
 *           nullable: true
 *         email:
 *           type: string
 *           description: Email address of the person
 *           nullable: true
 *         phoneNumber:
 *           type: string
 *           description: Phone number with area code (no formatting necessary)
 *         zipCode:
 *           type: string
 *           description: Zip code of the person
 *         emergencyContact:
 *           $ref: '#/components/schemas/EmergencyContact'
 *           nullable: true
 */
interface IPurchasingPerson extends IPerson {
  email: string;
  zipCode: string;
  emergencyContact?: IEmergencyContact;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Person:
 *       type: object
 *       description: Basic information about a person
 *       properties:
 *         firstName:
 *           type: string
 *           description: First name of the person
 *         lastName:
 *           type: string
 *           description: Last name of the person
 *         preferredName:
 *           type: string
 *           description: Preferred name of the person
 *           nullable: true
 *         email:
 *           type: string
 *           description: Email address of the person
 *           nullable: true
 */
interface IPerson {
  firstName: string;
  lastName: string;
  preferredName?: string;
  email?: string;
  phoneNumber: string | undefined;
  isAdult: boolean;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     EmergencyContact:
 *       type: object
 *       description: Emergency contact information
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the emergency contact person
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the emergency contact person
 */
interface IEmergencyContact {
  name: string;
  phoneNumber: string;
  relationship: string;
}

export type {
  IAddAttendeeRequest,
  IPurchasingPerson,
  IPerson,
  IEmergencyContact,
};
