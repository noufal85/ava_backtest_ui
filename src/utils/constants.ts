export const API_BASE_URL = '/api/v2'
export const WS_BASE_URL = import.meta.env.DEV
  ? 'ws://localhost:8201/api/v2/ws'
  : `wss://${window.location.host}/api/v2/ws`
