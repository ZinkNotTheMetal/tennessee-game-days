import { ConventionForm } from "../../convention-form";
import type { IConvention, ILibraryItem } from "@repo/shared";
import DeleteConventionButton from "./delete-convention-button";
import { getConventionById } from "../../actions";

interface Props {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props
) {
  const convention = await getConventionById(Number(params.id))

  return {
    title: `Edit - ${convention.name}`
  }
}


export default async function Page({ params }: { params: { id: string } }) {
  const conventionId = Number(params.id)
  const convention = await getConventionById(conventionId)

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">
        Edit {convention.name}
      </h1>

      <div className="text-right">
        <DeleteConventionButton id={Number(params.id)} conventionName={convention.name} />
      </div>

      <div className="pt-4">
        {!convention && (
          <div className="pt-8">
            Convention was not found in the database, someone may have deleted while you were looking at it :(
          </div>
        )}
        {Boolean(convention) && (
          <ConventionForm id={conventionId} convention={convention} />
        )}
      </div>
    </main>
  );
}
