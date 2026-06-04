import { useQuery } from '@tanstack/react-query'
import { api } from '../api/endpoints'
import KpiCard from '../components/KpiCard'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  TrendingUp,
  Users,
  Lightbulb,
  PieChartIcon,
  MessageSquare,
  AlertTriangle,
  Award,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { formatDuration } from '@/lib/utils'

// HIDDEN_PHASE flags — flip to true to unhide (see HiddenPhase.md). Not in Module 6 spec.
const SHOW_SALES_INDIVIDUAL_EXTRA = false  // Pitch Prompt Usage + Conversion Correlation KPIs
const SHOW_SALES_ARCHETYPE_PIE = false     // Walkthrough Archetype Distribution pie
const SHOW_SALES_TEAM_EXTRA_COLS = false   // Prompt Action Rate, Deal Correlation, Flags/Coaching columns

const ARCHETYPE_COLORS = {
  exploratory: '#6366f1',  // Indigo
  comparative: '#0ea5e9',  // Sky
  confirmatory: '#10b981', // Emerald
  disengaged: '#f43f5e'    // Rose
}

const ARCHETYPE_LABELS = {
  exploratory: 'Exploratory (Scanners)',
  comparative: 'Comparative (Evaluators)',
  confirmatory: 'Confirmatory (Ready to Buy)',
  disengaged: 'Disengaged (Early Exit)'
}

function SalesPerformance() {
  const { role, profile } = useAuth()

  // Show team view to sales manager/head, builders, and admins
  const canViewTeam = role === 'sales_head' || role === 'cxo' || role === 'builder' || role === 'awaas_admin'

  // Individual-only screen (Sales Executive) gets a personal identity header
  const isIndividualOnly = !canViewTeam

  // Query individual performance metrics
  const { data: individualSummary, isLoading: isLoadingIndividual } = useQuery({
    queryKey: ['sales-me-summary'],
    queryFn: api.getSalesSummary
  })

  // Query team performance metrics
  const { data: teamSummary, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['sales-team-summary'],
    queryFn: api.getTeamSummary,
    enabled: canViewTeam
  })

  // Transform archetype details for pie chart
  const archetypeData = individualSummary ? Object.entries(individualSummary.archetype_breakdown).map(([key, val]) => ({
    name: ARCHETYPE_LABELS[key] || key,
    value: val,
    color: ARCHETYPE_COLORS[key] || '#cbd5e1'
  })) : []

  // Discover top performer & training flags from team summary
  const teamMetrics = teamSummary?.reps || []
  
  const topPerformer = teamMetrics.length > 0 
    ? [...teamMetrics].sort((a, b) => b.avg_engagement - a.avg_engagement)[0]
    : null

  const trainingNeeds = teamMetrics.filter(rep => rep.avg_engagement < 65 && rep.prompt_usage_pct < 60)

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {isIndividualOnly
            ? `My Performance${profile?.name ? ` — ${profile.name}` : ''}`
            : 'Sales Effectiveness & Performance'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isIndividualOnly
            ? 'Your personal walkthrough engagement and effectiveness'
            : 'Analyze team walkthrough engagements and salesperson effectiveness'}
        </p>
      </div>

      {/* Row 1: Individual metrics */}
      {isLoadingIndividual ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-card border border-border" />
          ))}
        </div>
      ) : individualSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KpiCard
            label="Sessions Handled"
            value={individualSummary.sessions_handled}
            trend={individualSummary.sessions_trend_pct}
            subtext="Lifetime client pitches"
            icon={Users}
          />
          <KpiCard
            label="Avg Session Duration"
            value={formatDuration(individualSummary.avg_duration_sec)}
            subtext="Time per walkthrough"
            icon={Clock}
          />
          <KpiCard
            label="Avg Completion"
            value={`${individualSummary.completion_pct}%`}
            subtext="Walkthrough completed"
            icon={CheckCircle2}
          />
          <KpiCard
            label="Avg Engagement"
            value={`${individualSummary.avg_engagement}%`}
            trend={4.2}
            subtext="Client interest score"
            sparkline={[70, 71, 73, 72, 75, 74, 76, 75]}
            icon={TrendingUp}
          />
          {/* HIDDEN_PHASE[sales-individual-extra]: "Pitch Prompt Usage" + "Conversion Correlation" KPIs — not in Module 6 spec. See HiddenPhase.md */}
          {SHOW_SALES_INDIVIDUAL_EXTRA && <>
          <KpiCard
            label="Pitch Prompt Usage"
            value={`${individualSummary.prompt_usage_pct}%`}
            subtext="Prompt responses acted on"
            icon={Lightbulb}
          />
          <KpiCard
            label="Conversion Correlation"
            value={individualSummary.conversion_corr}
            subtext="Engagement-to-deal weight"
            trend={8.5}
            sparkline={[0.58, 0.6, 0.62, 0.61, 0.64, 0.65, 0.68]}
            icon={TrendingUp}
          />
          </>}
        </div>
      ) : null}

      {/* Row 2: Archetypes & Objections (Individual Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HIDDEN_PHASE[sales-archetype-pie]: Walkthrough Archetype Distribution pie — not in Module 6 spec. See HiddenPhase.md */}
        {SHOW_SALES_ARCHETYPE_PIE && (
        /* Archetype Pie */
        <Card className="border border-border">
          <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Walkthrough Archetype Distribution
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-60 w-full">
              {isLoadingIndividual ? (
                <div className="h-full bg-muted/20 animate-pulse rounded-lg" />
              ) : archetypeData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">No sessions recorded yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={archetypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {archetypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        )}
        {/* END HIDDEN_PHASE[sales-archetype-pie] */}

        {/* Objections List */}
        <Card className="border border-border">
          <CardHeader className="px-6 py-5 border-b border-border flex flex-row items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Top Customer Objection Patterns
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            {isLoadingIndividual ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-10 bg-muted/20 rounded-lg" />
                <div className="h-10 bg-muted/20 rounded-lg" />
              </div>
            ) : !individualSummary || individualSummary.top_objections.length === 0 ? (
              <div className="text-muted-foreground text-center py-10">No significant objections recorded.</div>
            ) : (
              <ul className="space-y-4">
                {individualSummary.top_objections.map((objection, index) => (
                  <li key={index} className="flex gap-3 bg-muted/30 border border-border p-3.5 rounded-xl">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-foreground text-sm font-medium">{objection}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Team Summary Table (Sales Heads / Builders / Admin) */}
      {canViewTeam && (
        <Card className="border border-border">
          <CardHeader className="px-6 py-5 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Sales Team Performance Overlay
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manager overview of salesperson engagement metrics</p>
            </div>
            
            {/* Top performer highlight */}
            {topPerformer && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Top Performer: <span className="font-bold ml-1">{topPerformer.name} ({topPerformer.avg_engagement}%)</span>
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingTeam ? (
              <div className="h-44 bg-muted/20 animate-pulse" />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-transparent border-b border-border">
                      <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider pl-6 py-4">Agent Name</TableHead>
                      <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center py-4">Pitches</TableHead>
                      <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center py-4">Avg Engagement</TableHead>
                      {/* HIDDEN_PHASE[sales-team-cols]: "Prompt Action Rate", "Deal Correlation", "Flags/Coaching" columns — not in Module 6 spec. See HiddenPhase.md */}
                      {SHOW_SALES_TEAM_EXTRA_COLS && <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center py-4">Prompt Action Rate</TableHead>}
                      <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center py-4">Walkthrough Completion</TableHead>
                      {SHOW_SALES_TEAM_EXTRA_COLS && <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-center py-4">Deal Correlation</TableHead>}
                      {SHOW_SALES_TEAM_EXTRA_COLS && <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right pr-6 py-4">Flags</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMetrics.map((rep) => {
                      const needsTraining = trainingNeeds.some(t => t.id === rep.id)
                      return (
                        <TableRow key={rep.id} className="hover:bg-muted/10 transition-colors border-b border-border">
                          <TableCell className="font-bold text-foreground pl-6 py-4">{rep.name}</TableCell>
                          <TableCell className="text-center py-4 text-muted-foreground font-medium">{rep.sessions}</TableCell>
                          <TableCell className="text-center py-4 text-foreground font-bold">{rep.avg_engagement}%</TableCell>
                          {/* HIDDEN_PHASE[sales-team-cols]: cells paired with hidden columns. See HiddenPhase.md */}
                          {SHOW_SALES_TEAM_EXTRA_COLS && <TableCell className="text-center py-4 text-muted-foreground">{rep.prompt_usage_pct}%</TableCell>}
                          <TableCell className="text-center py-4 text-muted-foreground">{rep.completion_pct}%</TableCell>
                          {SHOW_SALES_TEAM_EXTRA_COLS && <TableCell className="text-center py-4 text-foreground font-semibold">{rep.conversion_corr}</TableCell>}
                          {SHOW_SALES_TEAM_EXTRA_COLS && <TableCell className="text-right pr-6 py-4">
                            {needsTraining ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                Requires Coaching
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                Optimal
                              </span>
                            )}
                          </TableCell>}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SalesPerformance
