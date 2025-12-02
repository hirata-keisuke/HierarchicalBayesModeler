import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// セッションIDをlocalStorageから取得または生成
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

// リクエストインターセプター: セッションIDを追加
api.interceptors.request.use((config) => {
  config.headers['X-Session-Id'] = getSessionId()
  return config
})

export default api
