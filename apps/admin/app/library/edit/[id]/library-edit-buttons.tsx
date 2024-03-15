"use client";

import { useRouter } from "next/navigation";

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
            // Toast a success message
          } else {
            // Toast a failure message
            console.log(success);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    router.replace("/library");
  };

  return (
    <>
      <div className="flex justify-end space-x-12">
        <button
          className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => removeItemFromLibrary(id)}
          type="button"
        >
          Delete '{gameName}' from library!
        </button>
        <button
          className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => {
            router.push("/library");
          }}
          type="button"
        >
          Back to list
        </button>
      </div>
    </>
  );
}
