import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function FeatureSensitivityBars({ data = [] }) {
  return (
    <Card className="border border-border h-full">
      <CardHeader className="px-6 py-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Feature Sensitivity Impact (%)
        </h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-64 w-full">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No sensitivity metrics available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis
                  dataKey="feature"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  width={110}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99,102,241,0.04)' }}
                  contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                />
                <Bar
                  dataKey="score_pct"
                  name="Sensitivity %"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FeatureSensitivityBars
