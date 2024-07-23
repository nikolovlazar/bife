'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { toggleCollectionPublished } from '../actions'

import { ToggleCollectionPublishedInput } from '@/interface-adapters/validation-schemas/collections'
import { Switch } from '@/web/_components/ui/switch'

export function CollectionPublishedSwitch({
  fingerprint,
  checked,
}: {
  fingerprint: string
  checked: boolean
}) {
  const [isPending, setIsPending] = useState(false)
  async function execute(input: ToggleCollectionPublishedInput) {
    try {
      setIsPending(true)
      await toggleCollectionPublished(input)
      toast.success(
        'Collection ' + (input.checked ? 'published!' : 'unpublished!')
      )
    } catch (err) {
      // @ts-ignore
      toast.error(err.message)
    } finally {
      setIsPending(false)
    }
  }

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
