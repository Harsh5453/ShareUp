import axios from 'axios'

const publicAxios = axios.create({
  baseURL: import.meta.env.VITE_ITEM_API
})

export default publicAxios
