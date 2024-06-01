'use client'

import { ReactNode, useEffect, useState } from 'react'

import { HiddenInput } from '@/components/custom/hidden-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit'

import { deleteLink } from './actions'
import { useGenericFormState } from '@/hooks/use-toasty-form-state'

export function DeleteLinkConfirmation({
  fingerprint,
  children,
}: {
  fingerprint: string
  children: ReactNode
}) {
  const [opened, setOpened] = useState(false)
  const [state, formAction] = useGenericFormState(deleteLink, {})

  useEffect(() => {
    if (state.message) {
      setOpened(false)
    }
  }, [state])

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will delete the link, for real.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="grid gap-3">
          <HiddenInput name="fingerprint" value={fingerprint} />
          <SubmitButton className="mt-4">Yes, delete the link</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
