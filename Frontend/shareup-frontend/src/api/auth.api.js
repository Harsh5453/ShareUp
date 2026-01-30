import axios from './axios'

const base = import.meta.env.VITE_AUTH_API

export default {
  login: data => axios.post(`${base}/api/auth/login`, data),
  register: data => axios.post(`${base}/api/auth/register`, data)
}
