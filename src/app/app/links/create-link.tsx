'use client'

import { Loader2, PlusIcon } from 'lucide-react'
import { FormEventHandler, forwardRef, useState } from 'react'
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

import { createLink } from './actions'

export const CreateLink = forwardRef(
  (
    {
      collectionFingerprint,
      ...props
    }: ButtonProps & {
      collectionFingerprint?: string
    },
    ref
  ) => {
    const [opened, setOpened] = useState(false)
    const [loading, setLoading] = useState(false)
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault()
      try {
        setLoading(true)
        const data = new FormData(event.currentTarget)
        await createLink(data)
        setLoading(false)
        setOpened(false)
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
          <form onSubmit={handleSubmit} className="grid gap-2">
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
              <Button disabled={loading} type="submit" className="mt-4">
                {loading && <Loader2 className="mr-2 w-4 animate-spin" />}
                Submit
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
)

CreateLink.displayName = 'CreateLink'
