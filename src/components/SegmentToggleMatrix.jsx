import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Heat coloring for a 0-100 percentage value
function getCellHeatClass(value) {
  if (value === undefined || value === null) return 'bg-transparent text-muted-foreground'
  if (value < 10) return 'bg-primary/[0.03] text-foreground'
  if (value < 20) return 'bg-primary/[0.08] text-foreground'
  if (value < 30) return 'bg-primary/[0.18] text-foreground font-medium'
  if (value < 40) return 'bg-primary/40 text-foreground font-semibold'
  return 'bg-primary/60 text-primary-foreground font-bold'
}

const DIMENSION_TABS = [
  { key: 'age_bracket', label: 'Age Bracket' },
  { key: 'work_profile', label: 'Work Profile' },
  { key: 'lead_source', label: 'Lead Source' },
]

/**
 * Module 6 §8.1 Segment View — renders one of three buyer-segment dimensions:
 *   - Age bracket vs feature interaction
 *   - Work profile vs room engagement
 *   - Lead source vs session engagement
 * Driven by `dimensions` = { age_bracket, work_profile, lead_source }, each
 * { row_header, caption, columns: [{key,label}], rows: [{label, values}] }.
 */
function SegmentToggleMatrix({ dimensions }) {
  const [active, setActive] = useState('age_bracket')
  const dim = dimensions?.[active]

  return (
    <Card className="border border-border h-full">
      <CardHeader className="px-6 py-5 border-b border-border flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Buyer Segment Behaviour
        </h3>
        <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border/50 w-fit">
          {DIMENSION_TABS.map(tab => (
            <Button
              key={tab.key}
              variant="ghost"
              size="sm"
              onClick={() => setActive(tab.key)}
              className={cn(
                'h-7 text-xs px-3 rounded-md',
                active === tab.key
                  ? 'bg-background text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        {dim?.caption && (
          <p className="text-xs text-muted-foreground">{dim.caption}</p>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider pl-6 py-4">
                  {dim?.row_header || 'Segment'}
                </TableHead>
                {dim?.columns?.map(col => (
                  <TableHead key={col.key} className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center py-4">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!dim || dim.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(dim?.columns?.length || 0) + 1} className="py-10 text-center text-muted-foreground">
                    No segment data available.
                  </TableCell>
                </TableRow>
              ) : (
                dim.rows.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent border-b border-border">
                    <TableCell className="font-bold text-foreground pl-6 py-4">{row.label}</TableCell>
                    {dim.columns.map(col => {
                      const val = row.values?.[col.key] ?? 0
                      return (
                        <TableCell
                          key={col.key}
                          className={cn(
                            'text-center py-4 transition-colors duration-150 border-r border-border/40 last:border-r-0',
                            getCellHeatClass(val)
                          )}
                        >
                          {val}%
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default SegmentToggleMatrix
