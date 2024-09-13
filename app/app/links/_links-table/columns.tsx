'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import { DeleteLinkConfirmation } from '../delete-link'
import { EditLink } from '../edit-link'

import { LinkRow } from '@/interface-adapters/controllers/get-own-links.controller'
import { Button } from '@/web/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/web/_components/ui/dropdown-menu'

export const linkColumns: ColumnDef<LinkRow>[] = [
  {
    accessorKey: 'url',
    header: 'URL',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'label',
    header: 'Label',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'fingerprint',
    header: 'Fingerprint',
    filterFn: 'equalsString',
  },
  {
    accessorKey: 'created_at',
    header: 'Date Created',
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
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/${link.fingerprint}`
                )
                toast.success('URL copied to clipboard')
              }}
            >
              Copy URL
            </DropdownMenuItem>
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
            <DeleteLinkConfirmation fingerprint={link.fingerprint}>
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onSelect={(e) => e.preventDefault()}
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
