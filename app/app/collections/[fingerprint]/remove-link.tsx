'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { removeLinkFromCollection } from '../actions'

import { removeLinkFromCollectionInputSchema } from '@/interface-adapters/validation-schemas/collections'
import { HiddenInput } from '@/web/_components/custom/hidden-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/web/_components/ui/dialog'
import { Form, FormField } from '@/web/_components/ui/form'
import { SubmitButton } from '@/web/_components/ui/submit'

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
