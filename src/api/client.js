import { API_CONFIG } from './config'
import * as mockData from './mock/mockData'

// Simulated network latency helper
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Session token handling
export const getStoredToken = () => localStorage.getItem(API_CONFIG.tokenKey)
export const setStoredToken = (token) => localStorage.setItem(API_CONFIG.tokenKey, token)
export const clearStoredToken = () => localStorage.removeItem(API_CONFIG.tokenKey)

/**
 * Base fetch API request handler
 */
async function request(endpoint, options = {}) {
  const token = getStoredToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const url = `${API_CONFIG.baseUrl}${endpoint}`
  const config = {
    ...options,
    headers,
  }

  if (options.body) {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      let errorMessage = 'An error occurred'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // Response wasn't JSON or didn't contain message
      }
      throw new Error(errorMessage)
    }

    if (response.headers.get('Content-Type')?.includes('text/csv')) {
      return response.text()
    }

    return response.json()
  } catch (error) {
    console.error('API Request Failure:', error)
    throw error
  }
}

// Router for mock requests to simulate server-side processing
async function handleMockRequest(method, endpoint, body = null) {
  await delay(250) // Simulate network delay

  const cleanEndpoint = endpoint.split('?')[0] // strip queries

  // Route: /auth/login
  if (method === 'POST' && cleanEndpoint === '/auth/login') {
    const { email, password } = body
    const userProfile = mockData.mockUsers[email]
    if (userProfile && userProfile.password === password) {
      setStoredToken(userProfile.token)
      // Save session in local storage like old code did for backward compatibility
      localStorage.setItem('nb_user', JSON.stringify({
        email: userProfile.user.email,
        name: userProfile.user.name,
        role: userProfile.role,
        company_name: userProfile.user.company_name,
        token: userProfile.token,
        scope: userProfile.scope
      }))
      return userProfile
    }
    throw new Error('Invalid email or password')
  }

  // Auth Guard for other endpoints
  const token = getStoredToken()
  if (!token) {
    throw new Error('Unauthorized - No token provided')
  }

  // Find user matching token
  const activeUser = Object.values(mockData.mockUsers).find(u => u.token === token)
  if (!activeUser) {
    throw new Error('Unauthorized - Invalid token')
  }

  // Route: /auth/me
  if (method === 'GET' && cleanEndpoint === '/auth/me') {
    return activeUser
  }

  // Route: /projects
  if (method === 'GET' && cleanEndpoint === '/projects') {
    // Filter projects based on user scope
    const allowedProjectIds = activeUser.scope.project_ids || []
    return mockData.mockProjects.filter(p => allowedProjectIds.includes(p.project_id))
  }

  // Route: /projects/:id/overview
  const overviewMatch = cleanEndpoint.match(/^\/projects\/([^/]+)\/overview$/)
  if (method === 'GET' && overviewMatch) {
    const projectId = overviewMatch[1]
    const overview = mockData.mockProjectOverviews[projectId]
    if (!overview) throw new Error('Project overview not found')
    return overview
  }

  // Route: /projects/:id/flats
  const flatsMatch = cleanEndpoint.match(/^\/projects\/([^/]+)\/flats$/)
  if (method === 'GET' && flatsMatch) {
    const projectId = flatsMatch[1]
    const list = mockData.mockFlatTiles[projectId] || []
    return list
  }

  // Route: /flats/:id/deep-dive
  const deepDiveMatch = cleanEndpoint.match(/^\/flats\/([^/]+)\/deep-dive$/)
  if (method === 'GET' && deepDiveMatch) {
    const flatId = deepDiveMatch[1]
    // Try to find flat number first in tiles to generate a friendly title
    let flatNum = 'Flat ' + flatId
    for (const projId in mockData.mockFlatTiles) {
      const tile = mockData.mockFlatTiles[projId].find(t => t.flat_id === flatId)
      if (tile) {
        flatNum = tile.flat_number
        break
      }
    }
    return mockData.getFlatDeepDive(flatId, flatNum)
  }

  // Route: /projects/:id/segments
  const segmentsMatch = cleanEndpoint.match(/^\/projects\/([^/]+)\/segments$/)
  if (method === 'GET' && segmentsMatch) {
    const projectId = segmentsMatch[1]
    const insights = mockData.mockSegmentInsights[projectId]
    if (!insights) {
      // Return a default fallback
      return {
        matrix: [
          { segment: 'General Buyers', rooms: { living: 30, balcony: 20, kitchen: 20, vastu: 15, bedroom: 15 } }
        ],
        feature_sensitivity: [
          { feature: 'Natural Light', score_pct: 60 },
          { feature: 'Spacious Balcony', score_pct: 70 }
        ],
        segment_dimensions: {
          work_profile: {
            row_header: 'Work Profile',
            caption: 'Work Profile vs Room Engagement (% avg dwell time)',
            columns: [
              { key: 'living', label: 'Living' }, { key: 'balcony', label: 'Balcony' },
              { key: 'kitchen', label: 'Kitchen' }, { key: 'vastu', label: 'Vastu' },
              { key: 'bedroom', label: 'Bedroom' }
            ],
            rows: [
              { label: 'General Buyers', values: { living: 30, balcony: 20, kitchen: 20, vastu: 15, bedroom: 15 } }
            ]
          },
          age_bracket: {
            row_header: 'Age Bracket',
            caption: 'Age Bracket vs Feature Interaction (% sessions interacting)',
            columns: [
              { key: 'sunlight', label: 'Sunlight' }, { key: 'balcony', label: 'Balcony' },
              { key: 'storage', label: 'Storage' }
            ],
            rows: [
              { label: 'All ages', values: { sunlight: 30, balcony: 25, storage: 20 } }
            ]
          },
          lead_source: {
            row_header: 'Lead Source',
            caption: 'Lead Source vs Session Engagement',
            columns: [
              { key: 'engagement', label: 'Avg Engagement' }, { key: 'completion', label: 'Completion' },
              { key: 'session_share', label: 'Session Share' }
            ],
            rows: [
              { label: 'All sources', values: { engagement: 65, completion: 68, session_share: 100 } }
            ]
          }
        }
      }
    }
    return insights
  }

  // Route: /projects/:id/action-recommendations
  const actionsMatch = cleanEndpoint.match(/^\/projects\/([^/]+)\/action-recommendations$/)
  if (method === 'GET' && actionsMatch) {
    const projectId = actionsMatch[1]
    // Filter recommendations by flat_id prefix matching project
    // emerald-heights prefix: 'eh-', sapphire-towers prefix: 'st-'
    const prefix = projectId === 'emerald-heights' ? 'eh-' : projectId === 'sapphire-towers' ? 'st-' : 'unknown'
    return mockData.mockActionRecommendations.filter(rec => rec.flat_id.startsWith(prefix))
  }

  // Route: /action-recommendations/:id/status
  const actionStatusMatch = cleanEndpoint.match(/^\/action-recommendations\/([^/]+)\/status$/)
  if (method === 'POST' && actionStatusMatch) {
    const id = actionStatusMatch[1]
    const { status } = body
    mockData.updateRecommendationStatus(id, status)
    return { success: true }
  }

  // Route: /sales/me/summary — scoped to the logged-in salesperson when available
  if (method === 'GET' && cleanEndpoint === '/sales/me/summary') {
    const salespersonId = activeUser.scope?.salesperson_id
    return mockData.mockSalesSummaries[salespersonId] || mockData.mockSalesSummary
  }

  // Route: /sales/team/summary
  if (method === 'GET' && cleanEndpoint === '/sales/team/summary') {
    if (activeUser.role !== 'sales_head' && activeUser.role !== 'cxo' && activeUser.role !== 'builder' && activeUser.role !== 'awaas_admin') {
      throw new Error('Forbidden - Sales head or higher required')
    }
    return mockData.mockTeamSummary
  }

  // Route: /admin/data-health
  if (method === 'GET' && cleanEndpoint === '/admin/data-health') {
    if (activeUser.role !== 'awaas_admin') throw new Error('Forbidden - Admin only')
    return mockData.mockDataHealth
  }

  // Route: /admin/render-comparison
  if (method === 'GET' && cleanEndpoint === '/admin/render-comparison') {
    if (activeUser.role !== 'awaas_admin') throw new Error('Forbidden - Admin only')
    return mockData.mockRenderComparison
  }

  // Route: /export/sessions.csv
  if (method === 'GET' && cleanEndpoint === '/export/sessions.csv') {
    const projectId = endpoint.split('project_id=')[1] || 'emerald-heights'
    return mockData.getMockSessionsCsv(projectId)
  }

  // Route: /export/events.csv
  if (method === 'GET' && cleanEndpoint === '/export/events.csv') {
    const projectId = endpoint.split('project_id=')[1] || 'emerald-heights'
    return mockData.getMockEventsCsv(projectId)
  }

  throw new Error(`Mock endpoint ${method} ${endpoint} not implemented.`)
}

export const client = {
  get: (endpoint, options = {}) => {
    if (API_CONFIG.useMock) {
      return handleMockRequest('GET', endpoint)
    }
    return request(endpoint, { ...options, method: 'GET' })
  },
  post: (endpoint, body, options = {}) => {
    if (API_CONFIG.useMock) {
      return handleMockRequest('POST', endpoint, body)
    }
    return request(endpoint, { ...options, method: 'POST', body })
  }
}
