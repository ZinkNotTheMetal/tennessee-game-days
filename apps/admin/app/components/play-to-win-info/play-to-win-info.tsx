
interface PlayToWinInformationProps {
  totalPlayToWinGames: number
  playToWinGamesPlayed: number
  playToWinPlays: number
  attendeesPlayed: number
}

export default function PlayToWinInformation({ totalPlayToWinGames, playToWinGamesPlayed, playToWinPlays, attendeesPlayed}: PlayToWinInformationProps) : JSX.Element {

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md text-xl divide-y-4">
      <h2 className="text-2xl mb-4 text-blue-500">Play to Win Games</h2>
      <span className="block">Games: {totalPlayToWinGames}</span>
      <span className="block">Games Played: {playToWinGamesPlayed}</span>
      <span className="block">Total Plays: {playToWinPlays}</span>
      <span className="block">Unique Attendees Played: {attendeesPlayed}</span>
    </div>
  )
}
