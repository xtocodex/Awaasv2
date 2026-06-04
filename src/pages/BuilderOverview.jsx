import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/endpoints'
import KpiCard from '../components/KpiCard'
import InventoryHeatmap from '../components/InventoryHeatmap'
import FlatDeepDivePanel from '../components/FlatDeepDivePanel'
import SegmentMatrix from '../components/SegmentMatrix'
import FeatureSensitivityBars from '../components/FeatureSensitivityBars'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Building2,
  MapPin,
  TrendingUp,
  TrendingDown,
  Download,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Clock,
  Users,
  Activity,
  BarChart3
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts'
import { toast } from 'sonner'
import { cn, formatDuration } from '@/lib/utils'

// HIDDEN_PHASE flags — flip to true to unhide (see HiddenPhase.md). Not in Module 6 spec.
const SHOW_OVERVIEW_KPI_EXTRA = false       // Top Buyer Driver + Weakest Area KPIs
const SHOW_OVERVIEW_RECOMMENDATIONS = false // Rule-Based Priority Recommendations block

function BuilderOverview({ userScope }) {
  const queryClient = useQueryClient()
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedFlat, setSelectedFlat] = useState(null)
  const [deepDiveOpen, setDeepDiveOpen] = useState(false)
  const [downloadingCsv, setDownloadingCsv] = useState({ type: '', active: false })

  // Query projects scoped to the logged-in builder/cxo
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  })

  // Set default project on load
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].project_id)
    }
  }, [projects, selectedProjectId])

  const activeProject = projects.find(p => p.project_id === selectedProjectId)

  // Query metrics for the active project
  const { data: overview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['project-overview', selectedProjectId],
    queryFn: () => api.getProjectOverview(selectedProjectId),
    enabled: !!selectedProjectId,
  })

  // Query flat inventory
  const { data: flats = [], isLoading: isLoadingFlats } = useQuery({
    queryKey: ['project-flats', selectedProjectId],
    queryFn: () => api.getProjectFlats(selectedProjectId),
    enabled: !!selectedProjectId,
  })

  // Query segment matrix & sensitivity
  const { data: segments, isLoading: isLoadingSegments } = useQuery({
    queryKey: ['project-segments', selectedProjectId],
    queryFn: () => api.getSegmentInsights(selectedProjectId),
    enabled: !!selectedProjectId,
  })

  // Query recommendations
  const { data: recommendations = [], isLoading: isLoadingRecs } = useQuery({
    queryKey: ['action-recommendations', selectedProjectId],
    queryFn: () => api.getActionRecommendations(selectedProjectId),
    enabled: !!selectedProjectId,
  })

  // Mutation to handle action updates (Mark Completed / Assign)
  const actionMutation = useMutation({
    mutationFn: ({ id, status }) => api.updateRecommendationStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === 'assigned' 
          ? 'Recommendation assigned to sales team!' 
          : 'Recommendation marked as completed!'
      )
      queryClient.invalidateQueries(['action-recommendations', selectedProjectId])
      queryClient.invalidateQueries(['project-flats', selectedProjectId])
    },
    onError: () => {
      toast.error('Action failed. Please try again.')
    }
  })

  // CSV download helper
  const handleCsvDownload = async (type) => {
    setDownloadingCsv({ type, active: true })
    try {
      let csvContent = ''
      if (type === 'sessions') {
        csvContent = await api.downloadSessionsCsv(selectedProjectId)
      } else {
        csvContent = await api.downloadEventsCsv(selectedProjectId)
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${selectedProjectId}-${type}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success(`${type.toUpperCase()} report downloaded successfully.`)
    } catch {
      toast.error(`Failed to download ${type} report.`)
    } finally {
      setDownloadingCsv({ type: '', active: false })
    }
  }

  const handleFlatClick = (flat) => {
    setSelectedFlat(flat)
    setDeepDiveOpen(true)
  }

  const getRiskBadge = (risk) => {
    if (risk === 'LOW') return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase font-bold text-[10px]">Low Risk</Badge>
    if (risk === 'MEDIUM') return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 uppercase font-bold text-[10px]">Medium Risk</Badge>
    return <Badge variant="secondary" className="bg-rose-50 text-rose-700 border-rose-200 uppercase font-bold text-[10px]">High Risk</Badge>
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Project Dashboard</h1>
            {activeProject && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {activeProject.location}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analytics and inventory performance overview
          </p>
        </div>

        {/* Project Selector & CSV Exports */}
        <div className="flex flex-wrap items-center gap-3">
          {projects.length > 1 && (
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId} disabled={isLoadingProjects}>
              <SelectTrigger className="w-[200px] border-border bg-background">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(proj => (
                  <SelectItem key={proj.project_id} value={proj.project_id}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleCsvDownload('sessions')} 
            disabled={downloadingCsv.active}
            className="border-border hover:bg-muted text-xs"
          >
            <Download className="w-4 h-4 mr-1.5 shrink-0" />
            Sessions CSV
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleCsvDownload('events')} 
            disabled={downloadingCsv.active}
            className="border-border hover:bg-muted text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 shrink-0" />
            Events CSV
          </Button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      {isLoadingOverview ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : overview ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KpiCard
            label="Total Sessions"
            value={overview.session_count?.toLocaleString('en-IN')}
            trend={overview.engagement_trend_pct}
            subtext="Walkthroughs conducted"
            sparkline={overview.session_volume?.map(p => p.sessions)}
            icon={Users}
          />
          <KpiCard
            label="Avg Session Duration"
            value={formatDuration(overview.avg_duration_sec)}
            subtext="Time per walkthrough"
            icon={Clock}
          />
          <KpiCard
            label="Engagement Score"
            value={overview.engagement_score}
            trend={overview.engagement_trend_pct}
            subtext="Avg score vs baseline"
            sparkline={overview.sparkline}
            icon={TrendingUp}
          />
          <KpiCard
            label="Early Exit Drop-off"
            value={`${overview.drop_off_pct}%`}
            subtext={overview.drop_off_risk}
            trend={-5} // Negative is good for drop-off
            sparkline={[35, 33, 34, 30, 28, 29, 28]}
            icon={TrendingDown}
          />
          {/* HIDDEN_PHASE[overview-kpi-extra]: "Top Buyer Driver" + "Weakest Area" KPIs — not in Module 6 spec. See HiddenPhase.md */}
          {SHOW_OVERVIEW_KPI_EXTRA && <>
          <KpiCard
            label="Top Buyer Driver"
            value={overview.top_buyer_driver?.feature}
            subtext={`${overview.top_buyer_driver?.influence_pct}% influence rate`}
            icon={Sparkles}
          />
          <KpiCard
            label="Weakest Area"
            value={overview.weakest_area?.room}
            subtext={`${overview.weakest_area?.avg_dwell_pct}% dwell-time share`}
            icon={AlertTriangle}
          />
          </>}
        </div>
      ) : null}

      {/* Row 1b: Feature Usage Distribution + Session Volume Trend (Module 6 §8.1 Project Overview) */}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Feature Usage Distribution
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-60 w-full">
                {isLoadingOverview ? (
                  <div className="h-full bg-muted/20 animate-pulse rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overview.feature_usage} layout="vertical" margin={{ left: 10, right: 16, top: 5, bottom: 5 }}>
                      <XAxis type="number" domain={[0, 'dataMax']} unit="%" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={11} width={100} tickLine={false} />
                      <Tooltip formatter={(v) => `${v}%`} cursor={{ fill: 'rgba(99,102,241,0.04)' }} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                      <Bar dataKey="usage_pct" name="Usage share" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Session Volume Trend
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-60 w-full">
                {isLoadingOverview ? (
                  <div className="h-full bg-muted/20 animate-pulse rounded-lg" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overview.session_volume} margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="sessionVolumeFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} width={28} />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="sessions" name="Sessions" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#sessionVolumeFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Row 2: Heatmap & Grid Layout */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Inventory Engagement Heatmap
          </h2>
          <Badge variant="outline" className="text-xs bg-card">
            {flats.length} Total Units
          </Badge>
        </div>

        {isLoadingFlats ? (
          <div className="h-64 rounded-xl bg-card border border-border animate-pulse" />
        ) : (
          <InventoryHeatmap flats={flats} onFlatClick={handleFlatClick} />
        )}
      </div>

      {/* Row 3: Buyer Insights & Segment Matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {isLoadingSegments ? (
            <div className="h-72 rounded-xl bg-card border border-border animate-pulse" />
          ) : (
            <SegmentMatrix matrix={segments?.matrix} />
          )}
        </div>
        <div>
          {isLoadingSegments ? (
            <div className="h-72 rounded-xl bg-card border border-border animate-pulse" />
          ) : (
            <FeatureSensitivityBars data={segments?.feature_sensitivity} />
          )}
        </div>
      </div>

      {/* Row 4: Rule-based Priority Action Recommendations */}
      {/* HIDDEN_PHASE[overview-recommendations]: Rule-Based Priority Recommendations block — not in Module 6 spec. See HiddenPhase.md */}
      {SHOW_OVERVIEW_RECOMMENDATIONS && (
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Rule-Based Priority Recommendations
        </h2>

        {isLoadingRecs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-28 rounded-xl bg-card border border-border" />
            <div className="h-28 rounded-xl bg-card border border-border" />
          </div>
        ) : recommendations.length === 0 ? (
          <Card className="text-center py-10 text-muted-foreground border border-border">
            No suggestions or recommendations triggered. All units performing stably!
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(rec => {
              const isOpen = rec.status === 'open'
              const isAssigned = rec.status === 'assigned'
              const isCompleted = rec.status === 'actioned'
              
              return (
                <Card 
                  key={rec.id} 
                  className={cn(
                    "border border-border p-5 flex flex-col justify-between gap-4 transition-colors",
                    isCompleted ? "opacity-60 bg-muted/20" : "bg-card"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Problem Trigger</span>
                        <Badge variant="outline" className={cn(
                          "text-[9px] uppercase font-bold py-0",
                          rec.priority === 'high' ? "bg-rose-50 text-rose-700 border-rose-200" :
                          rec.priority === 'medium' ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-blue-50 text-blue-700 border-blue-200"
                        )}>
                          {rec.priority} Priority
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {rec.status}
                      </Badge>
                    </div>
                    <p className="text-foreground font-bold text-sm">{rec.problem}</p>
                    <p className="text-muted-foreground text-xs">{rec.fix}</p>
                  </div>

                  {/* Actions buttons */}
                  {!isCompleted && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => actionMutation.mutate({ id: rec.id, status: 'actioned' })}
                        className="text-[10px] h-7 px-2.5 border-border hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                      >
                        Mark Completed
                      </Button>
                      {!isAssigned && (
                        <Button
                          variant="default"
                          size="xs"
                          onClick={() => actionMutation.mutate({ id: rec.id, status: 'assigned' })}
                          className="text-[10px] h-7 px-2.5"
                        >
                          Assign to Sales
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
      )}
      {/* END HIDDEN_PHASE[overview-recommendations] */}

      {/* Flat details Sheet */}
      <FlatDeepDivePanel
        open={deepDiveOpen}
        onOpenChange={setDeepDiveOpen}
        flatId={selectedFlat?.flat_id}
      />
    </div>
  )
}

export default BuilderOverview
