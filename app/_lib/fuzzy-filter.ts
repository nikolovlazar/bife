import { rankItem } from '@tanstack/match-sorter-utils'
import { FilterFn } from '@tanstack/react-table'

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}
