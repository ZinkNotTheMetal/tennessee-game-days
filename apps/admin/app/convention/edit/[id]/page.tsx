import { GetConventionById } from "../../[id]/page";
import { ConventionForm } from "../../convention-form"
import DeleteConventionButton from "./delete-convention-button"
import BackButton from "@/app/components/buttons/back-button"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const conventionId = Number((await params).id)
  const convention = await GetConventionById(conventionId);

  return {
    title: `Edit - ${convention?.name}`,
  };
}

export default async function Page({ params }: Props) {
  const conventionId = Number((await params).id)
  const convention = await GetConventionById(conventionId)

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">
        Edit {convention?.name}
      </h1>

      <div className="flex justify-end space-x-4">
        <BackButton />
        <DeleteConventionButton
          id={conventionId}
          conventionName={convention?.name ?? ''}
        />
      </div>

      <div className="pt-4">
        {!convention && (
          <div className="pt-8">
            Convention was not found in the database, someone may have deleted
            while you were looking at it :(
          </div>
        )}
        {convention !== null && (
          <ConventionForm payload={{...convention}} />
        )}
      </div>
    </main>
  );
}
