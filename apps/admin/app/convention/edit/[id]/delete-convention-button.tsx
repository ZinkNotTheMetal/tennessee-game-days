'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';

interface DeleteConventionButtonProps {
  id: number
  conventionName: string
}

export default function DeleteConventionButton({ id, conventionName }: DeleteConventionButtonProps): JSX.Element {
  const router = useRouter()

  const removeConvention = (id: number): void => {
    if (id) {
      const success = fetch(`/api/convention/${id}`, {
        method: "DELETE",
      })
        .then((success) => {
          if (success.ok) {
            toast(
              `Successfully deleted ${conventionName}`,
              { type: "success" }
            )
          } else {
            toast(
              `Failed to delete ${conventionName} (API error)`,
              { type: "error" }
            )
          }
        })
        .catch((e) => {
          console.log(e)
          toast(
            `Failed to delete ${conventionName} (check the logs)`,
            { type: "error" }
          )
        });
    }

    router.refresh()
    router.replace("/convention")
    router.refresh()
  };

  return (
    <button className='bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full' onClick={() => { removeConvention(id) } } type='button' >Delete convention</button>
  )
}