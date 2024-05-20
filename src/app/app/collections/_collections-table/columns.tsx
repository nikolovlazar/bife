'use client'

import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { CollectionPublishedSwitch } from './collection-published-switch'
import type { Database } from '~/supabase/types.gen'

import { DeleteCollectionConfirmation } from '../[fingerprint]/delete-collection'

export type Collection = Database['public']['Tables']['link_collection']['Row']

export const collectionColumns: ColumnDef<Collection>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link href={`/app/collections/${row.original.fingerprint}`}>
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'published',
    header: 'Published',
    cell: ({ row }) => (
      <CollectionPublishedSwitch
        fingerprint={row.original.fingerprint}
        checked={row.original.published}
      />
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Date Created',
    cell: ({ row }) => dayjs(row.original.created_at).format('MMM D, YYYY'),
  },
  {
    accessorKey: 'fingerprint',
    header: 'Fingerprint',
  },
  {
    id: 'actions',
    size: 35,
    meta: { headerClassName: 'w-14', cellClassName: 'w-14' },
    cell: ({ row }) => {
      const collection = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/${collection.fingerprint}`
                )
                toast.success('URL copied to clipboard')
              }}
            >
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                className="cursor-pointer"
                href={`/app/collections/${row.original.fingerprint}`}
              >
                Edit collection
              </Link>
            </DropdownMenuItem>
            <DeleteCollectionConfirmation
              fingerprint={row.original.fingerprint}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive cursor-pointer"
              >
                Delete collection
              </DropdownMenuItem>
            </DeleteCollectionConfirmation>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
