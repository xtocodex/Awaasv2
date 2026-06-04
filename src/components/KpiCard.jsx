import { Card } from '@/components/ui/card'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function KpiCard({ label, value, subtext, trend, sparkline, icon: Icon, onClick }) {
  const isPositive = trend >= 0

  return (
    <Card 
      onClick={onClick}
      className={cn(
        "flex flex-col justify-between p-6 bg-card border border-border rounded-xl transition-all duration-200 select-none",
        onClick ? "cursor-pointer hover:shadow-md hover:border-primary/45 active:scale-[0.99]" : ""
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
          <h3 className="text-2xl font-bold text-foreground tracking-tight mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 mt-auto">
        <div className="flex flex-col gap-1">
          {trend !== undefined && (
            <div className="flex items-center">
              <span className={cn(
                "flex items-center text-xs font-bold px-1.5 py-0.5 rounded",
                isPositive 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              )}>
                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {Math.abs(trend)}%
              </span>
            </div>
          )}
          <span className="text-xs text-muted-foreground whitespace-nowrap">{subtext}</span>
        </div>

        {sparkline && sparkline.length > 0 && (
          <div className="w-24 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline.map((val, i) => ({ val, i }))}>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  )
}

export default KpiCard
