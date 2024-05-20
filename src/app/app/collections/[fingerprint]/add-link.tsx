'use client'

import { Loader2, PlusIcon } from 'lucide-react'
import { FormEventHandler, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit'

import { createLinkForCollection } from '../actions'

export function AddLink({ fingerprint }: { fingerprint: string }) {
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const data = new FormData(event.currentTarget)
      await createLinkForCollection(data)
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
        <Button>
          <PlusIcon className="w-4" /> Add link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add link to collection</DialogTitle>
          <form onSubmit={handleSubmit} className="grid gap-2">
            <div className="gap-1.5">
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" type="url" placeholder="https://..." />
            </div>
            <div className="gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="description"
                placeholder=""
              />
            </div>
            <input
              name="fingerprint"
              readOnly
              type="text"
              hidden
              aria-hidden
              aria-readonly
              value={fingerprint}
              className="hidden"
            />
            <DialogClose asChild>
              <Button disabled={loading} type="submit">
                {loading && <Loader2 className="animate-spin w-4 mr-2" />}
                Submit
              </Button>
            </DialogClose>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
