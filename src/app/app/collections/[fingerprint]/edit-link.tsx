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
  linkId,
  url,
  visible,
  description,
  children,
}: {
  linkId: number
  url: string
  visible: boolean
  description: string | null
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
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="description"
              defaultValue={description ?? ''}
              placeholder=""
            />
          </div>
          <div className="flex gap-1.5 items-center">
            <Checkbox
              name="visible"
              id="visible"
              defaultChecked={visible}
              className="w-6 h-6"
            />
            <Label htmlFor="visible">Visible</Label>
          </div>
          <input
            name="id"
            readOnly
            type="text"
            hidden
            aria-hidden
            aria-readonly
            value={linkId}
            className="hidden"
          />
          <DialogClose asChild>
            <Button disabled={loading} type="submit" className="mt-4">
              {loading && <Loader2 className="animate-spin w-4 mr-2" />}
              Update
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  )
}
