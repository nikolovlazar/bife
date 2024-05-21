'use client'

import { Loader2 } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { deleteCollection } from '../actions'

export function DeleteCollectionConfirmation({
  fingerprint,
  children,
}: {
  fingerprint: string
  children: ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const handleDeletion = async () => {
    try {
      setLoading(true)
      const data = new FormData()
      data.append('fingerprint', fingerprint)
      await deleteCollection(data)
    } catch (error) {
      if (error instanceof Error) {
        setLoading(false)
        const toastId = toast.error(error.message, {
          dismissible: true,
          action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(toastId),
          },
          duration: 5000,
        })
      }
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the collection and all of its links.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-destructive hover:bg-destructive/80"
              disabled={loading}
              onClick={handleDeletion}
            >
              {loading && <Loader2 className="mr-2 w-4 animate-spin" />}
              Yes, delete the collection
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
