import publicAxios from './publicAxios'
import itemAxios from './itemAxios'

export default {

  // Public browsing
  getAll: () => publicAxios.get('/api/items'),

  // Public item details
  getById: id => publicAxios.get(`/api/items/${id}`),

  // Owner creates item
  createItem: data => itemAxios.post('/api/items', data),

  // Upload image
  uploadImage: (id, file) => {
    const fd = new FormData()
    fd.append('image', file)

    return itemAxios.post(`/api/items/${id}/image`, fd)
  },

  // Owner inventory
  myItems: () => itemAxios.get('/api/items/owner'),

  // 🔹 DELETE ITEM
  deleteItem: id => itemAxios.delete(`/api/items/${id}`)
}