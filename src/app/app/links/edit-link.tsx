'use client'

import { ReactNode, useEffect, useState } from 'react'

import { HiddenInput } from '@/components/custom/hidden-input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit'

import { updateLink } from './actions'
import { useGenericFormState } from '@/hooks/use-toasty-form-state'

export function EditLink({
  fingerprint,
  url,
  label,
  children,
}: {
  fingerprint: string
  url: string
  label: string | null
  children: ReactNode
}) {
  const [opened, setOpened] = useState(false)
  const [state, formAction] = useGenericFormState(updateLink, {})

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
          <DialogTitle>Edit link</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="grid gap-3">
          <div className="gap-1.5">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              defaultValue={url}
              placeholder="https://..."
            />
          </div>
          <div className="gap-1.5">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              name="label"
              type="label"
              defaultValue={label ?? ''}
              placeholder=""
            />
          </div>
          <HiddenInput name="fingerprint" value={fingerprint} />
          <SubmitButton className="mt-4">Update</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
