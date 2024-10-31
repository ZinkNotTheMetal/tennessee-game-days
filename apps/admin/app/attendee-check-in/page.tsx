import { Metadata } from "next";
import AttendeeScanner from "./attendee-form";

export const metadata: Metadata = {
  title: "Check-in Attendee",
};

export default async function Page() {

  return(
    <main className="container mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">Scan only an attendee badge</h2>

      <div>
        <AttendeeScanner />
      </div>
    </main>
  )
}