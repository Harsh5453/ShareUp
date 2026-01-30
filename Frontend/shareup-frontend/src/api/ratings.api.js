import axios from './axios'

const base = import.meta.env.VITE_RENTAL_API

export default {
  getMyRatings: () => axios.get(`${base}/api/ratings/me`)
}
