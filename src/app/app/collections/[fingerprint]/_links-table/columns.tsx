'use client'

import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { VisibilitySwitch } from './visibility-switch'
import type { Database } from '~/supabase/types.gen'

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
      <VisibilitySwitch
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Update link</DropdownMenuItem>
            <DropdownMenuItem>Delete link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
