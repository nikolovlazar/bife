'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { ToggleLinkVisibilityInput } from '@/interface-adapters/validation-schemas/links'
import { Switch } from '@/web/_components/ui/switch'
import { toggleLinkVisibility } from '@/web/app/links/actions'

export function LinkVisibilitySwitch({
  linkFingerprint,
  collectionFingerprint,
  checked,
}: {
  linkFingerprint: string
  collectionFingerprint: string
  checked: boolean
}) {
  const [isPending, setIsPending] = useState(false)
  const execute = async (input: ToggleLinkVisibilityInput) => {
    try {
      setIsPending(true)
      await toggleLinkVisibility(input)
      toast.success('Link visibility changed!')
    } catch (err) {
      toast.error('Failed to update link visibility', {
        // @ts-ignore
        description: err.message,
      })
    } finally {
      setIsPending(false)
    }
  }

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
