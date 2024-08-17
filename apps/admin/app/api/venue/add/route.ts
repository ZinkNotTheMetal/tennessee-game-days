import { NextRequest, NextResponse } from "next/server";
import { IVenueRequest } from "../../requests/convention-request";
import { AddVenue } from "./actions";
import { GeoapifyResponse } from "./geoapify.response";

const ADDRESS_SEARCH_URL = `${process.env.GEOAPIFY_API_URL}${process.env.GEOAPIFY_API_SEARCH_ENDPOINT}?apiKey=${process.env.GEOAPIFY_API_KEY}`

export async function POST(request: NextRequest) {
  const venueToAdd: IVenueRequest = await request.json()
  let latitude: number | undefined = undefined;
  let longitude: number | undefined = undefined;

  // Try to get the geocode information (finally add the venue)
  try {
    const geoapifyApi = await fetch(`${ADDRESS_SEARCH_URL}&text=${venueToAdd.streetNumber} ${venueToAdd.streetName} ${venueToAdd.city} ${venueToAdd.stateProvince} ${venueToAdd.postalCode}`)
    const response: GeoapifyResponse = await geoapifyApi.json()

    if (!response) throw Error("Response did not bind properly")
  
    const feature = response.features.filter(f => f.properties.rank.match_type == "full_match")

    // Full match on address
    if (feature[0]) {
      venueToAdd.latitude = feature[0]?.geometry.coordinates[0]
      venueToAdd.longitude = feature[0]?.geometry.coordinates[1]
      venueToAdd.timeZone = feature[0]?.properties.timezone.name
    }

  } catch (e) {
    console.log('Geoapify error:', e)
  } finally {
    await AddVenue(venueToAdd)
  }

  return NextResponse.json({
    message: `Venue - ${venueToAdd.name} successfully added`,
  });
}