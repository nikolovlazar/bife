'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { Switch } from '@/components/ui/switch'

import { toggleLinkVisibility } from '../../actions'

export function LinkVisibilitySwitch({
  linkId,
  checked,
}: {
  linkId: number
  checked: boolean
}) {
  const [loading, setLoading] = useState(false)
  const handleVisibilityChange = async (value: boolean) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('id', linkId + '')
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
