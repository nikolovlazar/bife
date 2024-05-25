'use client'

import { useSortable } from '@dnd-kit/sortable'
import { GripVertical } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function RowDragHandle({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({ id: rowId })
  return (
    <Button
      variant="ghost"
      className="w-6 cursor-grab p-0"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-4 text-foreground/60" />
    </Button>
  )
}
