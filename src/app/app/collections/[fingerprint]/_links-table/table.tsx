'use client'

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { startTransition, useOptimistic } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ColumnsType } from './columns'
import { DraggableRow } from './draggable-row'

import { updateLinksOrder } from '../../actions'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function LinksDataTable<TData extends ColumnsType, TValue>({
  columns,
  data,
  collectionFingerprint,
}: DataTableProps<TData, TValue> & { collectionFingerprint: string }) {
  const [orderedData, setOrderedData] = useOptimistic<typeof data, typeof data>(
    data,
    (_, newData) => newData
  )
  const table = useReactTable({
    data: orderedData,
    columns,
    getRowId: (row) => row.fingerprint,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  })

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = orderedData.findIndex(
        ({ fingerprint }) => fingerprint === active.id.toString()
      )
      const newIndex = orderedData.findIndex(
        ({ fingerprint }) => fingerprint === over.id.toString()
      )
      const newData = arrayMove(orderedData, oldIndex, newIndex) //this is just a splice util
      updateLinksOrder(
        collectionFingerprint,
        newData.map((data, index) => ({
          fingerprint: data.fingerprint,
          order: index + 1,
        }))
      )
      startTransition(() => setOrderedData(newData))
      return newData
    }
  }

  return (
    <>
      <div className="grid rounded-md border">
        <DndContext
          id="links-table-dnd-context"
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
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
                <SortableContext
                  items={table.getRowModel().rows.map((row) => row.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
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
        </DndContext>
      </div>
    </>
  )
}
