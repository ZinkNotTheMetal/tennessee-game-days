import type { Metadata } from "next";
import { ConventionForm } from "../convention-form";

export const metadata: Metadata = {
  title: "Add new Convention",
};

export default function Page(): JSX.Element {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">
        Add upcoming convention
      </h1>

      <div className="">
        <ConventionForm />
      </div>
    </main>
  );
}
