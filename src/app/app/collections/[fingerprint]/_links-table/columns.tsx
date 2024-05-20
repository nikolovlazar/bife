'use client'

import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { LinkVisibilitySwitch } from './link-visibility-switch'
import type { Database } from '~/supabase/types.gen'

import { DeleteLinkConfirmation } from '../delete-link'
import { UpdateLink } from '../update-link'

type Link = Database['public']['Tables']['link']['Row']

export const linkColumns: ColumnDef<Link>[] = [
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'visible',
    header: 'Visible',
    cell: ({ row }) => (
      <LinkVisibilitySwitch
        linkId={row.original.id}
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
    size: 35,
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UpdateLink
              linkId={link.id}
              description={link.description}
              url={link.url}
              visible={link.visible}
            >
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                Update link
              </DropdownMenuItem>
            </UpdateLink>
            <DeleteLinkConfirmation linkId={link.id}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive cursor-pointer"
              >
                Delete link
              </DropdownMenuItem>
            </DeleteLinkConfirmation>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
