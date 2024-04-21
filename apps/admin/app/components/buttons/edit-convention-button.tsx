
'use client'

import { useRouter } from 'next/navigation'

interface EditConventionButtonProps {
  id: number
}

export default function EditConventionButton({ id }: EditConventionButtonProps): JSX.Element {
  const router = useRouter()

  const navigateToEditConvention = (id: number): void => {
    router.push(`/convention/edit/${id}`)
  };

  return (
    <button className='bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full' onClick={() => { navigateToEditConvention(id) } } type='button'>Edit convention</button>
  )
}
