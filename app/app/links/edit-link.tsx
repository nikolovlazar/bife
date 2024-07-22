'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { updateLink } from './actions'
import { updateLinkInputSchema } from '@/interface-adapters/validation-schemas/links'
import { HiddenInput } from '@/web/_components/custom/hidden-input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/web/_components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/web/_components/ui/form'
import { Input } from '@/web/_components/ui/input'
import { SubmitButton } from '@/web/_components/ui/submit'

export function EditLink({
  fingerprint,
  url,
  label,
  children,
}: {
  fingerprint: string
  url: string
  label: string
  children: ReactNode
}) {
  const [opened, setOpened] = useState(false)
  const form = useForm<z.infer<typeof updateLinkInputSchema>>({
    resolver: zodResolver(updateLinkInputSchema),
    defaultValues: {
      label,
      url,
      fingerprint,
    },
  })

  const { execute } = useServerAction(updateLink, {
    onError: ({ err }) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('Link updated!')
      setOpened(false)
    },
  })

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => execute(values))}
            className="grid gap-2"
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fingerprint"
              render={({ field }) => <HiddenInput {...field} />}
            />
            <SubmitButton className="mt-4">Submit</SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
