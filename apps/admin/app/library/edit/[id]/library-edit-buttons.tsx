"use client";

import BackButton from "@/app/components/buttons/back-button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LibraryItemEditButtonsProps {
  id: number;
  gameName: string;
}

export function LibraryItemEditButtons({
  id,
  gameName,
}: LibraryItemEditButtonsProps): JSX.Element {
  const router = useRouter();

  const removeItemFromLibrary = (id: number): void => {
    if (id) {
      const success = fetch(`/api/library/${id}`, {
        method: "DELETE",
      })
        .then((success) => {
          if (success.ok) {
            toast(
              `Successfully deleted ${gameName} from the Library`,
              { type: "success" }
            )
          } else {
            toast(
              `Failed to delete ${gameName} from the library (API error)`,
              { type: "error" }
            )
          }
        })
        .catch((e) => {
          console.log(e)
          toast(
            `Failed to delete ${gameName} from the library (check the logs)`,
            { type: "error" }
          )
        });
    }

    router.refresh()
    router.replace("/library")
    router.refresh()
  };

  return (
    <>
      <div className="flex justify-end space-x-4">
        <BackButton />
        <button
          className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => removeItemFromLibrary(id)}
          type="button"
        >
          Delete '{gameName}' from library!
        </button>
      </div>
    </>
  );
}
