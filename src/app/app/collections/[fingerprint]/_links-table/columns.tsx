'use client'

import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { EditLink } from '@/app/app/links/edit-link'

import { LinkVisibilitySwitch } from './link-visibility-switch'
import { RowDragHandle } from './row-drag-handle'
import type { Collection, Link } from '@/utils/types'

import { RemoveLinkFromCollectionConfirmation } from '../remove-link'

export type ColumnsType = Link & {
  visible: boolean
  order: number
  collectionFingerprint: Collection['fingerprint']
}
export const linkColumns: ColumnDef<ColumnsType>[] = [
  {
    accessorKey: 'order',
    header: '#',
    cell: ({ row }) => <RowDragHandle rowId={row.id} />,
    meta: { headerClassName: 'w-10 text-center', cellClassName: 'w-10' },
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'visible',
    header: 'Visible',
    cell: ({ row }) => (
      <LinkVisibilitySwitch
        linkFingerprint={row.original.fingerprint}
        collectionFingerprint={row.original.collectionFingerprint}
        checked={row.original.visible}
      />
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Date Created',
    cell: ({ row }) => dayjs(row.original.created_at).format('MMM D, YYYY'),
  },
  {
    id: 'actions',
    meta: { headerClassName: 'w-14', cellClassName: 'w-14' },
    cell: ({ row }) => {
      const link = row.original

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditLink
              fingerprint={link.fingerprint}
              label={link.label}
              url={link.url}
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                Edit link
              </DropdownMenuItem>
            </EditLink>
            <RemoveLinkFromCollectionConfirmation
              linkFingerprint={link.fingerprint}
              collectionFingerprint={link.collectionFingerprint}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer text-red-500"
              >
                Remove from collection
              </DropdownMenuItem>
            </RemoveLinkFromCollectionConfirmation>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
