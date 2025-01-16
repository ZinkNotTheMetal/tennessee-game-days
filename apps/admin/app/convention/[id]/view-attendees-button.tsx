
'use client'

import { useRouter } from 'next/navigation'

interface ViewAttendeesForConventionButtonProps {
  conventionId: number
}

export default function ViewAttendeesForConventionButton({ conventionId }: ViewAttendeesForConventionButtonProps): JSX.Element {
  const router = useRouter()

  const navigateToPlayToWinGames = (conventionId: number): void => {
    router.push(`${conventionId}/attendees`)
  };

  return (
    <button className='bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full' onClick={() => { navigateToPlayToWinGames(conventionId) } } type='button'>View Attendees</button>
  )
}
