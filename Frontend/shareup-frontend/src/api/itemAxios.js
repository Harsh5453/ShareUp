import axios from 'axios'

const itemAxios = axios.create({
  baseURL: import.meta.env.VITE_ITEM_API
})

itemAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default itemAxios
