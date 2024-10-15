'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { LinkRow } from '@/interface-adapters/controllers/get-own-links.controller'
import { Button } from '@/web/_components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/web/_components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalCount: number
  page: number
  pageSize: number
}

export function LinksDataTable<TData extends LinkRow, TValue>({
  columns,
  data,
  totalCount,
  page,
  pageSize,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      size: Number.MAX_SAFE_INTEGER,
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  })

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?page=${newPage}&pageSize=${pageSize}`)
  }

  return (
    <>
      <div className="my-4 grid rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { headerClassName } =
                    header.column.columnDef.meta ?? ({} as any)
                  return (
                    <TableHead
                      className={headerClassName}
                      key={header.id}
                      style={{
                        width: !Number.isNaN(header.column.getSize())
                          ? `${header.column.getSize()}px`
                          : 'auto',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original.fingerprint}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    const { cellClassName } =
                      cell.column.columnDef.meta ?? ({} as any)
                    return (
                      <TableCell className={cellClassName} key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page * pageSize >= totalCount}
        >
          Next
        </Button>
      </div>
    </>
  )
}
