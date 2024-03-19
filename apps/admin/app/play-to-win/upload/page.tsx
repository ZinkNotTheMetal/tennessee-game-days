import { Metadata } from "next";
import Dropzone from "../../components/drop-zone/drop-zone";
import PlayToWinDropZone from "./ptw-dropzone";


export const metadata: Metadata = {
  title: "Upload Play to Win Games",
};

export default async function Page() {

  return(
    <main>
      <div className="pt-8">
        <PlayToWinDropZone />
      </div>
    </main>
  )
}