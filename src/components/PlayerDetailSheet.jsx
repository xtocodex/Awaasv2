import { useEffect, useMemo, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Info, MapPin, Clock, Inbox, } from 'lucide-react'
import {
  getPlayerGazeObjectsBySpawnPoint,
  getPlayerSpawnPointTotals
} from '../firebase/userService'

const HIDDEN_FIELDS = new Set(['playerID', 'spawnPointID', 'totalTimeSeconds', 'docId'])

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim()
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function getVisibleEntries(record) {
  return Object.entries(record).filter(([key]) => !HIDDEN_FIELDS.has(key))
}

function PlayerDetailSheet({ open, onOpenChange, player, canViewGazeObjects = false }) {
  const [spawnPointTotals, setSpawnPointTotals] = useState([])
  const [gazeObjectsBySpawnPoint, setGazeObjectsBySpawnPoint] = useState([])
  const [loading, setLoading] = useState(false)
  const [gazeLoading, setGazeLoading] = useState(false)
  const [error, setError] = useState('')
  const [gazeError, setGazeError] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!open || !player?.docId) {
      Promise.resolve().then(() => {
        if (cancelled) return
        setSpawnPointTotals([])
        setGazeObjectsBySpawnPoint([])
        setError('')
        setGazeError('')
        setLoading(false)
        setGazeLoading(false)
      })
      return () => { cancelled = true }
    }

    Promise.resolve().then(() => {
      if (cancelled) return
      setLoading(true)
      setError('')
      getPlayerSpawnPointTotals(player.docId).then(result => {
        if (cancelled) return
        if (result.error) {
          setError(result.error)
        } else {
          setSpawnPointTotals(result.data)
        }
        setLoading(false)
      })
    })

    return () => { cancelled = true }
  }, [open, player])

  useEffect(() => {
    let cancelled = false

    if (!open || !player?.docId || !canViewGazeObjects) {
      Promise.resolve().then(() => {
        if (cancelled) return
        setGazeObjectsBySpawnPoint([])
        setGazeError('')
        setGazeLoading(false)
      })
      return () => { cancelled = true }
    }

    Promise.resolve().then(() => {
      if (cancelled) return
      setGazeLoading(true)
      setGazeError('')
      getPlayerGazeObjectsBySpawnPoint(player.docId).then(result => {
        if (cancelled) return
        if (result.error) {
          setGazeError(result.error)
        } else {
          setGazeObjectsBySpawnPoint(result.data)
        }
        setGazeLoading(false)
      })
    })

    return () => { cancelled = true }
  }, [open, player, canViewGazeObjects])

  const visibleSpawnPoints = useMemo(
    () => spawnPointTotals.map(record => ({
      docId: record.docId,
      entries: getVisibleEntries(record),
    })),
    [spawnPointTotals]
  )

  const gazeObjectsBySpawnPointId = useMemo(() => {
    const gazeObjectsMap = new Map()
    gazeObjectsBySpawnPoint.forEach(item => {
      gazeObjectsMap.set(item.spawnPointId, item.gazeObjects || [])
    })
    return gazeObjectsMap
  }, [gazeObjectsBySpawnPoint])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">

        <SheetHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <SheetTitle>{player?.name || 'Player Details'}</SheetTitle>
          </div>
        </SheetHeader>

        {/* Player summary */}
        {player && (
          <div className="border border-border bg-card rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Name</p>
                <p className="text-foreground font-medium">{player.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Phone Number</p>
                <p className="text-foreground">{player.phoneNumber || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">BHK</p>
                <Badge variant="secondary">{player.bhk || '—'}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Building</p>
                <p className="text-foreground">{player.building || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Total Sessions
                </p>
                <Badge variant="secondary">{player.totalSessions ?? '—'}</Badge>
              </div>
            </div>
          </div>
        )}

        <Separator className="mb-4" />

        {/* Spawn point totals section */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Spawn Point Totals</h3>
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground">Loading spawn point totals...</p>
        )}

        {!loading && error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {!loading && !error && visibleSpawnPoints.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10">
            <Inbox className="w-10 h-10 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">No spawn point totals found</p>
          </div>
        )}

        {!loading && !error && visibleSpawnPoints.length > 0 && (
          <div className="flex flex-col gap-3">
            {visibleSpawnPoints.map((point, index) => (
              <div key={point.docId} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Spawn Point {index + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {point.entries.map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between gap-4 text-sm">
                      <span className="text-muted-foreground shrink-0">{formatLabel(key)}</span>
                      <span className="text-foreground text-right break-all">
                        {formatValue(value)}
                      </span>
                    </div>
                  ))}
                </div>

                {canViewGazeObjects && (
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Gaze Objects
                      </p>
                      {gazeLoading && (
                        <span className="text-xs text-muted-foreground">Loading...</span>
                      )}
                    </div>

                    {!gazeLoading && gazeError && (
                      <p className="text-xs text-destructive">{gazeError}</p>
                    )}

                    {!gazeLoading && !gazeError && (gazeObjectsBySpawnPointId.get(point.docId) || []).length === 0 && (
                      <p className="text-xs text-muted-foreground">No gaze objects found</p>
                    )}

                    {!gazeLoading && !gazeError && (gazeObjectsBySpawnPointId.get(point.docId) || []).length > 0 && (
                      <div className="flex flex-col gap-2">
                        {(gazeObjectsBySpawnPointId.get(point.docId) || []).map(gazeObject => (
                          <div
                            key={gazeObject.docId}
                            className="rounded-md border border-border bg-muted/30 px-3 py-2"
                          >
                            <div className="flex items-start justify-between gap-4 text-sm">
                              <span className="text-muted-foreground shrink-0">Object Name</span>
                              <span className="text-foreground text-right break-all">
                                {gazeObject.objectName || '—'}
                              </span>
                            </div>
                            <div className="flex items-start justify-between gap-4 text-sm mt-1">
                              <span className="text-muted-foreground shrink-0">Gaze Time</span>
                              <span className="text-foreground text-right break-all">
                                {gazeObject.gazeTimeFormatted || '—'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}

export default PlayerDetailSheet
