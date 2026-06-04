import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { api } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Building, Eye, EyeOff } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

function Login() {
  const [error, setError]               = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    if (!authLoading && profile) {
      navigate('/dashboard', { replace: true })
    }
  }, [authLoading, profile, navigate])

  async function onSubmit({ email, password }) {
    setError('')
    try {
      const response = await api.login(email, password)
      login({
        email: response.user.email,
        name: response.user.name,
        role: response.role,
        company_name: response.user.company_name,
        token: response.token,
        scope: response.scope
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-6">
      {/* Floating theme switcher */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.08), transparent)',
        }}
      />

      <Card className="relative w-full max-w-md rounded-2xl shadow-xl border border-border bg-card">
        {/* Brand + title + description */}
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Building className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AWAAS</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to the AWAAS Web Dashboard
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                className="focus-visible:ring-primary"
                {...register('email', { required: true })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="focus-visible:ring-primary pr-10"
                  {...register('password', { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Builder/CXO: <code className="bg-muted px-1 rounded text-foreground">cxo@awaas.com</code> / password</li>
              <li>Sales Head: <code className="bg-muted px-1 rounded text-foreground">saleshead@awaas.com</code> / password</li>
              <li>Sales Exec: <code className="bg-muted px-1 rounded text-foreground">salesexec@awaas.com</code> / password</li>
              <li>Admin: <code className="bg-muted px-1 rounded text-foreground">admin@awaas.com</code> / password</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
