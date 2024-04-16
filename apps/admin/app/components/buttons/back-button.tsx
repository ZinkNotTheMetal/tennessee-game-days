'use client'

import { useRouter } from "next/navigation";

export default function BackButton(): JSX.Element {
  const router = useRouter();

  return (
    <button
      className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full"
      onClick={() => {
        router.back();
      }}
      type="button"
    >
      Back
    </button>
  );
}