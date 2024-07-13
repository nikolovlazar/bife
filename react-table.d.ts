export * from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy?: FilterFn<unknown>
  }
  interface TableOptions {
    filterFns?: FilterFns
  }
}
