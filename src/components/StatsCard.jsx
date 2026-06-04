import { Card } from '@/components/ui/card'

const iconBg = {
  blue: 'rgba(99,102,241,0.1)',
  green: 'rgba(16,185,129,0.1)',
  purple: 'rgba(168,85,247,0.1)',
  orange: 'rgba(245,158,11,0.1)',
}

const iconColors = {
  blue: 'rgb(99,102,241)',
  green: 'rgb(16,185,129)',
  purple: 'rgb(168,85,247)',
  orange: 'rgb(245,158,11)',
}

function StatsCard({ label, value, icon, color = 'blue' }) {
  const Icon = icon
  return (
    <Card className="flex items-start gap-4 p-6">
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: iconBg[color] || iconBg.blue,
          flexShrink: 0,
        }}
        className="flex items-center justify-center"
      >
        <Icon className="w-5 h-5" style={{ color: iconColors[color] || iconColors.blue }} />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
      </div>
    </Card>
  )
}

export default StatsCard
