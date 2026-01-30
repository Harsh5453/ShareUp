import publicAxios from './publicAxios'
import itemAxios from './itemAxios'

export default {
  getAll: () => publicAxios.get('/api/items'),
  getById: id => api.get(`/api/items/${id}`),
  getById: id => publicAxios.get(`/api/items/${id}`),

  createItem: data => itemAxios.post('/api/items', data),

  uploadImage: (id, file) => {
    const fd = new FormData()
    fd.append('image', file)
    return itemAxios.post(`/api/items/${id}/image`, fd)
  },

  myItems: () => itemAxios.get('/api/items/owner')
}
