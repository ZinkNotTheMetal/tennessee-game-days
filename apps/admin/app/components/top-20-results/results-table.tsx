'use client'

import { IBoardGameGeekEntity } from "@repo/board-game-geek-shared"
import { TopCheckedOutGame } from "@repo/shared"
import { useEffect, useState } from "react"

interface TopCheckedOutGameProps {
  topCheckedOutGames: TopCheckedOutGame[]
}

export default function TopCheckedOutGames({ topCheckedOutGames }: TopCheckedOutGameProps): JSX.Element {

  return (
    <>
      { topCheckedOutGames.length <= 0 && (
        <div className="flex justify-center py-5">
          <span>Not enough checkout events to show top checked out games...</span>
        </div>
      )}
      { topCheckedOutGames.length >= 0 && (
        <div className="pt-12">
          <div className="flex justify-center">
            <span className="text-xl font-semibold mb-4 text-blue-600">Top Checked out games in the library</span>
          </div>
          <table
            className="bg-gray-200 min-w-full divide-y-0 divide-gray-300 rounded-t-xl rounded-b-xl"
          >

            <ResultsTableHeader />

            <ResultsTableBody games={topCheckedOutGames} />

          </table>
        </div>
      )}
    </>
  )
}

function ResultsTableHeader(): JSX.Element {

  return (
    <thead className="border-b border-gray-400">
      <tr>
        <th className="py-2 px-12 text-gray-500">Game Name</th>
        <th className="py-2 px-4 text-gray-500">Times Checked Out</th>
        <th className="py-2 px-4 text-gray-500 hidden lg:table-cell">
          Total Checkout time
        </th>
        <th className="py-2 px-4 text-gray-500">Complexity</th>
        <th className="py-2 px-4 text-gray-500">BGG Avg Rating</th>
        <th className="py-2 px-4 text-gray-500 hidden sm:table-cell">
          Minimum Player Count
        </th>
        <th className="py-2 px-4 text-gray-500 hidden md:table-cell">
          Max Player count
        </th>
      </tr>
    </thead>
  )
}

interface ResultsTableBodyProps {
  games: TopCheckedOutGame[]
}

function ResultsTableBody({ games }: ResultsTableBodyProps): JSX.Element {

  return (
    <tbody className="text-center">

      { games.map((game) => (
        <ResultsTableRow key={game.barcode} {...game} checkOutCount={game._count.checkOutEvents} />
      ))}

    </tbody>
  )
}

interface ResultsRowProps {
  alias: string
  barcode: string
  boardGameGeekThing: IBoardGameGeekEntity,
  totalCheckedOutMinutes: number
  checkOutCount: number
  isCheckedOut: boolean
}

function ResultsTableRow({ alias, barcode, boardGameGeekThing, isCheckedOut, totalCheckedOutMinutes, checkOutCount }: ResultsRowProps) : JSX.Element {

  return (
    <tr
      key={barcode}
      className={`${isCheckedOut ? 'italic text-red-400' : ''}`}
    >
      <td className="p-3">{ alias || boardGameGeekThing.itemName }</td>
      <td className="p-3">{ checkOutCount }</td>
      <td className="p-3">{ totalCheckedOutMinutes } min</td>
      <td className="p-3">{ Number(boardGameGeekThing.complexityRating).toFixed(1) }</td>
      <td className="p-3">{ Number(boardGameGeekThing.averageUserRating).toFixed(1) }</td>
      <td className="p-3">{ boardGameGeekThing.minimumPlayerCount }</td>
      <td className="p-3">{ boardGameGeekThing.maximumPlayerCount }</td>
    </tr>
  )
}