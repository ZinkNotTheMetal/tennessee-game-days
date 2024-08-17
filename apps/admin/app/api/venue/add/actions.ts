import prisma from "@/app/lib/prisma";
import { IVenueRequest } from "../../requests/convention-request";

export async function AddVenue(request: IVenueRequest) {
  const addedVenue = await prisma.venue.create({
    data: request
  })
  return addedVenue.id
}