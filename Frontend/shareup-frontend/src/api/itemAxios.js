import axios from 'axios'

const itemAxios = axios.create({
  baseURL: import.meta.env.VITE_ITEM_API
})

// Request interceptor — attach JWT
itemAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

//  Response interceptor — handle expired/invalid JWT
itemAxios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default itemAxios