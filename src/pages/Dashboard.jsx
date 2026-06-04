import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import Layout from '../components/Layout'
import UserTable from '../components/UserTable'
import CreateUserModal from '../components/CreateUserModal'
import PlayerDetailSheet from '../components/PlayerDetailSheet'
import BuilderOverview from './BuilderOverview'
import SalesPerformance from './SalesPerformance'
import AdminDashboard from './AdminDashboard'
import InventoryHeatmap from '../components/InventoryHeatmap'
import FlatDeepDivePanel from '../components/FlatDeepDivePanel'
import SegmentToggleMatrix from '../components/SegmentToggleMatrix'
import FeatureSensitivityBars from '../components/FeatureSensitivityBars'
import { api } from '../api/endpoints'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog'
import { useAuth } from '../context/AuthContext'
import {
  getAllUsersUnderAdmin,
  getSalesManagersByBuilder,
  getMembersBySalesManager,
  getPlayers,
  getPlayerSpawnPointTotals,
  getPlayerGazeObjectsBySpawnPoint,
} from '../firebase/userService'
import { createUser, deleteUser } from '../firebase/authService'
import { Building2, MapPin, Users, UserCircle, Gamepad2, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const SPAWN_HIDDEN_FIELDS = new Set(['playerID', 'spawnPointID', 'totalTimeSeconds', 'docId'])

function escapeCsvValue(value) {
  if (value === null || value === undefined || value === '') return ''
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function formatCsvTimestamp(value) {
  if (!value || typeof value.toDate !== 'function') return String(value ?? '')
  return value.toDate().toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function spawnFieldLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim()
}

function buildEnrichedPlayersCsv(enrichedPlayers, isAdmin) {
  const spawnFieldSet = new Set()
  enrichedPlayers.forEach(({ spawnPoints }) => {
    spawnPoints.forEach(sp => {
      Object.keys(sp).forEach(key => {
        if (!SPAWN_HIDDEN_FIELDS.has(key)) spawnFieldSet.add(key)
      })
    })
  })
  const spawnFields = [...spawnFieldSet]

  const headers = [
    'Row', 'Player No.', 'Name', 'Phone Number', 'BHK', 'Building',
    'Total Sessions', 'Created At', 'Spawn Point',
    ...spawnFields.map(spawnFieldLabel),
    ...(isAdmin ? ['Gaze Object', 'Gaze Time'] : []),
  ]

  const csvRows = [headers.map(escapeCsvValue).join(',')]
  let rowNum = 0

  enrichedPlayers.forEach(({ player, spawnPoints, gazeBySpawnPointId }, playerIndex) => {
    const playerNo = playerIndex + 1
    const baseFields = [
      player.name || '',
      player.phoneNumber || '',
      player.bhk || '',
      player.building || '',
      player.totalSessions ?? '',
      player.createdAt || '',
    ]

    const buildRow = (spawnPointId, spawnFieldVals, gazeObject = '', gazeTime = '') => {
      rowNum++
      const cells = [
        rowNum, playerNo, ...baseFields, spawnPointId,
        ...spawnFieldVals,
        ...(isAdmin ? [gazeObject, gazeTime] : []),
      ]
      return cells.map(escapeCsvValue).join(',')
    }

    const emptySpawnVals = spawnFields.map(() => '')

    if (spawnPoints.length === 0) {
      csvRows.push(buildRow('', emptySpawnVals))
      return
    }

    spawnPoints.forEach((sp, spIndex) => {
      const spawnPointId = sp.docId || `SP${spIndex + 1}`
      const spawnFieldVals = spawnFields.map(field => {
        const val = sp[field]
        if (val === undefined || val === null) return ''
        if (typeof val === 'object' && typeof val.toDate === 'function') return formatCsvTimestamp(val)
        if (typeof val === 'object') return JSON.stringify(val)
        return String(val)
      })

      if (!isAdmin) {
        csvRows.push(buildRow(spawnPointId, spawnFieldVals))
        return
      }

      const gazeObjects = gazeBySpawnPointId.get(sp.docId) || []
      if (gazeObjects.length === 0) {
        csvRows.push(buildRow(spawnPointId, spawnFieldVals))
        return
      }

      gazeObjects.forEach(gazeObj => {
        csvRows.push(buildRow(spawnPointId, spawnFieldVals, gazeObj.objectName || '', gazeObj.gazeTimeFormatted || ''))
      })
    })
  })

  return csvRows.join('\n')
}

// Fallback players in case Firebase is empty or fails
const fallbackPlayers = [
  { docId: 'p-1', name: 'Aarav Mehta', phoneNumber: '+91 98765 43210', bhk: '3BHK', building: 'Emerald Tower A', totalSessions: 4, createdAt: '2026-05-24T10:14:00' },
  { docId: 'p-2', name: 'Ishita Sen', phoneNumber: '+91 98123 45678', bhk: '2BHK', building: 'Emerald Tower C', totalSessions: 2, createdAt: '2026-05-24T11:45:00' },
  { docId: 'p-3', name: 'Rohan Roy', phoneNumber: '+91 99887 76655', bhk: '3BHK', building: 'Sapphire Tower B', totalSessions: 3, createdAt: '2026-05-24T14:20:00' },
  { docId: 'p-4', name: 'Priya Das', phoneNumber: '+91 97766 55443', bhk: '4BHK', building: 'Emerald Tower A', totalSessions: 5, createdAt: '2026-05-25T09:30:00' }
]

function Dashboard() {
  const { role, profile } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTargetRole, setModalTargetRole] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [playerSheetOpen, setPlayerSheetOpen] = useState(false)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([])
  const [activeTab, setActiveTab] = useState('Overview')
  
  // Tab controller for original User Management
  const [userManagementTab, setUserManagementTab] = useState(() => {
    if (role === 'awaas_admin') return 'Builders'
    return 'Sales Managers'
  })

  const [data, setData] = useState({
    builders: [],
    salesManagers: [],
    members: [],
    players: []
  })
  
  const [loading, setLoading] = useState(true)
  const [csvLoading, setCsvLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, row: null, deleteRole: '' })

  // Project selector state for standalone analytics screens
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [selectedFlat, setSelectedFlat] = useState(null)
  const [deepDiveOpen, setDeepDiveOpen] = useState(false)

  // Query projects scoped to the logged-in builder/cxo
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
    enabled: role === 'cxo' || role === 'builder',
  })

  // Set default project on load
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].project_id)
    }
  }, [projects, selectedProjectId])

  const activeProject = projects.find(p => p.project_id === selectedProjectId)

  // Standalone: Query flat inventory
  const { data: flats = [], isLoading: isLoadingFlats } = useQuery({
    queryKey: ['project-flats', selectedProjectId],
    queryFn: () => api.getProjectFlats(selectedProjectId),
    enabled: !!selectedProjectId && activeTab === 'Inventory Intelligence',
  })

  // Standalone: Query segment matrix & sensitivity
  const { data: segments, isLoading: isLoadingSegments } = useQuery({
    queryKey: ['project-segments', selectedProjectId],
    queryFn: () => api.getSegmentInsights(selectedProjectId),
    enabled: !!selectedProjectId && activeTab === 'Buyer Insights',
  })

  function handleViewPlayer(row) {
    setSelectedPlayer(row)
    setPlayerSheetOpen(true)
  }

  const handleActivePageChange = useCallback((page) => {
    setActiveTab(page)
    if (page !== 'Own Sessions') {
      setSelectedPlayerIds([])
    }
  }, [])

  const fetchPlayersData = useCallback(async () => {
    try {
      const result = await getPlayers()
      if (!result.error && result.players?.length > 0) {
        setData(prev => ({ ...prev, players: result.players }))
      } else {
        setData(prev => ({ ...prev, players: fallbackPlayers }))
      }
    } catch {
      setData(prev => ({ ...prev, players: fallbackPlayers }))
    }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const createdBy = profile?.company_name
        ? `${profile.email} | ${profile.company_name}`
        : profile?.email || 'admin@awaas.com'

      // We map admin permissions to system admin and fallback builder roles
      if (role === 'awaas_admin') {
        const result = await getAllUsersUnderAdmin(createdBy)
        setData(prev => ({
          ...prev,
          builders: result.builders || [],
          salesManagers: result.salesManagers || [],
          members: result.members || []
        }))
      } else if (role === 'builder' || role === 'cxo') {
        const smsResult = await getSalesManagersByBuilder(createdBy)
        const smList = smsResult.users || []
        const memberGroups = await Promise.all(smList.map(sm => {
          const smCreatedBy = sm.company_name
            ? `${sm.email} | ${sm.company_name}`
            : sm.email
          return getMembersBySalesManager(smCreatedBy)
        }))
        const members = memberGroups.flatMap(result => result.users || [])
        setData(prev => ({
          ...prev,
          builders: [],
          salesManagers: smList,
          members
        }))
      }
    } catch {
      setError('Firebase loading error. Local onboarding data offline.')
    }
    setLoading(false)
  }, [profile, role])

  useEffect(() => {
    if (!profile || !role) return
    Promise.resolve().then(() => {
      fetchData()
      fetchPlayersData()
    })
  }, [profile, role, fetchData, fetchPlayersData])

  function getSectionConfig(pageTab) {
    switch (pageTab) {
      case 'Builders':
        return {
          rows: data.builders,
          addLabel: 'Builder',
          createRole: 'builder',
          deleteRole: 'builder',
          canAdd: role === 'awaas_admin',
        }
      case 'Sales Managers':
        return {
          rows: data.salesManagers,
          addLabel: 'Sales Manager',
          createRole: 'sales_manager',
          deleteRole: 'sales_manager',
          canAdd: role === 'awaas_admin' || role === 'builder' || role === 'cxo',
        }
      case 'Members':
        return {
          rows: data.members,
          addLabel: 'Sales Rep',
          createRole: 'member',
          deleteRole: 'member',
          canAdd: role === 'awaas_admin' || role === 'builder' || role === 'cxo',
        }
      default:
        return { rows: [], addLabel: '', createRole: '', deleteRole: '', canAdd: false }
    }
  }

  async function handleCreate(formData) {
    const createdBy = profile.company_name
      ? `${profile.email} | ${profile.company_name}`
      : profile.email

    const { error } = await createUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      type: formData.type || '',
      role: modalTargetRole,
      createdBy,
      companyName: formData.companyName || '',
      address: formData.address || '',
      phone: formData.phone || ''
    })

    if (error) {
      toast.error(error)
      return false
    }

    setModalOpen(false)
    toast.success(`${formData.name} created successfully`)
    fetchData()
    return true
  }

  function handleDelete(row, deleteRole) {
    setDeleteConfirm({ open: true, row, deleteRole })
  }

  async function confirmDelete() {
    const { row, deleteRole } = deleteConfirm
    setDeleteConfirm({ open: false, row: null, deleteRole: '' })
    const { error } = await deleteUser(deleteRole, row.docId)
    if (error) {
      toast.error(error)
      return
    }
    toast.success(`${row.name || row.email} deleted`)
    fetchData()
  }

  function handleTogglePlayerSelection(playerId) {
    setSelectedPlayerIds(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    )
  }

  function handleToggleAllPlayerSelection(players) {
    const playerIds = players.map(player => player.docId).filter(Boolean)
    const allVisibleSelected = playerIds.length > 0 && playerIds.every(id => selectedPlayerIds.includes(id))

    if (allVisibleSelected) {
      setSelectedPlayerIds(prev => prev.filter(id => !playerIds.includes(id)))
      return
    }

    setSelectedPlayerIds(prev => [...new Set([...prev, ...playerIds])])
  }

  async function handleDownloadPlayersCsv() {
    const playersToExport = selectedPlayerIds.length > 0
      ? data.players.filter(player => selectedPlayerIds.includes(player.docId))
      : data.players

    if (playersToExport.length === 0) {
      toast.warning('No player records available to download.')
      return
    }

    setCsvLoading(true)
    try {
      const isAdmin = role === 'awaas_admin'

      const enrichedPlayers = await Promise.all(
        playersToExport.map(async (player) => {
          try {
            if (isAdmin) {
              const [spawnResult, gazeResult] = await Promise.all([
                getPlayerSpawnPointTotals(player.docId),
                getPlayerGazeObjectsBySpawnPoint(player.docId),
              ])
              const gazeBySpawnPointId = new Map()
              ;(gazeResult.data || []).forEach(item => {
                gazeBySpawnPointId.set(item.spawnPointId, item.gazeObjects || [])
              })
              return { player, spawnPoints: spawnResult.data || [], gazeBySpawnPointId }
            }
            const spawnResult = await getPlayerSpawnPointTotals(player.docId)
            return { player, spawnPoints: spawnResult.data || [], gazeBySpawnPointId: new Map() }
          } catch {
            return { player, spawnPoints: [], gazeBySpawnPointId: new Map() }
          }
        })
      )

      const csv = buildEnrichedPlayersCsv(enrichedPlayers, isAdmin)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const date = new Date().toISOString().slice(0, 10)
      link.href = url
      link.download = `sessions-${date}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Simulation walkthrough logs exported.')
    } finally {
      setCsvLoading(false)
    }
  }

  const handleFlatClick = (flat) => {
    setSelectedFlat(flat)
    setDeepDiveOpen(true)
  }

  return (
    <Layout onActivePageChange={handleActivePageChange}>
      {() => {
        // 1. Overview Screen (Builders/CXOs)
        if (activeTab === 'Overview') {
          return <BuilderOverview userScope={profile?.scope} />
        }

        // 2. Inventory Intelligence (Stand-alone screen)
        if (activeTab === 'Inventory Intelligence') {
          return (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Inventory Intelligence Panel
                  </h1>
                  {activeProject && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Viewing all flats for <span className="font-semibold text-foreground">{activeProject.name}</span>
                    </p>
                  )}
                </div>

                {projects.length > 1 && (
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger className="w-[200px] border-border bg-background">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(proj => (
                        <SelectItem key={proj.project_id} value={proj.project_id}>
                          {proj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {isLoadingFlats ? (
                <div className="h-64 rounded-xl bg-card border border-border animate-pulse" />
              ) : (
                <InventoryHeatmap flats={flats} onFlatClick={handleFlatClick} />
              )}

              <FlatDeepDivePanel
                open={deepDiveOpen}
                onOpenChange={setDeepDiveOpen}
                flatId={selectedFlat?.flat_id}
              />
            </div>
          )
        }

        // 3. Buyer Insights (Stand-alone screen)
        if (activeTab === 'Buyer Insights') {
          return (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Walkthrough Buyer Insights
                  </h1>
                  {activeProject && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Evaluating preferences for <span className="font-semibold text-foreground">{activeProject.name}</span>
                    </p>
                  )}
                </div>

                {projects.length > 1 && (
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger className="w-[200px] border-border bg-background">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(proj => (
                        <SelectItem key={proj.project_id} value={proj.project_id}>
                          {proj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {isLoadingSegments ? (
                <div className="h-80 rounded-xl bg-card border border-border animate-pulse" />
              ) : (
                <SegmentToggleMatrix dimensions={segments?.segment_dimensions} />
              )}

              {isLoadingSegments ? (
                <div className="h-72 rounded-xl bg-card border border-border animate-pulse" />
              ) : (
                <FeatureSensitivityBars data={segments?.feature_sensitivity} />
              )}
            </div>
          )
        }

        // 4. Sales Performance Screen
        if (activeTab === 'Sales Performance') {
          return <SalesPerformance />
        }

        // 5. Data Health Screen (Admin — Data Ops + Analytics)
        if (activeTab === 'Data Health') {
          return <AdminDashboard view="data-health" />
        }

        // 5b. Render Comparison Screen (Admin — Pilot Phase)
        if (activeTab === 'Render Comparison') {
          return <AdminDashboard view="render-comparison" />
        }

        // 6. Own Sessions Screen (Original VR simulation list)
        if (activeTab === 'Own Sessions') {
          return (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  Walkthrough Sessions Registry
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  View and query active customer simulations and spatial log outputs
                </p>
              </div>

              <UserTable
                columns={['Name', 'Phone Number', 'BHK', 'Building', 'Total Sessions', 'Created At']}
                data={data.players}
                loading={loading}
                addLabel="Sessions Log"
                onView={handleViewPlayer}
                onDownloadCsv={handleDownloadPlayersCsv}
                csvLoading={csvLoading}
                csvSelectionCount={selectedPlayerIds.length}
                selectable={role === 'awaas_admin' || role === 'builder' || role === 'cxo'}
                selectedRowIds={selectedPlayerIds}
                getRowId={(row) => row.docId}
                onToggleRowSelection={handleTogglePlayerSelection}
                onToggleAllRows={handleToggleAllPlayerSelection}
              />

              <PlayerDetailSheet
                open={playerSheetOpen}
                onOpenChange={setPlayerSheetOpen}
                player={selectedPlayer}
                canViewGazeObjects={role === 'awaas_admin'}
              />
            </div>
          )
        }

        // 7. Original User Management (Coexisting Configuration screen)
        if (activeTab === 'User Management') {
          const config = getSectionConfig(userManagementTab)
          
          return (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header */}
              <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-primary" />
                  User & Team Management
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Onboard, assign, and configure roles across your organization
                </p>
              </div>

              {/* Navigation tabs for role list */}
              <div className="flex gap-2 bg-muted p-1 rounded-lg border border-border w-fit">
                {role === 'awaas_admin' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserManagementTab('Builders')}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-md transition-colors",
                      userManagementTab === 'Builders' ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Builders
                  </Button>
                )}
                {(role === 'awaas_admin' || role === 'builder' || role === 'cxo') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserManagementTab('Sales Managers')}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-md transition-colors",
                      userManagementTab === 'Sales Managers' ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sales Managers
                  </Button>
                )}
                {(role === 'awaas_admin' || role === 'builder' || role === 'cxo') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserManagementTab('Members')}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-md transition-colors",
                      userManagementTab === 'Members' ? "bg-background text-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Sales Reps
                  </Button>
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <UserTable
                columns={['Name', 'Email', 'Type']}
                data={config.rows}
                loading={loading}
                onDelete={config.deleteRole ? (row) => handleDelete(row, config.deleteRole) : null}
                onAdd={config.canAdd ? () => {
                  setModalTargetRole(config.createRole)
                  setModalOpen(true)
                } : null}
                addLabel={config.addLabel}
              />

              <CreateUserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreate}
                role={config.addLabel}
              />

              <AlertDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => !open && setDeleteConfirm({ open: false, row: null, deleteRole: '' })}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {deleteConfirm.row?.name || deleteConfirm.row?.email}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The user credentials will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        }

        return null;
      }}
    </Layout>
  )
}

export default Dashboard
