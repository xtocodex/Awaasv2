import {
  LayoutDashboard,
  Building2,
  Users,
  TrendingUp,
  UserCircle,
  Gamepad2,
  Activity,
  BarChart3,
  LogOut,
  Building
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import ThemeToggle from './ThemeToggle'

const navItems = {
  cxo: [
    { label: 'Overview',               icon: LayoutDashboard },
    { label: 'Inventory Intelligence',  icon: Building2 },
    { label: 'Buyer Insights',         icon: Users },
    { label: 'Sales Performance',      icon: TrendingUp },
    { label: 'User Management',        icon: UserCircle },
  ],
  builder: [
    { label: 'Overview',               icon: LayoutDashboard },
    { label: 'Inventory Intelligence',  icon: Building2 },
    { label: 'Buyer Insights',         icon: Users },
    { label: 'Sales Performance',      icon: TrendingUp },
    { label: 'User Management',        icon: UserCircle },
  ],
  sales_head: [
    { label: 'Sales Performance',      icon: TrendingUp },
    { label: 'Own Sessions',           icon: Gamepad2 },
  ],
  sales_exec: [
    { label: 'Sales Performance',      icon: TrendingUp },
    { label: 'Own Sessions',           icon: Gamepad2 },
  ],
  awaas_admin: [
    { label: 'Data Health',            icon: Activity },
    { label: 'Render Comparison',      icon: BarChart3 },
    { label: 'User Management',        icon: UserCircle },
  ],
}

function SidebarContent({ activePage, setActivePage }) {
  const { role, profile, logoutUser } = useAuth()
  const items = navItems[role] || []

  const handleLogout = () => {
    logoutUser()
    window.location.replace('/')
  }

  const initials = (profile?.name || profile?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Building className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">AWAAS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = activePage === item.label
          const Icon = item.icon
          return (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => setActivePage(item.label)}
              className={cn(
                'w-full justify-start gap-3 transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-medium hover:bg-primary/15'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <Separator />

      {/* Theme toggle */}
      <div className="px-4 pt-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Theme
        </span>
        <ThemeToggle />
      </div>

      {/* User profile + sign out */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.name || 'User'}
            </p>
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider mt-0.5">
              {role?.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <Button variant="outline" className="w-full text-sm border-border hover:bg-muted" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

function Sidebar({ activePage, setActivePage, mobileOnly = false, mobileOpen = false, onMobileOpenChange }) {
  if (mobileOnly) {
    return (
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="p-0 w-64 bg-card border-r border-border">
          <SidebarContent activePage={activePage} setActivePage={setActivePage} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      <SidebarContent activePage={activePage} setActivePage={setActivePage} />
    </div>
  )
}

export default Sidebar
