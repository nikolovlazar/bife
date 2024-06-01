'use client'

import { ReactNode } from 'react'

import { HiddenInput } from '@/components/custom/hidden-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit'

import { useGenericFormState } from '@/hooks/use-toasty-form-state'

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
  const [_, formAction] = useGenericFormState(removeLinkFromCollection, {})
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You sure?</DialogTitle>
          <DialogDescription>
            This will not delete the link itself, just remove it from this
            collection. You can always add it back later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={formAction}>
            <HiddenInput
              name="collection_fingerprint"
              value={collectionFingerprint}
            />
            <HiddenInput name="link_fingerprint" value={linkFingerprint} />
            <SubmitButton className="bg-destructive hover:bg-destructive/80">
              Yes, remove it
            </SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
