'use client'

import { PlusIcon } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'

import { HiddenInput } from '@/components/custom/hidden-input'
import { Button, type ButtonProps } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit'

import { createLink } from './actions'
import { useGenericFormState } from '@/hooks/use-toasty-form-state'

export const CreateLink = forwardRef(
  (
    {
      collectionFingerprint,
      ...props
    }: ButtonProps & {
      collectionFingerprint?: string
    },
    _
  ) => {
    const [opened, setOpened] = useState(false)
    const [state, formAction] = useGenericFormState(createLink, {})

    useEffect(() => {
      if (state.message) {
        setOpened(false)
      }
    }, [state])

    return (
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild>
          <Button variant="secondary" {...props}>
            <PlusIcon className="mr-2 w-4" /> Create a link
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create link{collectionFingerprint && ' and add to collection'}
            </DialogTitle>
            {collectionFingerprint && (
              <DialogDescription>
                Only the visible links will show up on the page.
              </DialogDescription>
            )}
          </DialogHeader>
          <form action={formAction} className="grid gap-2">
            <div className="gap-1.5">
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" type="url" placeholder="https://..." />
            </div>
            <div className="gap-1.5">
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" type="text" placeholder="" />
            </div>
            <HiddenInput name="collection" value={collectionFingerprint} />
            <SubmitButton className="mt-4">Submit</SubmitButton>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
)

CreateLink.displayName = 'CreateLink'
