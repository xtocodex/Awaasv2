import { client } from './client'

/**
 * AWAAS API Endpoints functions mapping to api-contract.yaml
 */
export const api = {
  // --- AUTH ---
  login: async (email, password) => {
    return client.post('/auth/login', { email, password })
  },
  
  getCurrentUser: async () => {
    return client.get('/auth/me')
  },

  // --- PROJECTS & OVERVIEW ---
  getProjects: async () => {
    return client.get('/projects')
  },

  getProjectOverview: async (projectId, dateRange = 'last_30_days') => {
    return client.get(`/projects/${projectId}/overview?date_range=${dateRange}`)
  },

  getProjectFlats: async (projectId, unitType = '', segment = '') => {
    let url = `/projects/${projectId}/flats`
    const params = []
    if (unitType) params.push(`unit_type=${unitType}`)
    if (segment) params.push(`segment=${segment}`)
    if (params.length > 0) {
      url += `?${params.join('&')}`
    }
    return client.get(url)
  },

  getFlatDeepDive: async (flatId) => {
    return client.get(`/flats/${flatId}/deep-dive`)
  },

  getSegmentInsights: async (projectId) => {
    return client.get(`/projects/${projectId}/segments`)
  },

  // --- ACTION RECOMMENDATIONS ---
  getActionRecommendations: async (projectId) => {
    return client.get(`/projects/${projectId}/action-recommendations`)
  },

  updateRecommendationStatus: async (recId, status) => {
    return client.post(`/action-recommendations/${recId}/status`, { status })
  },

  // --- SALES DASHBOARD ---
  getSalesSummary: async () => {
    return client.get('/sales/me/summary')
  },

  getTeamSummary: async () => {
    return client.get('/sales/team/summary')
  },

  // --- ADMIN STUBS ---
  getDataHealth: async () => {
    return client.get('/admin/data-health')
  },

  getRenderComparison: async () => {
    return client.get('/admin/render-comparison')
  },

  // --- EXPORT CSV ---
  downloadSessionsCsv: async (projectId) => {
    return client.get(`/export/sessions.csv?project_id=${projectId}`)
  },

  downloadEventsCsv: async (projectId) => {
    return client.get(`/export/events.csv?project_id=${projectId}`)
  }
}
