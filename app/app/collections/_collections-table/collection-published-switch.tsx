'use client'

import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

import { toggleCollectionPublished } from '../actions'

import { Switch } from '@/web/_components/ui/switch'

export function CollectionPublishedSwitch({
  fingerprint,
  checked,
}: {
  fingerprint: string
  checked: boolean
}) {
  const { isPending, execute } = useServerAction(toggleCollectionPublished, {
    onError: ({ err }) => {
      toast.error(err.message)
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
