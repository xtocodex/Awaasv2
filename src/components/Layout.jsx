import { useState, useEffect } from 'react'
import { Menu, Building } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { useAuth } from '../context/AuthContext'

function Layout({ children, onActivePageChange }) {
  const { role } = useAuth()

  // Get default page for role
  const getDefaultPage = (userRole) => {
    if (userRole === 'cxo' || userRole === 'builder') return 'Overview'
    if (userRole === 'sales_head') return 'Sales Performance'
    if (userRole === 'sales_exec') return 'Own Sessions'
    if (userRole === 'awaas_admin') return 'Data Health'
    return 'Overview'
  }

  const [activePage, setActivePage] = useState(() => getDefaultPage(role))
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Sync active page if role changes (e.g., login)
  useEffect(() => {
    if (role) {
      const defaultPage = getDefaultPage(role)
      setActivePage(defaultPage)
      onActivePageChange?.(defaultPage)
    }
  }, [role, onActivePageChange])

  function handleActivePageChange(page) {
    setActivePage(page)
    setMobileSidebarOpen(false)
    onActivePageChange?.(page)
  }

  useEffect(() => {
    document.title = `${activePage} — AWAAS Dashboard`
  }, [activePage])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop fixed sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activePage={activePage}
          setActivePage={handleActivePageChange}
        />
      </div>

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-card border-b border-border lg:hidden">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground mr-3"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Building className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground">AWAAS</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Mobile sidebar Sheet */}
      <Sidebar
        activePage={activePage}
        setActivePage={handleActivePageChange}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
        mobileOnly
      />

      {/* Main content */}
      <div className="flex-1 min-h-screen bg-background p-8 pt-6 lg:ml-64 mt-14 lg:mt-0">
        {typeof children === 'function'
          ? children({ activePage, setActivePage: handleActivePageChange })
          : children}
      </div>
    </div>
  )
}

export default Layout
