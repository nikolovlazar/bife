'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Switch } from '@/components/ui/switch'

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
  const [loading, setLoading] = useState(false)
  const handleVisibilityChange = async (value: boolean) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('link_pk', linkFingerprint)
      formData.append('collection_pk', collectionFingerprint)
      formData.append('checked', value ? 'true' : 'false')

      await toggleLinkVisibility(formData)
      setLoading(false)
      toast.success('Link visibility updated')
    } catch (e) {
      console.error(e)
      setLoading(false)
      if (e instanceof Error) {
        toast.error('Failed to update link visibility', {
          description: e.message,
        })
      }
    }
  }
  return (
    <Switch
      disabled={loading}
      defaultChecked={checked}
      onCheckedChange={handleVisibilityChange}
    />
  )
}
