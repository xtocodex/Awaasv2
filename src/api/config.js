export const API_CONFIG = {
  useMock: import.meta.env.VITE_USE_MOCK !== 'false', // Default to true unless explicitly set to 'false'
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.awaas.example/v1',
  tokenKey: 'awaas_auth_token',
}
