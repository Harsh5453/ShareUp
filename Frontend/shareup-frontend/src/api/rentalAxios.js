import axios from 'axios'

const rentalAxios = axios.create({
  baseURL: import.meta.env.VITE_RENTAL_API
})

// Request interceptor — attach JWT
rentalAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

//  Response interceptor — handle expired/invalid JWT
rentalAxios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default rentalAxios