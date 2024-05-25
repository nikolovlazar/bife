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

import { removeLinkFromCollection } from '../actions'

export function RemoveLinkFromCollectionConfirmation({
  linkFingerprint,
  collectionFingerprint,
  children,
}: {
  linkFingerprint: string
  collectionFingerprint: string
  children: ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const handleRemoval = async () => {
    try {
      setLoading(true)
      await removeLinkFromCollection(collectionFingerprint, linkFingerprint)
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
          <AlertDialogTitle>You sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will not delete the link itself, just remove it from this
            collection. You can always add it back later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-destructive hover:bg-destructive/80"
              disabled={loading}
              onClick={handleRemoval}
            >
              {loading && <Loader2 className="mr-2 w-4 animate-spin" />}
              Yes, remove it
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
