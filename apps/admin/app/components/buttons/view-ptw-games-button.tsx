
'use client'

import { useRouter } from 'next/navigation'

interface ViewPlayToWinGamesButtonProps {
  conventionId: number
}

export default function ViewPlayToWinGamesForConvention({ conventionId }: ViewPlayToWinGamesButtonProps): JSX.Element {
  const router = useRouter()

  const navigateToPlayToWinGames = (conventionId: number): void => {
    router.push(`/play-to-win/${conventionId}`)
  };

  return (
    <button className='bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full' onClick={() => { navigateToPlayToWinGames(conventionId) } } type='button'>View Play to Win Games</button>
  )
}
