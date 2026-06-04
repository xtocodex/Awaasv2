import { useState, useMemo } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LayoutGrid, List, AlertTriangle, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

const RISK_BADGES = {
  GREEN: {
    label: 'Good Engagement',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2
  },
  AMBER: {
    label: 'Attention Needed',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: AlertTriangle
  },
  RED: {
    label: 'High Drop-off Risk',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: AlertCircle
  }
}

function InventoryHeatmap({ flats = [], onFlatClick }) {
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [filterConfig, setFilterConfig] = useState('ALL') // 'ALL' | '2BHK' | '3BHK' | '4BHK'
  const [filterRisk, setFilterRisk] = useState('ALL') // 'ALL' | 'GREEN' | 'AMBER' | 'RED'

  // Extract unique configs for filter tabs
  const configs = useMemo(() => {
    const set = new Set(flats.map(f => f.config))
    return ['ALL', ...Array.from(set).sort()]
  }, [flats])

  // Filter flats
  const filteredFlats = useMemo(() => {
    return flats.filter(flat => {
      const matchConfig = filterConfig === 'ALL' || flat.config === filterConfig
      const matchRisk = filterRisk === 'ALL' || flat.risk === filterRisk
      return matchConfig && matchRisk
    })
  }, [flats, filterConfig, filterRisk])

  return (
    <div className="space-y-6">
      {/* Filters & Toggles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border">
        {/* Left Side: Filter Tabs */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unit Type</span>
            <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border/50">
              {configs.map(cfg => (
                <Button
                  key={cfg}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterConfig(cfg)}
                  className={cn(
                    "h-7 text-xs px-2.5 rounded-md",
                    filterConfig === cfg 
                      ? "bg-background text-foreground font-semibold shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cfg}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Risk Level</span>
            <div className="flex gap-1 bg-muted p-0.5 rounded-lg border border-border/50">
              {['ALL', 'GREEN', 'AMBER', 'RED'].map(risk => (
                <Button
                  key={risk}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterRisk(risk)}
                  className={cn(
                    "h-7 text-xs px-2.5 rounded-md",
                    filterRisk === risk 
                      ? "bg-background text-foreground font-semibold shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {risk === 'ALL' ? 'All' : risk}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Grid / List View Toggle */}
        <div className="flex flex-col gap-1.5 self-end sm:self-auto">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right hidden sm:block">View Mode</span>
          <div className="flex bg-muted p-0.5 rounded-lg border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn("w-8 h-8 rounded-md", viewMode === 'grid' ? "bg-background text-primary shadow-sm" : "text-muted-foreground")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn("w-8 h-8 rounded-md", viewMode === 'list' ? "bg-background text-primary shadow-sm" : "text-muted-foreground")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Heatmap Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFlats.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground bg-card border border-border rounded-xl">
              No flats match selected filters.
            </div>
          ) : (
            filteredFlats.map(flat => {
              const badge = RISK_BADGES[flat.risk] || RISK_BADGES.GREEN
              return (
                <div
                  key={flat.flat_id}
                  onClick={() => onFlatClick(flat)}
                  className={cn(
                    "group relative overflow-hidden bg-card border border-border rounded-xl p-5 cursor-pointer select-none",
                    "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
                    "active:scale-[0.98]"
                  )}
                >
                  {/* Top: Flat number & trend arrow */}
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-muted-foreground">{flat.config}</span>
                    <span className={cn(
                      "flex items-center text-[10px] font-bold px-1 rounded-sm",
                      flat.trend_pct >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                    )}>
                      {flat.trend_pct >= 0 ? '+' : ''}{flat.trend_pct}%
                    </span>
                  </div>

                  {/* Mid: Flat Name */}
                  <h4 className="text-base font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                    {flat.flat_number}
                  </h4>

                  {/* Bottom: Engagement Score */}
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">
                      {flat.engagement_score}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">Score</span>
                  </div>

                  {/* Avg completion % */}
                  {flat.completion_pct !== undefined && (
                    <div className="mt-1 text-[10px] font-medium text-muted-foreground">
                      {flat.completion_pct}% avg completion
                    </div>
                  )}

                  {/* Footer status line */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                    <span className={cn("w-2 h-2 rounded-full", badge.dot)} />
                    <span className="truncate">{badge.label}</span>
                  </div>

                  {/* Action prompt icon on hover */}
                  <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        /* List View (Table Format) */
        <Card className="overflow-hidden border border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-border">
                  <TableHead className="w-28 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Flat Number</TableHead>
                  <TableHead className="w-24 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</TableHead>
                  <TableHead className="w-36 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engagement Score</TableHead>
                  <TableHead className="w-32 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completion %</TableHead>
                  <TableHead className="w-40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk Level</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Issue</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      No flats match selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFlats.map(flat => {
                    const badge = RISK_BADGES[flat.risk] || RISK_BADGES.GREEN
                    const Icon = badge.icon
                    return (
                      <TableRow 
                        key={flat.flat_id} 
                        onClick={() => onFlatClick(flat)}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-bold text-foreground">{flat.flat_number}</TableCell>
                        <TableCell className="text-muted-foreground">{flat.config}</TableCell>
                        <TableCell className="font-semibold text-foreground">{flat.engagement_score}</TableCell>
                        <TableCell className="text-muted-foreground">{flat.completion_pct}%</TableCell>
                        <TableCell>
                          <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border", badge.bg)}>
                            <Icon className="w-3 h-3" />
                            {flat.risk}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">{flat.primary_issue}</TableCell>
                        <TableCell className="max-w-[250px] truncate text-foreground font-medium">{flat.suggested_action}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default InventoryHeatmap
