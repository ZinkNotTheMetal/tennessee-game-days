'use client'

import { TopCheckedOutGame } from "@repo/shared"

interface TopCheckedOutGamesProps {
  count: number
  showFullDetails: boolean
  topCheckedOutGames: TopCheckedOutGame[]
}

export default function DisplayTopCheckedOutGames({ count, showFullDetails, topCheckedOutGames }: TopCheckedOutGamesProps): JSX.Element {

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4 text-blue-500">Top {count} Checked Out Games</h2>
      { /* Display if not enough checked out games */}
      { topCheckedOutGames.length === 0 && (
        <span className="italic text-red-400 block py-3">Not enough checkout events to show...</span>
      )}
      { topCheckedOutGames.length > 0 && (
        <DisplayTopGamesTable count={count} showFullDetails={showFullDetails} topCheckedOutGames={topCheckedOutGames} />
      )}

    </div>
  )
}

interface DisplayTopGamesTableProps {
  showFullDetails: boolean
  topCheckedOutGames: TopCheckedOutGame[]
  count: number
}

function DisplayTopGamesTable({ showFullDetails, topCheckedOutGames, count } : DisplayTopGamesTableProps) : JSX.Element {

  return (
    <div>
      <table
        className="bg-gray-200 min-w-full divide-y-0 divide-gray-300 rounded-t-xl rounded-b-xl"
      >

        <DisplayTopGamesHeader showFullDetails={showFullDetails} />

        <DisplayTopGamesBody showFullDetails= {showFullDetails} games={topCheckedOutGames} count={count} />

      </table>
    </div>

  )
}

interface DisplayTopGamesHeaderProps {
  showFullDetails: boolean
}
function DisplayTopGamesHeader({ showFullDetails }: DisplayTopGamesHeaderProps): JSX.Element {

  return (
    <thead className="text-gray-500 font-thin border-gray-300 border-b-2">
      <tr>
        <th className="px-12 text-sm text-nowrap">Game Name</th>
        <th className="px-4 text-sm text-nowrap">Count</th>
        <th className="px-2 text-sm text-nowrap">Best Player Count</th>
        { showFullDetails && (
          <>
            <th className="py-2 px-4 hidden sm:table-cell">
              Player Count (min)
            </th>
            <th className="py-2 px-4 hidden md:table-cell">
              Player Count (max)
            </th>
            <th className="py-2 px-4 hidden lg:table-cell">
              Total Checkout time
            </th>
            <th className="py-2 px-4 text-gray-500">Complexity</th>
            <th className="py-2 px-4 text-gray-500">BGG Avg Rating</th>
            <th className="py-2 px-4 text-gray-500 hidden md:table-cell">
              Average Playtime (minutes)
            </th>
          </>
        )}
      </tr>
    </thead>
  )
}


interface DisplayTopGamesBodyProps {
  showFullDetails: boolean
  count: number
  games: TopCheckedOutGame[]
}

function DisplayTopGamesBody({ showFullDetails, games, count }: DisplayTopGamesBodyProps): JSX.Element {

  return (
    <tbody className="text-center">

      { games.slice(0, count).map((game) => (
        <ResultsTableRow key={game.id} showFullDetails={showFullDetails} game={game} />
      ))}

    </tbody>
  )
}

interface ResultsRowProps {
  showFullDetails: boolean
  game: TopCheckedOutGame
}

function ResultsTableRow({ 
  showFullDetails, game
}: ResultsRowProps) : JSX.Element {

  return (
    <tr
      className={`${game.allCopiesCheckedOut ? 'italic text-red-400 text-sm' : 'text-sm'}`}
      key={game.id}
    >
      <td className="p-1">{ game.libraryItemName }</td>
      <td className="p-1">{ game.totalCheckedOutEvents }</td>
      <td className="p-1">{ game.votedBestPlayerCount }</td>
      { showFullDetails && (
        <>
          <td className="p-1">{ game.minPlayerCount }</td>
          <td className="p-1">{ game.maxPlayerCount }</td>
          <td className="p-1">{ game.totalCheckedOutMinutes } min</td>
          <td className="p-1">{ Number(game.bggAverageComplexity).toFixed(1) }</td>
          <td className="p-1">{ Number(game.bggAverageRating).toFixed(1) }</td>
          <td className="p-1">{ game.bggPlaytimeMinutes }</td>
        </>
      )}
    </tr>
  )
}
