'use client'

import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

import { Switch } from '@/components/ui/switch'

import { toggleCollectionPublished } from '../actions'

export function CollectionPublishedSwitch({
  fingerprint,
  checked,
}: {
  fingerprint: string
  checked: boolean
}) {
  const { isPending, execute } = useServerAction(toggleCollectionPublished, {
    onError: ({ err }) => {
      toast.error(`Failed to ${checked ? 'unpublish' : 'publish'} collection`, {
        description: err.message,
      })
    },
    onSuccess: ({ data }) => {
      toast.success(
        'Collection ' + (data.published ? 'published!' : 'unpublished!')
      )
    },
  })
  const handleCheckedChange = async (value: boolean) => {
    execute({
      fingerprint,
      checked: value,
    })
  }
  return (
    <Switch
      disabled={isPending}
      defaultChecked={checked}
      onCheckedChange={handleCheckedChange}
    />
  )
}
