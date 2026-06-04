import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[96px] font-bold text-border leading-none">404</h1>
        <p className="text-muted-foreground text-base mt-3">Page not found</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
