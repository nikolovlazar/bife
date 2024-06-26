'use client'

import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'

import { Switch } from '@/app/_components/ui/switch'

import { toggleLinkVisibility } from '@/app/app/links/actions'

export function LinkVisibilitySwitch({
  linkFingerprint,
  collectionFingerprint,
  checked,
}: {
  linkFingerprint: string
  collectionFingerprint: string
  checked: boolean
}) {
  const { isPending, execute } = useServerAction(toggleLinkVisibility, {
    onError: ({ err }) => {
      toast.error('Failed to update link visibility', {
        description: err.message,
      })
    },
    onSuccess: () => {
      toast.success('Link visibility changed!')
    },
  })

  const handleVisibilityChange = async (value: boolean) => {
    execute({
      link_pk: linkFingerprint,
      collection_pk: collectionFingerprint,
      checked: value,
    })
  }
  return (
    <Switch
      disabled={isPending}
      defaultChecked={checked}
      onCheckedChange={handleVisibilityChange}
    />
  )
}
