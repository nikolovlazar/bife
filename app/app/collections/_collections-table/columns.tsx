'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { DeleteCollectionConfirmation } from '../[fingerprint]/delete-collection'

import { CollectionPublishedSwitch } from './collection-published-switch'
import type { GetCollectionsTableControllerOutput } from '@/interface-adapters/controllers/get-collections-table.controller'
import { Button } from '@/web/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/web/_components/ui/dropdown-menu'

type CollectionRow = GetCollectionsTableControllerOutput['data'][0]

export const collectionColumns: ColumnDef<CollectionRow>[] = [
  {
    accessorKey: 'title',
    filterFn: 'includesString',
    size: 500,
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
    filterFn: 'includesString',
    header: 'Description',
    size: NaN,
  },
  {
    accessorKey: 'published',
    header: 'Published',
    size: 100,
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
    size: 130,
  },
  {
    accessorKey: 'fingerprint',
    header: 'Fingerprint',
    filterFn: 'equalsString',
    size: 130,
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
                className="cursor-pointer text-red-500"
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
