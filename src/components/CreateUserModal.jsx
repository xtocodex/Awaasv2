import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getNextType } from '../firebase/userService'

const roleMap = {
  'Builder':       'builder',
  'Sales Manager': 'sales_manager',
  'Member':        'member',
  'Sales Rep':     'member',
}

function CreateUserModal({ isOpen, onClose, onSubmit, role }) {
  const [nextTypeState, setNextTypeState] = useState({ mappedRole: '', value: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isBuilder      = role === 'Builder'
  const isSalesManager = role === 'Sales Manager'

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ shouldUnregister: true })

  useEffect(() => {
    if (!isOpen) {
      reset()
      setShowPassword(false)
      setShowConfirmPassword(false)
      return
    }
    const mappedRole = roleMap[role]
    if (!mappedRole) return

    let isCurrent = true
    getNextType(mappedRole).then(val => {
      if (isCurrent) {
        setNextTypeState({ mappedRole, value: val })
      }
    })

    return () => {
      isCurrent = false
    }
  }, [isOpen, role, reset])

  const mappedRole = roleMap[role] ?? ''
  const nextType = nextTypeState.mappedRole === mappedRole ? nextTypeState.value : ''
  const typeLoading = Boolean(isOpen && mappedRole && !nextType)

  const handleFormSubmit = async (formData) => {
    if (!nextType) {
      toast.warning('Type is still loading, please wait')
      return
    }

    const success = await onSubmit({
      name:     formData.name,
      email:    formData.email.trim(),
      password: formData.password,
      type:     nextType,
      ...(isBuilder && {
        companyName: formData.companyName,
        address:     formData.address,
        phone:       `+91${formData.phone.trim()}`,
      }),
      ...(isSalesManager && {
        phone: `+91${formData.phone.trim()}`,
      }),
    })

    if (success) {
      reset()
      onClose()
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => { if (!open && !isSubmitting) onClose() }}
    >
      <DialogContent className="max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create {role}</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new {role?.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter full name"
              disabled={isSubmitting}
              {...register('name', { required: 'Full name is required' })}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              disabled={isSubmitting}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value:   /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="pr-10"
                {...register('password', { required: 'Password is required' })}
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
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="pr-10"
                {...register('confirmPassword', {
                  required: 'Please confirm the password',
                  validate: val => val === watch('password') || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Type — auto-assigned */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-muted-foreground">Type (Auto-assigned)</Label>
            <div className="mt-1.5 flex items-center gap-2">
              {typeLoading ? (
                <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />
              ) : (
                <Badge
                  variant="secondary"
                  className="text-sm px-4 py-1.5 font-semibold tracking-wide"
                >
                  {nextType}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                This value is assigned automatically
              </span>
            </div>
          </div>

          {/* Builder-only company fields */}
          {isBuilder && (
            <div className="flex flex-col gap-4 border-t border-border pt-5">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
                Company Details
              </p>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Enter company name"
                  disabled={isSubmitting}
                  {...register('companyName', { required: 'Company name is required' })}
                />
                {errors.companyName && (
                  <p className="text-destructive text-xs">{errors.companyName.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  placeholder="Enter address"
                  disabled={isSubmitting}
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-sans"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="text-destructive text-xs">{errors.address.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Phone No</Label>
                <div className="flex items-center">
                  <span className="flex items-center px-3 h-10 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                    +91
                  </span>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: 'Phone number is required',
                      pattern: {
                        value:   /^[6-9]\d{9}$/,
                        message: 'Enter a valid 10-digit Indian mobile number',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        disabled={isSubmitting}
                        className="rounded-l-none"
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-destructive text-xs">{errors.phone.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Sales Manager phone */}
          {isSalesManager && (
            <div className="flex flex-col gap-4 border-t border-border pt-5">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
                Contact Details
              </p>

              <div className="flex flex-col gap-1.5">
                <Label>Phone No</Label>
                <div className="flex items-center">
                  <span className="flex items-center px-3 h-10 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                    +91
                  </span>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: 'Phone number is required',
                      pattern: {
                        value:   /^[6-9]\d{9}$/,
                        message: 'Enter a valid 10-digit Indian mobile number',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        disabled={isSubmitting}
                        className="rounded-l-none"
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-destructive text-xs">{errors.phone.message}</p>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create</span>
              )}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserModal
