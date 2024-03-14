import type { Metadata } from "next"
import UserSearchBggGame from "./search-bgg-game"

export const metadata: Metadata = {
  title: 'Add new Game to Library'
}

export default function AddGameToLibrary(): JSX.Element {

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-600 uppercase">Add new Game to library</h1>

      <UserSearchBggGame />

    </main>
  )
}