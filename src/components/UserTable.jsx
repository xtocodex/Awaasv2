import { useState, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Inbox, BadgeInfo, Download, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const columnKeyMap = {
  'Name': 'name',
  'Email': 'email',
  'Type': 'type',
  'Company': 'company_name',
  'Phone': 'phone',
  'Address': 'address',
  'Role': 'role',
  'Phone Number': 'phoneNumber',
  'BHK': 'bhk',
  'Building': 'building',
  'Total Sessions': 'totalSessions',
  'Created At': 'createdAt',
}

const PAGE_SIZE_OPTIONS = [10, 15, 20]

function SortIcon({ column, sortState }) {
  if (sortState.key !== column) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40 inline" />
  return sortState.direction === 'asc'
    ? <ChevronUp className="w-3 h-3 ml-1 inline" />
    : <ChevronDown className="w-3 h-3 ml-1 inline" />
}

function UserTable({
  columns,
  data = [],
  onDelete,
  onAdd,
  addLabel,
  onView,
  onDownloadCsv,
  csvLoading = false,
  csvSelectionCount = 0,
  selectable = false,
  selectedRowIds = [],
  getRowId,
  onToggleRowSelection,
  onToggleAllRows,
  loading = false,
}) {
  const [search, setSearch] = useState('')
  const [sortState, setSortState] = useState({ key: null, direction: 'asc' })
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const hasActions = Boolean(onDelete || onView)
  const selectedRowIdSet = new Set(selectedRowIds)

  const searchableKeys = ['name', 'email']

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return data
    return data.filter(row =>
      searchableKeys.some(k => String(row[k] || '').toLowerCase().includes(q))
    )
  }, [data, search])

  const sorted = useMemo(() => {
    if (!sortState.key) return filtered
    const key = columnKeyMap[sortState.key] || sortState.key.toLowerCase()
    return [...filtered].sort((a, b) => {
      // createdAt is a formatted display string; sort by the raw timestamp when available
      if (key === 'createdAt' && (a.createdAtMs != null || b.createdAtMs != null)) {
        const cmp = (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0)
        return sortState.direction === 'asc' ? cmp : -cmp
      }
      const av = String(a[key] ?? '').toLowerCase()
      const bv = String(b[key] ?? '').toLowerCase()
      const cmp = av.localeCompare(bv, undefined, { numeric: true })
      return sortState.direction === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortState])

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const pageRows = sorted.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage)

  const rowIds = getRowId ? pageRows.map(row => getRowId(row)).filter(Boolean) : []
  const selectedVisibleCount = rowIds.filter(id => selectedRowIdSet.has(id)).length
  const allRowsSelected = selectable && rowIds.length > 0 && selectedVisibleCount === rowIds.length
  const someRowsSelected = selectable && selectedVisibleCount > 0 && !allRowsSelected

  function handleSort(col) {
    setSortState(prev =>
      prev.key === col
        ? { key: col, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key: col, direction: 'asc' }
    )
    setPage(1)
  }

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  const skeletonCols = 1 + columns.length + (hasActions ? 1 : 0) + (selectable ? 1 : 0)

  return (
    <Card>
      {/* Card header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">
            {addLabel} List
          </h2>
          <Badge variant="secondary">{data.length}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {onDownloadCsv && (
            <Button variant="outline" size="sm" onClick={onDownloadCsv} disabled={csvLoading} className="flex items-center">
              {csvLoading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin mr-1.5 shrink-0" />
                  Preparing…
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-1" />
                  {csvSelectionCount > 0 ? `CSV (${csvSelectionCount})` : 'CSV'}
                </>
              )}
            </Button>
          )}
          {onAdd && (
            <Button variant="default" size="sm" onClick={onAdd} className="flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              Add {addLabel}
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Search bar */}
      <div className="px-6 py-3 border-b border-border">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={handleSearch}
            placeholder="Search by name or email…"
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <CardContent className="p-0">
        <Table>

          {/* Column headers */}
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-12">
                S.No
              </TableHead>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allRowsSelected ? true : someRowsSelected ? 'indeterminate' : false}
                    onCheckedChange={() => onToggleAllRows?.(pageRows)}
                    aria-label="Select all players"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort(col)}
                >
                  {col}
                  <SortIcon column={col} sortState={sortState} />
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right w-24">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          {/* Rows */}
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent border-b border-border/50">
                  {Array.from({ length: skeletonCols }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 rounded bg-muted animate-pulse" style={{ width: j === 0 ? '2rem' : '70%' }} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sorted.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell
                  colSpan={skeletonCols}
                  className="py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="w-10 h-10 text-muted-foreground opacity-40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {search ? 'No results match your search' : 'No records found'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row, index) => {
                const rowId = getRowId?.(row)
                const globalIndex = (safePage - 1) * rowsPerPage + index + 1

                return (
                  <TableRow key={rowId || index}>
                    <TableCell className="text-sm text-muted-foreground font-normal w-12">
                      {globalIndex}
                    </TableCell>
                    {selectable && (
                      <TableCell className="w-12">
                        <Checkbox
                          checked={rowId ? selectedRowIdSet.has(rowId) : false}
                          onCheckedChange={() => rowId && onToggleRowSelection?.(rowId)}
                          aria-label={`Select ${row.name || 'player'}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => {
                      const key = columnKeyMap[col] || col.toLowerCase()
                      const value = row[key] || '—'

                      if (col === 'Type') {
                        return (
                          <TableCell key={col}>
                            <Badge variant="secondary">{value}</Badge>
                          </TableCell>
                        )
                      }

                      const isPrimary = col === 'Name' || col === 'Total Sessions'
                      return (
                        <TableCell
                          key={col}
                          className={isPrimary ? 'font-medium text-foreground' : 'text-muted-foreground'}
                        >
                          {value}
                        </TableCell>
                      )
                    })}

                    {hasActions && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onView(row)}
                              title="View details"
                              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                            >
                              <BadgeInfo className="w-4 h-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(row)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>

        </Table>
      </CardContent>

      {/* Pagination footer */}
      {!loading && sorted.length > 0 && (
        <CardFooter className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(val) => { setRowsPerPage(Number(val)); setPage(1) }}
            >
              <SelectTrigger className="h-8 w-[70px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map(n => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sorted.length > rowsPerPage && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {(safePage - 1) * rowsPerPage + 1}–{Math.min(safePage * rowsPerPage, sorted.length)} of {sorted.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground tabular-nums px-1">
                  {safePage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export default UserTable
