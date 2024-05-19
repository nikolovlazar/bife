'use client'

import { useRouter } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import CreateCollectionForm from '../create-collection-form'

export default function CreateCollectionModal() {
  const router = useRouter()
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          router.push('/app/collections')
        }
      }}
      defaultOpen={true}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create a new collection</DialogTitle>
          <DialogDescription>
            Collections are shareable lists of links.
          </DialogDescription>
        </DialogHeader>
        <CreateCollectionForm />
      </DialogContent>
    </Dialog>
  )
}
