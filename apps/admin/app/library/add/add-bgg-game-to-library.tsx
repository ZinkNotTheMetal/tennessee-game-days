'use client'

import { ILibraryItem } from "@repo/shared"
import { ApiListResponse } from "@repo/shared"
import { useEffect, useState } from "react"
import { LibraryForm } from "../library-form"
import Link from "next/link"
import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared"

interface AddBggGameToLibraryProps {
  gameSelected: IBoardGameGeekEntity
  clear: () => void
}

export default function AddBggGameToLibrary({ gameSelected, clear }: AddBggGameToLibraryProps): JSX.Element {
  const [gamesFound, setGamesFound] = useState<{ libraryId: number, barcode: string }[]>([])

  useEffect(() => {
    fetch(`/api/library/search/${gameSelected.id}`)
      .then((response) => response.json())
      .then(json => {
        const response: ApiListResponse<ILibraryItem> = json

        if (response.total > 0) {
          const foundGames = response.list.map(game => {
            return {
              libraryId: game.id,
              barcode: game.barcode
            }
          })
          setGamesFound(foundGames)
        } else {
          setGamesFound([])
        }
      })

  }, [gameSelected])

  const libraryItem: ILibraryItem = {
    alias: '',
    barcode: '',
    id: 0,
    isCheckedOut: false,
    isHidden: false,
    owner: '',
    checkOutEvents: [],
    totalCheckedOutMinutes: 0,
    updatedAtUtc: new Date().toISOString(),
    dateAddedUtc: new Date().toISOString(),
    additionalBoxContent: [],
    boardGameGeekThingId: gameSelected.id,
    boardGameGeekThing: gameSelected,
  }

  return(
    <>
      <div className="text-right">
        <button 
          className='bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full'
          onClick={clear}
          type="button"
        >
          Back to Board Game Geek List
        </button>
      </div>
      {gamesFound.length > 0 && (
        <div className="text-center pt-4">
          <span className="text-orange-500">Already found { gamesFound.length > 1 ? 'copies' : 'a copy' } of {gameSelected.itemName} in the database!</span>
          <ul>
            {gamesFound?.map(gameFound => ( 
              <li key={gameFound.libraryId}>
                <Link className="hover:text-blue-400" href={`/library/edit/${gameFound.libraryId}`}>{gameFound.barcode}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="pt-8">
        {/* Add library item from bggthing */}
        <LibraryForm libraryItem={libraryItem} />
      </div>
    </>
  )
}
