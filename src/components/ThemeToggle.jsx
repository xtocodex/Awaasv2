import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { cn } from '@/lib/utils'

const options = [
  { value: 'light',  icon: Sun,     label: 'Light theme' },
  { value: 'system', icon: Monitor, label: 'System theme' },
  { value: 'dark',   icon: Moon,    label: 'Dark theme' },
]

/**
 * Segmented theme switch (light / system / dark).
 * Mirrors the pattern used by Vercel, Linear, Tailwind UI docs.
 */
function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/50 p-0.5',
        className
      )}
    >
      {options.map(({ value, icon: Icon, label }) => {
        const active = theme === value
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
          </button>
        )
      })}
    </div>
  )
}

export default ThemeToggle
