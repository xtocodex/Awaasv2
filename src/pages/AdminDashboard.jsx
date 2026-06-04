import { useQuery } from '@tanstack/react-query'
import { api } from '../api/endpoints'
import KpiCard from '../components/KpiCard'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  ShieldAlert,
  Activity,
  Database,
  AlertCircle,
  TrendingUp,
  LayoutGrid,
  HardDrive,
  Headphones,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MonitorPlay
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ZONE_KEYS = [
  { key: 'living', label: 'Living', color: '#6366f1' },
  { key: 'balcony', label: 'Balcony', color: '#0ea5e9' },
  { key: 'kitchen', label: 'Kitchen', color: '#10b981' },
  { key: 'bedroom', label: 'Bedroom', color: '#f59e0b' },
  { key: 'vastu', label: 'Vastu', color: '#f43f5e' },
]

const VALIDATION_STYLES = {
  pass: { icon: CheckCircle2, badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Pass' },
  warn: { icon: AlertTriangle, badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Warning' },
  fail: { icon: XCircle, badge: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Fail' },
}

/**
 * Admin screens (Module 6 §8.3). Driven by `view`:
 *   - 'data-health'       → Data Operations + Analytics
 *   - 'render-comparison' → Rendering Mode Comparison (Pilot Phase)
 */
function AdminDashboard({ view = 'data-health' }) {
  const isRenderView = view === 'render-comparison'

  // Query data health (Data Ops + Analytics)
  const { data: health, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['admin-data-health'],
    queryFn: api.getDataHealth,
    enabled: !isRenderView,
  })

  // Query render A/B comparison
  const { data: comparison, isLoading: isLoadingComparison } = useQuery({
    queryKey: ['admin-render-comparison'],
    queryFn: api.getRenderComparison,
    enabled: isRenderView,
  })

  // Transform A/B details for bar charts
  const comparisonData = comparison ? [
    {
      metric: 'Avg Engagement (%)',
      Panoramic: comparison.panoramic.avg_engagement,
      '3D Unreal': comparison.threeD.avg_engagement
    },
    {
      metric: 'Walkthrough Complete (%)',
      Panoramic: comparison.panoramic.avg_completion,
      '3D Unreal': comparison.threeD.avg_completion
    }
  ] : []

  const engagementLift = comparison ? +(comparison.threeD.avg_engagement - comparison.panoramic.avg_engagement).toFixed(1) : 0
  const completionLift = comparison ? +(comparison.threeD.avg_completion - comparison.panoramic.avg_completion).toFixed(1) : 0

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            {isRenderView ? <MonitorPlay className="w-6 h-6 text-primary" /> : <ShieldAlert className="w-6 h-6 text-primary" />}
            {isRenderView ? 'Rendering Mode Comparison' : 'AWAAS System Administration'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRenderView
              ? 'Pilot-phase side-by-side engagement metrics for Panoramic vs 3D sessions'
              : 'Data health integrity, audio storage, validation reports, and zone analytics'}
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase font-bold text-xs">
          {isRenderView ? 'Pilot Phase' : 'Admin Session'}
        </Badge>
      </div>

      {/* ===================== DATA HEALTH VIEW ===================== */}
      {!isRenderView && (
        <>
          {/* Row 1: KPI Cards */}
          {isLoadingHealth ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-card border border-border" />
              ))}
            </div>
          ) : health ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard
                label="Sync Failure Rate"
                value={`${health.sync_failure_rate}%`}
                subtext="API write delays"
                trend={-12.4}
                sparkline={[0.2, 0.18, 0.19, 0.15, 0.14, 0.13, 0.12]}
                icon={Activity}
              />
              <KpiCard
                label="Event Completeness"
                value={`${health.event_completeness_pct}%`}
                subtext="Gaze data packet integrity"
                trend={1.2}
                sparkline={[97.5, 97.8, 98, 98.1, 98.2, 98.4, 98.4]}
                icon={Database}
              />
              <KpiCard
                label="Active Alert Warnings"
                value={health.alerts.length}
                subtext="System issues flagged"
                icon={AlertCircle}
              />
            </div>
          ) : null}

          {/* Row 2: Project streams & Live Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Streams */}
            <Card className="border border-border lg:col-span-2">
              <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Project Data Streams
                </h3>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingHealth ? (
                  <div className="h-40 bg-muted/20 animate-pulse" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-transparent border-b border-border">
                        <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider pl-6 py-4">Project ID</TableHead>
                        <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center py-4">Total Packets</TableHead>
                        <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right pr-6 py-4">Stream Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {health?.sessions_per_project.map((proj) => (
                        <TableRow key={proj.project_id} className="border-b border-border hover:bg-muted/10 transition-colors">
                          <TableCell className="font-bold text-foreground pl-6 py-4">{proj.project_id}</TableCell>
                          <TableCell className="text-center py-4 text-foreground font-semibold">{proj.count} sessions</TableCell>
                          <TableCell className="text-right pr-6 py-4">
                            <span className={cn(
                              "font-bold text-xs",
                              proj.trend_pct >= 0 ? "text-emerald-600" : "text-rose-600"
                            )}>
                              {proj.trend_pct >= 0 ? '↑' : '↓'} {Math.abs(proj.trend_pct)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Live Alerts list */}
            <Card className="border border-border">
              <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Live System Alerts
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingHealth ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-10 bg-muted/20 rounded-lg" />
                  </div>
                ) : !health || health.alerts.length === 0 ? (
                  <div className="text-muted-foreground text-center py-10">No warnings in queue.</div>
                ) : (
                  <ul className="space-y-3">
                    {health.alerts.map((alert, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start bg-rose-50/50 border border-rose-100 rounded-lg p-3 text-rose-950 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                        <span className="font-medium">{alert}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Audio File Storage (Data Ops) + Data Quality Validation (Analytics) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audio File Storage Status */}
            <Card className="border border-border">
              <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Audio File Storage
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingHealth || !health?.audio_storage ? (
                  <div className="h-40 bg-muted/20 animate-pulse rounded-lg" />
                ) : (() => {
                  const a = health.audio_storage
                  const usedPct = Math.round((a.used_gb / a.capacity_gb) * 100)
                  return (
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Headphones className="w-3.5 h-3.5" /> {a.used_gb} GB of {a.capacity_gb} GB used
                          </span>
                          <span className="text-xs font-bold text-foreground">{usedPct}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', usedPct >= 85 ? 'bg-rose-500' : usedPct >= 60 ? 'bg-amber-500' : 'bg-primary')}
                            style={{ width: `${usedPct}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="rounded-lg border border-border p-3">
                          <p className="text-lg font-bold text-foreground">{a.total_files.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Files</p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <p className="text-lg font-bold text-foreground">{a.uploaded_today}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Uploaded Today</p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <p className="text-lg font-bold text-amber-600">{a.pending_sync}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending Sync</p>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <p className={cn('text-lg font-bold', a.failed_uploads > 0 ? 'text-rose-600' : 'text-emerald-600')}>{a.failed_uploads}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Failed Uploads</p>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Data Quality Validation Reports */}
            <Card className="border border-border lg:col-span-2">
              <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Data Quality Validation Reports
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingHealth || !health?.validation_reports ? (
                  <div className="h-40 bg-muted/20 animate-pulse rounded-lg" />
                ) : (
                  <ul className="space-y-3">
                    {health.validation_reports.map((report, idx) => {
                      const style = VALIDATION_STYLES[report.status] || VALIDATION_STYLES.pass
                      const Icon = style.icon
                      return (
                        <li key={idx} className="flex items-center justify-between gap-4 border border-border rounded-lg p-3.5">
                          <div className="flex items-start gap-3 min-w-0">
                            <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', report.status === 'pass' ? 'text-emerald-600' : report.status === 'warn' ? 'text-amber-600' : 'text-rose-600')} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground">{report.check}</p>
                              <p className="text-xs text-muted-foreground">{report.detail}</p>
                            </div>
                          </div>
                          <span className={cn('shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded border', style.badge)}>
                            {style.label}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 4: Zone Attention Distribution across projects (Analytics) */}
          <Card className="border border-border">
            <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Zone Attention Distribution Across Projects
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-72 w-full">
                {isLoadingHealth || !health?.zone_attention ? (
                  <div className="h-full bg-muted/20 animate-pulse rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={health.zone_attention} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                      <XAxis dataKey="project_id" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} unit="%" />
                      <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      {ZONE_KEYS.map(zone => (
                        <Bar key={zone.key} dataKey={zone.key} name={zone.label} stackId="zones" fill={zone.color} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ===================== RENDER COMPARISON VIEW ===================== */}
      {isRenderView && (
        <>
          {/* Row 1: Render KPIs */}
          {isLoadingComparison ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-card border border-border" />
              ))}
            </div>
          ) : comparison ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <KpiCard
                label="Panoramic Sessions"
                value={comparison.panoramic.session_count.toLocaleString('en-IN')}
                subtext={`${comparison.panoramic.avg_engagement}% avg engagement`}
                icon={LayoutGrid}
              />
              <KpiCard
                label="3D Unreal Sessions"
                value={comparison.threeD.session_count.toLocaleString('en-IN')}
                subtext={`${comparison.threeD.avg_engagement}% avg engagement`}
                icon={MonitorPlay}
              />
              <KpiCard
                label="Engagement Lift (3D vs Pano)"
                value={`+${engagementLift} pts`}
                trend={engagementLift}
                subtext="3D Unreal advantage"
                icon={TrendingUp}
              />
              <KpiCard
                label="Completion Lift (3D vs Pano)"
                value={`+${completionLift} pts`}
                trend={completionLift}
                subtext="3D Unreal advantage"
                icon={TrendingUp}
              />
            </div>
          ) : null}

          {/* Row 2: A/B Render comparison chart */}
          <Card className="border border-border">
            <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                A/B Render Pilot Performance Analysis
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 w-full">
                {isLoadingComparison ? (
                  <div className="h-full bg-muted/20 animate-pulse rounded-lg" />
                ) : comparisonData.length === 0 ? (
                  <div className="text-muted-foreground text-center">No comparison insights found.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                      <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="Panoramic" name="Panoramic (WebGL)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="3D Unreal" name="Unreal walkthrough" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default AdminDashboard
