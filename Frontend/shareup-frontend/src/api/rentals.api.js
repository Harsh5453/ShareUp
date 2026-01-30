import rentalAxios from './rentalAxios'

export default {
  request: data => rentalAxios.post('/api/rentals/request', data),

  approve: id => rentalAxios.put(`/api/rentals/approve/${id}`),
  reject: id => rentalAxios.put(`/api/rentals/reject/${id}`),

  myRentals: () => rentalAxios.get('/api/rentals/me'),
  getOwnerRequests: () => rentalAxios.get('/api/rentals/owner'),

  getPendingReturns: () => rentalAxios.get('/api/rentals/owner/returns'),

  returnItem: (id, file) => {
    const fd = new FormData()
    fd.append('image', file)
    return rentalAxios.post(`/api/rentals/${id}/return`, fd)
  },

  approveReturn: id => rentalAxios.put(`/api/rentals/approve-return/${id}`)
}
