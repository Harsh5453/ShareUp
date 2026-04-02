import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API
})

// Request interceptor — attach JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

//  Response interceptor — handle expired/invalid JWT
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api