'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

import { GetCollectionsTableControllerOutput } from '@/interface-adapters/controllers/get-collections-table.controller'
import { Input } from '@/web/_components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/web/_components/ui/table'
import { fuzzyFilter } from '@/web/_lib/fuzzy-filter'

type CollectionRow = GetCollectionsTableControllerOutput[0]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function CollectionsDataTable<TData extends CollectionRow, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      size: Number.MAX_SAFE_INTEGER,
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'fuzzy',
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
  })

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter collections..."
          value={globalFilter ?? ''}
          onChange={(event) =>
            setGlobalFilter(String(event.currentTarget.value))
          }
          className="max-w-sm"
        />
      </div>
      <div className="max-w-4xl rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { headerClassName } =
                    header.column.columnDef.meta ?? ({} as any)
                  return (
                    <TableHead className={headerClassName} key={header.id}>
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
    </>
  )
}
