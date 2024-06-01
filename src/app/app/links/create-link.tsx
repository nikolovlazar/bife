'use client'

import { PlusIcon } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import { Button, type ButtonProps } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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

type State = {
  message?: string
  error?: string
}

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
    const [state, formAction] = useFormState<State, FormData>(createLink, {})

    useEffect(() => {
      if (state.message) {
        const toastId = toast.success(state.message, {
          dismissible: true,
          action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(toastId),
          },
          duration: 5000,
        })
        setOpened(false)
      } else if (state.error) {
        const toastId = toast.error(state.error, {
          dismissible: true,
          action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(toastId),
          },
          duration: 5000,
        })
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
              <Input
                id="label"
                name="label"
                type="label"
                placeholder=""
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    event.currentTarget.form?.requestSubmit()
                  }
                }}
              />
            </div>
            <input
              name="collection"
              readOnly
              type="text"
              hidden
              aria-hidden
              aria-readonly
              value={collectionFingerprint}
              className="hidden"
            />
            <DialogClose asChild>
              <SubmitButton>Submit</SubmitButton>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
)

CreateLink.displayName = 'CreateLink'
