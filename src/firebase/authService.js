import { db } from './config'
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'

// Collection names
const COLLECTIONS = {
  admin: 'admins',
  builder: 'builders',
  sales_manager: 'salesmanager',
  member: 'members'
}

// Login — search all collections for matching email + password
export async function loginWithEmail(email, password) {
  const collectionsToCheck = [
    { name: 'admins', role: 'admin' },
    { name: 'builders', role: 'builder' },
    { name: 'salesmanager', role: 'sales_manager' },
    { name: 'members', role: 'member' },
  ]

  for (const col of collectionsToCheck) {
    try {
      const snapshot = await getDocs(collection(db, col.name))
      for (const document of snapshot.docs) {
        const data = document.data()

        // Check inside users array if exists (old structure)
        if (data.users && Array.isArray(data.users)) {
          const found = data.users.find(
            u => u.username === email && u.password === password
          )
          if (found) {
            const userData = {
              docId: document.id,
              role: col.role,
              email: found.username,
              type: found.type || '',
              created_by: found.created_by || '',
              name: found.name || found.username,
              company_name: data.company_name || ''
            }
            saveSession(userData)
            return { userData, error: null }
          }
        }

        // Check flat document structure (new structure)
        if (data.email === email && data.password === password) {
          const userData = {
            docId: document.id,
            role: col.role,
            email: data.email,
            type: data.type || '',
            created_by: data.created_by || '',
            name: data.name || data.email,
            company_name: data.company_name || ''
          }
          saveSession(userData)
          return { userData, error: null }
        }
      }
    } catch (err) {
      console.error(`Error checking ${col.name}:`, err)
    }
  }

  return { userData: null, error: 'Invalid email or password' }
}

// Logout
export function logout() {
  clearSession()
}

// Create a new user
export async function createUser({ name, email, password, type, role, createdBy, companyName, address, phone }) {
  try {
    const colName = COLLECTIONS[role]
    if (!colName) throw new Error('Invalid role')

    // Check if email already exists in this collection
    const existingDoc = await getDoc(doc(db, colName, email))
    if (existingDoc.exists()) {
      return { docId: null, error: `A ${role} with this email already exists.` }
    }

    const newUser = {
      name,
      email,
      password,
      type,
      created_by: createdBy,
      createdAt: serverTimestamp()
    }

    if (role === 'builder') {
      newUser.company_name = companyName || ''
      newUser.address = address || ''
      newUser.phone = phone || ''
    }

    if (role === 'sales_manager') {
      newUser.phone = phone || ''
    }

    await setDoc(doc(db, colName, email), newUser)
    return { docId: email, error: null }

  } catch (err) {
    console.error('Create user error:', err)
    return { docId: null, error: err.message }
  }
}

// Delete user
export async function deleteUser(role, docId) {
  try {
    const colName = COLLECTIONS[role]
    await deleteDoc(doc(db, colName, docId))
    return { error: null }
  } catch (err) {
    return { error: err.message }
  }
}

// Session helpers
function saveSession(userData) {
  localStorage.setItem('nb_user', JSON.stringify(userData))
}

function clearSession() {
  localStorage.removeItem('nb_user')
}

export function getSession() {
  try {
    const data = localStorage.getItem('nb_user')
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}