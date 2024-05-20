'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Switch } from '@/components/ui/switch'

import { toggleCollectionPublished } from '../actions'

export function CollectionPublishedSwitch({
  fingerprint,
  checked,
}: {
  fingerprint: string
  checked: boolean
}) {
  const [loading, setLoading] = useState(false)
  const handleCheckedChange = async (value: boolean) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('fingerprint', fingerprint)
      formData.append('checked', value ? 'true' : 'false')

      await toggleCollectionPublished(formData)
      setLoading(false)
      toast.success('Collection ' + (value ? 'published' : 'unpublished'))
    } catch (e) {
      console.error(e)
      setLoading(false)
      if (e instanceof Error) {
        toast.error(`Failed to ${value ? 'publish' : 'unpublish'} collection`, {
          description: e.message,
        })
      }
    }
  }
  return (
    <Switch
      disabled={loading}
      defaultChecked={checked}
      onCheckedChange={handleCheckedChange}
    />
  )
}
