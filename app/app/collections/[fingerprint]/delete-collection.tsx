'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { deleteCollection } from '../actions'

import {
  DeleteCollectionInput,
  deleteCollectionInputSchema,
} from '@/interface-adapters/validation-schemas/collections'
import { HiddenInput } from '@/web/_components/custom/hidden-input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/web/_components/ui/alert-dialog'
import { Form, FormField } from '@/web/_components/ui/form'
import { SubmitButton } from '@/web/_components/ui/submit'

export function DeleteCollectionConfirmation({
  fingerprint,
  children,
}: {
  fingerprint: string
  children: ReactNode
}) {
  const form = useForm<z.infer<typeof deleteCollectionInputSchema>>({
    resolver: zodResolver(deleteCollectionInputSchema),
    defaultValues: {
      fingerprint: fingerprint,
    },
  })

  async function execute(input: DeleteCollectionInput) {
    try {
      await deleteCollection(input)
      toast.success('Collection deleted!')
    } catch (err) {
      // @ts-ignore
      toast.error(err.message)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the collection and all of its links.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => execute(values))}>
            <AlertDialogFooter>
              <FormField
                control={form.control}
                name="fingerprint"
                render={({ field }) => <HiddenInput {...field} />}
              />
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <SubmitButton className="bg-destructive hover:bg-destructive/80">
                  Yes, delete the collection
                </SubmitButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
