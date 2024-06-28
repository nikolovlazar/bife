'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { createCollectionInputSchema } from '@/app/_lib/validation-schemas/collections'

import { Button } from '@/app/_components/ui/button'
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

import { createCollection } from './actions'

export default function CreateCollection() {
  const [opened, setOpened] = useState(false)

  const form = useForm<z.infer<typeof createCollectionInputSchema>>({
    resolver: zodResolver(createCollectionInputSchema),
    defaultValues: {
      title: '',
    },
  })

  const { execute } = useServerAction(createCollection, {
    onError: ({ err }) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('Collection created!')
      setOpened(false)
    },
  })

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 w-4" /> Create a collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create collection</DialogTitle>
          <DialogDescription>
            Collections are shareable lists of links.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => execute(values))}
            className="grid w-full items-center gap-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="ReactConf 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton className="mt-4" type="submit">
              Create
            </SubmitButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
