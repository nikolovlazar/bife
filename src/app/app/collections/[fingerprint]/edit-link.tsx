'use client'

import { Loader2 } from 'lucide-react'
import { FormEventHandler, ReactNode, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { updateLink } from '../actions'

export function EditLink({
  fingerprint,
  url,
  visible,
  label,
  children,
}: {
  fingerprint: string
  url: string
  visible: boolean
  label: string
  children: ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      const data = new FormData(event.currentTarget)
      await updateLink(data)
      setLoading(false)
      toast.success('Link updated')
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
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
              defaultValue={label}
              placeholder=""
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox
              name="visible"
              id="visible"
              defaultChecked={visible}
              className="h-6 w-6"
            />
            <Label htmlFor="visible">Visible</Label>
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
            <Button disabled={loading} type="submit" className="mt-4">
              {loading && <Loader2 className="mr-2 w-4 animate-spin" />}
              Update
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}
