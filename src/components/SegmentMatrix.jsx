import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function getCellHeatClass(value) {
  if (value === undefined || value === null) return 'bg-transparent text-muted-foreground'
  if (value < 10) return 'bg-primary/[0.03] text-foreground'
  if (value < 20) return 'bg-primary/[0.08] text-foreground'
  if (value < 30) return 'bg-primary/[0.18] text-foreground font-medium'
  if (value < 40) return 'bg-primary/40 text-foreground font-semibold'
  return 'bg-primary/60 text-primary-foreground font-bold'
}

function SegmentMatrix({ matrix = [] }) {
  // Discover room keys dynamically
  const rooms = ['living', 'balcony', 'kitchen', 'vastu', 'bedroom']
  const roomLabels = {
    living: 'Living Room',
    balcony: 'Balcony Area',
    kitchen: 'Kitchen Space',
    vastu: 'Vastu Entrance',
    bedroom: 'Bedroom Area'
  }

  return (
    <Card className="border border-border">
      <CardHeader className="px-6 py-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Segment Behaviour Matrix (% Avg Dwell Time)
        </h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider pl-6 py-4">
                  Buyer Segment
                </TableHead>
                {rooms.map(rm => (
                  <TableHead key={rm} className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center py-4">
                    {roomLabels[rm]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={rooms.length + 1} className="py-10 text-center text-muted-foreground">
                    No segment matrix data available.
                  </TableCell>
                </TableRow>
              ) : (
                matrix.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent border-b border-border">
                    <TableCell className="font-bold text-foreground pl-6 py-4">
                      {row.segment}
                    </TableCell>
                    {rooms.map(rm => {
                      const val = row.rooms?.[rm] ?? 0
                      return (
                        <TableCell 
                          key={rm} 
                          className={cn(
                            "text-center py-4 transition-colors duration-150 border-r border-border/40 last:border-r-0",
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

export default SegmentMatrix
