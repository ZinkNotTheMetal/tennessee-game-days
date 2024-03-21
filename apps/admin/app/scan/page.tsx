import { Metadata } from "next";
import ScanningTerminalClient from "./scanning-terminal";

export const metadata: Metadata = {
  title: "Scanning Terminal",
};

export default async function Page() {

  return(
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome to the Scanning Terminal</h1>

        <ScanningTerminalClient />

        {/* If game is scanned in (and not checked out) - Need to wait for a person barcode, then create an event, check the game out */}

        {/* If game is scanned in (and checked out) - Complete event, check back in, reset the page, add checkout minutes to game */}
        
        {/* If person is scanned - Need to wait for a library item barcode, then create an event, check the game out */}

      </div>
    </div>
  )
}
