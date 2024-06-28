'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { createLinkInputSchema } from '@/app/_lib/validation-schemas/links'

import { HiddenInput } from '@/app/_components/custom/hidden-input'
import { Button, type ButtonProps } from '@/app/_components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'
import { Input } from '@/app/_components/ui/input'
import { SubmitButton } from '@/app/_components/ui/submit'

import { createLink } from './actions'

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

    const form = useForm<z.infer<typeof createLinkInputSchema>>({
      resolver: zodResolver(createLinkInputSchema),
      defaultValues: {
        label: '',
        url: '',
        collection: collectionFingerprint,
      },
    })

    const { execute } = useServerAction(createLink, {
      onError: ({ err }) => {
        toast.error(err.message)
      },
      onSuccess: () => {
        toast.success('Link created!')
        setOpened(false)
      },
    })

    return (
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild>
          <Button {...props}>
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
                name="collection"
                render={({ field }) => <HiddenInput {...field} />}
              />
              <SubmitButton className="mt-4">Submit</SubmitButton>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }
)

CreateLink.displayName = 'CreateLink'
