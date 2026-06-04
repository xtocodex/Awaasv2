import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { api } from '../api/endpoints'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Info, AlertCircle, Sparkles, UserCheck, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const IMPACT_COLORS = {
  high: 'bg-rose-50 text-rose-700 border-rose-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-blue-50 text-blue-700 border-blue-200'
}

function FlatDeepDivePanel({ open, onOpenChange, flatId }) {
  const queryClient = useQueryClient()

  // Fetch deep dive data
  const { data: deepDive, isLoading, error } = useQuery({
    queryKey: ['flat-deep-dive', flatId],
    queryFn: () => api.getFlatDeepDive(flatId),
    enabled: open && !!flatId,
  })

  // Action status mutation
  const assignMutation = useMutation({
    mutationFn: ({ status }) => api.updateRecommendationStatus(flatId, status), // Mock endpoint status update
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === 'assigned' 
          ? 'Flat flagged and assigned to sales team!' 
          : 'Flat action marked as completed!'
      )
      queryClient.invalidateQueries(['action-recommendations'])
      onOpenChange(false)
    },
    onError: () => {
      toast.error('Failed to submit action. Please try again.')
    }
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto bg-card border-l border-border p-6">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Info className="h-5 w-5" />
            </div>
            <SheetTitle className="text-xl font-bold text-foreground">
              {deepDive?.flat_number || 'Flat Deep-Dive'}
            </SheetTitle>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="h-28 rounded-xl bg-muted animate-pulse" />
            <div className="h-48 rounded-xl bg-muted animate-pulse" />
            <div className="h-32 rounded-xl bg-muted animate-pulse" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg p-4">
            Failed to load deep-dive metrics. Please retry.
          </div>
        ) : deepDive ? (
          <div className="space-y-6 text-sm">
            {/* Flat stats strip */}
            <div className="grid grid-cols-3 gap-4 border border-border bg-muted/30 rounded-xl p-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Session Count</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{deepDive.session_count}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Drop-off Rate</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{deepDive.drop_off_rate}%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</p>
                <Badge variant="outline" className="mt-1 bg-background">Active</Badge>
              </div>
            </div>

            {/* Engagement Trend Chart */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Engagement Trend (Last 10 Sessions)</h4>
              <div className="h-44 w-full bg-muted/10 rounded-xl border border-border p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={deepDive.engagement_trend.map((val, i) => ({ session: `S${i+1}`, val }))}>
                    <XAxis dataKey="session" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="val" name="Score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Room breakdown chart */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Room Dwell-Time Distribution (%)</h4>
              <div className="h-48 w-full bg-muted/10 rounded-xl border border-border p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deepDive.room_breakdown} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="room" type="category" stroke="#94a3b8" fontSize={11} width={85} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Bar dataKey="pct" name="Dwell %" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gaze Attention Heatmap Overlay (Module 6 §8.1 Inventory View) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Gaze Attention Heatmap</h4>
              {(() => {
                const rooms = deepDive.room_breakdown || []
                const maxPct = Math.max(...rooms.map(r => r.pct), 1)
                return (
                  <div className="bg-muted/10 rounded-xl border border-border p-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {rooms.map((room, idx) => {
                        const intensity = room.pct / maxPct // 0..1
                        return (
                          <div
                            key={idx}
                            className="relative rounded-lg border border-border/60 p-3 h-20 flex flex-col justify-between overflow-hidden"
                            title={`${room.room}: ${room.pct}% gaze dwell`}
                          >
                            {/* Heat overlay */}
                            <div
                              className="absolute inset-0"
                              style={{ backgroundColor: 'hsl(var(--primary))', opacity: 0.08 + intensity * 0.62 }}
                            />
                            <span className="relative text-[11px] font-semibold text-foreground leading-tight">{room.room}</span>
                            <span className={cn('relative text-sm font-bold', intensity > 0.55 ? 'text-primary-foreground' : 'text-foreground')}>
                              {room.pct}%
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    {/* Legend */}
                    <div className="flex items-center justify-end gap-2 mt-3">
                      <span className="text-[10px] text-muted-foreground">Low gaze</span>
                      <div className="h-2 w-24 rounded-full" style={{ background: 'linear-gradient(to right, hsl(var(--primary) / 0.12), hsl(var(--primary)))' }} />
                      <span className="text-[10px] text-muted-foreground">High gaze</span>
                    </div>
                  </div>
                )
              })()}
            </div>

            <Separator />

            {/* Issues list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Issues Detected
              </h4>
              <ul className="space-y-2">
                {deepDive.issues.map((issue, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start bg-rose-50/50 border border-rose-100 rounded-lg p-3 text-rose-950">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested actions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Suggested Actions
              </h4>
              <div className="space-y-2.5">
                {deepDive.suggested_actions.map((act, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 bg-card border border-border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Action #{idx+1}</span>
                      <Badge variant="outline" className={cn("text-[9px] font-bold py-0 uppercase border", IMPACT_COLORS[act.impact] || IMPACT_COLORS.low)}>
                        {act.impact} impact
                      </Badge>
                    </div>
                    <p className="text-foreground font-medium">{act.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="pt-4 border-t border-border flex gap-3">
              <Button
                variant="outline"
                className="flex-1 text-xs border-border hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                onClick={() => assignMutation.mutate({ status: 'actioned' })}
                disabled={assignMutation.isPending}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Mark Completed
              </Button>
              <Button
                variant="default"
                className="flex-1 text-xs"
                onClick={() => assignMutation.mutate({ status: 'assigned' })}
                disabled={assignMutation.isPending}
              >
                <UserCheck className="w-4 h-4 mr-1.5" />
                Assign to Sales
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export default FlatDeepDivePanel
