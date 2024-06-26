'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { deleteLinkInputSchema } from '@/lib/validation-schemas/links'

import { HiddenInput } from '@/app/_components/custom/hidden-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { Form, FormField } from '@/app/_components/ui/form'
import { SubmitButton } from '@/app/_components/ui/submit'

import { deleteLink } from './actions'

export function DeleteLinkConfirmation({
  fingerprint,
  children,
}: {
  fingerprint: string
  children: ReactNode
}) {
  const [opened, setOpened] = useState(false)

  const form = useForm<z.infer<typeof deleteLinkInputSchema>>({
    resolver: zodResolver(deleteLinkInputSchema),
    defaultValues: {
      fingerprint,
    },
  })

  const { execute } = useServerAction(deleteLink, {
    onError: ({ err }) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('Link deleted!')
      setOpened(false)
    },
  })

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => execute(values))}
            className="grid gap-3"
          >
            <FormField
              control={form.control}
              name="fingerprint"
              render={({ field }) => <HiddenInput {...field} />}
            />
            <SubmitButton className="mt-4">Yes, delete the link</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
