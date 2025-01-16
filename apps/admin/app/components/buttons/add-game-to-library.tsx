'use client'

import { useRouter } from "next/navigation";

export default function AddGameToLibraryButton() : JSX.Element {
  const router = useRouter();

  return (
    <button
      className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
      onClick={() => {
        router.push("/library/add");
      }}
      type="button"
    >
      Add Game to Library
    </button>
  );
}
