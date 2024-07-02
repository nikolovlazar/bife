'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

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
import { removeLinkFromCollectionInputSchema } from '@/app/_lib/validation-schemas/collections'

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
  const [opened, setOpened] = useState(false)

  const form = useForm<z.infer<typeof removeLinkFromCollectionInputSchema>>({
    resolver: zodResolver(removeLinkFromCollectionInputSchema),
    defaultValues: {
      fingerprint: collectionFingerprint,
      linkFingerprint,
    },
  })

  const { execute } = useServerAction(removeLinkFromCollection, {
    onError: ({ err }) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('Link removed from collection!')
      setOpened(false)
    },
  })
  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You sure?</DialogTitle>
          <DialogDescription>
            This will not delete the link itself, just remove it from this
            collection. You can always add it back later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className=""
            onSubmit={form.handleSubmit((values) => execute(values))}
          >
            <FormField
              control={form.control}
              name="fingerprint"
              render={({ field }) => <HiddenInput {...field} />}
            />
            <FormField
              control={form.control}
              name="linkFingerprint"
              render={({ field }) => <HiddenInput {...field} />}
            />
            <SubmitButton className="bg-destructive hover:bg-destructive/80">
              Yes, remove it
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
