import { db } from './config'
import { collection, getDocs, query, where } from 'firebase/firestore'

function getCreatedByCandidates(value) {
  const candidates = []

  if (typeof value === 'string') {
    candidates.push(value)
    if (value.includes('|')) {
      candidates.push(value.split('|')[0].trim())
    }
  } else if (value?.email) {
    candidates.push(value.email)
    if (value.company_name) {
      candidates.push(`${value.email} | ${value.company_name}`)
    }
  }

  return [...new Set(candidates.filter(Boolean))]
}

async function getUsersByCreatedBy(collectionName, createdBy) {
  const candidates = getCreatedByCandidates(createdBy)
  if (candidates.length === 0) return []

  const snapshots = await Promise.all(
    candidates.map(candidate => {
      const q = query(
        collection(db, collectionName),
        where('created_by', '==', candidate)
      )
      return getDocs(q)
    })
  )

  const usersById = new Map()
  snapshots.forEach(snapshot => {
    snapshot.docs.forEach(d => {
      usersById.set(d.id, { docId: d.id, ...d.data() })
    })
  })

  return [...usersById.values()]
}

// Get all builders under an admin (by created_by email)
export async function getBuildersByAdmin(adminEmail) {
  try {
    const users = await getUsersByCreatedBy('builders', adminEmail)
    return { users, error: null }
  } catch (err) {
    return { users: [], error: err.message }
  }
}

// Get all sales managers under a builder (by created_by email)
export async function getSalesManagersByBuilder(builderEmail) {
  try {
    const users = await getUsersByCreatedBy('salesmanager', builderEmail)
    return { users, error: null }
  } catch (err) {
    return { users: [], error: err.message }
  }
}

// Get all members under a sales manager (by created_by email)
export async function getMembersBySalesManager(smEmail) {
  try {
    const users = await getUsersByCreatedBy('members', smEmail)
    return { users, error: null }
  } catch (err) {
    return { users: [], error: err.message }
  }
}

// Get full hierarchy under admin
export async function getAllUsersUnderAdmin(adminEmail) {
  try {
    // Get builders
    const buildersResult = await getBuildersByAdmin(adminEmail)
    const builders = buildersResult.users

    // Fetch child records in parallel so the dashboard does not wait on nested serial queries.
    const salesManagerGroups = await Promise.all(
      builders.map(builder => getUsersByCreatedBy('salesmanager', builder))
    )
    const salesManagers = salesManagerGroups.flat()

    const memberGroups = await Promise.all(
      salesManagers.map(sm => getUsersByCreatedBy('members', sm))
    )
    const members = memberGroups.flat()

    return { builders, salesManagers, members, error: null }
  } catch (err) {
    return { builders: [], salesManagers: [], members: [], error: err.message }
  }
}


// Get auto-incremented type code for a role (e.g. BD3, SM2, MM5)
export async function getNextType(role) {
  const prefixMap = {
    builder: 'BD',
    sales_manager: 'SM',
    member: 'MM'
  }
  const collectionMap = {
    builder: 'builders',
    sales_manager: 'salesmanager',
    member: 'members'
  }
  const prefix = prefixMap[role]
  const colName = collectionMap[role]
  if (!prefix || !colName) return ''

  try {
    const snapshot = await getDocs(collection(db, colName))
    const numbers = []
    snapshot.docs.forEach(doc => {
      const type = doc.data().type || ''
      if (type.startsWith(prefix)) {
        const num = parseInt(type.replace(prefix, ''))
        if (!isNaN(num)) numbers.push(num)
      }
    })
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0
    return `${prefix}${maxNum + 1}`
  } catch (err) {
    console.error('getNextType error:', err)
    return `${prefix}1`
  }
}
// Get all spawn point totals for a single player (read-only subcollection)
export async function getPlayerSpawnPointTotals(playerDocId) {
  if (!playerDocId) return { data: [], error: 'Player ID is required' }
  try {
    const snapshot = await getDocs(collection(db, 'players', playerDocId, 'spawnPointTotals'))
    const data = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }))
    return { data, error: null }
  } catch (err) {
    return { data: [], error: err.message }
  }
}

// Get all gaze objects grouped by spawn point for a single player (read-only nested subcollection)
export async function getPlayerGazeObjectsBySpawnPoint(playerDocId) {
  if (!playerDocId) return { data: [], error: 'Player ID is required' }
  try {
    const spawnPointSnapshot = await getDocs(collection(db, 'players', playerDocId, 'spawnPointTotals'))
    const data = await Promise.all(
      spawnPointSnapshot.docs.map(async spawnPointDoc => {
        const gazeObjectsSnapshot = await getDocs(
          collection(
            db,
            'players',
            playerDocId,
            'spawnPointTotals',
            spawnPointDoc.id,
            'gazeObjects'
          )
        )

        return {
          spawnPointId: spawnPointDoc.id,
          gazeObjects: gazeObjectsSnapshot.docs.map(doc => {
            const gazeObject = doc.data()
            return {
              docId: doc.id,
              objectName: gazeObject.objectName || '',
              gazeTimeFormatted: gazeObject.gazeTimeFormatted || ''
            }
          })
        }
      })
    )

    return { data, error: null }
  } catch (err) {
    return { data: [], error: err.message }
  }
}

// Get and format players collection for dashboard view
export async function getPlayers() {
  try {
    const snapshot = await getDocs(collection(db, 'players'))

    const players = snapshot.docs.map(doc => {
      const data = doc.data()
      const timestamp = data.createdAt

      return {
        docId: doc.id,
        ...data,
        createdAt: timestamp
          ? timestamp.toDate().toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          : '—'
      }
    })

    return { players, error: null }
  } catch (err) {
    console.error('Get players error:', err)
    return { players: [], error: err.message }
  }
}
