'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateCollection } from '../actions'

import { DeleteCollectionConfirmation } from './delete-collection'
import {
  UpdateCollectionInput,
  updateCollectionInputSchema,
} from '@/interface-adapters/validation-schemas/collections'
import { HiddenInput } from '@/web/_components/custom/hidden-input'
import { Button } from '@/web/_components/ui/button'
import { Checkbox } from '@/web/_components/ui/checkbox'
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

export default function UpdateOrDeleteCollection({
  title,
  description,
  fingerprint,
  published,
}: {
  title: string
  description: string | undefined
  fingerprint: string
  published: boolean
}) {
  const form = useForm<z.infer<typeof updateCollectionInputSchema>>({
    resolver: zodResolver(updateCollectionInputSchema),
    defaultValues: {
      title,
      description,
      fingerprint,
      published,
    },
  })

  async function execute(input: UpdateCollectionInput) {
    try {
      await updateCollection(input)
      toast.success('Collection updated!')
    } catch (err) {
      // @ts-ignore
      toast.error(err.message)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => execute(values))}
        className="w-full xl:max-w-lg"
      >
        <fieldset className="grid items-start gap-4 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">
            Collection details
          </legend>
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
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-6 w-6"
                  />
                </FormControl>
                <FormLabel className="ml-2 pb-2">Published</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fingerprint"
            render={({ field }) => <HiddenInput {...field} />}
          />
          <SubmitButton>Update</SubmitButton>
          <DeleteCollectionConfirmation fingerprint={fingerprint}>
            <Button variant="destructive">Delete</Button>
          </DeleteCollectionConfirmation>
          <Button asChild variant="ghost">
            <Link
              href={`/${fingerprint}`}
              target="_blank"
              className="flex items-center gap-2"
            >
              View collection page
              <ExternalLink className="w-4" />
            </Link>
          </Button>
        </fieldset>
      </form>
    </Form>
  )
}
