import axios from 'axios'

const TOKEN_KEY = '@app-promocoes:token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  timeout: 15000,
})

// ─── Request interceptor — injeta o token ────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response interceptor — trata 401 ───────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('@app-promocoes:user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export { TOKEN_KEY }
export default api
